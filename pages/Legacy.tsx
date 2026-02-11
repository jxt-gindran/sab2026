import React from 'react';
import { ShieldCheck, Heart, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';

const TIMELINE = [
  {
    year: '2022',
    title: 'Cycle for Cancer',
    beneficiary: 'MAKNA',
    raised: 'RM 230,000',
    stats: '10 Cyclists · 1,100km',
    desc: 'The inaugural ride that started a movement.'
  },
  {
    year: '2023',
    title: 'Program ROSE',
    beneficiary: 'Cervical Cancer Awareness',
    raised: 'RM 250,000',
    stats: '20 Cyclists · 700km',
    desc: 'Expanding our reach to women\'s health.'
  },
  {
    year: '2024',
    title: 'Program ROSE',
    beneficiary: 'Cervical Cancer Awareness',
    raised: 'RM 270,000',
    stats: '7 Cyclists · 900km',
    desc: 'Consistently pushing limits for consistent impact.'
  },
  {
    year: '2025',
    title: 'MAPPAC',
    beneficiary: 'Paediatric Palliative Care',
    raised: 'RM 450,000',
    stats: '17 Cyclists · 600km',
    desc: 'Our biggest fundraising milestone yet.'
  },
  {
    year: '2026',
    title: 'SAB2026',
    beneficiary: 'MAPS & MyPOPI',
    raised: 'Targeting Impact',
    stats: 'Surgery & Immunity',
    desc: 'Writing the next chapter. Join us.',
    active: true
  },
];

const Legacy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">

      {/* 1. TRUST INDICATORS HERO */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        {/* Abstract Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-brand-cyan mb-6">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Track Record</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-heading leading-tight mb-6 text-white">
              A History of <br />Moving Mountains.
            </h1>
            <p className="text-2xl text-brand-pale font-medium">Over <span className="text-brand-orange font-bold">RM 1.2 Million</span> raised since 2022.</p>
          </div>

          {/* Organizer Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* MMA Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center mb-6 p-2">
                <img src="/assets/logos/MMA_logo.png" alt="MMA Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-black mb-2 font-heading text-white">Malaysian Medical Association</h3>
              <p className="text-brand-pale font-medium">Established 1959. 17,000 members committed to medical ethics and public health.</p>
            </div>

            {/* MMA Foundation Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center mb-6 p-2">
                <img src="/assets/logos/MMAF_logo.png" alt="MMAF Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-black mb-2 font-heading text-white">MMA Foundation</h3>
              <p className="text-brand-pale font-medium">Established 1974. Managing charitable donations with absolute transparency and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TIMELINE */}
      <section className="py-24 bg-brand-pale relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-brand-cyan/30 md:-translate-x-1/2"></div>

            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-brand-cyan bg-white z-10 box-content"></div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-10">
                    <div className={`bg-white p-8 rounded-[2rem] shadow-xl border border-brand-grey/10 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group ${item.active ? 'ring-4 ring-brand-cyan/20' : ''}`}>
                      {item.active && (
                        <div className="absolute top-0 right-0 bg-brand-cyan text-brand-navy text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-bl-xl">Current</div>
                      )}

                      <div className="text-6xl font-black text-brand-pale absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity select-none font-heading">{item.year}</div>

                      <div className="relative z-10">
                        <div className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-1">{item.beneficiary}</div>
                        <h3 className="text-3xl font-black text-brand-navy mb-4 font-heading">{item.title}</h3>

                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="inline-flex items-center gap-2 bg-brand-pale/30 px-3 py-1 rounded-lg text-sm font-bold text-brand-slate">
                            <Users className="h-4 w-4" /> {item.stats}
                          </div>
                        </div>

                        <div className="border-t border-brand-pale pt-4 mt-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Funds Raised</div>
                              <div className="text-2xl font-black text-brand-orange">{item.raised}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer for alternating layout */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>

          </div>

          <div className="text-center mt-24">
            <p className="text-brand-slate font-medium mb-6">Be part of history.</p>
            <a href="#/donate" className="inline-flex items-center gap-2 text-brand-navy font-black text-lg hover:text-brand-orange transition-colors">
              Make your mark <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Legacy;