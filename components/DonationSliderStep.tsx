import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { sliderToAmount, amountToSlider } from '../lib/donationMatcher';
import { useTranslation } from '../lib/i18n';

// ── Types ─────────────────────────────────────────────────────────────────────
interface TierTranslation {
  title?:       string;
  category?:    string;
  description?: string;
}

interface ImpactTier {
  _id: string;
  charity: string;
  tier: number;
  title?: string;
  category?: string;
  description: string;
  isActive?: boolean;
  translations?: Record<string, TierTranslation>;
}

// ── Floor-match helper ────────────────────────────────────────────────────────
function floorMatch(tiers: ImpactTier[], amount: number): ImpactTier | null {
  const eligible = tiers.filter((t) => t.isActive !== false && t.tier <= amount);
  if (!eligible.length) return null;
  return eligible.reduce((a, b) => (b.tier > a.tier ? b : a));
}

// ── Resolve translated content with English fallback ─────────────────────────
function resolveTier(tier: ImpactTier, lang: string) {
  const ov = lang !== 'en' ? (tier.translations?.[lang] ?? {}) : {};
  return {
    title:       ov.title       ?? tier.title,
    category:    ov.category    ?? tier.category,
    description: ov.description ?? tier.description,
  };
}

// ── Cards ─────────────────────────────────────────────────────────────────────
// Card title is 1 size smaller (xl instead of 2xl), consistent across both charities.
// Charity label is brand-navy per brand guidelines.

interface MapsCardProps { item: ImpactTier; lang: string; }
const MapsCard: React.FC<MapsCardProps> = ({ item, lang }) => {
  const r = resolveTier(item, lang);
  return (
  <div className="flex-1 min-w-0 bg-white rounded-[2rem] border border-brand-grey/20 shadow-xl p-7 flex flex-col gap-3 transition-all duration-500 animate-fade-in relative overflow-hidden">
    <div className="absolute -top-8 -right-8 h-28 w-28 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />
    {/* Header row: logo + name only */}
    <div className="flex items-center gap-3 relative z-10">
      <div className="h-10 w-10 bg-brand-pale rounded-xl flex items-center justify-center shrink-0 p-1.5">
        <img
          src="https://sab.mma.org.my/assets/logos/MAPS%20Logo.png"
          alt="MAPS"
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      {/* brand-navy per guidelines */}
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-navy">MAPS</span>
      {/* Price tag pushed to the right */}
      <div className="ml-auto text-sm font-black text-brand-orange uppercase tracking-widest leading-tight whitespace-nowrap">
        From RM {item.tier.toLocaleString()}
      </div>
    </div>
    {/* xl = 1 size smaller than 2xl, consistent */}
    <h3 className="text-xl font-black font-heading text-brand-navy leading-tight relative z-10">
      {r.title}
    </h3>
    <p className="text-sm text-brand-slate font-medium leading-relaxed flex-grow relative z-10">
      {r.description}
    </p>
  </div>
);
};

interface MypopiCardProps { item: ImpactTier; lang: string; }
const MypopiCard: React.FC<MypopiCardProps> = ({ item, lang }) => {
  const r = resolveTier(item, lang);
  return (
  <div className="flex-1 min-w-0 bg-white rounded-[2rem] border border-brand-grey/20 shadow-xl p-7 flex flex-col gap-3 transition-all duration-500 animate-fade-in relative overflow-hidden">
    <div className="absolute -top-8 -right-8 h-28 w-28 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
    {/* Header row: logo + name only */}
    <div className="flex items-center gap-3 relative z-10">
      <div className="h-10 w-10 bg-brand-pale rounded-xl flex items-center justify-center shrink-0 p-1.5">
        <img
          src="https://sab.mma.org.my/assets/logos/MyPOPI-1.png"
          alt="MyPOPI"
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      {/* brand-navy per guidelines */}
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-navy">MyPOPI</span>
      {/* Price tag pushed to the right */}
      <div className="ml-auto text-sm font-black text-brand-orange uppercase tracking-widest leading-tight whitespace-nowrap">
        From RM {item.tier.toLocaleString()}
      </div>
    </div>
    {/* xl = 1 size smaller, consistent with MAPS card */}
    <h3 className="text-xl font-black font-heading text-brand-navy leading-tight relative z-10">
      {r.category}
    </h3>
    <p className="text-sm text-brand-slate font-medium leading-relaxed flex-grow relative z-10">
      {r.description}
    </p>
  </div>
);
};

