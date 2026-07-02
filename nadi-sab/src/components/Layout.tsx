import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Home, Settings, LogOut, Menu, X, Users, Map, Globe, Heart, DollarSign, Newspaper } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/cyclists', icon: Users, label: 'Cyclist Profiles' },
    { to: '/ride', icon: Map, label: 'Route & Maps' },
    { to: '/impact-tiers', icon: Heart, label: 'Impact Tiers' },
    { to: '/donations', icon: DollarSign, label: 'Donations' },
    { to: '/press-releases', icon: Newspaper, label: 'Press Releases' },
    { to: '/translations', icon: Globe, label: 'Translations' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavList = ({ onSelect }: { onSelect?: () => void }) => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onSelect}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive ? 'bg-brand-cyan text-brand-navy' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen bg-brand-pale">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black font-heading tracking-tight text-white">NADI<span className="text-brand-cyan">-SAB</span></h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavList />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors font-bold rounded-xl hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          {/* Drawer panel */}
          <div className="relative w-72 bg-brand-navy text-white flex flex-col h-full shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h1 className="text-xl font-black font-heading text-white">NADI<span className="text-brand-cyan">-SAB</span></h1>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              <NavList onSelect={() => setMobileOpen(false)} />
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors font-bold rounded-xl hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-brand-navy text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-black font-heading">NADI-SAB</h1>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-grow p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
