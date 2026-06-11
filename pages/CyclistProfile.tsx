import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTranslation } from '../lib/i18n';
import {
  Heart,
  ArrowLeft,
  Share2,
  ArrowRight,
  Target,
  MapPin,
  CheckCircle2,
  User
} from 'lucide-react';

const CyclistProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // Skip the query entirely if slug is missing — prevents querying with empty string
  const cyclist = useQuery(api.cyclists.getBySlug, slug ? { shareSlug: slug } : 'skip');
  const allSettings = useQuery(api.admin.getPublicSettings) || [];
  const showProgressSetting = allSettings.find((s: any) => s.key === 'show_fundraising_progress');
  const showFundraisingProgress = showProgressSetting ? showProgressSetting.value !== 'false' : true;
  const [copied, setCopied] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const { t, lang } = useTranslation();

  // Safety timeout: if Convex is slow / rate-limited, don't hang the spinner forever
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (cyclist !== undefined) {
      setTimedOut(false); // Query resolved — reset
      return;
    }
    const timer = setTimeout(() => setTimedOut(true), 10000); // 10 s
    return () => clearTimeout(timer);
  }, [cyclist]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (cyclist === undefined) {
    if (timedOut) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-pale px-4">
          <div className="text-center">
            <div className="text-5xl mb-4">⏱</div>
            <h1 className="text-2xl font-black text-brand-navy mb-3 font-heading">
              {t('cyclistProfile.load_error', 'Connection Timeout')}
            </h1>
            <p className="text-brand-slate font-medium mb-8 max-w-sm">
              {t('cyclistProfile.load_error_desc', 'Unable to load this profile. Please check your connection and try again.')}
            </p>
            <button
              onClick={() => { setTimedOut(false); window.location.reload(); }}
              className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-navy transition-all"
            >
              {t('cyclistProfile.retry', 'Retry')}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-pale">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-brand-cyan border-t-transparent animate-spin" />
          <p className="font-black text-brand-navy uppercase tracking-widest text-xs">{t('cyclistProfile.loading')}</p>
        </div>
      </div>
    );
  }

  if (!cyclist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-pale px-4">
        <div className="text-center">
          <h1 className="text-6xl font-black text-brand-navy mb-4 font-heading">404</h1>
          <p className="text-brand-slate font-medium mb-8">{t('cyclistProfile.not_found')}</p>
          <Link to="/ride" className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-navy transition-all">
            {t('cyclistProfile.view_all_riders')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Resolve translated content with English fallback ─────────────────────
  const langOverride = cyclist.translations?.[lang];
  const displayName  = langOverride?.name  ?? cyclist.name;
  const displayRole  = langOverride?.role  ?? cyclist.role;
  const displayStory = langOverride?.story ?? cyclist.story;

  const pct = Math.min((cyclist.raised / cyclist.goal) * 100, 100);
  const galleryImages = (cyclist.galleryUrls || []).filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="relative bg-brand-navy overflow-hidden pt-24 pb-10">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#0cdfed 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Profile photo as full bleed bg */}
        {cyclist.profileUrl && (
          <div className="absolute inset-0 z-0">
            <img src={cyclist.profileUrl} alt={displayName} className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-0">
          {/* Back nav */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-brand-cyan text-xs font-black uppercase tracking-widest transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> {t('cyclistProfile.back')}
          </button>

          <div className="flex flex-col md:flex-row items-end gap-8 pb-0">
            {/* Avatar */}
            <div className="relative shrink-0 self-center md:self-end">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border-4 border-brand-cyan shadow-2xl shadow-brand-cyan/20 bg-slate-800">
                {cyclist.profileUrl ? (
                  <img src={cyclist.profileUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-20 w-20 text-slate-600" />
                  </div>
                )}
              </div>
              {/* Role badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                {displayRole}
              </div>
            </div>

            {/* Name & stats */}
            <div className="flex-grow text-center md:text-left pb-8">
              <div className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t('cyclistProfile.sab_rider_label')}</div>
              <h1 className="text-4xl md:text-6xl font-black text-white font-heading leading-tight mb-4 tracking-tighter">
                {displayName}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-cyan" /> {t('cyclistProfile.location_label')}</span>
                {showFundraisingProgress && (
                  <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-brand-orange" /> RM {cyclist.goal.toLocaleString()} {t('cyclistProfile.goal_label')}</span>
                )}
                {cyclist.isFeatured && (
                  <span className="flex items-center gap-1.5 text-brand-orange"><CheckCircle2 className="h-3.5 w-3.5" /> {t('cyclistProfile.featured_label')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FUNDRAISING PROGRESS ────────────────────────────────────── */}
      {showFundraisingProgress && (
        <div className="bg-brand-navy border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-brand-cyan font-black text-2xl font-heading">RM {cyclist.raised.toLocaleString()}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{t('cyclistProfile.raised_label')}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-black text-lg font-heading">RM {cyclist.goal.toLocaleString()}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{t('cyclistProfile.goal_label')}</div>
                </div>
              </div>
              <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #00AEEF, #F97316)' }}
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-white/20 to-transparent" style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>
              <div className="text-right text-white/40 text-[10px] font-black uppercase tracking-widest">{pct.toFixed(0)}{t('cyclistProfile.reached_suffix')}</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTENT BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT — Story + Gallery */}
        <div className="lg:col-span-2 space-y-10">

          {/* Story */}
          {displayStory && (
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.2em] mb-4">{t('cyclistProfile.their_story')}</div>
              <div
                className="prose prose-base max-w-none text-brand-slate leading-relaxed"
                style={{ fontFamily: 'inherit' }}
                dangerouslySetInnerHTML={{ __html: displayStory }}
              />
            </div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.2em] mb-4">{t('cyclistProfile.gallery')}</div>
              <div className={`grid gap-4 ${galleryImages.length === 1 ? 'grid-cols-1' : galleryImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightboxImg(img)}
                    className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Info */}
          <div className="bg-brand-pale/50 rounded-3xl p-8 border border-brand-grey/20">
            <div className="text-brand-orange font-black text-xs uppercase tracking-[0.2em] mb-5">{t('cyclistProfile.about_the_ride')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: t('cyclistProfile.distance_label'), value: t('cyclistProfile.distance_value') },
                { label: t('cyclistProfile.days_label'),     value: t('cyclistProfile.days_value') },
                { label: t('cyclistProfile.route_label'),    value: t('cyclistProfile.route_value') },
                { label: t('cyclistProfile.date_label'),     value: t('cyclistProfile.date_value') },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-brand-navy font-heading">{s.value}</div>
                  <div className="text-[10px] font-black text-brand-slate/50 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — CTA Sticky Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Donate CTA */}
            <div className="bg-brand-navy rounded-3xl p-8 text-white">
              <div className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.25em] mb-2">{t('cyclistProfile.support_prefix')} {displayName.split(' ')[0]}</div>
              <p className="text-white/70 text-sm font-medium mb-6 leading-relaxed">
                {t('cyclistProfile.donate_desc')}
              </p>
              <Link
                to={`/donate?cyclist=${encodeURIComponent(cyclist.shareSlug)}`}
                className="block w-full text-center bg-brand-orange hover:bg-brand-cyan hover:text-brand-navy text-white font-black py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-sm mb-3"
              >
                <Heart className="h-4 w-4 inline mr-2" />
                {t('cyclistProfile.donate_now')}
              </Link>
              <Link
                to="/donate"
                className="block w-full text-center text-white/40 hover:text-white font-bold py-2 text-xs uppercase tracking-widest transition-colors"
              >
                {t('cyclistProfile.or_general_fund')}
              </Link>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border-2 ${copied ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-white border-slate-200 text-brand-navy hover:border-brand-orange hover:text-brand-orange'}`}
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? t('cyclistProfile.link_copied') : t('cyclistProfile.share_profile')}
            </button>

            {/* See all riders */}
            <Link
              to="/ride"
              className="flex items-center justify-center gap-2 text-brand-slate hover:text-brand-navy font-bold text-xs uppercase tracking-widest py-2 transition-colors"
            >
              {t('cyclistProfile.see_all_riders')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── LIGHTBOX ────────────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[200] bg-brand-navy/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <img
            src={lightboxImg}
            alt="Gallery enlarged"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white font-black text-2xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default CyclistProfile;
