import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { sliderToAmount, amountToSlider } from '../lib/donationMatcher';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ImpactTier {
  _id: string;
  charity: string;
  tier: number;
  title?: string;
  category?: string;
  description: string;
  isActive?: boolean;
}

// ── Floor-match helper ────────────────────────────────────────────────────────
function floorMatch(tiers: ImpactTier[], amount: number): ImpactTier | null {
  const eligible = tiers.filter((t) => t.isActive !== false && t.tier <= amount);
  if (!eligible.length) return null;
  return eligible.reduce((a, b) => (b.tier > a.tier ? b : a));
}

// ── Cards ─────────────────────────────────────────────────────────────────────
interface MapsCardProps  { item: ImpactTier; }
const MapsCard: React.FC<MapsCardProps> = ({ item }) => (
  <div className="flex-1 min-w-0 bg-white rounded-[2rem] border border-brand-grey/20 shadow-xl p-7 flex flex-col gap-3 transition-all duration-500 animate-fade-in relative overflow-hidden">
    {/* Subtle teal accent blob */}
    <div className="absolute -top-8 -right-8 h-28 w-28 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />
    <div className="flex items-center gap-3 mb-1 relative z-10">
      <div className="h-10 w-10 bg-brand-pale rounded-xl flex items-center justify-center shrink-0 p-1.5">
        <img
          src="https://sab.mma.org.my/assets/logos/MAPS%20Logo.png"
          alt="MAPS"
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-cyan">MAPS</span>
    </div>
    <h3 className="text-2xl md:text-2xl font-black font-heading text-brand-navy leading-tight relative z-10">
      {item.title}
    </h3>
    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest relative z-10">
      From RM {item.tier.toLocaleString()}
    </div>
    <p className="text-sm text-brand-slate font-medium leading-relaxed flex-grow relative z-10">
      {item.description}
    </p>
  </div>
);

interface MypopiCardProps { item: ImpactTier; }
const MypopiCard: React.FC<MypopiCardProps> = ({ item }) => (
  <div className="flex-1 min-w-0 bg-white rounded-[2rem] border border-brand-grey/20 shadow-xl p-7 flex flex-col gap-3 transition-all duration-500 animate-fade-in relative overflow-hidden">
    {/* Subtle orange accent blob */}
    <div className="absolute -top-8 -right-8 h-28 w-28 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
    <div className="flex items-center gap-3 mb-1 relative z-10">
      <div className="h-10 w-10 bg-brand-pale rounded-xl flex items-center justify-center shrink-0 p-1.5">
        <img
          src="https://sab.mma.org.my/assets/logos/MyPOPI-1.png"
          alt="MyPOPI"
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange">MyPOPI</span>
    </div>
    <h3 className="text-2xl font-black font-heading text-brand-navy leading-tight relative z-10">
      {item.category}
    </h3>
    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest relative z-10">
      From RM {item.tier.toLocaleString()}
    </div>
    <p className="text-sm text-brand-slate font-medium leading-relaxed flex-grow relative z-10">
      {item.description}
    </p>
  </div>
);

