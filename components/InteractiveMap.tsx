import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const InteractiveMap: React.FC = () => {
    const [activePoint, setActivePoint] = useState<number | null>(null);

    // Approximate Coordinates on the map % (Top Left Origin)
    // Assuming map covers the coast. KK is top-right, Miri is bottom-left.
    const points = [
        { id: 1, name: 'Kota Kinabalu', x: 85, y: 15, desc: 'Start Line. 26 July.' },
        { id: 2, name: 'Papar', x: 78, y: 25, desc: 'Check Point 1' },
        { id: 3, name: 'Beaufort', x: 70, y: 35, desc: 'Check Point 2' },
        { id: 4, name: 'Sipitang', x: 62, y: 45, desc: 'Border Crossing' },
        { id: 5, name: 'Lawas', x: 55, y: 55, desc: 'Sarawak Entry' },
        { id: 6, name: 'Limbang', x: 45, y: 65, desc: 'Gateway to Brunei' },
        { id: 7, name: 'Miri', x: 30, y: 80, desc: 'Finish Line. 1 Aug.' },
    ];

    return (
        <div className="relative w-full aspect-[16/9] bg-brand-navy rounded-3xl overflow-hidden shadow-2xl border border-brand-cyan/20 group">
            {/* Background Image */}
            <img
                src="/assets/images/map-route.webp"
                alt="Route Map"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-brand-navy/40 mix-blend-multiply"></div>

            {/* SVG Overlay for Line */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0cdfed" />
                        <stop offset="100%" stopColor="#FF7F32" />
                    </linearGradient>
                </defs>
                {/* Dashed Line connecting points */}
                <polyline
                    points={points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                    className="opacity-40"
                />
            </svg>

            {/* Interactive Points */}
            <div className="absolute inset-0 z-20">
                {points.map((p) => (
                    <div
                        key={p.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/point hover:z-50"
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        onMouseEnter={() => setActivePoint(p.id)}
                        onMouseLeave={() => setActivePoint(null)}
                    >
                        {/* Pulse Effect */}
                        <div className={`absolute inset-0 rounded-full ${p.name.includes('Kota') || p.name === 'Miri' ? 'bg-brand-orange animate-ping opacity-75' : 'bg-brand-cyan animate-ping opacity-40'} h-full w-full`}></div>

                        {/* Dot */}
                        <div className={`relative h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-150 ${p.name.includes('Kota') || p.name === 'Miri' ? 'bg-brand-orange h-4 w-4 sm:h-5 sm:w-5' : 'bg-brand-cyan'}`}></div>

                        {/* Tooltip */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 bg-white text-brand-navy p-3 rounded-xl shadow-xl transition-all duration-300 pointer-events-none z-50 ${activePoint === p.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
                            <div className="text-xs font-black uppercase tracking-widest mb-1 text-brand-orange">{p.name}</div>
                            <div className="text-[10px] font-bold text-slate-500 leading-tight">{p.desc}</div>
                            {/* Triangle */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend / Title Overlay */}
            <div className="absolute top-6 left-6 z-30 pointer-events-none">
                <div className="bg-brand-navy/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-brand-cyan animate-bounce" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Interactive Route</span>
                    </div>
                    <div className="text-[10px] text-brand-pale font-bold uppercase tracking-widest">Hover points for details</div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
