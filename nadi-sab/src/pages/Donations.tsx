import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { CheckCircle2, XCircle, Clock, Globe, CreditCard, TrendingUp, AlertTriangle, Info } from 'lucide-react';

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
  failed:    { label: 'Voided / Failed', className: 'bg-red-100 text-red-600', icon: XCircle },
};

type FilterType = 'all' | 'pending' | 'completed' | 'hitpay' | 'manual';

export default function Donations() {
  const { token } = useAuth();
  const breakdown    = useQuery(api.donations.getDonationBreakdown);
  const allDonations = useQuery(api.donations.listAll) ?? [];
  const updateStatus = useMutation(api.donations.updateStatus);

  const [updatingId,    setUpdatingId]    = useState<string | null>(null);
  const [bulkVoiding,   setBulkVoiding]   = useState(false);
  const [filter,        setFilter]        = useState<FilterType>('all');
  const [showPendingInfo, setShowPendingInfo] = useState(true);

  // Counts for filter badges
  const pendingOnline = allDonations.filter((d: any) => d.status === 'pending' && d.type === 'hitpay').length;
  const pendingManual = allDonations.filter((d: any) => d.status === 'pending' && d.type === 'manual').length;
  const pendingTotal  = pendingOnline + pendingManual;

  const handleStatus = async (id: string, status: string) => {
    if (!token) return;
    setUpdatingId(id);
    try {
      await updateStatus({ token, id: id as any, status });
    } finally {
      setUpdatingId(null);
    }
  };

  // Void ALL pending HitPay donations in one click
  const handleBulkVoidOnline = async () => {
    if (!token) return;
    if (!confirm(`Void all ${pendingOnline} pending Online (HitPay) donation${pendingOnline > 1 ? 's' : ''}?\n\nThese were never confirmed by HitPay — they are abandoned or failed checkouts. This cannot be undone.`)) return;
    setBulkVoiding(true);
    try {
      const toVoid = allDonations.filter((d: any) => d.status === 'pending' && d.type === 'hitpay');
      for (const d of toVoid) {
        await updateStatus({ token, id: d._id as any, status: 'failed' });
      }
    } finally {
      setBulkVoiding(false);
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

  const online = breakdown?.onlineTotal  ?? 0;
  const manual = breakdown?.manualTotal  ?? 0;
  const total  = breakdown?.totalFundRaised ?? 0;

  const FILTER_LABELS: Record<FilterType, string> = {
    all:       'All',
    pending:   'Pending',
    completed: 'Completed',
    hitpay:    'Online (HitPay)',
    manual:    'Manual Transfer',
  };

  return (
    <div className="animate-fade-in max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-brand-cyan" />
            Donations
          </h1>
          <p className="text-brand-slate mt-2">
            Fund Raised = <span className="font-black text-brand-cyan">Online (completed)</span>
            <span className="text-brand-slate mx-2">+</span>
            <span className="font-black text-brand-orange">Manual (admin-approved)</span>
          </p>
        </div>
        {pendingTotal > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-sm font-black text-amber-700">
              {pendingOnline > 0 && `${pendingOnline} online`}
              {pendingOnline > 0 && pendingManual > 0 && ' · '}
              {pendingManual > 0 && `${pendingManual} manual`}
              {' '}pending
            </span>
          </div>
        )}
      </div>

      {/* ── WHY ARE ONLINE DONATIONS PENDING? ── */}
      {pendingOnline > 0 && showPendingInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-grow min-w-0">
            <p className="text-sm font-black text-amber-800 mb-1">
              Why are Online (HitPay) donations showing as Pending?
            </p>
            <p className="text-xs text-amber-700 leading-relaxed mb-3">
              When a donor clicks <strong>"Proceed to Checkout"</strong>, a <em>pending</em> record is created immediately
              before they are redirected to HitPay. If the donor abandons the checkout, the payment fails,
              or HitPay's webhook does not fire, the record stays pending permanently.
              <br /><br />
              <strong>These pending online donations will NOT count towards Fund Raised</strong> — only
              webhook-confirmed <em>completed</em> donations do. You can safely void abandoned ones below.
            </p>
            {pendingOnline > 0 && (
              <button
                onClick={handleBulkVoidOnline}
                disabled={bulkVoiding}
                className="flex items-center gap-2 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-red-600 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {bulkVoiding
                  ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <XCircle className="h-4 w-4" />
                }
                Void All {pendingOnline} Pending Online Donation{pendingOnline > 1 ? 's' : ''}
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPendingInfo(false)}
            className="text-amber-400 hover:text-amber-600 transition-colors text-xs font-black shrink-0"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── HOW TO USE THIS PAGE ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-600 leading-relaxed">
          <strong>Online (HitPay):</strong> Auto-verified via webhook — no action needed unless voiding an abandoned checkout.
          {' '}<strong>Manual Transfer:</strong> Approve <CheckCircle2 className="inline h-3 w-3 text-green-500" /> to add to Fund Raised,
          or Reject <XCircle className="inline h-3 w-3 text-red-400" /> if payment not received.
          Use the filter tabs below to narrow by status or type.
        </p>
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
              <div className="text-[10px] opacity-60">HitPay — Webhook Confirmed</div>
            </div>
          </div>
          <div className="text-3xl font-black font-heading relative z-10">{fmt(online)}</div>
          <div className="text-xs opacity-70 mt-1 relative z-10">
            {breakdown?.count.online ?? 0} completed
            {pendingOnline > 0 && <span className="ml-2 opacity-60">· {pendingOnline} pending (not counted)</span>}
          </div>
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
              <div className="text-[10px] opacity-60">Bank Transfer — Admin Approved</div>
            </div>
          </div>
          <div className="text-3xl font-black font-heading relative z-10">{fmt(manual)}</div>
          <div className="text-xs opacity-70 mt-1 relative z-10">
            {breakdown?.count.manual ?? 0} approved
            {pendingManual > 0 && <span className="ml-2 opacity-60">· {pendingManual} awaiting approval</span>}
          </div>
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
            {(breakdown?.count.online ?? 0) + (breakdown?.count.manual ?? 0)} confirmed transactions
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'pending', 'completed', 'hitpay', 'manual'] as FilterType[]).map(f => {
          const count = f === 'pending'
            ? pendingTotal
            : f === 'hitpay'
            ? allDonations.filter((d: any) => d.type === 'hitpay').length
            : f === 'manual'
            ? allDonations.filter((d: any) => d.type === 'manual').length
            : f === 'completed'
            ? allDonations.filter((d: any) => d.status === 'completed').length
            : allDonations.length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${
                filter === f
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-navy border-brand-pale hover:border-brand-cyan'
              }`}
            >
              {FILTER_LABELS[f]}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
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

            // What actions are available?
            const isManualPending = d.type === 'manual' && d.status === 'pending';
            const isOnlinePending = d.type === 'hitpay' && d.status === 'pending';
            const hasAction = isManualPending || isOnlinePending;

            return (
              <div
                key={d._id}
                className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center transition-colors ${
                  d.status === 'pending' ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Donor Details */}
                <div className="min-w-0">
                  <div className="font-black text-brand-navy text-sm truncate">{d.name}</div>
                  <div className="text-xs text-slate-400 font-medium truncate">{d.email || '—'}</div>
                  {d.phone && <div className="text-xs text-slate-400 font-medium">{d.phone}</div>}
                  <div className="text-[10px] text-slate-300 mt-0.5">{formatDate(d.timestamp)}</div>
                  {d.paymentId && (
                    <div className="text-[10px] text-slate-300 truncate font-mono" title={d.paymentId}>
                      Ref: {d.paymentId.slice(0, 20)}{d.paymentId.length > 20 ? '…' : ''}
                    </div>
                  )}
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

                {/* Action */}
                <div className="flex gap-1 items-center">
                  {isUpdating && (
                    <div className="h-4 w-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  )}

                  {/* Manual pending: Approve ✓ or Reject ✗ */}
                  {!isUpdating && isManualPending && (
                    <>
                      <button
                        onClick={() => handleStatus(d._id, 'completed')}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-500 hover:text-white transition-all"
                        title="Approve — payment received, add to Fund Raised"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatus(d._id, 'failed')}
                        className="p-1.5 rounded-lg bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Reject — payment not received"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {/* Online pending: Void only (cannot approve — that's webhook's job) */}
                  {!isUpdating && isOnlinePending && (
                    <button
                      onClick={() => handleStatus(d._id, 'failed')}
                      className="p-1.5 rounded-lg bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Void — abandoned or failed HitPay checkout"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}

                  {/* No action available */}
                  {!isUpdating && !hasAction && (
                    <span className="text-slate-200 text-xs font-bold px-1">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-400 font-bold justify-center">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          Approve Manual = adds to Fund Raised
        </span>
        <span className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5 text-red-400" />
          Reject Manual / Void Online = excludes from total
        </span>
        <span className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-sky-500" />
          Online completions are automatic via HitPay webhook
        </span>
      </div>
    </div>
  );
}
