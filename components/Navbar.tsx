import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import RegistrationModal from './RegistrationModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Pages where the hero section is dark, allowing for a transparent navbar initially
  const isDarkHeroPage = ['/', '/mission', '/ride'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Mission', path: '/mission' },
    { name: 'Our Legacy', path: '/legacy' },
    { name: 'The Ride', path: '/ride' },
  ];

  // Dynamic Classes
  const navContainerClass = `fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled || !isDarkHeroPage
    ? 'bg-white/95 backdrop-blur-xl border-b border-brand-pale shadow-lg py-2'
    : 'bg-transparent border-b border-white/10 py-4'
    }`;

  const logoTextClass = isScrolled || !isDarkHeroPage ? 'text-brand-navy' : 'text-white';
  const navLinkClass = isScrolled || !isDarkHeroPage
    ? 'text-brand-navy/70 hover:text-brand-cyan'
    : 'text-white/90 hover:text-brand-cyan';

  const mobileMenuButtonClass = isScrolled || !isDarkHeroPage
    ? 'bg-brand-pale/20 text-brand-navy'
    : 'bg-white/20 text-white';

  return (
    <>
      <nav className={navContainerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo / Brand */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-5 group" onClick={() => window.scrollTo(0, 0)}>
              <div className="relative">
                <div className="h-20 w-20 bg-brand-navy rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                  <Heart className="absolute h-8 w-8 text-brand-cyan fill-current z-0" />
                  <img
                    src="/assets/logos/SAB%20Logo_%20Light.png"
                    alt="SAB"
                    className="absolute inset-0 h-full w-full object-contain z-10 p-1.5"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              </div>
              <div className={`flex flex-col border-l-2 pl-5 ${isScrolled || !isDarkHeroPage ? 'border-brand-pale' : 'border-white/30'}`}>
                <span className={`font-black text-2xl tracking-tighter leading-none ${logoTextClass}`}>SEPEDA AMAL</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-brand-cyan tracking-widest">BORNEO</span>
                  <span className="bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full">2026</span>
                </div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${navLinkClass}`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Secondary Action: Register (Ghost) */}
                <button
                  onClick={() => setIsRegOpen(true)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all hover:-translate-y-1 active:scale-95 ${isScrolled || !isDarkHeroPage
                    ? 'border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-brand-navy'
                    : 'border-white/50 text-white hover:bg-white hover:text-brand-navy'
                    }`}
                >
                  Register to Ride
                </button>

                {/* Primary Action: Donate (Solid) */}
                <Link
                  to="/donate"
                  className="bg-brand-orange text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-brand-cyan hover:text-brand-navy transition-all hover:-translate-y-1 active:scale-95"
                >
                  DONATE
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-colors ${mobileMenuButtonClass}`}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-brand-pale h-screen animate-fade-in fixed inset-0 top-20 z-40 overflow-y-auto">
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-5 py-4 rounded-2xl text-lg font-black text-brand-navy hover:bg-brand-pale/20 transition-all uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-8 space-y-4 border-t border-brand-pale mt-8">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsRegOpen(true);
                  }}
                  className="block w-full text-center py-4 rounded-2xl text-sm font-black border-2 border-brand-cyan text-brand-cyan uppercase tracking-widest"
                >
                  Register to Ride
                </button>

                <Link
                  to="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-brand-orange text-white py-5 rounded-2xl text-xl font-black shadow-xl uppercase tracking-widest"
                >
                  DONATE NOW
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <RegistrationModal isOpen={isRegOpen} onClose={() => setIsRegOpen(false)} />
    </>
  );
};

export default Navbar;