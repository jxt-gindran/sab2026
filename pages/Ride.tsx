import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, TrendingUp, Quote, ArrowRight, UserPlus } from 'lucide-react';
import ridersData from '../data/riders.json';
import RegistrationModal from '../components/RegistrationModal';
import { BorneoRouteMap } from '../components/BorneoRouteMap';
import RiderStoryModal from '../components/RiderStoryModal';
import { ChevronDown, ChevronUp } from 'lucide-react'; // For FAQ if accordion, or just static

const Ride: React.FC = () => {
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<any | null>(null);
  const [riders, setRiders] = useState(ridersData);

  useEffect(() => {
    fetch('/api/riders').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setRiders(data);
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* 1. EVENT HERO */}
      <section className="bg-brand-navy text-white relative overflow-hidden pt-32 pb-24">

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-cyan text-[10px] font-black tracking-[0.3em] mb-8 uppercase backdrop-blur-md border border-white/10">
            26 July - 1 August 2026
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-heading leading-tight mb-8">
            The Journey: <br />
            <span className="text-brand-orange">SAB2026.</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-xl text-brand-pale font-medium mb-16">
            <MapPin className="h-5 w-5 text-brand-cyan" />
            <span>Kota Kinabalu to Miri</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-16">
            {[
              { label: 'Days', value: '6' },
              { label: 'Distance', value: '660 KM' },
              { label: 'Elevation', value: '8,000 M' },
              { label: 'Cyclists', value: '20' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading">{stat.value}</div>
                <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY QUOTE */}
      <section className="py-24 bg-brand-pale">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="h-12 w-12 text-brand-cyan mx-auto mb-8 opacity-50" />
          <p className="text-2xl md:text-4xl font-black text-brand-navy leading-tight font-heading italic">
            "Endurance cycling mirrors the realities faced by patients: long journeys marked by uncertainty, setbacks, and the need for sustained support. We take these conversations out of hospitals and into everyday spaces."
          </p>
        </div>
      </section>

      {/* 2.5 INTERACTIVE MAP */}
      {/* 2.5 INTERACTIVE MAP */}
      <div className="w-full max-w-7xl mx-auto px-6 -mt-12 relative z-20 mb-24">
        <BorneoRouteMap />
      </div>


      {/* 3. MEET THE CHAMPIONS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-navy mb-4 font-heading">Support a Rider.</h2>
            <p className="text-brand-slate font-medium">Sponsor a champion and help them reach their fundraising goal.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riders.map((rider) => (
              <div key={rider.id} className="group bg-white rounded-[2.5rem] p-6 border border-brand-grey/20 hover:border-brand-cyan/50 hover:shadow-2xl transition-all">
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative">
                  <img src={rider.image} alt={rider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>

                <h3 className="text-2xl font-black text-brand-navy mb-4 font-heading">{rider.name}</h3>

                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-bold text-brand-slate uppercase tracking-widest mb-1">
                    <span>Raised: <span className="text-brand-navy font-black text-sm">RM {rider.raised.toLocaleString()}</span></span>
                    <span>Goal: <span className="text-brand-cyan font-black text-sm">RM {rider.goal.toLocaleString()}</span></span>
                  </div>
                  <div className="w-full h-3 bg-brand-pale/50 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-brand-orange rounded-full shadow-sm" style={{ width: `${Math.min((rider.raised / rider.goal) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="w-full text-center py-4 rounded-xl border border-brand-grey/30 text-brand-navy font-black uppercase tracking-widest text-xs hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    Read Story
                  </button>
                  <a
                    href={`#/donate?rider=${rider.id}`}
                    className="block w-full text-center py-4 rounded-xl border-2 border-brand-orange text-brand-orange font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    Donate to Me
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* 3.5 FAQ SECTION */}


      {/* 4. REGISTRATION CTA */}
      <section className="py-24 bg-brand-navy text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0cdfed 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <UserPlus className="h-16 w-16 text-brand-orange mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">Join the Peloton.</h2>
          <p className="text-xl text-brand-pale font-medium mb-12">
            Ready to push your limits for a cause? <br />
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest block mt-4">Minimum Donation to Ride: RM 3,000</span>
          </p>
          <button
            onClick={() => setIsRegOpen(true)}
            className="inline-block bg-brand-orange text-white text-xl font-black px-12 py-5 rounded-full hover:bg-white hover:text-brand-orange transition-all shadow-xl hover:-translate-y-1"
          >
            Register to Ride
          </button>
          <p className="text-xs text-brand-pale/40 mt-6 max-w-sm mx-auto">
            Limited slots available. Riders are selected based on fundraising commitment and fitness readiness.
          </p>
        </div>
      </section>


      <RegistrationModal isOpen={isRegOpen} onClose={() => setIsRegOpen(false)} />
      <RiderStoryModal rider={selectedRider} onClose={() => setSelectedRider(null)} />

    </div >
  );
};

export default Ride;