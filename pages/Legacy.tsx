import React, { useState } from 'react';
import { ShieldCheck, Heart, TrendingUp, Users, Calendar, ArrowUpRight, X } from 'lucide-react';
import { GoGear } from "react-icons/go";

const TIMELINE = [
  {
    year: '2022',
    title: 'Cycle for Cancer',
    beneficiary: 'MAKNA',
    raised: 'RM 230,000',
    stats: '10 Cyclists · 1,100km',
    desc: 'The inaugural ride that started a movement.',
    details: 'In 2022, 10 courageous cyclists embarked on a grueling 1,100km journey across Borneo to raise funds for MAKNA (Majlis Kanser Nasional). This inaugural ride set the foundation for what would become a yearly tradition of giving back, channeling the endurance of cycling into hope for cancer patients.'
  },
  {
    year: '2023',
    title: 'Program ROSE',
    beneficiary: 'Cervical Cancer Awareness',
    raised: 'RM 250,000',
    stats: '20 Cyclists · 700km',
    desc: 'Expanding our reach to women\'s health.',
    details: 'Program ROSE (Remove Obstacles to Cervical Screening) aims to eliminate cervical cancer in Malaysia. Our 20 cyclists covered 700km, raising RM 250,000 to support self-sampling screening for women in remote areas, ensuring that geography is no barrier to lifesaving healthcare.'
  },
  {
    year: '2024',
    title: 'Program ROSE',
    beneficiary: 'Cervical Cancer Awareness',
    raised: 'RM 270,000',
    stats: '7 Cyclists · 900km',
    desc: 'Consistently pushing limits for consistent impact.',
    details: 'Continuing our support for Program ROSE, 7 elite cyclists pushed their limits over 900km. The funds raised helped expand screening programs further into East Malaysia, reinforcing the message that early detection saves lives and empowering more women to take charge of their health.'
  },
  {
    year: '2025',
    title: 'MAPPAC',
    beneficiary: 'Paediatric Palliative Care',
    raised: 'RM 450,000',
    stats: '17 Cyclists · 600km',
    desc: 'Our biggest fundraising milestone yet.',
    details: 'MAPPAC (Malaysian Association of Paediatric Palliative Care) provides critical care for children with life-limiting conditions. With 17 cyclists covering 600km, we raised our highest amount yet—RM 450,000—to support these families, ensuring comfort and dignity for the children who need it most.'
  },
  {
    year: '2026',
    title: 'SAB2026',
    beneficiary: 'MAPS & MyPOPI',
    raised: 'Targeting Impact',
    stats: '10 Cyclists · Surgery & Immunity',
    desc: 'Writing the next chapter. Join us.',
    details: 'SAB2026 targets Paediatric Surgery & Immunology. We are gathering 10 elite cyclists to ride for MAPS (Malaysian Association of Paediatric Surgery) and MyPOPI (Malaysian Patient Organization for Primary Immunodeficiencies). Join us in making this the most impactful ride yet, funding life-saving surgeries and immune treatments.',
    active: true
  },
];

const Legacy: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof TIMELINE[0] | null>(null);

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
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col items-center text-center">
              <div className="h-28 w-28 bg-white rounded-xl flex items-center justify-center mb-6 p-4 shadow-lg">
                <img src="/assets/logos/MMA_logo.png" alt="MMA Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-black mb-2 font-heading text-white">Malaysian Medical Association</h3>
              <p className="text-brand-pale font-medium">Established 1959. 17,000 members committed to medical ethics and public health.</p>
            </div>

            {/* MMA Foundation Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col items-center text-center">
              <div className="h-28 w-28 bg-white rounded-xl flex items-center justify-center mb-6 p-4 shadow-lg">
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
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 border-l-4 border-dashed border-brand-cyan/40"></div>
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 translate-x-1.5 border-l-4 border-dashed border-brand-cyan/40"></div>

            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Dot (Updated to GoGear icon) */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-brand-cyan bg-white z-10 shadow-lg">
                    <span className="text-brand-navy flex items-center justify-center">
                      <GoGear size={24} />
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-10">
                    <div
                      onClick={() => setSelectedItem(item)}
                      className={`bg-white p-8 rounded-[2rem] shadow-xl border border-brand-grey/10 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group cursor-pointer ${item.active ? 'ring-4 ring-brand-cyan/20' : ''}`}
                    >
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
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-cyan font-bold text-sm bg-brand-navy/5 px-3 py-1 rounded-full">
                              Read More
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
            <a href="#/donate" className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-brand-orange/90 transition-all uppercase tracking-widest text-sm group">
              Make your mark <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl animate-scale-in border-4 border-brand-cyan/10" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>

            <div className="text-brand-cyan font-black text-6xl opacity-20 absolute top-8 right-12 font-heading pointer-events-none">
              {selectedItem.year}
            </div>

            <div className="relative z-10">
              <div className="text-xs font-black text-brand-orange uppercase tracking-[0.2em] mb-2">{selectedItem.beneficiary}</div>
              <h2 className="text-4xl font-black text-brand-navy mb-6 font-heading">{selectedItem.title}</h2>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-brand-pale/50 px-4 py-2 rounded-xl text-sm font-bold text-brand-slate flex items-center gap-2">
                  <Users className="h-4 w-4" /> {selectedItem.stats}
                </div>
                <div className="bg-brand-pale/50 px-4 py-2 rounded-xl text-sm font-bold text-brand-slate flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> {selectedItem.raised}
                </div>
              </div>

              <div className="prose prose-slate text-brand-slate font-medium leading-relaxed">
                <p>{selectedItem.details}</p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2 rounded-lg font-bold text-sm text-brand-slate hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Legacy;