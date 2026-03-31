import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, ShieldCheck, Bike } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-brand-pale py-20 border-t border-brand-navy/10 relative overflow-hidden font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* 1. BRAND COLUMN */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-24 w-48 shrink-0">
                <img src="/assets/logos/SAB Logo_ Light.png" alt="SAB Logo" className="w-full h-full object-contain object-left" />
              </div>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed max-w-sm">
              Trusted Authority. Vibrant Hope.<br /><br />
              Sepeda Amal Borneo 2026 (SAB2026) is a premier 660KM charity cycling event across Borneo, from Kota Kinabalu (Sabah) to Miri (Sarawak).
              Organized by the Malaysian Medical Association Foundation (MMAF) to fund life-saving paediatric surgeries and support children with Primary Immunodeficiencies (PID).
            </p>
            <div className="flex flex-row gap-4 items-center">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img
                  src="/assets/logos/MAPS%20Logo.png"
                  alt="MAPS"
                  className="h-8 w-auto object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img
                  src="/assets/logos/MyPOPI-1.png"
                  alt="MyPOPI"
                  className="h-8 w-auto object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 font-heading">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/mission" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">The Mission</Link></li>
              <li><Link to="/ride" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">The Ride</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">Sponsorships</Link></li>
              <li><Link to="/faq" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* 3. LEGAL & TRUST */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 font-heading">Legal & Trust</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="text-sm font-medium text-brand-pale hover:text-brand-cyan transition-colors">Refund Policy</Link></li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                <span className="text-sm text-brand-pale">Tax Exempt: LHDN.01/35/42/51/179-6.5621</span>
              </li>
              <li className="text-sm text-brand-pale opacity-60">MMAF Reg: PPM-001-14-14022019</li>
            </ul>
          </div>

          {/* 4. SOCIALS */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 font-heading">Connect</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/sepedaamalborneo" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/sepedaamalborneo" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-8 text-xs text-brand-slate leading-relaxed">
              Every pedal stroke brings hope to a child in need. Join the movement.
            </p>
          </div>

        </div>

        {/* COPYRIGHT BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <p className="text-[10px] font-bold text-brand-slate uppercase tracking-widest text-center md:text-left">
              &copy; 2026 Sepeda Amal Borneo. Organized by MMA Foundation.
            </p>
            <div className="hidden md:flex items-center gap-2 text-brand-cyan/60">
              <span className="h-1 w-1 bg-brand-cyan rounded-full"></span>
              <Bike className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">Powered by Cyclists</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-slate">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;