import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { CheckCircle2, XCircle, Clock, Globe, CreditCard, TrendingUp } from 'lucide-react';

function fmt(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_PILL: Record<string, { label: string; className: string; icon: React.FC<{ className?: string }> }> = {
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  pending:   { label: 'Pending',   className: 'bg-amber-100 text-amber-700',  icon: Clock },
  failed:    { label: 'Failed',    className: 'bg-red-100 text-red-600',      icon: XCircle },
};

export default function Donations() {
  const breakdown    = useQuery(api.donations.getDonationBreakdown);
  const allDonations = useQuery(api.donations.listAll) ?? [];
  const updateStatus = useMutation(api.donations.updateStatus);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'hitpay' | 'manual'>('all');

  const handleStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id: id as any, status });
    } finally {
      setUpdatingId(null);
    }
  };

  const visible = allDonations.filter((d: any) => {
    if (filter === 'all')       return true;
    if (filter === 'pending')   return d.status === 'pending';
    if (filter === 'completed') return d.status === 'completed';
    if (filter === 'hitpay')    return d.type === 'hitpay';
    if (filter === 'manual')    return d.type === 'manual';
    return true;
  });

  const online  = breakdown?.onlineTotal  ?? 0;
  const manual  = breakdown?.manualTotal  ?? 0;
  const total   = breakdown?.totalFundRaised ?? 0;
  const pending = allDonations.filter((d: any) => d.status === 'pending').length;

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-brand-cyan" />
            Donations
          </h1>
          <p className="text-brand-slate mt-2">
            Fund Raised Formula: <span className="font-black text-brand-navy">Online Donations + Manual Donations = Fund Raised</span>
          </p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-black text-amber-700">{pending} pending manual donation{pending > 1 ? 's' : ''} awaiting approval</span>
          </div>
        )}
      </div>

      {/* Fund Raised Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Online */}
        <div className="bg-gradient-to-br from-brand-cyan to-sky-400 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-white/10 rounded-full" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Online Donations</div>
              <div className="text-[10px] opacity-60">(HitPay — Auto Verified)</div>
            </div>
          </div>
          <div className="text-3xl font-black font-heading relative z-10">{fmt(online)}</div>
          <div className="text-xs opacity-70 mt-1 relative z-10">{breakdown?.count.online ?? 0} transaction{breakdown?.count.online !== 1 ? 's' : ''}</div>
        </div>

        {/* Manual */}
        <div className="bg-gradient-to-br from-brand-orange to-amber-400 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-white/10 rounded-full" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Manual Donations</div>
              <div className="text-[10px] opacity-60">(Bank Transfer — Admin Approved)</div>
            </div>
          </div>
          <div className="text-3xl font-black font-heading relative z-10">{fmt(manual)}</div>
          <div className="text-xs opacity-70 mt-1 relative z-10">{breakdown?.count.manual ?? 0} transaction{breakdown?.count.manual !== 1 ? 's' : ''}</div>
        </div>

        {/* Total */}
        <div className="bg-brand-navy rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-brand-cyan/20">
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-brand-cyan/10 rounded-full" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="h-10 w-10 bg-brand-cyan/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-brand-cyan" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">= Fund Raised</div>
              <div className="text-[10px] opacity-60">Online + Manual (completed only)</div>
            </div>
          </div>
          <div className="text-3xl font-black font-heading text-brand-cyan relative z-10">{fmt(total)}</div>
          <div className="text-xs text-white/50 mt-1 relative z-10">
            {(breakdown?.count.online ?? 0) + (breakdown?.count.manual ?? 0)} completed transactions
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'pending', 'completed', 'hitpay', 'manual'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
              filter === f
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-navy border-brand-pale hover:border-brand-cyan'
            }`}
          >
            {f === 'hitpay' ? 'Online (HitPay)' : f === 'manual' ? 'Manual Transfer' : f}
          </button>
        ))}
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-5 py-3 border-b border-slate-100 gap-4">
          <span>Donor / Details</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
          {visible.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold">No donations found matching filter.</div>
          )}
          {visible.map((d: any) => {
            const pill = STATUS_PILL[d.status] ?? STATUS_PILL['pending'];
            const PillIcon = pill.icon;
            const isUpdating = updatingId === d._id;

            return (
              <div key={d._id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-slate-50/50 transition-colors">
                {/* Donor Details */}
                <div className="min-w-0">
                  <div className="font-black text-brand-navy text-sm truncate">{d.name}</div>
                  <div className="text-xs text-slate-400 font-medium truncate">{d.email || '—'}</div>
                  {d.phone && <div className="text-xs text-slate-400 font-medium">{d.phone}</div>}
                  <div className="text-[10px] text-slate-300 mt-0.5">{formatDate(d.timestamp)}</div>
                </div>

                {/* Amount */}
                <div className="font-black text-brand-navy text-sm whitespace-nowrap">{fmt(d.amount)}</div>

                {/* Type Badge */}
                <div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    d.type === 'hitpay' ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {d.type === 'hitpay' ? 'Online' : 'Manual'}
                  </span>
                </div>

                {/* Status pill */}
                <div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${pill.className}`}>
                    <PillIcon className="h-3 w-3" />
                    {pill.label}
                  </span>
                </div>

                {/* Action — only for manual pending */}
                <div className="flex gap-1">
                  {d.type === 'manual' && d.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatus(d._id, 'completed')}
                        disabled={isUpdating}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase"
                        title="Approve — mark as completed"
                      >
                        {isUpdating ? (
                          <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleStatus(d._id, 'failed')}
                        disabled={isUpdating}
                        className="p-1.5 rounded-lg bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Reject — mark as failed"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {!(d.type === 'manual' && d.status === 'pending') && (
                    <span className="text-slate-200 text-xs font-bold">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4 font-bold">
        Approve manual donations to include them in the Fund Raised total on the public homepage.
        Online (HitPay) donations are auto-verified via webhook.
      </p>
    </div>
  );
}
