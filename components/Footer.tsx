import React from 'react';
import { HeartHandshake, ShieldPlus, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-slate-300 py-20 border-t border-brand-navy/10 relative overflow-hidden">
      {/* Decorative Cyan Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">

          {/* Organized By */}
          <div>
            <h3 className="text-xs font-black text-brand-cyan uppercase tracking-[0.2em] mb-8">Organized By</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <ShieldPlus className="h-8 w-8 text-white mb-2" />
                <span className="block text-[10px] font-black text-white uppercase tracking-widest">MMA</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <HeartHandshake className="h-8 w-8 text-white mb-2" />
                <span className="block text-[10px] font-black text-white uppercase tracking-widest">Foundation</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400 font-medium leading-relaxed">
              Malaysian Medical Association & MMA Foundation. Standing together for children's health since 2022.
            </p>
          </div>

          {/* In Support Of */}
          <div>
            <h3 className="text-xs font-black text-brand-coral uppercase tracking-[0.2em] mb-8">In Support Of</h3>
            <div className="flex flex-col space-y-4 text-sm font-bold text-white">
              <a href="https://maps-malaysia.org" target="_blank" rel="noreferrer" className="group flex items-center gap-3 hover:text-brand-cyan transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan"></span>
                MAPS (Paediatric Surgery)
              </a>
              <a href="https://mypopi.org" target="_blank" rel="noreferrer" className="group flex items-center gap-3 hover:text-brand-cyan transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan"></span>
                MyPOPI (Immunodeficiencies)
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-black text-brand-cyan uppercase tracking-[0.2em] mb-8">Contact Information</h3>
            <div className="space-y-4 text-sm text-slate-400 font-medium">
              <p className="flex flex-col">
                <span className="text-white font-bold mb-1">Tax Exemption Receipts:</span>
                +60 14 513 9470
              </p>
              <p className="flex flex-col">
                <span className="text-white font-bold mb-1">General Inquiries:</span>
                +60 3 404 113 75 (ext. 113)
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-cyan flex items-center justify-center text-brand-navy">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <span className="text-white font-black tracking-tight">SAB 2026</span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            &copy; 2026 Sepeda Amal Borneo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;