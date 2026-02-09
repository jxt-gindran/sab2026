import React from 'react';
import { History, Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Legacy: React.FC = () => {
  const events = [
    { year: '2022', title: 'Cycle for Cancer', raised: 'RM 230,000', cause: 'MAKNA', dist: '1,100km' },
    { year: '2023', title: 'Program ROSE', raised: 'RM 250,000', cause: 'Cervical Cancer Elimination', dist: '700km' },
    { year: '2024', title: 'Program ROSE', raised: 'RM 270,000', cause: 'Cervical Cancer Elimination', dist: '900km' },
    { year: '2025', title: 'Paediatric Palliative Care', raised: 'RM 450,000', cause: 'MAPPAC', dist: '600km' },
    { year: '2026', title: 'SAB2026 (Ongoing)', raised: 'Targeting RM 500k+', cause: 'Paediatric Surgery & Immunity', dist: '660km', active: true },
  ];

  return (
    <div className="bg-white min-h-screen font-['Inter'] pb-24">

      {/* 🏛️ LEGACY HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-brand-navy">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-brand-cyan blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-cyan text-[10px] font-black tracking-[0.3em] mb-8 uppercase backdrop-blur-md border border-white/10">
            Our Foundation • Decades of Giving
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Built on <span className="text-brand-cyan">Trust.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            The Sepeda Amal Borneo movement is powered by the MMA Foundation, an institution dedicated to Malaysian public health since 1974.
          </p>
        </div>
      </section>

      {/* 🏦 ORGANIZATION PROFILES (BENTO STYLE) */}
      <section className="py-24 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100 group hover:scale-[1.02] transition-transform">
              <div className="h-16 w-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center text-brand-cyan mb-8">
                <History className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-brand-navy mb-6 tracking-tight">MMA Foundation</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                Established in 1974 to assist the Malaysian Medical Association in contributing to community health projects. We have spearheaded humanitarian initiatives for over <span className="text-brand-navy font-black underline decoration-brand-cyan decoration-4 underline-offset-4">50 years</span>.
              </p>
              <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                Registered Charity (LHDN)
              </div>
            </div>

            <div className="bg-brand-navy rounded-[2.5rem] shadow-2xl p-12 border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Award className="h-40 w-40 text-white" />
              </div>
              <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-cyan mb-8">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Malaysian Medical Association</h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
                The voice of the medical profession in Malaysia since 1959. Representing over <span className="text-white font-black underline decoration-brand-coral decoration-4 underline-offset-4">17,000 members</span> dedicated to medical ethics and national health philanthropy.
              </p>
              <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                National Professional Body
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🗓️ IMPACT TIMELINE */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter">The Impact Timeline</h2>
            <div className="h-1 w-20 bg-brand-cyan mx-auto rounded-full"></div>
          </div>

          <div className="space-y-12">
            {events.slice().reverse().map((event, index) => (
              <div key={event.year} className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16">

                {/* Year Badge */}
                <div className={`flex-shrink-0 h-32 w-32 rounded-full flex flex-col items-center justify-center border-4 transition-all
                  ${event.active ? 'bg-brand-coral border-brand-coral shadow-[0_0_30px_rgba(255,111,0,0.3)] text-white' : 'bg-slate-50 border-slate-100 text-brand-navy'}
                `}>
                  <div className="text-2xl font-black leading-none">{event.year}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{event.dist}</div>
                </div>

                {/* Content Card */}
                <div className={`flex-grow p-10 rounded-[2.5rem] border-4 transition-all
                   ${event.active
                    ? 'bg-brand-navy border-brand-coral shadow-2xl'
                    : 'bg-white border-slate-50 shadow-sm hover:shadow-xl hover:border-brand-cyan/20'
                  }
                `}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className={`text-3xl font-black tracking-tight ${event.active ? 'text-white' : 'text-brand-navy'}`}>{event.title}</h3>
                    <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${event.active ? 'bg-brand-coral text-white' : 'bg-brand-cyan/10 text-brand-cyan'}`}>
                      {event.raised}
                    </div>
                  </div>
                  <p className={`text-lg font-medium leading-relaxed ${event.active ? 'text-slate-400' : 'text-slate-500'}`}>
                    Beneficiary: <span className={event.active ? 'text-brand-cyan font-bold' : 'text-brand-navy font-bold'}>{event.cause}</span>
                  </p>
                </div>

                {/* Vertical Connector Line (CSS only for MD+) */}
                {index < events.length - 1 && (
                  <div className="absolute top-32 left-16 bottom-[-48px] w-1 bg-slate-100 -z-10 hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-brand-cyan rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
            <History className="h-64 w-64 text-brand-navy" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-brand-navy mb-8 tracking-tighter relative z-10">Be part of the legacy.</h2>
          <Link
            to="/donate"
            className="inline-flex items-center gap-3 bg-brand-navy text-white text-xl font-black px-12 py-6 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 relative z-10"
          >
            Support SAB 2026 Today <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Legacy;