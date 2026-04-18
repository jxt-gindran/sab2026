import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Settings from './pages/Settings';

import Cyclists from './pages/Cyclists';
import MapCMS from './pages/MapCMS';
import Translations from './pages/Translations';
import ImpactTiersCMS from './pages/ImpactTiersCMS';
import Donations from './pages/Donations';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-brand-navy font-bold">Verifying access...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function DashboardHome() {
  const stats    = useQuery(api.donations.getStats);
  const cyclists = useQuery(api.cyclists.listAll) ?? [];

  const fmt = (n: number) =>
    `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleString('en-MY', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });

  if (!stats) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-3xl" />
        ))}
      </div>
    );
  }

  const pct = (n: number, total: number) =>
    total > 0 ? ((n / total) * 100).toFixed(1) : '0.0';

  const topCyclists = [...cyclists]
    .filter((c: any) => c.raised > 0)
    .sort((a: any, b: any) => b.raised - a.raised)
    .slice(0, 5);

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black font-heading text-brand-navy">Analytics Overview</h1>
        <p className="text-brand-slate mt-1 text-sm">Live fundraising data — refreshes automatically.</p>
      </div>

      {/* Pending Alert */}
      {(stats.pendingManual > 0 || stats.pendingOnline > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <p className="text-sm font-black text-amber-700">
            {stats.pendingManual > 0 && `${stats.pendingManual} manual donation${stats.pendingManual > 1 ? 's' : ''} awaiting approval`}
            {stats.pendingManual > 0 && stats.pendingOnline > 0 && ' · '}
            {stats.pendingOnline > 0 && `${stats.pendingOnline} abandoned online checkout${stats.pendingOnline > 1 ? 's' : ''} to void`}
            {' — '}
            <a href="/nadi-sab/donations" className="underline hover:text-amber-900">Go to Donations</a>
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fund Raised', value: fmt(stats.totalFund), sub: 'Online + Manual completed', color: 'text-brand-cyan', bg: 'bg-brand-navy' },
          { label: 'Online (HitPay)', value: fmt(stats.onlineTotal), sub: `${pct(stats.onlineTotal, stats.totalFund)}% of total`, color: 'text-sky-300', bg: 'bg-sky-900' },
          { label: 'Manual Transfer', value: fmt(stats.manualTotal), sub: `${pct(stats.manualTotal, stats.totalFund)}% of total`, color: 'text-amber-300', bg: 'bg-amber-900' },
          { label: 'Avg Donation', value: fmt(stats.avgDonation), sub: `${stats.completedCount} completed transaction${stats.completedCount !== 1 ? 's' : ''}`, color: 'text-green-300', bg: 'bg-green-900' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-2xl p-5 text-white relative overflow-hidden`}>
            <div className="absolute -top-4 -right-4 h-20 w-20 bg-white/5 rounded-full" />
            <div className={`text-[10px] font-black uppercase tracking-widest ${card.color} mb-2`}>{card.label}</div>
            <div className="text-2xl font-black font-heading">{card.value}</div>
            <div className="text-[10px] text-white/40 mt-1 font-bold">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 bg-slate-50">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-navy">Recent Donations</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentDonations.length === 0 && (
              <p className="text-center text-slate-300 text-sm font-bold py-8">No donations yet.</p>
            )}
            {stats.recentDonations.map((d: any) => (
              <div key={d._id} className="flex items-center gap-3 px-5 py-3">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                  d.status === 'completed' ? 'bg-green-400' :
                  d.status === 'pending'   ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                <div className="flex-grow min-w-0">
                  <div className="text-sm font-black text-brand-navy truncate">{d.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{fmtDate(d.timestamp)} · {d.type === 'hitpay' ? 'Online' : 'Manual'}</div>
                </div>
                <div className={`text-sm font-black whitespace-nowrap ${d.status === 'completed' ? 'text-brand-navy' : 'text-slate-300'}`}>
                  {fmt(d.amount)}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <a href="/nadi-sab/donations" className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:text-brand-orange transition-colors">
              View all donations →
            </a>
          </div>
        </div>

        {/* Cyclist Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 bg-slate-50">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-navy">Cyclist Fundraising</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {topCyclists.length === 0 && (
              <p className="text-center text-slate-300 text-sm font-bold py-8">No cyclist donations yet.</p>
            )}
            {topCyclists.map((c: any, i: number) => {
              const pctRaised = Math.min((c.raised / c.goal) * 100, 100);
              return (
                <div key={c._id} className="px-5 py-3">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-black text-slate-300 w-4">{i + 1}</span>
                    {c.profileUrl && (
                      <img src={c.profileUrl} alt={c.name} className="h-7 w-7 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-grow min-w-0">
                      <div className="text-sm font-black text-brand-navy truncate">{c.name}</div>
                    </div>
                    <div className="text-sm font-black text-brand-orange whitespace-nowrap">{fmt(c.raised)}</div>
                  </div>
                  <div className="ml-7 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-orange transition-all"
                      style={{ width: `${pctRaised}%` }}
                    />
                  </div>
                  <div className="ml-7 text-[9px] text-slate-300 font-bold mt-0.5">
                    {pctRaised.toFixed(0)}% of RM {c.goal.toLocaleString()} goal
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <a href="/nadi-sab/cyclists" className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:text-brand-orange transition-colors">
              Manage cyclists →
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename="/nadi-sab">
        <div className="min-h-screen font-sans text-brand-slate">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />

              <Route path="cyclists" element={<Cyclists />} />
              <Route path="ride" element={<MapCMS />} />
              <Route path="translations" element={<Translations />} />
              <Route path="impact-tiers" element={<ImpactTiersCMS />} />
              <Route path="donations" element={<Donations />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
