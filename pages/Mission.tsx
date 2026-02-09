import React from 'react';
import { Heart, Shield, Stethoscope, Baby, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mission: React.FC = () => {
  return (
    <div className="bg-white font-['Inter']">

      {/* 🏥 MISSION HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-brand-navy">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-brand-cyan blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-brand-coral blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-cyan text-[10px] font-black tracking-[0.3em] mb-8 uppercase backdrop-blur-md border border-white/10">
            The Cause • Why We Pedal
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Saving <span className="text-brand-cyan">Little</span> Hearts.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Sepeda Amal Borneo 2026 is dedicated to two critical pillars of paediatric health in Malaysia. Every kilometer we ride is a heartbeat we protect.
          </p>
        </div>
      </section>

      {/* 👶 PILLAR 1: MAPS */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl"></div>
                <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,43,73,0.15)] relative z-10">
                  <img
                    src="https://picsum.photos/seed/sabmaps/800/1000"
                    alt="Surgical Precision"
                    className="w-full h-full object-cover aspect-[4/5]"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-8 -right-8 bg-brand-navy p-8 rounded-[2rem] shadow-2xl z-20 border border-white/10">
                  <Stethoscope className="h-10 w-10 text-brand-cyan mb-3" />
                  <div className="text-white font-black text-xl leading-tight">Expert <br />Surgery</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-3 text-brand-cyan mb-6">
                <Heart className="h-8 w-8 fill-current" />
                <span className="text-sm font-black uppercase tracking-[0.3em]">Foundation Pillar 01</span>
              </div>
              <h2 className="text-5xl font-black text-brand-navy mb-8 tracking-tighter leading-tight">Repairing Lives: <br />MAPS Foundation.</h2>
              <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed mb-12">
                <p>
                  The <span className="text-brand-navy font-bold">Malaysian Association of Paediatric Surgery (MAPS)</span> is at the forefront of surgical excellence. Many children in Borneo are born with congenital conditions that require complex, expensive operations.
                </p>
                <p>
                  Through SAB 2026, we fund:
                </p>
                <ul className="space-y-4">
                  {[
                    "O.T. consumables for abdominal and thoracic surgeries.",
                    "Post-operative recovery monitoring for newborns.",
                    "Specialized surgical kits for remote clinics."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-brand-cyan mt-2.5 flex-shrink-0"></div>
                      <span className="text-brand-navy font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/donate" className="w-full sm:w-auto bg-brand-navy text-white font-black px-10 py-5 rounded-2xl hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-xl">
                  Sponsor a Surgery
                </Link>
                <a href="https://maps-malaysia.org" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-brand-navy transition-colors">
                  Visit MAPS Site <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🛡️ PILLAR 2: MyPOPI */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-coral/10 rounded-full blur-3xl"></div>
                <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,43,73,0.1)] relative z-10">
                  <img
                    src="https://picsum.photos/seed/sabmypopi/800/1000"
                    alt="Protected Child"
                    className="w-full h-full object-cover aspect-[4/5]"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-8 -left-8 bg-brand-coral p-8 rounded-[2rem] shadow-2xl z-20">
                  <Shield className="h-10 w-10 text-white mb-3" />
                  <div className="text-white font-black text-xl leading-tight">Immune <br />Defense</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-3 text-brand-coral mb-6">
                <Baby className="h-8 w-8" />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Foundation Pillar 02</span>
              </div>
              <h2 className="text-5xl font-black text-brand-navy mb-8 tracking-tighter leading-tight">The Bubble of Hope: <br />MyPOPI.</h2>
              <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed mb-12">
                <p>
                  <span className="text-brand-navy font-bold">MyPOPI</span> supports children affected by Primary Immunodeficiencies (PID). These children are born without the natural ability to fight infections.
                </p>
                <p>
                  Your donations help create a 'bubble of safety' through:
                </p>
                <ul className="space-y-4">
                  {[
                    "Early genetic screening for newborn PID detection.",
                    "Regular IVIG (Intravenous Immunoglobulin) treatments.",
                    "Home-care isolation support for high-risk patients."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-brand-coral mt-2.5 flex-shrink-0"></div>
                      <span className="text-brand-navy font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/donate" className="w-full sm:w-auto bg-brand-coral text-white font-black px-10 py-5 rounded-2xl hover:bg-brand-navy transition-all shadow-xl">
                  Fund a Shield
                </Link>
                <a href="https://mypopi.org" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-brand-navy transition-colors">
                  Visit MyPOPI Site <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className="py-24 bg-brand-navy text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-cyan/5 opacity-50 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Ready to make an impact?</h2>
          <Link
            to="/donate"
            className="inline-flex items-center gap-3 bg-brand-cyan hover:bg-white text-brand-navy text-xl font-black px-12 py-6 rounded-[2rem] shadow-2xl transition-all hover:scale-105"
          >
            Donate Now <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Mission;