// ── Cyclist SVG — updated per user spec ──────────────────────────────────────
const CyclistSVG: React.FC = () => (
  <svg
    fill="#F4831F"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="-25.61 -25.61 96.94 96.94"
    className="w-full h-full drop-shadow-md"
    stroke="#F4831F"
  >
    <g strokeWidth="0" />
    <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="1.37175" />
    <g>
      <g>
        <g>
          <path d="M9.405,25.479C4.218,25.479,0,29.698,0,34.885s4.219,9.407,9.405,9.407c5.188,0,9.407-4.22,9.407-9.407
            S14.593,25.479,9.405,25.479z M9.405,40.305c-2.987,0-5.419-2.432-5.419-5.42s2.432-5.42,5.419-5.42
            c2.989,0,5.421,2.432,5.421,5.42S12.395,40.305,9.405,40.305z"/>
          <path d="M36.318,25.479c-5.188,0-9.406,4.219-9.406,9.406s4.219,9.407,9.406,9.407c5.188,0,9.406-4.22,9.406-9.407
            S41.506,25.479,36.318,25.479z M36.318,40.305c-2.988,0-5.42-2.432-5.42-5.42s2.432-5.42,5.42-5.42
            c2.987,0,5.42,2.432,5.42,5.42S39.306,40.305,36.318,40.305z"/>
          <path d="M24.777,25.198l-5.056-4.479l5.487-5.25l2.574,3.894c0.531,0.806,1.42,1.305,2.388,1.339l5.058,0.179
            c1.633,0.062,3.034-1.232,3.094-2.882c0.059-1.651-1.232-3.036-2.883-3.094l-3.52-0.124l-3.7-5.594
            c-0.489-0.739-1.28-1.224-2.16-1.322c-0.885-0.098-1.76,0.197-2.4,0.811L13.237,18.64
            c-0.604,0.578-0.938,1.381-0.922,2.217c0.014,0.835,0.385,1.626,1.01,2.181l6.478,5.741v10.244
            c0,1.65,1.345,2.989,2.996,2.989c1.652,0,2.997-1.339,2.997-2.989V27.433C25.795,26.579,25.416,25.764,24.777,25.198z"/>
          <circle cx="32.363" cy="5.388" r="3.956"/>
        </g>
      </g>
    </g>
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────
interface DonationSliderStepProps {
  amount: number;
  onChange: (amount: number) => void;
}

const DonationSliderStep: React.FC<DonationSliderStepProps> = ({ amount, onChange }) => {
  const { lang } = useTranslation();
  const [inputValue, setInputValue] = useState(String(amount));
  const [isEditing, setIsEditing] = useState(false);

  // ── Backend queries ──
  const mapsTiersRaw   = useQuery(api.impactTiers.listByCharity, { charity: 'maps'   }) ?? null;
  const mypopiTiersRaw = useQuery(api.impactTiers.listByCharity, { charity: 'mypopi' }) ?? null;
  const seedDefaults   = useMutation(api.impactTiers.seedDefaults);

  // Seed on first mount if DB is empty
  useEffect(() => {
    seedDefaults().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapsTiers   = useMemo(() => (mapsTiersRaw  ?? []) as ImpactTier[], [mapsTiersRaw]);
  const mypopiTiers = useMemo(() => (mypopiTiersRaw ?? []) as ImpactTier[], [mypopiTiersRaw]);

  const mapsMatch   = useMemo(() => floorMatch(mapsTiers,   amount), [mapsTiers,   amount]);
  const mypopiMatch = useMemo(() => floorMatch(mypopiTiers, amount), [mypopiTiers, amount]);

  // Sync displayed value when slider changes externally
  useEffect(() => {
    if (!isEditing) setInputValue(String(amount));
  }, [amount, isEditing]);

  const sliderPct = amountToSlider(amount); // 0–1
  const sliderVal = Math.round(sliderPct * 10000); // 0–10000

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseInt(e.target.value, 10) / 10000;
    const next = sliderToAmount(pct);
    onChange(next);
  }, [onChange]);

  const handleInputCommit = useCallback(() => {
    const parsed = parseInt(inputValue.replace(/\D/g, ''), 10);
    // Min is RM 1 for manual entry; slider min is RM 50
    if (!isNaN(parsed) && parsed >= 1) {
      onChange(parsed);
    } else {
      setInputValue(String(amount));
    }
    setIsEditing(false);
  }, [inputValue, amount, onChange]);

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
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl font-black text-brand-slate/40 font-heading select-none self-end pb-1">RM</span>
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            min={1}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputCommit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit(); }}
            autoFocus
            className="text-5xl md:text-7xl font-black text-brand-navy font-heading text-center outline-none border-b-4 border-brand-orange bg-transparent w-[200px] md:w-[280px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 group"
            title="Tap to enter custom amount"
          >
            <span className="text-5xl md:text-7xl font-black text-brand-navy font-heading group-hover:text-brand-orange transition-colors leading-none">
              {amount.toLocaleString()}
            </span>
            {/* Visible edit icon */}
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-pale group-hover:bg-brand-orange group-hover:text-white text-brand-navy transition-all self-end mb-1 shrink-0">
              <Pencil className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>
      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-3">
        {isEditing ? 'Press Enter or click away to apply' : 'Tap to edit amount'}
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
        {/* Transparent native input — captures drag interaction */}
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
        {/* Cyclist icon overlaid on thumb position — pulsing ring hints it is draggable */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: `calc(${fillPct}% * (100% - 64px) / 100%)`,
            transform: 'translateY(-50%)',
            width: '64px',
            height: '64px',
            zIndex: 10,
          }}
        >
          {/* Pulsing ring — appears behind the cyclist */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(244,131,31,0.35) 0%, transparent 70%)',
              animationDuration: '1.6s',
            }}
          />
          {/* Soft static glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(244,131,31,0.18) 0%, transparent 65%)',
            }}
          />
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
          <span className="text-brand-navy">MAPS</span> &amp;{' '}
          <span className="text-brand-navy">MyPOPI</span>
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-orange/30" />
      </div>

      {/* ── Impact Cards — both desktop and mobile shown directly (no accordion) ── */}
      <div className="flex flex-col md:flex-row gap-5">
        {mapsMatch
          ? <MapsCard item={mapsMatch} lang={lang} />
          : (
            <div className="flex-1 rounded-[2rem] border-2 border-dashed border-brand-cyan/20 flex items-center justify-center text-xs text-brand-cyan/40 font-black uppercase tracking-widest p-8 text-center">
              Increase donation to<br />unlock MAPS impact
            </div>
          )}
        {mypopiMatch
          ? <MypopiCard item={mypopiMatch} lang={lang} />
          : (
            <div className="flex-1 rounded-[2rem] border-2 border-dashed border-brand-orange/20 flex items-center justify-center text-xs text-brand-orange/40 font-black uppercase tracking-widest p-8 text-center">
              Increase donation to<br />unlock MyPOPI impact
            </div>
          )}
      </div>
    </div>
  );
};

export default DonationSliderStep;
