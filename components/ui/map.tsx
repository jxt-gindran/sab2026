import React, { Children, isValidElement, cloneElement, ReactElement } from "react";

// PROJECTION CONSTANTS FOR BORNEO REGION (KK to Miri)
// Approximate bounding box based on route data:
// LNG: [113.8, 117.0] (3.2 width)
// LAT: [4.2, 6.2] (2.0 height)
const MIN_LNG = 113.8;
const MAX_LNG = 117.0;
const MIN_LAT = 4.2;
const MAX_LAT = 6.2;
const LNG_RANGE = MAX_LNG - MIN_LNG;
const LAT_RANGE = MAX_LAT - MIN_LAT;
const ASPECT_RATIO = LNG_RANGE / LAT_RANGE; // ~1.6

// Simple linear projection to percentage coordinates (0-100%)
// SVG coordinate system: (0,0) is top-left
// Map coordinate system: lat increases upwards (y decreases in SVG)
function project(lng: number, lat: number) {
    const x = ((lng - MIN_LNG) / LNG_RANGE) * 100;
    const y = 100 - ((lat - MIN_LAT) / LAT_RANGE) * 100;
    return { x, y };
}

// --- COMPONENTS ---

export function Map({ center, zoom, bearing, pitch, children, className, backgroundImage }: any) {
    // We ignore center/zoom/bearing for this static SVG implementation to maintain layout
    // But we render children which contain the route and markers.

    return (
        <div className={`relative w-full h-full overflow-hidden bg-[#e6eeef] ${className || ''}`}>
            {/* Optional Background Image */}
            {backgroundImage && (
                <img
                    src={backgroundImage}
                    alt="Map Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply pointer-events-none"
                />
            )}

            {/* Background Map Shapes (Simplified Coastline Placeholder) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Abstract background shape roughly masking land vs sea */}
                <path d="M0,100 L100,100 L100,0 L70,10 C50,30 30,60 0,60 Z" fill="#cbdbe3" />
            </svg>

            {/* Render Route (SVG Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Children.map(children, (child) => {
                    if (isValidElement(child) && child.type === MapRoute) {
                        return child;
                    }
                    return null;
                })}
            </svg>

            {/* Render Markers (HTML Elements) */}
            <div className="absolute inset-0 z-10">
                {Children.map(children, (child) => {
                    if (isValidElement(child) && child.type === MapMarker) {
                        const { longitude, latitude } = child.props as any;
                        const { x, y } = project(longitude, latitude);

                        return (
                            <div
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group/marker"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                {child}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Compass Handling - if passed as child, it just renders normally */}
            <div className="absolute top-4 right-4 pointer-events-none">
                {/* Compass rendering logic if needed, but BorneoRouteMap handles it outside Map children typically */}
            </div>

        </div>
    );
}

export function MapRoute({ coordinates, color = 'blue', width = 2, opacity = 1 }: any) {
    if (!coordinates || coordinates.length === 0) return null;

    const points = coordinates.map((coord: [number, number]) => {
        const { x, y } = project(coord[0], coord[1]);
        return `${x},${y}`;
    }).join(" ");

    return (
        <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={width / 5} // Scale width relative to SVG
            strokeOpacity={opacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke" // Ensure constant width regardless of scaling
        // Actually vector-effect requires specific SVG setup, simpler to just use percentage width or adjust
        // For percentage based viewBox 0-100, strokeWidth of 0.5 is reasonable
        />
    );
}

export function MapMarker({ longitude, latitude, children }: any) {
    // Markers logic handled in Map parent to position absolutely
    return <>{children}</>;
}

export function MarkerContent({ children }: any) {
    return <div className="relative">{children}</div>;
}

export function MarkerTooltip({ children }: any) {
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-white p-2 rounded shadow-lg opacity-0 group-hover/marker:opacity-100 transition-opacity z-50">
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
        </div>
    );
}
