import React from 'react';
import { Calendar, MapPin, Mountain, Bike, ArrowRight, Timer, Wind, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ride: React.FC = () => {
  return (
    <div className="w-full bg-white font-['Inter']">

      {/* 🚴 RIDE HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-brand-navy">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-cyan/20 blur-[100px] rounded-full z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-cyan text-[10px] font-black tracking-[0.3em] mb-8 uppercase backdrop-blur-md border border-white/10">
                The Event • Endurance Challenge
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                The <span className="text-brand-cyan">Infinite</span> <br />Road.
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-12">
                660km from Kota Kinabalu to Miri. 8,000m of elevation. 20 dedicated cyclists. One shared mission of hope.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-cyan">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Date</div>
                    <div className="text-lg font-black text-white">26 July - 1 Aug 2026</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-coral">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Route</div>
                    <div className="text-lg font-black text-white">KK → Miri</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/5 relative">
              <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Bike className="h-32 w-32 text-white/5 -rotate-12" />
                </div>
                <h3 className="text-xl font-black text-brand-cyan mb-8 uppercase tracking-widest leading-tight">Registration Status</h3>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-white font-bold text-lg">Confirmed Riders</span>
                    <span className="text-3xl font-black text-white">20 <span className="text-slate-500 text-sm">/ 40</span></span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-cyan rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-brand-cyan hover:bg-white text-brand-navy font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                  Join the Peloton <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ THE CHALLENGE STATS */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: 'Total Distance', value: '660 KM', icon: Mountain, detail: 'Cross-state endurance', color: 'bg-brand-navy' },
              { label: 'Total Elevation', value: '8,000 M', icon: Wind, detail: 'Challenging Borneo peaks', color: 'bg-brand-coral' },
              { label: 'Time Goal', value: '6 Days', icon: Timer, detail: 'Avg 110km per day', color: 'bg-brand-cyan' }
            ].map((stat, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white mb-8 transition-transform group-hover:scale-110 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-black text-brand-navy mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</div>
                <p className="text-slate-500 font-medium leading-relaxed">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏔️ ROUTE BREAKDOWN */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

            <div className="relative">
              <div className="rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white p-2">
                <img
                  src="https://picsum.photos/seed/sabroute/800/800"
                  alt="Borneo Landscape"
                  className="w-full h-full object-cover aspect-square rounded-[3.5rem]"
                />
              </div>
              {/* Floating Shield */}
              <div className="absolute -top-10 -right-10 bg-brand-navy p-10 rounded-full shadow-2xl border-4 border-white animate-bounce-slow">
                <Shield className="h-12 w-12 text-brand-cyan" />
              </div>
            </div>

            <div>
              <h2 className="text-5xl font-black text-brand-navy mb-8 tracking-tighter leading-tight">The Journey <br />of Resillience.</h2>
              <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                The SAB 2026 route is a reflection of the challenges our patients face. From the steep climbs of Crocker Range to the tropical winds of the Sarawak coast, our cyclists push through physical pain to deliver medical hope.
              </p>

              <div className="space-y-8">
                {[
                  { title: "Neutral Support", desc: "Full escort vehicles with medical and mechanical aid." },
                  { title: "Safety Protocol", desc: "Rigorous safety standards and group riding dynamics." },
                  { title: "Team Spirit", desc: "This is not a race. We start together, we finish together." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="h-10 w-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-navy group-hover:bg-brand-cyan transition-colors flex-shrink-0">
                      <span className="font-black text-xs">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-brand-navy mb-1">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 💳 FINAL CTA */}
      <section className="py-24 bg-brand-coral text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Support our champions.</h2>
          <p className="text-xl md:text-2xl font-bold opacity-80 mb-12">Don't want to ride? You can still be part of the peloton by sponsoring a cyclist.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/donate"
              className="bg-brand-navy text-white text-xl font-black px-12 py-6 rounded-2xl shadow-3xl hover:bg-white hover:text-brand-navy transition-all"
            >
              Sponsor a Rider
            </Link>
            <Link
              to="/mission"
              className="text-white font-black text-lg flex items-center gap-2 hover:opacity-75 transition-opacity underline decoration-white/30 underline-offset-8"
            >
              Read the Mission <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Ride;