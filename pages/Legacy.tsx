import React from 'react';
import { History, Award } from 'lucide-react';

const Legacy: React.FC = () => {
  const events = [
    { year: '2022', title: 'Cycle for Cancer', raised: 'RM 230,000', cause: 'MAKNA', dist: '1,100km' },
    { year: '2023', title: 'Program ROSE', raised: 'RM 250,000', cause: 'Cervical Cancer Elimination', dist: '700km' },
    { year: '2024', title: 'Program ROSE', raised: 'RM 270,000', cause: 'Cervical Cancer Elimination', dist: '900km' },
    { year: '2025', title: 'Paediatric Palliative Care', raised: 'RM 450,000', cause: 'MAPPAC', dist: '600km' },
    { year: '2026', title: 'SAB2026', raised: 'Fundraising Now', cause: 'Paediatric Surgery & Immunity', dist: '660km', active: true },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Organization Profile */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 border-t-4 border-sab">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <History className="text-sab" />
                 <h2 className="text-2xl font-bold text-slate-900">MMA Foundation</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Established in 1974 to assist the Malaysian Medical Association in contributing to community health projects and public health education. We have spearheaded humanitarian initiatives for over 50 years.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Award className="text-sab" />
                 <h2 className="text-2xl font-bold text-slate-900">Malaysian Medical Association</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Established in 1959, representing over 17,000 members dedicated to medical ethics and philanthropy. The voice of the medical profession in Malaysia.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Timeline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">The Impact Timeline</h2>
          <p className="text-slate-500 mt-2">A history of endurance for a cause.</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-200 hidden md:block"></div>

          <div className="space-y-12">
            {events.map((event, index) => (
              <div key={event.year} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 z-10 hidden md:block ${event.active ? 'bg-orange-500 border-white shadow-lg' : 'bg-sab border-slate-50'}`}></div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 px-6">
                  <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${event.active ? 'border-orange-500 ring-2 ring-orange-100' : 'border-sab'} hover:shadow-lg transition-shadow`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-2xl font-bold ${event.active ? 'text-orange-600' : 'text-sab'}`}>{event.year}</span>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{event.dist}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{event.cause}</p>
                    <div className="pt-3 border-t border-slate-100">
                      <span className="block text-sm font-semibold text-slate-900">
                        Total Raised: <span className={event.active ? 'text-orange-600' : 'text-sab'}>{event.raised}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Empty Side for layout balance */}
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Legacy;