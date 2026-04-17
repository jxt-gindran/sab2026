import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  MAPS_DATA,
  MYPOPI_DATA,
  matchMaps,
  matchMypopi,
  sliderToAmount,
  amountToSlider,
  type MapsItem,
  type MypopiItem,
} from '../lib/donationMatcher';

// ── Sub-components ────────────────────────────────────────────────────────────

interface MapsCardProps { item: MapsItem; }
const MapsCard: React.FC<MapsCardProps> = ({ item }) => (
  <div className="flex-1 min-w-0 rounded-3xl border-2 border-[#00AEEF]/30 bg-gradient-to-br from-[#001B3A] to-[#00233F] p-6 md:p-8 text-white shadow-2xl flex flex-col gap-3 transition-all duration-500 animate-fade-in">
    <div className="flex items-center gap-2 mb-1">
      <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-[#00AEEF]/20 shrink-0">
        <img src="/assets/logos/MMA_logo.png" alt="MAPS" className="h-5 w-5 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00AEEF]">MAPS</span>
    </div>
    <div className="text-2xl md:text-3xl font-black font-heading text-white leading-tight">{item.title}</div>
    <div className="text-xs font-bold text-[#00AEEF]/60 uppercase tracking-widest">From RM {item.tier.toLocaleString()}</div>
    <p className="text-sm text-white/70 font-medium leading-relaxed flex-grow">{item.description}</p>
  </div>
);

interface MypopiCardProps { item: MypopiItem; }
const MypopiCard: React.FC<MypopiCardProps> = ({ item }) => (
  <div className="flex-1 min-w-0 rounded-3xl border-2 border-[#F4831F]/30 bg-gradient-to-br from-[#3A1A00] to-[#2A1200] p-6 md:p-8 text-white shadow-2xl flex flex-col gap-3 transition-all duration-500 animate-fade-in">
    <div className="flex items-center gap-2 mb-1">
      <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-[#F4831F]/20 shrink-0">
        <img src="/assets/logos/MMAF_logo.png" alt="MyPOPI" className="h-5 w-5 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F4831F]">MyPOPI</span>
    </div>
    <div className="text-xl md:text-2xl font-black text-[#F4831F] leading-tight">{item.category}</div>
    <div className="text-xs font-bold text-[#F4831F]/60 uppercase tracking-widest">From RM {item.tier.toLocaleString()}</div>
    <p className="text-sm text-white/70 font-medium leading-relaxed flex-grow">{item.description}</p>
  </div>
);

// Mobile accordion card wrapper
interface MobileCardWrapperProps {
  label: string;
  accentColor: string;
  children: React.ReactNode;
}
const MobileCardWrapper: React.FC<MobileCardWrapperProps> = ({ label, accentColor, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border-2 transition-all duration-300" style={{ borderColor: accentColor + '40' }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
        style={{ background: accentColor + '15' }}
      >
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>{label} Impact</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} style={{ color: accentColor }} />
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};

// ── Cyclist SVG icon for slider thumb ────────────────────────────────────────
const CyclistIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#F4831F" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 drop-shadow-lg">
    <circle cx="15.5" cy="3.5" r="1.5"/>
    <path d="M12 10.31V8l3.5 2.5-2 2L12 11.5V15l-3-1.5V10l3 .31zM5 14.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0zm1.5 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM12.5 14.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0zm1.5 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
    <path d="M8.5 7l1.5 3-2 1.5"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────

interface DonationSliderStepProps {
  amount: number;
  onChange: (amount: number) => void;
}

const DonationSliderStep: React.FC<DonationSliderStepProps> = ({ amount, onChange }) => {
  const [inputValue, setInputValue] = useState(String(amount));
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Sync inputValue when amount changes externally (slider drag)
  useEffect(() => {
    if (!isEditing) setInputValue(String(amount));
  }, [amount, isEditing]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value) / 1000;
    const newAmount = sliderToAmount(pct);
    onChange(newAmount);
    setInputValue(String(newAmount));
  }, [onChange]);

  const handleInputCommit = useCallback(() => {
    const parsed = parseInt(inputValue.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 50) {
      onChange(parsed);
    } else {
      setInputValue(String(amount)); // revert
    }
    setIsEditing(false);
  }, [inputValue, amount, onChange]);

  const mapsMatch = matchMaps(amount);
  const mypopiMatch = matchMypopi(amount);
  const sliderPct = amountToSlider(amount);

  // Slider fill % for CSS gradient
  const fillPct = Math.round(sliderPct * 100);

  return (
    <div className="animate-fade-in flex-grow flex flex-col">
      {/* ── Heading ── */}
      <h2 className="text-2xl sm:text-4xl font-black text-brand-navy mb-1 tracking-tighter leading-none font-heading">
        Choose Your Impact.
      </h2>
      <p className="text-sm text-brand-slate font-medium mb-8">
        Drag the slider or tap the amount to enter a custom value.
      </p>

      {/* ── Amount Display ── */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl md:text-4xl font-black text-brand-slate/40 font-heading">RM</span>
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            min={50}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputCommit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit(); }}
            autoFocus
            className="text-5xl md:text-7xl font-black text-brand-navy font-heading text-center outline-none border-b-4 border-brand-orange bg-transparent w-[220px] md:w-[300px] appearance-none"
            style={{ MozAppearance: 'textfield' } as React.CSSProperties}
          />
        ) : (
          <button
            onClick={() => { setIsEditing(true); setTimeout(() => inputRef.current?.select(), 0); }}
            className="text-5xl md:text-7xl font-black text-brand-navy font-heading hover:text-brand-orange transition-colors cursor-text leading-none"
            title="Tap to enter custom amount"
          >
            {amount.toLocaleString()}
          </button>
        )}
      </div>
      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
        {isEditing ? 'Press Enter or click away to apply' : 'Tap amount to edit'}
      </p>

      {/* ── Cyclist Slider ── */}
      <div className="relative mb-3 px-2">
        {/* Gradient track background */}
        <div
          className="absolute top-1/2 left-2 right-2 h-3 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #00AEEF, #7ECFB3, #F4831F)',
          }}
        />
        {/* Unfilled overlay from thumb to right */}
        <div
          className="absolute top-1/2 right-2 h-3 -translate-y-1/2 rounded-r-full pointer-events-none bg-slate-200/60"
          style={{ left: `calc(${fillPct}% * (100% - 16px) / 100 + 8px)` }}
        />

        <style>{`
          .cyclist-slider {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            width: 100%;
            height: 48px;
            cursor: pointer;
            position: relative;
            z-index: 10;
          }
          .cyclist-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 40px;
            height: 40px;
            background: transparent;
            cursor: grab;
            margin-top: -2px;
          }
          .cyclist-slider::-moz-range-thumb {
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
            cursor: grab;
          }
          .cyclist-slider::-webkit-slider-runnable-track {
            background: transparent;
            height: 12px;
          }
          .cyclist-slider::-moz-range-track {
            background: transparent;
            height: 12px;
          }
        `}</style>

        {/* Custom cyclist thumb positioned via CSS var trick */}
        <div className="relative">
          <input
            ref={sliderRef}
            type="range"
            min={0}
            max={1000}
            step={1}
            value={Math.round(sliderPct * 1000)}
            onChange={handleSliderChange}
            className="cyclist-slider"
          />
          {/* Cyclist icon overlaid on top of slider thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
            style={{
              left: `calc(${fillPct}% * (100% - 40px) / 100)`,
            }}
          >
            <div className="w-10 flex items-center justify-center drop-shadow-xl">
              <CyclistIcon />
            </div>
          </div>
        </div>

        {/* Range labels */}
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 px-1">
          <span>RM 50</span>
          <span>RM 5K</span>
          <span>RM 60K+</span>
        </div>
      </div>

      {/* ── 50/50 Split Notice ── */}
      <div className="flex items-center justify-center gap-3 my-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00AEEF]/40" />
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed">
          Your donation is shared equally (50/50) between{' '}
          <span className="text-[#00AEEF]">MAPS</span> and{' '}
          <span className="text-[#F4831F]">MyPOPI</span>
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F4831F]/40" />
      </div>

      {/* ── Impact Cards ── */}
      <div className="flex-grow">
        {/* Desktop: side by side */}
        <div className="hidden md:flex gap-4">
          {mapsMatch
            ? <MapsCard item={mapsMatch} />
            : <div className="flex-1 rounded-3xl border-2 border-dashed border-[#00AEEF]/20 flex items-center justify-center text-xs text-[#00AEEF]/40 font-bold uppercase tracking-widest p-8">Increase donation to unlock MAPS impact</div>
          }
          {mypopiMatch
            ? <MypopiCard item={mypopiMatch} />
            : <div className="flex-1 rounded-3xl border-2 border-dashed border-[#F4831F]/20 flex items-center justify-center text-xs text-[#F4831F]/40 font-bold uppercase tracking-widest p-8">Increase donation to unlock MyPOPI impact</div>
          }
        </div>

        {/* Mobile: stacked with accordion */}
        <div className="flex flex-col gap-3 md:hidden">
          <MobileCardWrapper label="MAPS" accentColor="#00AEEF">
            {mapsMatch
              ? <MapsCard item={mapsMatch} />
              : <div className="p-4 text-xs text-[#00AEEF]/60 font-bold text-center">Increase donation to unlock MAPS impact</div>
            }
          </MobileCardWrapper>
          <MobileCardWrapper label="MyPOPI" accentColor="#F4831F">
            {mypopiMatch
              ? <MypopiCard item={mypopiMatch} />
              : <div className="p-4 text-xs text-[#F4831F]/60 font-bold text-center">Increase donation to unlock MyPOPI impact</div>
            }
          </MobileCardWrapper>
        </div>
      </div>
    </div>
  );
};

export default DonationSliderStep;
