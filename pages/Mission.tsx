import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, ShieldCheck, ExternalLink, Quote } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const Mission: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">

      {/* 1. HERO */}
      <section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="relative h-[50vh] lg:h-auto">
            <img src="/assets/images/surgeon-hand.webp" alt="Surgeon holding child's hand" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply"></div>
          </div>
          <div className="flex flex-col justify-center p-12 lg:p-24 relative z-10">
            <div className="inline-flex items-center gap-2 text-brand-cyan mb-6">
              <Heart className="h-5 w-5 fill-current" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">{t('mission.tag')}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-heading leading-tight mb-8">
              {t('mission.heading1')} <br />
              <span className="text-brand-cyan">{t('mission.heading2')}</span>
            </h1>
            <p className="text-xl text-brand-pale font-medium leading-relaxed mb-12 max-w-lg">
              {t('mission.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SAB */}
      <section className="py-24 bg-brand-pale">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-brand-navy mb-8 font-heading">{t('mission.about_heading')}</h2>
          <p className="text-xl md:text-2xl text-brand-slate font-medium leading-relaxed">{t('mission.about_desc')}</p>
        </div>
      </section>

      {/* 3. MAPS */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-brand-grey/20 order-2 lg:order-1">
              <img src="/assets/images/pediatric-surgery.webp" alt="Paediatric Surgery" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <img src="/assets/logos/MAPS%20Logo.png" alt="MAPS Logo" className="h-20 mb-8 object-contain" />
              <h3 className="text-3xl lg:text-4xl font-black text-brand-navy mb-2 font-heading">{t('mission.maps_heading')}</h3>
              <div className="text-sm font-black text-brand-orange uppercase tracking-widest mb-8">{t('mission.maps_tagline')}</div>
              <p className="text-lg text-brand-slate mb-8 leading-relaxed">{t('mission.maps_desc')}</p>
              <ul className="space-y-4 mb-8">
                {[t('mission.maps_bullet1'), t('mission.maps_bullet2'), t('mission.maps_bullet3'), t('mission.maps_bullet4')].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                      <Stethoscope className="h-3 w-3" />
                    </div>
                    <span className="text-brand-navy font-bold">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="https://maps-malaysia.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-cyan font-black uppercase tracking-widest text-xs hover:text-brand-navy transition-colors border-b-2 border-brand-cyan pb-1">
                {t('mission.maps_visit')} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MyPOPI */}
      <section className="py-24 bg-white relative border-t border-brand-pale/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src="/assets/logos/MyPOPI-1.png" alt="MyPOPI Logo" className="h-20 mb-8 object-contain" />
              <h3 className="text-3xl lg:text-4xl font-black text-brand-navy mb-2 font-heading">{t('mission.mypopi_heading')}</h3>
              <div className="text-sm font-black text-brand-orange uppercase tracking-widest mb-8">{t('mission.mypopi_tagline')}</div>
              <p className="text-lg text-brand-slate mb-8 leading-relaxed">{t('mission.mypopi_desc')}</p>
              <ul className="space-y-4 mb-8">
                {[t('mission.mypopi_bullet1'), t('mission.mypopi_bullet2'), t('mission.mypopi_bullet3'), t('mission.mypopi_bullet4')].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                    </div>
                    <span className="text-brand-navy font-bold">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="https://mypopi.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-cyan font-black uppercase tracking-widest text-xs hover:text-brand-navy transition-colors border-b-2 border-brand-cyan pb-1">
                {t('mission.mypopi_visit')} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-brand-grey/20">
              <img src="/assets/images/bubble-baby.jpeg" alt="Immune Deficiency Care" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. STORIES OF HOPE */}
      <section className="py-24 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="lg:col-span-2 relative h-full min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&h=800&auto=format&fit=crop"
                alt="Happy Child"
                className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="lg:col-span-3 py-8 lg:pr-12">
              <Quote className="h-16 w-16 text-brand-cyan mb-8 opacity-20" />
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-8 font-heading leading-tight">{t('mission.stories_heading1')}<br />{t('mission.stories_heading2')}</h2>
              <p className="text-xl md:text-2xl font-medium text-brand-slate italic mb-8">{t('mission.stories_quote')}</p>
              <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-brand-orange"></div>
                <div>
                  <div className="font-black text-brand-navy text-lg uppercase tracking-widest">{t('mission.stories_name')}</div>
                  <div className="text-xs font-bold text-brand-cyan uppercase tracking-widest">{t('mission.stories_role')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 bg-brand-navy text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Heart className="h-16 w-16 text-brand-orange mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10 font-heading">{t('mission.cta_heading')}</h2>
          <Link to="/donate" className="inline-block bg-brand-orange text-white text-xl font-black px-12 py-5 rounded-full hover:bg-white hover:text-brand-orange transition-all shadow-xl hover:-translate-y-1 uppercase tracking-widest">
            {t('mission.cta_btn')}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Mission;