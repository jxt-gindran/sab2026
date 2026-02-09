import React from 'react';
import { HeartHandshake, ShieldPlus } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Organized By */}
          <div>
            <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">Organized By</h3>
            <div className="flex items-center space-x-4">
               <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                 {/* Placeholder for Logos */}
                 <ShieldPlus className="h-8 w-8 text-white" />
                 <span className="block text-xs mt-1 font-bold text-white">MMA</span>
               </div>
               <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                 <HeartHandshake className="h-8 w-8 text-white" />
                 <span className="block text-xs mt-1 font-bold text-white">Foundation</span>
               </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Malaysian Medical Association & MMA Foundation.
            </p>
          </div>

          {/* In Support Of */}
          <div>
            <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-4">In Support Of</h3>
            <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <a href="https://maps-malaysia.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  MAPS (Malaysian Association of Paediatric Surgery)
                </a>
                <a href="https://mypopi.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  MyPOPI (Malaysian Patient Organization for Primary Immunodeficiencies)
                </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">Contact</h3>
            <p className="text-sm text-slate-400">
              For tax exemption receipts:
              <br />
              +60 14 513 9470
              <br />
              +60 3 404 113 75 (ext. 113)
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; 2026 Sepeda Amal Borneo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;