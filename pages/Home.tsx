import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Map,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { GoGear } from 'react-icons/go';

const RIDERS = [
  {
    id: 1,
    name: 'Dr. Ahmad Rizal',
    role: 'Paediatric Surgeon',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&h=300&auto=format&fit=crop',
    goal: 50000,
    raised: 38500
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Endurance Cyclist',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300&h=300&auto=format&fit=crop',
    goal: 30000,
    raised: 12400
  },
  {
    id: 3,
    name: 'Lt. Murali Kumar',
    role: 'Retired Officer',
    image: 'https://images.unsplash.com/photo-1544191136-11f8149e634e?q=80&w=300&h=300&auto=format&fit=crop',
    goal: 25000,
    raised: 24800
  },
  {
    id: 4,
    name: 'Elena Tan',
    role: 'Triathlete',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&auto=format&fit=crop',
    goal: 15000,
    raised: 8200
  }
];

const TIMELINE = [
  { year: '2022', title: 'Cycle for Cancer', raised: 'RM 230k' },
  { year: '2023', title: 'Program ROSE', raised: 'RM 250k' },
  { year: '2024', title: 'Program ROSE', raised: 'RM 270k' },
  { year: '2025', title: 'MAPPAC', raised: 'RM 450k' },
];

const Home: React.FC = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [raisedAmount, setRaisedAmount] = useState('RM 1.2M');
  const [ridersList, setRidersList] = useState(RIDERS);

  useEffect(() => {
    // Fetch dynamic stats
    fetch('/api/stats').then(res => res.json()).then(data => {
      if (data && typeof data.totalRaised === 'number') {
        // Assuming 1.2M is historical base, we add current campaign to it?
        // Or if 1.2M is 2026 goal?
        // The user said "Add sum total to include manual and hitpay".
        // I will treat 1.2M as historical base and add the new amount.
        const base = 1200000;
        const total = base + data.totalRaised;
        setRaisedAmount(`RM ${(total / 1000000).toFixed(3)}M`);
      }
    }).catch(err => console.error(err));

    // Fetch riders update
    fetch('/api/riders').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        // Map API data to match local structure or just use it
        setRidersList(data.slice(0, 4));
      }
    }).catch(console.error);
  }, []);

  // JSON-LD Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "name": "Sepeda Amal Borneo",
        "url": "https://sab2026.com",
        "logo": "https://sab2026.com/logo.png",
        "description": "A charity cycling movement funding paediatric surgeries in Borneo.",
        "parentOrganization": {
          "@type": "Organization",
          "name": "Malaysian Medical Association Foundation"
        }
      },
      {
        "@type": "Event",
        "name": "Sepeda Amal Borneo 2026 Charity Ride",
        "startDate": "2026-07-26",
        "location": {
          "@type": "Place",
          "name": "Borneo",
          "address": "Kota Kinabalu to Miri"
        },
        "description": "A 660km charity cycle to raise funds for paediatric surgery and immune deficiency support.",
        "organizer": {
          "@type": "Organization",
          "name": "MMA Foundation"
        }
      }
    ]
  };

  return (
    <div className="w-full bg-white font-sans text-brand-slate">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* 2. HERO SECTION (The Emotional Hook) */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/male-working-as-paediatrician.jpg"
            alt="SAB 2026 Medical Mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white mt-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.1] font-heading text-white">
            Pedal for Care, <br />
            <span className="text-brand-cyan">Ride for Hope.</span>
          </h1>
          <h2 className="text-lg md:text-2xl font-medium text-brand-pale mb-10 max-w-3xl mx-auto leading-relaxed">
            Funding life-saving surgeries and immune defense for Malaysia's most vulnerable children. Powered by a 660km endurance ride across Borneo.
          </h2>

          <div className="flex flex-col items-center gap-4">
            <Link
              to="/donate"
              className="bg-brand-orange hover:bg-white hover:text-brand-orange text-white text-xl font-black px-12 py-5 rounded-full shadow-[0_0_30px_rgba(255,127,50,0.4)] hover:shadow-xl transition-all hover:-translate-y-1 animate-pulse flex items-center gap-3 uppercase tracking-widest"
            >
              Save a Life Now <ArrowRight className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-pale/60">
              <ShieldCheck className="h-4 w-4" />
              <span>Organized by MMA Foundation | Tax Exempt</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS STRIP (Social Proof) */}
      <section className="py-12 bg-white relative z-20 -mt-10 mx-4 md:mx-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-brand-grey/20 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: 'Raised', value: raisedAmount, icon: TrendingUp },
                { label: 'Cycled', value: '3,900 KM', icon: Map },
                { label: 'Tax Relief', value: '100%', icon: ShieldCheck },
                { label: 'Charities', value: '2 Lifelines', icon: Heart }
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left flex flex-col items-center md:items-start group">
                  <stat.icon className="h-8 w-8 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl lg:text-4xl font-black text-brand-navy tracking-tight font-heading">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-slate/60 group-hover:text-brand-orange transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE MISSION (About Us & Beneficiaries) */}
      <section id="mission" className="py-24 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* The Why */}
            <div>
              <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm animate-fade-in">Our Core Mission</div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 tracking-tighter font-heading">Two Causes. <br />One Lifeline.</h2>
              <p className="text-lg text-brand-slate font-medium mb-8 leading-relaxed">
                Sepeda Amal Borneo is more than a cycling event; it is a movement. We ride to turn awareness into action, ensuring that no child is denied medical care due to lack of funds.
              </p>
              <div className="h-1 w-24 bg-brand-cyan rounded-full"></div>
            </div>

            {/* The Who (Cards) */}
            <div className="grid gap-6">
              {/* Card A: MAPS */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-grey/20 hover:shadow-xl transition-all group cursor-pointer hover:border-brand-cyan/30">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-brand-grey/20 p-2 group-hover:scale-105 transition-transform">
                    <img src="/assets/logos/MAPS%20Logo.png" alt="MAPS Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-brand-navy mb-2 font-heading">MAPS Malaysia</h3>
                    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3">Repairing Little Lives</div>
                    <p className="text-sm text-brand-slate font-medium mb-4">Funding complex paediatric surgeries for congenital anomalies and life-threatening conditions.</p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                      <Link to="/mission" className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors flex items-center gap-1 border-b border-brand-navy hover:border-brand-cyan pb-0.5">
                        See How We Help <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link to="/donate?beneficiary=MAPS" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:text-brand-navy transition-colors flex items-center gap-1">
                        Donate Directly →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card B: MyPOPI */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-grey/20 hover:shadow-xl transition-all group cursor-pointer hover:border-brand-cyan/30">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-brand-grey/20 p-2 group-hover:scale-105 transition-transform">
                    <img src="/assets/logos/MyPOPI-1.png" alt="MyPOPI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-brand-navy mb-2 font-heading">MyPOPI</h3>
                    <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3">Defending the Defenseless</div>
                    <p className="text-sm text-brand-slate font-medium mb-4">Supporting diagnostics and treatment for Primary Immunodeficiency (PID) patients.</p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                      <Link to="/mission" className="text-[10px] font-black text-brand-navy uppercase tracking-widest hover:text-brand-cyan transition-colors flex items-center gap-1 border-b border-brand-navy hover:border-brand-cyan pb-0.5">
                        See How We Help <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link to="/donate?beneficiary=MyPOPI" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:text-brand-navy transition-colors flex items-center gap-1">
                        Donate Directly →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR LEGACY (The Track Record) */}
      <section id="history" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-4 tracking-tighter font-heading">A History of Moving Mountains.</h2>
            <p className="text-brand-slate font-medium text-lg">Consistent impact, year after year.</p>
          </div>

          <div className="relative">
            {/* Chain Graphic Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-pale -translate-y-1/2 hidden md:block z-0"></div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-8 pb-8 md:grid md:grid-cols-4 md:gap-8 relative z-10 snap-x snap-mandatory hide-scrollbar">
              {TIMELINE.map((item, i) => (
                <div key={i} className="min-w-[280px] snap-center bg-white p-8 rounded-[2rem] border border-brand-grey/20 shadow-lg text-center relative group hover:-translate-y-2 transition-transform">
                  {/* Use GoGear icon */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                    <GoGear className="h-6 w-6 text-brand-cyan" />
                  </div>

                  <div className="text-4xl font-black text-brand-navy mb-2 font-heading">{item.year}</div>
                  <div className="text-[10px] font-bold text-brand-slate uppercase tracking-widest mb-4">{item.title}</div>
                  <div className="inline-block bg-brand-pale/50 px-5 py-2 rounded-xl text-brand-navy font-black text-xl">
                    {item.raised}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE RIDE & RIDERS (The Event) */}
      <section id="ride" className="py-24 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16 px-4">
            <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">The Challenge</div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-8 tracking-tighter font-heading">Kota Kinabalu to Miri.</h2>
            <div className="max-w-5xl mx-auto rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden text-white border border-brand-cyan/20 group">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/images/KK-miri.png"
                  alt="Kota Kinabalu to Miri Route"
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <MapPin className="h-16 w-16 text-brand-cyan mx-auto mb-6 animate-bounce" />
                <h3 className="text-5xl md:text-6xl font-black mb-4 font-heading tracking-tight">660 KM</h3>
                <p className="text-brand-pale font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                  A high-endurance cross-country expedition across the rugged heart of Borneo.
                </p>

                {/* Visual Route Placeholder */}
                <div className="mt-12 max-w-lg mx-auto">
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
              <h2 className="text-3xl font-black text-brand-navy font-heading">Meet the Champions.</h2>
              <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-2">Endurance mirrors the patient's journey.</p>
            </div>
            <Link to="/ride" className="hidden md:inline-flex items-center gap-2 font-black text-brand-navy hover:text-brand-cyan uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-brand-cyan pb-1 transition-all">
              View All Riders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Rider Carousel */}
          <div
            ref={scrollContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8"
          >
            {ridersList.map((rider) => (
              <div key={rider.id} className="bg-white rounded-[2rem] p-6 border border-brand-grey/20 hover:border-brand-orange/50 hover:shadow-xl transition-all group">
                <div className="h-64 w-full rounded-2xl overflow-hidden mb-6 relative">
                  <img src={rider.image} alt={rider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-navy/90 to-transparent">
                    <div className="text-white font-black text-xl font-heading">{rider.name}</div>
                    <div className="text-brand-cyan text-[10px] font-bold uppercase tracking-widest">{rider.role}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                    <span>Raised: RM {rider.raised.toLocaleString()}</span>
                    <span className="text-brand-navy">Goal: RM {rider.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-brand-pale/30 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-orange rounded-full" style={{ width: `${(rider.raised / rider.goal) * 100}%` }}></div>
                  </div>
                </div>

                <Link to={`/donate?rider=${rider.id}`} className="block w-full text-center border-2 border-brand-orange bg-white text-brand-orange font-black py-4 rounded-xl hover:bg-brand-orange hover:text-white transition-all text-sm uppercase tracking-widest">
                  Donate to Me
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CTA (The Closer) */}
      <section className="py-24 bg-white text-center border-t border-brand-pale">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-brand-navy font-heading">Ready to Make an Impact?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/donate"
              className="w-full sm:w-auto bg-brand-navy text-white text-lg font-black px-12 py-6 rounded-[2rem] shadow-2xl hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
            >
              Donate to General Fund
            </Link>
            <button className="w-full sm:w-auto bg-transparent border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-brand-navy text-lg font-black px-12 py-6 rounded-[2rem] transition-all uppercase tracking-widest" onClick={() => window.location.href = '/ride'}>
              Register as a Cyclist
            </button>
          </div>
        </div>
      </section>

      {/* 8. CORPORATE TRUST STRIP (New) */}
      <section className="py-16 bg-slate-50 border-t border-brand-pale">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-black text-brand-slate/40 mb-10 uppercase tracking-[0.3em]">Our Partners in Hope</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Logos */}
            <div className="h-48 w-96 flex items-center justify-center">
              <img src="/assets/logos/MMA_logo.png" alt="MMA" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="h-48 w-96 flex items-center justify-center">
              <img src="/assets/logos/MMAF_logo.png" alt="MMAF" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="h-48 w-96 flex items-center justify-center">
              <img src="/assets/logos/SAB%20Logo_%20Light.png" alt="SAB" className="max-h-full max-w-full object-contain invert" />
            </div>
            {/* Placeholders */}
            <div className="h-24 px-10 bg-brand-pale/20 rounded-xl flex items-center justify-center font-bold text-slate-400 text-sm uppercase tracking-widest border border-brand-pale">Global Sponsor</div>
          </div>
          <Link to="/contact" className="inline-block mt-12 text-[10px] font-black text-brand-orange hover:text-brand-navy border-b-2 border-brand-orange hover:border-brand-navy pb-1 transition-all uppercase tracking-widest">
            Become a Corporate Partner →
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;