import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Map,
  MapPin,
  PlayCircle,
  User,
  Bike,
  Settings
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { BorneoRouteMap } from '../components/BorneoRouteMap';
import { useTranslation } from '../lib/i18n';

const TIMELINE = [
  { year: '2022', title: 'Cycle for Cancer', raised: 'RM 230k' },
  { year: '2023', title: 'Program ROSE', raised: 'RM 250k' },
  { year: '2024', title: 'Program ROSE', raised: 'RM 270k' },
  { year: '2025', title: 'MAPPAC', raised: 'RM 450k' },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // totalRaised = sum of all DB-completed donations (online + admin-approved manual)
  const totalRaised = useQuery(api.donations.getTotal) || 0;

  const allSettings = useQuery(api.admin.getPublicSettings) || [];
  // historicalBase: pre-2026 total entered in admin settings (e.g. RM 1.2M from 2022-2025)
  const historicalSetting = allSettings.find((s: { key: string; value: string }) => s.key === 'raised_amount');
  const goalSetting       = allSettings.find((s: { key: string; value: string }) => s.key === 'donation_goal');
  const showProgressSetting = allSettings.find((s: { key: string; value: string }) => s.key === 'show_fundraising_progress');

  const cycledSetting = allSettings.find((s: { key: string; value: string }) => s.key === 'home.stats_cycled_value');
  const charitiesSetting = allSettings.find((s: { key: string; value: string }) => s.key === 'home.stats_charities_value');
  const distanceSetting = allSettings.find((s: { key: string; value: string }) => s.key === 'ride.distance');

  const cycledValue = cycledSetting ? cycledSetting.value : t('home.stats_cycled_value');
  const charitiesValue = charitiesSetting ? charitiesSetting.value : t('home.stats_charities_value');
  const distanceValue = distanceSetting ? distanceSetting.value : t('home.stats_cycled_value');
  // Default ON (visible) unless explicitly set to 'false'
  const showFundraisingProgress = showProgressSetting ? showProgressSetting.value !== 'false' : true;

  const historicalBase = historicalSetting ? parseFloat(historicalSetting.value) : 1200000;
  const currentTotal   = historicalBase + totalRaised;  // always live DB + historical base
  const donationGoal   = goalSetting ? parseFloat(goalSetting.value) : 2000000;
  const donationPercent = Math.min((currentTotal / donationGoal) * 100, 100);

  const formatRM = (n: number) => {
    if (n >= 1_000_000) {
      const v = n / 1_000_000;
      return `RM ${Number.isInteger(v) ? v : v.toFixed(1)}M`;
    }
    if (n >= 1_000) {
      const v = Math.round(n / 1_000);
      return `RM ${v}K`;
    }
    return `RM ${Math.round(n).toLocaleString()}`;
  };

  const raisedDisplay = formatRM(currentTotal);
  const goalDisplay   = formatRM(donationGoal);

  const featuredCyclists = useQuery(api.cyclists.listFeatured) || [];

  const contentData = useQuery(api.admin.getContent) || [];
  const getText = (section: string, defaultText: string) =>
    contentData.find((c: any) => c.page === 'home' && c.section === section)?.value || defaultText;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "name": "Sepeda Amal Borneo",
        "url": "https://sab2026.com",
        "logo": "https://sab2026.com/logo.png",
        "description": "A charity cycling movement funding paediatric surgeries in Borneo.",
        "parentOrganization": { "@type": "Organization", "name": "Malaysian Medical Association Foundation" }
      },
      {
        "@type": "Event",
        "name": "Sepeda Amal Borneo 2026 Charity Ride",
        "startDate": "2026-07-26",
        "location": { "@type": "Place", "name": "Borneo", "address": "Kota Kinabalu to Miri" },
        "description": "A 680km charity cycle to raise funds for paediatric surgery and immune deficiency support.",
        "organizer": { "@type": "Organization", "name": "MMA Foundation" }
      }
    ]
  };

  return (
    <div className="w-full bg-white font-sans text-brand-slate">
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/hero-compressed.webp" alt="SAB 2026 Medical Mission" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 py-12 mt-16 grid items-center gap-8 md:gap-12 transition-all duration-700 ${isVideoOpen ? 'lg:grid-cols-2 text-left' : 'grid-cols-1 text-center'}`}>
          <div className={`animate-fade-in ${isVideoOpen ? 'lg:items-start' : 'items-center'} flex flex-col`}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tighter leading-[1.1] font-heading text-white transition-all">
              {getText('hero_title_line1', t('home.hero_title_line1'))} <br />
              <span className="text-brand-cyan">{getText('hero_title_line2', t('home.hero_title_line2'))}</span>
            </h1>
            <h2 className={`text-base md:text-lg lg:text-2xl font-medium text-brand-pale mb-8 md:mb-10 leading-relaxed transition-all ${isVideoOpen ? 'max-w-xl' : 'max-w-3xl mx-auto'}`}>
              {getText('hero_subtitle', t('home.hero_subtitle'))}
            </h2>

            <div className={`flex flex-col gap-4 md:gap-6 w-full ${isVideoOpen ? 'lg:items-start' : 'items-center'}`}>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto text-center bg-brand-orange hover:bg-white hover:text-brand-orange text-white text-base sm:text-xl font-black px-8 sm:px-12 py-4 sm:py-5 rounded-full shadow-[0_0_30px_rgba(255,127,50,0.4)] hover:shadow-xl transition-all hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {t('home.hero_save_life')} <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>

                {!isVideoOpen && (
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-sm backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                  >
                    {t('home.hero_highlights')}
                    <PlayCircle className="h-4 w-4 text-brand-cyan" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-pale/60">
                <ShieldCheck className="h-4 w-4" />
                <span>{t('home.hero_org')}</span>
              </div>
            </div>
          </div>

          {isVideoOpen && isDesktop && (
            <div className="hidden lg:flex justify-end items-center animate-scale-in relative pr-12">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-0 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20 group"
                title={t('home.hero_close')}
              >
                <ArrowRight className="h-6 w-6 rotate-180 group-hover:text-brand-cyan" />
              </button>
              <div className="relative w-full max-w-[340px] aspect-[9/19.5] bg-black rounded-[3rem] border-[10px] border-slate-800 shadow-[0_0_100px_rgba(12,223,237,0.4)] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                <video autoPlay controls className="w-full h-full object-cover" src="/assets/videos/highlights.mp4">
                  {t('home.video_unsupported')}
                </video>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent z-10"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE VIDEO MODAL */}
      {isVideoOpen && !isDesktop && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/95 backdrop-blur-xl animate-fade-in p-6">
          <button onClick={() => setIsVideoOpen(false)} className="absolute top-8 right-8 text-white hover:text-brand-cyan transition-colors z-[110]">
            <ArrowRight className="h-10 w-10 rotate-180" />
            <span className="block text-[10px] font-black uppercase tracking-widest mt-2">{t('home.hero_close')}</span>
          </button>
          <div className="relative w-full max-w-[320px] aspect-[9/19.5] bg-black rounded-[3rem] border-[8px] border-slate-800 shadow-[0_0_80px_rgba(12,223,237,0.3)] overflow-hidden animate-scale-in">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
            <video autoPlay controls className="w-full h-full object-cover" src="/assets/videos/highlights.mp4">
              {t('home.video_unsupported')}
            </video>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent z-10"></div>
          </div>
        </div>
      )}

      {/* IMPACT STATS STRIP */}
      <section className="py-8 md:py-12 bg-white relative z-20 -mt-6 md:-mt-10 mx-2 md:mx-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-brand-grey/20 p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              {[
                { label: t('home.stats_raised_label'), value: raisedDisplay, icon: TrendingUp },
                { label: t('home.stats_cycled_label'), value: cycledValue, icon: Map },
                { label: t('home.stats_tax_label'), value: t('home.stats_tax_value'), icon: ShieldCheck },
                { label: t('home.stats_charities_label'), value: `${charitiesValue} Beneficiary`, icon: Heart, special: true },
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left flex flex-col items-center md:items-start group w-full">
                  <stat.icon className="h-8 w-8 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
                  {stat.special ? (
                    <div className="flex flex-col lg:flex-row lg:items-baseline gap-0 lg:gap-2 text-brand-navy">
                      <span className="text-3xl sm:text-4xl lg:text-4xl font-black tracking-tight font-heading leading-tight">{charitiesValue}</span>
                      <span className="text-2xl sm:text-3xl xl:text-3xl font-black tracking-tight font-heading leading-tight">{t('home.stats_charities_suffix')}</span>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl lg:text-4xl font-black text-brand-navy tracking-tight font-heading leading-tight break-words max-w-full">
                      {stat.value}
                    </div>
                  )}
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-slate/60 group-hover:text-brand-orange transition-colors mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DONATION THERMOMETER */}
      <section className="py-16 bg-brand-navy">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-brand-cyan font-black text-xs uppercase tracking-[0.3em] mb-2">{t('home.fundraising_label')}</div>
            <h2 className="text-3xl md:text-4xl font-black text-white font-heading">{t('home.fundraising_heading_prefix')} {goalDisplay}</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-brand-cyan font-black text-2xl font-heading">{raisedDisplay}</div>
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest">{t('home.fundraising_raised_label')}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-black text-2xl font-heading">{goalDisplay}</div>
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest">{t('home.fundraising_goal_label')}</div>
              </div>
            </div>
            <div className="w-full h-8 bg-white/10 rounded-full overflow-hidden relative">
              <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${donationPercent}%`, background: 'linear-gradient(90deg, #00AEEF, #F97316)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
              {[25, 50, 75].map(m => (
                <div key={m} className="absolute top-0 bottom-0 w-0.5 bg-white/20" style={{ left: `${m}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">
              <span>0%</span>
              <span className="text-brand-orange font-black text-sm">{donationPercent.toFixed(1)}{t('home.fundraising_funded_suffix')}</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/donate" className="inline-block bg-brand-orange text-white font-black px-10 py-4 rounded-full hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-xl uppercase tracking-widest text-sm">
              {t('home.fundraising_donate')}
            </Link>
          </div>
        </div>
      </section>

      {/* PATIENT IMPACT */}
      <section className="py-24 bg-white relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-brand-pale/20 rounded-[3rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-brand-pale">
            <div className="w-full md:w-1/3 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-3 border-4 border-white">
                <img src="https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=600&h=800&auto=format&fit=crop" alt="Adik Rizky playing football" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg rotate-3 z-10">
                <div className="text-4xl font-black text-brand-orange font-heading">7</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-slate">{t('home.patient_age_label')}</div>
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-brand-cyan mb-4">
                <Heart className="h-5 w-5 fill-current animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">{t('home.patient_tag')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 font-heading">{t('home.patient_name')}</h2>
              <blockquote className="text-xl md:text-2xl text-brand-slate font-medium italic mb-8 leading-relaxed">
                {t('home.patient_quote')}
              </blockquote>
              <Link to="/donate?beneficiary=MAPS" className="inline-flex items-center gap-2 text-brand-orange font-black uppercase tracking-widest text-sm border-b-2 border-brand-orange hover:text-brand-navy hover:border-brand-navy pb-1 transition-all group">
                {t('home.patient_cta')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-24 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Bike className="absolute -top-10 -left-10 h-40 w-40 text-brand-navy/5 -rotate-12 pointer-events-none" />
              <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm animate-fade-in relative z-10">{t('home.mission_tag')}</div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 tracking-tighter font-heading relative z-10">{t('home.mission_heading1')} <br />{t('home.mission_heading2')}</h2>
              <p className="text-lg text-brand-slate font-medium mb-8 leading-relaxed relative z-10">{t('home.mission_desc')}</p>
              <div className="h-1 w-24 bg-brand-cyan rounded-full relative z-10"></div>
            </div>

            <div className="grid gap-6">
              {/* MAPS Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-grey/20 hover:shadow-xl transition-all group cursor-pointer hover:border-brand-cyan/30">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-brand-grey/20 p-2 group-hover:scale-105 transition-transform">
                    <img src="/assets/logos/MAPS%20Logo.png" alt="MAPS Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-brand-navy mb-2 font-heading">{t('home.maps_name')}</h3>
                    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3">{t('home.maps_tagline')}</div>
                    <p className="text-sm text-brand-slate font-medium mb-4">{t('home.maps_desc')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                      <Link to="/mission" className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors flex items-center gap-1 border-b border-brand-navy hover:border-brand-cyan pb-0.5">
                        {t('home.maps_see_how')} <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link to="/donate?beneficiary=MAPS" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:text-brand-navy transition-colors flex items-center gap-1">
                        {t('home.maps_donate')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* MyPOPI Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-grey/20 hover:shadow-xl transition-all group cursor-pointer hover:border-brand-cyan/30">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-brand-grey/20 p-2 group-hover:scale-105 transition-transform">
                    <img src="/assets/logos/MyPOPI-1.png" alt="MyPOPI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-brand-navy mb-2 font-heading">{t('home.mypopi_name')}</h3>
                    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3">{t('home.mypopi_tagline')}</div>
                    <p className="text-sm text-brand-slate font-medium mb-4">{t('home.mypopi_desc')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                      <Link to="/mission" className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors flex items-center gap-1 border-b border-brand-navy hover:border-brand-cyan pb-0.5">
                        {t('home.mypopi_see_how')} <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link to="/donate?beneficiary=MyPOPI" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:text-brand-navy transition-colors flex items-center gap-1">
                        {t('home.mypopi_donate')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section id="history" className="py-24 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-tire-tread opacity-[0.02] pointer-events-none" style={{ backgroundSize: '100px 100px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-4 tracking-tighter font-heading">{t('home.history_heading')}</h2>
            <p className="text-brand-slate font-medium text-lg">{t('home.history_subheading')}</p>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-tire-tread -translate-y-1/2 hidden md:block z-0"></div>
            <div className="flex overflow-x-auto gap-8 pt-8 pb-8 md:grid md:grid-cols-4 md:gap-8 relative z-10 snap-x snap-mandatory hide-scrollbar">
              {TIMELINE.map((item, i) => (
                <div key={i} className="min-w-[280px] snap-center bg-white p-8 rounded-[2rem] border border-brand-grey/20 shadow-lg text-center relative group hover:-translate-y-2 transition-transform">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                    <TrendingUp className="h-6 w-6 text-brand-cyan" />
                  </div>
                  <div className="text-4xl font-black text-brand-navy mb-2 font-heading">{item.year}</div>
                  <div className="text-[10px] font-bold text-brand-slate uppercase tracking-widest mb-4">{item.title}</div>
                  <div className="inline-block bg-brand-pale/50 px-5 py-2 rounded-xl text-brand-navy font-black text-xl">{item.raised}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE RIDE & RIDERS */}
      <section id="ride" className="py-24 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">{t('home.ride_tag')}</div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-8 tracking-tighter font-heading">{t('home.ride_heading')}</h2>
            <div className="max-w-5xl mx-auto rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden text-white border border-brand-cyan/20 group">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <BorneoRouteMap className="w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10">
                <MapPin className="h-16 w-16 text-brand-cyan mx-auto mb-6 animate-bounce" />
                <h3 className="text-5xl md:text-6xl font-black mb-4 font-heading tracking-tight text-white drop-shadow-[0_0_15px_rgba(12,223,237,0.8)]">{distanceValue}</h3>
                <p className="text-brand-pale font-medium text-xl max-w-2xl mx-auto leading-relaxed">{t('home.ride_desc')}</p>
                <div className="mt-12 max-w-lg mx-auto relative cursor-default">
                  <div className="absolute -top-6 left-0 animate-[ride_8s_ease-in-out_infinite] z-20 text-brand-orange">
                    <Bike className="h-6 w-6" />
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-brand-cyan via-brand-orange to-brand-cyan animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] mt-6 text-brand-cyan">
                    <span className="flex items-center gap-2 animate-pulse"><div className="h-2 w-2 rounded-full bg-brand-cyan"></div> KK</span>
                    <span className="flex items-center gap-2 animate-pulse"><div className="h-2 w-2 rounded-full bg-brand-orange"></div> MIRI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-end justify-between px-4">
            <div>
              <h2 className="text-3xl font-black text-brand-navy font-heading">{t('home.champions_heading')}</h2>
              <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-2">{t('home.champions_subheading')}</p>
            </div>
            <Link to="/ride" className="hidden md:inline-flex items-center gap-2 font-black text-brand-navy hover:text-brand-cyan uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-brand-cyan pb-1 transition-all">
              {t('home.champions_view_all')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div ref={scrollContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
            {featuredCyclists.map((rider: any) => (
              <div key={rider._id} className="bg-white rounded-[2rem] p-6 border border-brand-grey/20 hover:border-brand-orange/50 hover:shadow-xl transition-all group flex flex-col">
                <div className="h-64 w-full rounded-2xl overflow-hidden mb-6 relative bg-slate-100 flex items-center justify-center">
                  {rider.profileUrl ? (
                    <img src={rider.profileUrl} alt={rider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <User className="h-16 w-16 text-slate-300" />
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-brand-orange text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{rider.role}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-navy/90 to-transparent">
                    <div className="text-white font-black text-xl font-heading leading-tight">{rider.name}</div>
                  </div>
                </div>
                <div className="mb-4 flex-grow">
                  {showFundraisingProgress && (
                    <>
                      <div className="flex justify-between text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                        <span>{t('home.rider_raised')} RM {rider.raised.toLocaleString()}</span>
                        <span className="text-brand-navy">{t('home.rider_goal')} RM {rider.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-3 bg-brand-pale/30 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-orange rounded-full bg-chain-fill" style={{ width: `${Math.min((rider.raised / rider.goal) * 100, 100)}%` }}></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link to={`/riders/${encodeURIComponent(rider.shareSlug)}`} className="flex-grow text-center bg-brand-navy text-white font-black py-3 rounded-xl hover:bg-brand-cyan hover:text-brand-navy transition-all text-sm uppercase tracking-widest">
                    {t('home.rider_view_profile')}
                  </Link>
                  <Link to={`/donate?cyclist=${encodeURIComponent(rider.shareSlug)}`} className="px-4 py-3 border-2 border-brand-orange bg-white text-brand-orange font-black rounded-xl hover:bg-brand-orange hover:text-white transition-all text-sm">
                    <Heart className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}

            {featuredCyclists.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                <div className="h-16 w-16 bg-brand-pale mx-auto rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-brand-navy" />
                </div>
                <h3 className="text-2xl font-black text-brand-navy mb-2">{t('home.no_cyclists_heading')}</h3>
                <p className="text-brand-slate font-medium">{t('home.no_cyclists_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center border-t border-brand-pale relative overflow-hidden">
        <Settings className="absolute -top-32 -left-32 h-96 w-96 text-brand-pale/50 animate-[spin_40s_linear_infinite] pointer-events-none" />
        <Settings className="absolute -bottom-32 -right-32 h-96 w-96 text-brand-pale/50 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-brand-navy font-heading">{t('home.cta_heading')}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/donate" className="w-full sm:w-auto bg-brand-navy text-white text-lg font-black px-12 py-6 rounded-[2rem] shadow-2xl hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
              {t('home.cta_donate')}
            </Link>
            <Link to="/ride" className="w-full sm:w-auto bg-transparent border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-brand-navy text-lg font-black px-12 py-6 rounded-[2rem] transition-all uppercase tracking-widest">
              {t('home.cta_register')}
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 bg-slate-50 border-t border-brand-pale">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-black text-brand-slate/40 mb-10 uppercase tracking-[0.3em]">{t('home.partners_heading')}</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="h-48 w-96 flex items-center justify-center">
              <img src="/assets/logos/MMA_logo.png" alt="MMA" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="h-48 w-96 flex items-center justify-center">
              <img src="/assets/logos/MMAF_logo.png" alt="MMAF" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <Link to="/contact" className="inline-block mt-12 text-[10px] font-black text-brand-orange hover:text-brand-navy border-b-2 border-brand-orange hover:border-brand-navy pb-1 transition-all uppercase tracking-widest">
            {t('home.partners_corporate')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;