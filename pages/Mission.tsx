import React from 'react';
import { Heart, Shield } from 'lucide-react';

const Mission: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900">The Mission</h1>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Supporting the healers and the protectors of our future generation.
          </p>
        </div>

        {/* Section 1: MAPS */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/sab2026surgery/800/600" 
                alt="Paediatric Surgeon" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sab/10 rounded-lg">
                <Heart className="w-6 h-6 text-sab" />
              </div>
              <h2 className="text-sm font-bold text-sab uppercase tracking-widest">The Healers</h2>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Repairing Little Lives (MAPS)</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              The Malaysian Association of Paediatric Surgery (MAPS) advances excellence in surgical care. We are fundraising to provide critical training, surgical equipment, and complex procedures for children born with congenital abnormalities.
            </p>
            <a 
              href="https://maps-malaysia.org" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center font-semibold text-sab hover:text-sab-dark border-b-2 border-sab hover:border-sab-dark transition-colors"
            >
              Visit maps-malaysia.org
            </a>
          </div>
        </div>

        {/* Section 2: MyPOPI */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/sab2026child/800/600" 
                alt="Child in protected environment" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-sm font-bold text-orange-600 uppercase tracking-widest">The Protectors</h2>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Defending the Defenseless (MyPOPI)</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              MyPOPI supports children affected by Primary Immunodeficiencies (PID)—children born without a functioning immune system. Your funds aid in early diagnosis, 'bubble' protection, and life-saving treatments.
            </p>
            <a 
              href="https://mypopi.org" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center font-semibold text-orange-600 hover:text-orange-800 border-b-2 border-orange-600 hover:border-orange-800 transition-colors"
            >
              Visit mypopi.org
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Mission;