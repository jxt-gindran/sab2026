import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Home, Settings, FileText, LogOut, Menu, Users } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/content', icon: FileText, label: 'Content CMS' },
    { to: '/cyclists', icon: Users, label: 'Cyclist Profiles' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-pale">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black font-heading tracking-tight text-white">NADI<span className="text-brand-cyan">-SAB</span></h1>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-brand-navy text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-black font-heading">NADI-SAB</h1>
          <button className="p-2"><Menu className="h-6 w-6" /></button>
        </header>

        <div className="flex-grow p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