// ── Mobile accordion wrapper ──────────────────────────────────────────────────
interface MobileCardWrapperProps {
  label: string;
  accentClass: string;
  borderColorHex: string;
  children: React.ReactNode;
}
const MobileCardWrapper: React.FC<MobileCardWrapperProps> = ({ label, accentClass, borderColorHex, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-brand-pale/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-brand-pale/30 text-left"
      >
        <span className={`text-xs font-black uppercase tracking-widest ${accentClass}`}>{label} Impact</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${accentClass} ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

// ── Cyclist SVG ───────────────────────────────────────────────────────────────
const CyclistSVG: React.FC = () => (
  <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <circle cx="24" cy="5" r="3" fill="#F4831F"/>
    {/* Body / torso leaning forward */}
    <path d="M24 8 L18 16 L13 14" stroke="#F4831F" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    {/* Left arm to handlebar */}
    <path d="M18 16 L14 12" stroke="#F4831F" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Crank arm */}
    <path d="M18 16 L20 22" stroke="#F4831F" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    {/* Rear wheel */}
    <circle cx="10" cy="26" r="7" stroke="#F4831F" strokeWidth="2" fill="none"/>
    {/* Front wheel */}
    <circle cx="26" cy="26" r="7" stroke="#F4831F" strokeWidth="2" fill="none"/>
    {/* Seat stay and chain stay */}
    <path d="M18 16 L10 26 M20 22 L10 26 M20 22 L26 26 M14 12 L26 26" stroke="#F4831F" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────
interface DonationSliderStepProps {
  amount: number;
  onChange: (amount: number) => void;
}

const DonationSliderStep: React.FC<DonationSliderStepProps> = ({ amount, onChange }) => {
  const [inputValue, setInputValue] = useState(String(amount));
  const [isEditing, setIsEditing] = useState(false);

  // ── Backend queries ──
  const mapsTiersRaw  = useQuery(api.impactTiers.listByCharity, { charity: 'maps'   }) ?? null;
  const mypopiTiersRaw = useQuery(api.impactTiers.listByCharity, { charity: 'mypopi' }) ?? null;
  const seedDefaults  = useMutation(api.impactTiers.seedDefaults);

  // Seed on first mount if DB is empty
  useEffect(() => {
    seedDefaults().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use active tiers from DB; while loading, show nothing (cards simply absent)
  const mapsTiers   = useMemo(() => (mapsTiersRaw  ?? []) as ImpactTier[], [mapsTiersRaw]);
  const mypopiTiers = useMemo(() => (mypopiTiersRaw ?? []) as ImpactTier[], [mypopiTiersRaw]);

  const mapsMatch   = useMemo(() => floorMatch(mapsTiers,   amount), [mapsTiers,   amount]);
  const mypopiMatch = useMemo(() => floorMatch(mypopiTiers, amount), [mypopiTiers, amount]);

  // Sync displayed value when slider changes externally
  useEffect(() => {
    if (!isEditing) setInputValue(String(amount));
  }, [amount, isEditing]);

  const sliderPct = amountToSlider(amount); // 0–1
  const sliderVal = Math.round(sliderPct * 10000); // maps to range 0–10000

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseInt(e.target.value, 10) / 10000;
    const next = sliderToAmount(pct);
    onChange(next);
  }, [onChange]);

  const handleInputCommit = useCallback(() => {
    const parsed = parseInt(inputValue.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 50) {
      onChange(parsed);
    } else {
      setInputValue(String(amount));
    }
    setIsEditing(false);
  }, [inputValue, amount, onChange]);

  // Fill % for the coloured portion of the track
  const fillPct = sliderPct * 100;

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      {/* Heading */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-black text-brand-navy mb-1 tracking-tighter leading-none font-heading">
          Choose Your Impact.
        </h2>
        <p className="text-sm text-brand-slate font-medium">
          Drag the slider or tap the amount below to enter a custom value.
        </p>
      </div>

      {/* ── Amount Display ── */}
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-3xl font-black text-brand-slate/40 font-heading select-none">RM</span>
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            min={50}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputCommit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit(); }}
            autoFocus
            className="text-5xl md:text-7xl font-black text-brand-navy font-heading text-center outline-none border-b-4 border-brand-orange bg-transparent w-[200px] md:w-[280px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-5xl md:text-7xl font-black text-brand-navy font-heading hover:text-brand-orange transition-colors cursor-text leading-none"
            title="Tap to enter custom amount"
          >
            {amount.toLocaleString()}
          </button>
        )}
      </div>
      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-3">
        {isEditing ? 'Press Enter or click away to apply' : 'Tap amount to edit · Min RM 50'}
      </p>

      {/* ── Cyclist Slider ── */}
      <div className="relative select-none" style={{ height: '72px' }}>

        {/* Gradient track (full width) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%',
            left: '0',
            right: '0',
            height: '12px',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(to right, #00AEEF, #6ECFA3, #F4831F)',
          }}
        />

        {/* Dim overlay for unfilled portion */}
        <div
          className="absolute rounded-r-full pointer-events-none bg-slate-200/70"
          style={{
            top: '50%',
            height: '12px',
            transform: 'translateY(-50%)',
            left: `${fillPct}%`,
            right: '0',
          }}
        />

        {/*
          Native range input — TRANSPARENT so our custom track shows through.
          The thumb is also made invisible; the cyclist SVG below is positioned
          to match it using the same fillPct calculation.
        */}
        <input
          type="range"
          min={0}
          max={10000}
          step={1}
          value={sliderVal}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '100%', zIndex: 20 }}
        />

        {/* Cyclist icon — positioned on top of the invisible thumb */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            // Mirror browser thumb centering: thumb spans [thumb/2 .. width-thumb/2]
            // We use 60px thumb width equivalent
            left: `calc(${fillPct}% * (100% - 60px) / 100%)`,
            transform: 'translateY(-50%)',
            width: '60px',
            height: '60px',
            zIndex: 10,
          }}
        >
          <CyclistSVG />
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-slate/50 -mt-3 px-1">
        <span>RM 50</span>
        <span>RM 5K</span>
        <span>RM 60K+</span>
      </div>

      {/* ── 50/50 notice ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-cyan/30" />
        <p className="text-[11px] font-black text-brand-slate/60 uppercase tracking-widest text-center leading-snug">
          Shared equally (50/50) between{' '}
          <span className="text-brand-cyan">MAPS</span> &amp;{' '}
          <span className="text-brand-orange">MyPOPI</span>
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-orange/30" />
      </div>

      {/* ── Impact Cards — Desktop ── */}
      <div className="hidden md:flex gap-5">
        {mapsMatch
          ? <MapsCard item={mapsMatch} />
          : (
            <div className="flex-1 rounded-[2rem] border-2 border-dashed border-brand-cyan/20 flex items-center justify-center text-xs text-brand-cyan/40 font-black uppercase tracking-widest p-8 text-center">
              Increase donation to<br />unlock MAPS impact
            </div>
          )}
        {mypopiMatch
          ? <MypopiCard item={mypopiMatch} />
          : (
            <div className="flex-1 rounded-[2rem] border-2 border-dashed border-brand-orange/20 flex items-center justify-center text-xs text-brand-orange/40 font-black uppercase tracking-widest p-8 text-center">
              Increase donation to<br />unlock MyPOPI impact
            </div>
          )}
      </div>

      {/* ── Impact Cards — Mobile ── */}
      <div className="flex flex-col gap-3 md:hidden">
        <MobileCardWrapper label="MAPS" accentClass="text-brand-cyan" borderColorHex="#00AEEF">
          {mapsMatch
            ? <MapsCard item={mapsMatch} />
            : <p className="p-4 text-xs text-brand-cyan/50 font-bold text-center">Increase donation to unlock MAPS impact</p>
          }
        </MobileCardWrapper>
        <MobileCardWrapper label="MyPOPI" accentClass="text-brand-orange" borderColorHex="#F4831F">
          {mypopiMatch
            ? <MypopiCard item={mypopiMatch} />
            : <p className="p-4 text-xs text-brand-orange/50 font-bold text-center">Increase donation to unlock MyPOPI impact</p>
          }
        </MobileCardWrapper>
      </div>
    </div>
  );
};

export default DonationSliderStep;
