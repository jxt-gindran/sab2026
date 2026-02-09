import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Mission', path: '/mission' },
    { name: 'Our Legacy', path: '/legacy' },
    { name: 'The Ride', path: '/ride' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo / Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-4 group" onClick={() => setIsOpen(false)}>
            <div className="bg-brand-navy p-2.5 rounded-2xl shadow-xl shadow-brand-navy/10 group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 text-brand-cyan fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-brand-navy">SAB 2026</span>
              <span className="text-[9px] font-black text-brand-cyan uppercase tracking-[0.3em] leading-none">Borneo Charity</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-black transition-all duration-300 hover:text-brand-cyan uppercase tracking-widest ${isActive(link.path)
                      ? 'text-brand-cyan'
                      : 'text-brand-navy/60'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/donate"
                className="bg-brand-navy text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-navy/20 hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1 active:scale-95"
              >
                Get Involved
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-slate-50 rounded-2xl text-brand-navy"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-50 h-[calc(100vh-6rem)] animate-fade-in">
          <div className="px-6 py-10 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-5 rounded-3xl text-xl font-black transition-all ${isActive(link.path)
                    ? 'bg-brand-cyan/10 text-brand-cyan'
                    : 'text-brand-navy hover:bg-slate-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/donate"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-12 bg-brand-coral text-white py-6 rounded-3xl text-2xl font-black shadow-2xl"
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;