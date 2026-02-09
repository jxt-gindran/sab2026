import React from 'react';
import { Calendar, MapPin, Mountain, Bike } from 'lucide-react';

const Ride: React.FC = () => {
  return (
    <div className="w-full bg-slate-50">
      {/* Event Header */}
      <div className="bg-sab text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">The Ride</h1>
          <p className="text-xl text-teal-100 font-light">
            "This is not a race, but a fully supported endurance ride involving 20 dedicated cyclists."
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Date */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-b-4 border-orange-500">
            <div className="bg-orange-100 p-4 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">Dates</h3>
            <p className="text-xl text-slate-700 font-semibold">26 July - 1 August 2026</p>
          </div>

          {/* Card 2: Route */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-b-4 border-sab">
             <div className="bg-sab/10 p-4 rounded-full mb-6">
              <MapPin className="w-8 h-8 text-sab" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">Route</h3>
            <p className="text-xl text-slate-700 font-semibold">Kota Kinabalu (Sabah) <br/>to<br/> Miri (Sarawak)</p>
          </div>

          {/* Card 3: Stats */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-b-4 border-slate-700">
             <div className="bg-slate-100 p-4 rounded-full mb-6">
              <Mountain className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">Challenge</h3>
            <p className="text-xl text-slate-700 font-semibold">660km Distance</p>
            <p className="text-md text-slate-500 mt-1">8,000m Elevation</p>
          </div>

        </div>

        {/* Philosophy / Image Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
           <div className="md:w-1/2 relative h-64 md:h-auto">
             <img 
               src="https://picsum.photos/seed/sab2026bike/800/600" 
               alt="Cyclists in Borneo" 
               className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-sab/30"></div>
           </div>
           <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Bike className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-slate-900">The Spirit of SAB</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                Sepeda Amal Borneo pushes the limits of physical endurance to mirror the resilience of the children we support. 
                Riding across the rugged terrain of Borneo, our cyclists are united by a single purpose: ensuring no child is denied medical care due to lack of funds.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-sab">
                <p className="text-sm text-slate-500 italic">
                  "Every pedal stroke is a promise kept to a child in need."
                </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Ride;