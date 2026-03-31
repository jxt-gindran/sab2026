import React, { useEffect, useRef, useState, useMemo } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";
import Overlay from "ol/Overlay";
import GPX from 'ol/format/GPX';
import { getDistance } from 'ol/sphere';
import { Flag, Trophy, Compass } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface BorneoRouteMapProps {
    className?: string;
}

export function BorneoRouteMap({ className }: BorneoRouteMapProps = {}) {
    // Refs
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const cursorOverlayRef = useRef<Overlay | null>(null);

    // Convex Data
    const activeRoute = useQuery(api.maps.getActiveRoute);
    const remoteMarkers = useQuery(api.maps.getMarkers) || [];

    // Local State
    const [elevationData, setElevationData] = useState<{dist: number, ele: number, lon: number, lat: number}[]>([]);
    const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        // 1. Create Route Layer with Empty Source initially
        const routeSource = new VectorSource();
        const routeLayer = new VectorLayer({
            source: routeSource,
            style: new Style({
                stroke: new Stroke({
                    color: "#0cdfed", // Electric Aqua
                    width: 5,
                }),
            }),
        });

        // 2. Initialize Map
        const initialZoom = window.innerWidth < 768 ? 6.5 : 7.8;
        
        // Cursor position overlay
        const cursorElement = document.createElement('div');
        cursorElement.className = 'w-4 h-4 bg-brand-orange border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 hidden';
        const cursorOverlay = new Overlay({
            element: cursorElement,
            positioning: 'center-center',
            stopEvent: false
        });
        cursorOverlayRef.current = cursorOverlay;

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                        attributions: '© OpenStreetMap, © CARTO'
                    }),
                    className: "bw-map", 
                }),
                routeLayer,
            ],
            view: new View({
                center: fromLonLat([115.4, 5.2]),
                zoom: initialZoom,
                minZoom: 5,
                maxZoom: 10,
                constrainResolution: true,
                rotation: 0,
            }),
            controls: [], 
            interactions: [], 
        });

        map.addOverlay(cursorOverlay);
        mapInstance.current = map;
        setMapLoaded(true);

        return () => {
            map.setTarget(undefined);
            mapInstance.current = null;
            setMapLoaded(false);
            cursorOverlayRef.current = null;
        };
    }, []);

    // Effect for fetching and parsing the active route file
    useEffect(() => {
        if (!mapInstance.current || activeRoute === undefined) return;
        
        const map = mapInstance.current;
        const routeLayer = map.getLayers().getArray().find(l => l instanceof VectorLayer) as VectorLayer<VectorSource>;
        if (!routeLayer) return;
        
        const routeSource = routeLayer.getSource();
        if (!routeSource) return;

        // Clear existing geometry
        routeSource.clear();
        setElevationData([]);

        // If no route uploaded yet, leave the map blank
        if (!activeRoute || !activeRoute.fileUrl) return;

        const fetchUrl = activeRoute.fileUrl;
        
        fetch(fetchUrl)
            .then(res => res.text())
            .then(fileText => {
                let parsedCoordinates: [number, number][] = [];
                let parsedElevations: { dist: number, ele: number, lon: number, lat: number }[] = [];

                if (activeRoute.fileName && activeRoute.fileName.toLowerCase().endsWith('.gpx')) {
                    // GPX PARSING (Includes Elevation! + Extract geometries natively)
                    const gpxFormat = new GPX();
                    const features = gpxFormat.readFeatures(fileText, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:4326' }); // Read raw lon/lats first for distance math
                    
                    if (features.length > 0) {
                        const geom = features[0].getGeometry();
                        if (geom && (geom.getType() === 'LineString' || geom.getType() === 'MultiLineString')) {
                            // Extract raw coords
                            const rawCoords = geom.getType() === 'LineString' 
                                ? (geom as LineString).getCoordinates() 
                                : (geom as any).getLineString(0).getCoordinates();
                            
                            let cumulativeDistance = 0;
                            for(let i=0; i<rawCoords.length; i++) {
                                // RawCoords from GPX format usually returns [lon, lat, ele, time]
                                const lon = rawCoords[i][0];
                                const lat = rawCoords[i][1];
                                const ele = rawCoords[i][2] !== undefined ? rawCoords[i][2] : 0;
                                
                                if (i > 0) {
                                    cumulativeDistance += getDistance([rawCoords[i-1][0], rawCoords[i-1][1]], [lon, lat]) / 1000;
                                }
                                
                                // Subsample slightly if very dense (e.g. 11k points down to 2-3k for chart rendering speed)
                                if (i % 2 === 0 || i === rawCoords.length - 1) {
                                    parsedElevations.push({ dist: Number(cumulativeDistance.toFixed(2)), ele: Number(ele.toFixed(0)), lon, lat });
                                }
                                parsedCoordinates.push([lon, lat]);
                            }
                        }
                    }
                } else {
                    // CSV PARSING FALLBACK (No elevation)
                    const lines = fileText.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        const parts = line.split(',');
                        if (parts.length >= 2) {
                            const lat = parseFloat(parts[0].trim());
                            const lon = parseFloat(parts[1].trim());
                            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
                                parsedCoordinates.push([lon, lat]);
                            }
                        }
                    }
                }

                if (parsedCoordinates.length > 0) {
                    const routePoints = parsedCoordinates.map((coord) => fromLonLat(coord));
                    const routeFeature = new Feature({
                        geometry: new LineString(routePoints),
                    });
                    routeSource.addFeature(routeFeature);
                    
                    if (parsedElevations.length > 0) {
                        setElevationData(parsedElevations);
                    }
                }
            })
            .catch(err => {
                console.error("Failed to load map coordinates:", err);
            });

    }, [activeRoute, mapLoaded]);

    // Effect for dynamically managing map overlays (stop markers)
    useEffect(() => {
        if (!mapInstance.current || !mapLoaded) return;
        const map = mapInstance.current;

        // We clean up existing dynamic overlays first 
        // Note: we don't remove the cursorOverlay which is managed separately
        const overlaysToRemove = map.getOverlays().getArray().filter(o => o !== cursorOverlayRef.current);
        overlaysToRemove.forEach(o => map.removeOverlay(o));

        remoteMarkers.forEach(stop => {
            const element = document.getElementById(`stop-${stop._id}`);
            if (element) {
                const overlay = new Overlay({
                    element: element,
                    position: fromLonLat([stop.lng, stop.lat]),
                    positioning: "center-center",
                    stopEvent: false, 
                });
                map.addOverlay(overlay);
            }
        });

    }, [remoteMarkers, mapLoaded]);

    // Dynamic Collision Detection for Labels
    useEffect(() => {
        if (!mapInstance.current || !mapLoaded || remoteMarkers.length === 0) return;
        const map = mapInstance.current;

        const repositionLabels = () => {
            const labels = Array.from(document.querySelectorAll('.marker-label')) as HTMLElement[];
            
            // Reset transforms
            labels.forEach(el => {
                el.style.transform = 'translate(0px, 0px)';
                el.style.zIndex = '20';
            });

            requestAnimationFrame(() => {
                const rects = labels.map(l => ({ el: l, rect: l.getBoundingClientRect() }));
                
                for (let i = 0; i < rects.length; i++) {
                    for (let j = i + 1; j < rects.length; j++) {
                        const r1 = rects[i].rect;
                        const r2 = rects[j].rect;
                        
                        // Check overlap
                        if (!(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom)) {
                            rects[j].el.style.zIndex = '30';
                            
                            const overlapLeft = r2.right - r1.left;
                            const overlapRight = r1.right - r2.left;
                            const overlapTop = r2.bottom - r1.top;
                            const overlapBottom = r1.bottom - r2.top;
                            
                            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                            
                            let cx = 0, cy = 0;
                            const currentTransform = rects[j].el.style.transform;
                            const match = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                            if (match) {
                                cx = parseFloat(match[1]);
                                cy = parseFloat(match[2]);
                            }

                            if (minOverlap === overlapLeft) cx -= (overlapLeft + 4);
                            else if (minOverlap === overlapRight) cx += (overlapRight + 4);
                            else if (minOverlap === overlapTop) cy -= (overlapTop + 4);
                            else if (minOverlap === overlapBottom) cy += (overlapBottom + 4);
                            
                            rects[j].el.style.transform = `translate(${cx}px, ${cy}px)`;
                            rects[j].rect = rects[j].el.getBoundingClientRect(); // update rect
                        }
                    }
                }
            });
        };

        map.on('moveend', repositionLabels);
        const timeout = setTimeout(repositionLabels, 400);

        return () => {
            map.un('moveend', repositionLabels);
            clearTimeout(timeout);
        };
    }, [remoteMarkers, mapLoaded]);

    // Effect to pin the moving dot on the map when hovering the chart
    useEffect(() => {
        if (cursorOverlayRef.current && hoverPoint) {
            cursorOverlayRef.current.setPosition(fromLonLat(hoverPoint));
            cursorOverlayRef.current.getElement()?.classList.remove('hidden');
        } else if (cursorOverlayRef.current) {
            cursorOverlayRef.current.getElement()?.classList.add('hidden');
        }
    }, [hoverPoint]);

    // Formatters for chart tooltips
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-brand-navy p-3 border border-white/20 rounded-lg shadow-xl text-white">
              <p className="font-bold text-brand-orange mb-1">{`${payload[0].value} m Altitude`}</p>
              <p className="text-xs text-brand-slate uppercase tracking-wider">{`${label} km distance`}</p>
            </div>
          );
        }
        return null;
    };

    return (
        <div className={className ? `relative flex flex-col ${className}` : "relative flex flex-col w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#013254]/10 bg-slate-100"}>

            {/* MAP CONTAINER (Top Half) */}
            <div className="relative w-full h-[360px] md:h-[450px]">
                <div ref={mapRef} className="w-full h-full filter grayscale-[0.2] invert hue-rotate-[180deg] brightness-[0.85] contrast-[1.5] saturate-[1.5]" />
                <div className="absolute inset-0 bg-[#013254] mix-blend-overlay opacity-20 pointer-events-none"></div>

                {/* HIDDEN MARKER ELEMENTS (Projected onto Map by OpenLayers) */}
                <div className="hidden">
                    {remoteMarkers.map((stop) => (
                        <div key={stop._id} id={`stop-${stop._id}`} className="relative group cursor-pointer z-20">
                            {/* START MARKER */}
                            {stop.type === "start" && (
                                <div className="flex flex-col items-center justify-center relative">
                                    <div className="p-2 bg-[#FF7F32] rounded-full text-white shadow-lg border-2 border-white animate-bounce">
                                        <Flag className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className="marker-label absolute top-full mt-1.5 px-2 py-0.5 bg-white/95 text-[10px] font-bold text-[#013254] rounded shadow whitespace-nowrap transition-transform duration-300">
                                        START: {stop.name}
                                    </span>
                                </div>
                            )}

                            {/* FINISH MARKER */}
                            {stop.type === "finish" && (
                                <div className="flex flex-col items-center justify-center relative">
                                    <div className="p-2 bg-[#0cdfed] rounded-full text-[#013254] shadow-lg border-2 border-white animate-pulse">
                                        <Trophy className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className="marker-label absolute top-full mt-1.5 px-2 py-0.5 bg-white/95 text-[10px] font-bold text-[#013254] rounded shadow whitespace-nowrap transition-transform duration-300">
                                        FINISH: {stop.name}
                                    </span>
                                </div>
                            )}

                            {/* PIT STOPS */}
                            {stop.type === "stop" && (
                                <div className="group/dot relative flex flex-col items-center justify-center">
                                    <div className="w-4 h-4 bg-[#013254] rounded-full border-2 border-white shadow-md hover:scale-150 transition-transform duration-200 z-10" />
                                    <div className="marker-label absolute top-full mt-1 text-[10px] font-black text-[#013254] bg-white/70 px-1 rounded uppercase tracking-wider shadow whitespace-nowrap pointer-events-none transition-transform duration-300">
                                        {stop.name}
                                    </div>
                                    {stop.description && (
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover/dot:opacity-100 transition-opacity bg-white text-[#013254] text-xs p-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                                        <span className="font-bold">{stop.name}</span><br />
                                        <span className="text-slate-500">{stop.description}</span>
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* COMPASS OVERLAY */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full border border-slate-200 shadow-lg z-10 pointer-events-none">
                    <Compass className="w-8 h-8 text-[#013254]" />
                </div>
            </div>

            {/* ELEVATION PROFILE CHART (Bottom Half) */}
            {elevationData.length > 0 && (
                <div className="w-full bg-brand-navy border-t-2 border-brand-cyan/30 pt-4 pb-2 px-1 text-white relative h-[150px] md:h-[200px]">
                    <div className="absolute top-2 left-4 text-xs font-bold text-white/50 tracking-widest uppercase flex items-center gap-2 z-10">
                        Elevation Profile
                        <span className="inline-block w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={elevationData}
                            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                            onMouseMove={(e) => {
                                if (e.activePayload && e.activePayload.length) {
                                    const point = e.activePayload[0].payload;
                                    setHoverPoint([point.lon, point.lat]);
                                }
                            }}
                            onMouseLeave={() => setHoverPoint(null)}
                        >
                            <defs>
                                <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF7F32" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#bf2e1a" stopOpacity={0.4}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="dist" 
                                tick={{fill: '#94a3b8', fontSize: 10}}
                                tickFormatter={(val) => `${Math.round(val)}km`}
                                minTickGap={30}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                tick={{fill: '#94a3b8', fontSize: 10}}
                                axisLine={false}
                                tickLine={false}
                                orientation="right"
                            />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="ele" 
                                stroke="#FF7F32" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorElevation)" 
                                isAnimationActive={!!hoverPoint} // Only animate if not currently dragging
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
