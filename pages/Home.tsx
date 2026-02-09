import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Map,
  ShieldCheck,
  Users,
  ArrowRight,
  Heart,
  Play,
  Quote,
  CheckCircle2,
  Trophy,
  Stethoscope,
  Bike
} from 'lucide-react';

const RIDERS = [
  {
    id: 1,
    name: 'Dr. Ahmad Rizal',
    role: 'Paediatric Surgeon',
    image: 'https://i.pravatar.cc/300?u=dr1',
    goal: 50000,
    raised: 38500,
    quote: "I see these kids every day in the OT. This ride is for their second chance.",
    stats: { km: 660, years: 4 }
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Endurance Cyclist',
    image: 'https://i.pravatar.cc/300?u=sc1',
    goal: 30000,
    raised: 12400,
    quote: "Healing isn't just medical; it's a community effort. Let's pedal together.",
    stats: { km: 1200, years: 2 }
  },
  {
    id: 3,
    name: 'Lt. Murali Kumar',
    role: 'Retired Officer',
    image: 'https://i.pravatar.cc/300?u=mk1',
    goal: 25000,
    raised: 24800,
    quote: "No child should fight alone. We ride so they don't have to.",
    stats: { km: 3900, years: 6 }
  }
];

const Home: React.FC = () => {
  return (
    <div className="w-full bg-white font-['Inter']">

      {/* 🚀 EMOTIONAL HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center pt-20 pb-20 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] bg-brand-cyan/10 blur-[120px] rounded-full z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-brand-coral/5 blur-[120px] rounded-full z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

            {/* Left: Humanity-Focused Messaging */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy text-brand-cyan text-xs font-black tracking-[0.2em] mb-8 uppercase shadow-xl animate-fade-in">
                <Heart className="h-3 w-3 fill-current" />
                SAB 2026 • The Human Race
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-brand-navy leading-[0.9] mb-10 tracking-tighter">
                Rewrite <br />
                <span className="text-brand-cyan">their future.</span> <br />
                One pedal <br />
                at a time.
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                We're cycling 660km to fund surgeries for Malaysia's most vulnerable children. <span className="text-brand-navy font-bold">Your heart fuels our legs.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link
                  to="/donate"
                  className="group bg-brand-coral hover:bg-brand-coral/90 text-white text-xl font-black px-12 py-6 rounded-[2rem] shadow-2xl shadow-brand-coral/30 transition-all hover:-translate-y-1 flex items-center gap-3"
                >
                  Save a Life Now
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <button className="flex items-center gap-4 text-brand-navy font-black text-lg group">
                  <div className="h-16 w-16 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-all">
                    <Play className="h-6 w-6 fill-current group-hover:text-white" />
                  </div>
                  Watch the Story
                </button>
              </div>
            </div>

            {/* Right: Emotional Visual Composite */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 w-full aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,43,73,0.3)] group">
                <img
                  src="https://picsum.photos/seed/sabkids/1000/1250"
                  alt="Child Patient"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>

                {/* Floating "Why We Ride" Banner */}
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                  <Quote className="h-8 w-8 text-brand-cyan mb-4 opacity-50" />
                  <p className="text-white text-lg font-bold leading-snug italic">
                    "The surgery I received changed my life. Now, I see these doctors riding so other kids can have the same chance I did."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1 w-8 bg-brand-cyan rounded-full"></div>
                    <span className="text-brand-cyan font-black text-xs uppercase tracking-widest">Aishah, Former Patient</span>
                  </div>
                </div>
              </div>

              {/* Floating Impact Badges */}
              <div className="absolute -top-10 -right-10 z-20 animate-bounce-slow">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center">
                  <div className="text-4xl font-black text-brand-navy leading-none mb-1">100%</div>
                  <div className="text-[10px] font-black text-brand-coral uppercase tracking-widest text-center">Direct Medical <br />Funding</div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-12 z-20 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                <div className="bg-brand-navy p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-cyan flex items-center justify-center text-brand-navy">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-white font-black text-xl leading-none">Pediatric Care</div>
                    <div className="text-brand-cyan text-[10px] font-black uppercase tracking-widest">Our Mission</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📊 REAL-TIME IMPACT DASHBOARD */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-1 flex flex-col justify-center">
              <h2 className="text-3xl font-black text-brand-navy mb-4 tracking-tight leading-tight">Lives Touched <br />by Your Kindness.</h2>
              <div className="h-1 w-20 bg-brand-cyan rounded-full"></div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Funds Raised', value: 'RM 1,284,500', icon: TrendingUp, color: 'text-brand-cyan' },
                { label: 'Distance Covered', value: '3,900 KM', icon: Map, color: 'text-brand-coral' },
                { label: 'Beneficiaries', value: '2 Charities', icon: Users, color: 'text-brand-navy' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className={`p-4 rounded-2xl bg-slate-50 inline-block mb-6 group-hover:bg-brand-navy group-hover:text-white transition-colors ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-black text-brand-navy mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 🏅 RIDER HIGHLIGHT: THE CHAMPIONS (BENTO GRID) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-brand-navy mb-6 tracking-tighter">Meet Your Champions.</h2>
              <p className="text-xl text-slate-500 font-medium">These riders are pushing their limits to ensure no child fights alone. Sponsor their journey and double the impact.</p>
            </div>
            <Link to="/ride" className="inline-flex items-center gap-2 text-brand-navy font-black uppercase tracking-widest text-sm hover:text-brand-cyan transition-colors">
              View All 40+ Riders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Featured Rider (Large Card) */}
            <div className="md:col-span-8 group relative rounded-[3rem] overflow-hidden bg-brand-navy h-[600px] shadow-2xl">
              <img
                src={RIDERS[0].image}
                alt={RIDERS[0].name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent"></div>

              <div className="absolute bottom-12 left-12 right-12">
                <div className="inline-block px-4 py-2 bg-brand-cyan text-brand-navy text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Featured Champion</div>
                <h3 className="text-5xl font-black text-white mb-4 tracking-tight">{RIDERS[0].name}</h3>
                <p className="text-brand-cyan text-lg font-bold mb-8 max-w-md italic leading-relaxed">"{RIDERS[0].quote}"</p>

                <div className="grid grid-cols-2 gap-12 mb-10">
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fundraising Progress</div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-3xl font-black text-white">RM {RIDERS[0].raised.toLocaleString()}</span>
                      <span className="text-slate-500 font-bold mb-1">/ RM {RIDERS[0].goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-cyan rounded-full shadow-[0_0_20px_rgba(0,174,239,0.5)]" style={{ width: `${(RIDERS[0].raised / RIDERS[0].goal) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{RIDERS[0].stats.km}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Training KM</div>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{RIDERS[0].stats.years}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Years Riding</div>
                    </div>
                  </div>
                </div>

                <Link to={`/donate?rider=${RIDERS[0].id}`} className="inline-flex bg-white hover:bg-brand-cyan text-brand-navy font-black px-10 py-5 rounded-2xl transition-all shadow-xl">
                  Sponsor Dr. Rizal
                </Link>
              </div>
            </div>

            {/* Side Riders (Vertical Stack) */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {RIDERS.slice(1).map(rider => (
                <div key={rider.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 group transition-all hover:bg-white hover:shadow-2xl">
                  <div className="flex items-center gap-5 mb-6">
                    <img src={rider.image} alt={rider.name} className="h-16 w-16 rounded-2xl object-cover shadow-lg" />
                    <div>
                      <h4 className="text-xl font-black text-brand-navy leading-none mb-1">{rider.name}</h4>
                      <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">{rider.role}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <span>Raised</span>
                      <span className="text-brand-navy">RM {rider.raised.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-coral" style={{ width: `${(rider.raised / rider.goal) * 100}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/donate?rider=${rider.id}`} className="w-full inline-flex items-center justify-center gap-2 border-2 border-brand-navy text-brand-navy font-black py-4 rounded-2xl hover:bg-brand-navy hover:text-white transition-all">
                    Sponsor {rider.name.split(' ')[1]} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}

              {/* Call to Action Card */}
              <div className="flex-grow bg-brand-cyan p-8 rounded-[2.5rem] relative overflow-hidden group border-4 border-brand-navy">
                <Bike className="absolute -bottom-6 -right-6 h-32 w-32 text-brand-navy/20 rotate-12" />
                <h4 className="text-2xl font-black text-brand-navy mb-4 relative z-10 leading-tight">Ready to ride <br />with us?</h4>
                <Link to="/ride" className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 hover:bg-white hover:text-brand-navy transition-all">
                  Register as Rider
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🏥 MEDICAL LEGACY & MISSION */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-brand-navy/50 z-0 skew-x-[-20deg] translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 text-brand-cyan mb-8">
                <Trophy className="h-8 w-8" />
                <span className="text-sm font-black uppercase tracking-[0.3em]">Our Legacy of Impact</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-tight">Beyond the finishing line.</h2>
              <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed">
                Since 2022, the Sepeda Amal Borneo movement has raised over <span className="text-white font-bold">RM 1.2M</span> for paediatric care.
                We don't just cycle for sport; we cycle to ensure that expert medical care is accessible to every child in Malaysia, regardless of their background.
              </p>

              <div className="space-y-6">
                {[
                  "Funding complex heart and abdominal surgeries.",
                  "Sourcing critical diagnostic kits for rare immune disorders.",
                  "Supporting family recovery and post-op medication.",
                  "Building a network of paediatric specialists across Borneo."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="h-6 w-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-navy transition-all">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-16">
                <Link to="/mission" className="bg-brand-cyan hover:bg-white text-brand-navy font-black px-12 py-6 rounded-[2rem] transition-all shadow-2xl flex items-center gap-3 w-fit">
                  Explore Our Mission
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-6">
              <img src="https://picsum.photos/seed/sabdoc1/500/800" className="rounded-[3rem] shadow-2xl mt-12" alt="Mission 1" />
              <img src="https://picsum.photos/seed/sabdoc2/500/800" className="rounded-[3rem] shadow-2xl -mt-12" alt="Mission 2" />
            </div>

          </div>
        </div>
      </section>

      {/* 💳 FINAL CTA */}
      <section className="py-24 bg-brand-cyan text-brand-navy text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Will you be the reason a child survives?</h2>
          <p className="text-xl md:text-2xl font-bold opacity-80 mb-12">Every contribution, large or small, goes directly to the Malaysian Medical Association Foundation.</p>
          <Link
            to="/donate"
            className="inline-block bg-brand-navy text-white text-2xl font-black px-16 py-8 rounded-[2.5rem] shadow-3xl hover:bg-white hover:text-brand-navy transition-all hover:scale-105 active:scale-95"
          >
            Donate Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;