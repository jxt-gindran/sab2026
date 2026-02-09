import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Map, ShieldCheck, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/sab2026care/1920/1080" 
            alt="Surgeon hands holding child hand" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-sab/90 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Pedal for Care. <br/>
            <span className="text-orange-400">Ride for Hope.</span>
          </h1>
          <p className="text-lg md:text-xl text-teal-50 mb-10 max-w-2xl mx-auto font-light">
            We ride 660km across Borneo to fund life-saving paediatric surgeries and immune defense for Malaysia's most vulnerable children.
          </p>
          <Link 
            to="/donate"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-xl transition-transform hover:-translate-y-1"
          >
            Donate Now
          </Link>
        </div>
      </section>

      {/* Impact Dashboard */}
      <section className="py-16 bg-white relative -mt-16 z-20 mx-4 md:mx-auto max-w-7xl rounded-xl shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center p-3 bg-sab/10 text-sab rounded-full mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">RM 1.2M+</h3>
            <p className="text-sm text-slate-500 font-medium mt-2 uppercase tracking-wide">Raised Since 2022</p>
          </div>

          <div className="text-center p-4 border-l-0 md:border-l border-slate-100">
            <div className="inline-flex items-center justify-center p-3 bg-sab/10 text-sab rounded-full mb-4">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">3,900 KM</h3>
            <p className="text-sm text-slate-500 font-medium mt-2 uppercase tracking-wide">Cycled for Charity</p>
          </div>

          <div className="text-center p-4 border-l-0 lg:border-l border-slate-100">
            <div className="inline-flex items-center justify-center p-3 bg-sab/10 text-sab rounded-full mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">100%</h3>
            <p className="text-sm text-slate-500 font-medium mt-2 uppercase tracking-wide">Tax-Exempt Donations</p>
          </div>

          <div className="text-center p-4 border-l-0 md:border-l border-slate-100">
            <div className="inline-flex items-center justify-center p-3 bg-sab/10 text-sab rounded-full mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">2 Charities</h3>
            <p className="text-sm text-slate-500 font-medium mt-2 uppercase tracking-wide">Changing Lives in 2026</p>
          </div>

        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">More Than Just a Ride</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-slate-600 leading-relaxed">
            Sepeda Amal Borneo (SAB) is a charity cycling movement organized by the MMA Foundation. 
            This year, we stand in solidarity with children fighting congenital abnormalities and immune deficiencies. 
            Every kilometer we cycle translates into direct medical support for those who cannot afford care.
          </p>
          <div className="mt-10">
            <Link to="/mission" className="text-sab font-bold hover:text-sab-dark flex items-center justify-center gap-2">
              Learn about our beneficiaries <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;