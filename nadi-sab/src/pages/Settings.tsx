import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { Key, Save, Eye, EyeOff, Plus, Mail, Send, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// ── Email template metadata ───────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: 'thank_you',
    emoji: '✅',
    name: 'Donor Thank You — Online (HitPay)',
    subject: '✅ Donation Confirmed — RM {amount} | SAB2026 (Ref: {ref})',
    audience: 'Donor',
    trigger: 'Fired automatically when HitPay webhook confirms a successful payment.',
    description: 'Sent to the donor immediately after an online HitPay donation is confirmed. Includes the donation amount, reference ID, and a message about the upcoming tax-exemption receipt.',
    color: 'from-emerald-950 to-emerald-900',
    accent: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'manual_submitted',
    emoji: '⏳',
    name: 'Manual Donation — Submission Received',
    subject: '⏳ Manual Donation Received — RM {amount} | SAB2026 (Ref: {ref})',
    audience: 'Donor',
    trigger: 'Fired when a donor submits a manual bank transfer via the donate form.',
    description: 'Sent to confirm receipt of the donor\'s bank transfer details. Explains next steps — making the transfer to UOB Malaysia and sending proof to the admin team for verification.',
    color: 'from-amber-950 to-amber-900',
    accent: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'manual_approved',
    emoji: '🎉',
    name: 'Manual Donation — Approved',
    subject: '✅ Bank Transfer Approved — RM {amount} | SAB2026 Thank You!',
    audience: 'Donor',
    trigger: 'Fired when an admin clicks "Approve" on a pending manual donation.',
    description: 'Confirms to the donor that their bank transfer has been verified and counted in the fundraising total. Informs them a tax-exemption receipt will follow within 3–5 working days.',
    color: 'from-sky-950 to-sky-900',
    accent: 'text-sky-300',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 'admin_hitpay',
    emoji: '💳',
    name: 'Admin Alert — New HitPay Donation',
    subject: '[SAB2026] 💳 New HitPay Donation — RM {amount} from {name}',
    audience: 'Admin',
    trigger: 'Fired simultaneously with Template 1, sent to admin list.',
    description: 'Internal admin notification of a confirmed online donation. Shows donor name, email, amount, and HitPay reference. No action required — the donation is recorded automatically.',
    color: 'from-violet-955 to-violet-900',
    accent: 'text-violet-300',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  {
    id: 'admin_manual',
    emoji: '⚠️',
    name: 'Admin Alert — Manual Transfer Pending',
    subject: '[SAB2026] ⚠️ Manual Transfer Pending — RM {amount} from {name}',
    audience: 'Admin',
    trigger: 'Fired simultaneously with Template 2, sent to admin list.',
    description: 'Internal admin alert requiring action. Includes donor name, phone/WhatsApp, reference, and amount. Provides a direct WhatsApp link and a link to the admin donations dashboard.',
    color: 'from-rose-955 to-rose-900',
    accent: 'text-rose-300',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    id: 'receipt_request',
    emoji: '🧾',
    name: 'Admin Alert — Tax Receipt Requested',
    subject: '[SAB2026] Tax Receipt Request — {name} | {amount}',
    audience: 'Admin',
    trigger: 'Fired when a donor requests a tax receipt on the thank you page.',
    description: 'Sent to the administrators to notify them of a new tax receipt request. Contains all required fields (NRIC, company reg. no., address) for LHDN.',
    color: 'from-cyan-950 to-cyan-900',
    accent: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'receipt_reminder',
    emoji: '⏰',
    name: 'Admin Alert — Weekly Outstanding Receipts',
    subject: '[SAB2026] REMINDER — {count} outstanding tax receipts',
    audience: 'Admin',
    trigger: 'Fired weekly via cron on Monday 9 AM if there are pending tax receipts.',
    description: 'Sent to administrators summarizing all outstanding receipt requests that have not been marked as Sent in the dashboard.',
    color: 'from-orange-950 to-orange-900',
    accent: 'text-orange-300',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  },
];

// ── Collapsible template card ─────────────────────────────────────────────────

function TemplateCard({
  template,
  token,
  savedSubject,
  onSaveSubject,
  savedBody,
  onSaveBody,
  savedTemplateId,
  onSaveTemplateId,
}: {
  template: typeof EMAIL_TEMPLATES[number];
  token: string;
  savedSubject: string;
  onSaveSubject: (val: string) => Promise<void>;
  savedBody: string;
  onSaveBody: (val: string) => Promise<void>;
  savedTemplateId: string;
  onSaveTemplateId: (val: string) => Promise<void>;
}) {
  const [expanded, setExpanded]     = useState(false);
  const [testEmail, setTestEmail]   = useState('');
  const [sending, setSending]       = useState(false);
  const [status, setStatus]         = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]     = useState('');

  const [subjectInput, setSubjectInput] = useState(savedSubject || template.subject);
  const [bodyInput, setBodyInput]       = useState(savedBody || '');
  const [templateIdInput, setTemplateIdInput] = useState(savedTemplateId || '');
  const [savingSubject, setSavingSubject] = useState(false);
  const [savingBody, setSavingBody]       = useState(false);
  const [savingTemplateId, setSavingTemplateId] = useState(false);

  useEffect(() => {
    setSubjectInput(savedSubject || template.subject);
  }, [savedSubject, template.subject]);

  useEffect(() => {
    setBodyInput(savedBody || '');
  }, [savedBody]);

  useEffect(() => {
    setTemplateIdInput(savedTemplateId || '');
  }, [savedTemplateId]);

  const sendTest = useAction(api.email.sendTestEmail);

  const handleSendTest = async () => {
    if (!testEmail.trim()) return;
    setSending(true);
    setStatus('idle');
    try {
      await sendTest({ token, templateId: template.id, toEmail: testEmail.trim() });
      setStatus('success');
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message || 'Unknown error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${template.color} border border-white/10 overflow-hidden`}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-2xl shrink-0">{template.emoji}</span>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-black text-sm">{template.name}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${template.badge}`}>
              {template.audience}
            </span>
          </div>
          <p className={`text-[11px] mt-0.5 font-medium ${template.accent} truncate opacity-70`}>
            {template.trigger}
          </p>
        </div>
        {expanded
          ? <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
          : <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
        }
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-white/10 pt-4 text-white">
          {/* Enginemailer Template ID */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 flex justify-between items-center">
              <span>Enginemailer Template ID (Optional)</span>
              {savedTemplateId && <span className="text-emerald-400 font-bold">Configured</span>}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={templateIdInput}
                onChange={e => setTemplateIdInput(e.target.value)}
                placeholder="e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-xs font-bold placeholder-white/30 focus:border-white/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={async () => {
                  setSavingTemplateId(true);
                  try {
                    await onSaveTemplateId(templateIdInput);
                  } finally {
                    setSavingTemplateId(false);
                  }
                }}
                disabled={savingTemplateId}
                className="h-10 px-4 bg-brand-cyan hover:bg-brand-orange disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Save className="h-4 w-4" />
                {savingTemplateId ? 'Saving…' : 'Save ID'}
              </button>
            </div>
            <p className="text-[9px] text-white/30 mt-1.5 italic font-medium">
              If provided, EngineMailer will send using the template designed in your portal. Subject and body fields below will be ignored.
            </p>
          </div>

          {/* Subject line editor */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 flex justify-between items-center">
              <span>Subject Line</span>
              {savedSubject && <span className="text-emerald-400 font-bold">Customized</span>}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-xs font-bold placeholder-white/30 focus:border-white/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={async () => {
                  setSavingSubject(true);
                  try {
                    await onSaveSubject(subjectInput);
                  } finally {
                    setSavingSubject(false);
                  }
                }}
                disabled={savingSubject}
                className="h-10 px-4 bg-brand-cyan hover:bg-brand-orange disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Save className="h-4 w-4" />
                {savingSubject ? 'Saving…' : 'Save'}
              </button>
            </div>
            <p className="text-[9px] text-white/30 mt-1.5 italic font-medium">
              Placeholders: {template.id === 'receipt_reminder' ? '{count}' : '{amount}, {ref}, {name}'}
            </p>
          </div>

          {/* Body text override */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 flex justify-between items-center">
              <span>Main Body Text Override (Optional)</span>
              {savedBody && <span className="text-emerald-400 font-bold">Customized</span>}
            </p>
            <textarea
              value={bodyInput}
              onChange={e => setBodyInput(e.target.value)}
              rows={3}
              placeholder="Enter custom paragraphs or text. Leave blank to default back to original template message."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-xs font-medium placeholder-white/30 focus:border-white/50 outline-none transition-colors resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={async () => {
                  setSavingBody(true);
                  try {
                    await onSaveBody(bodyInput);
                  } finally {
                    setSavingBody(false);
                  }
                }}
                disabled={savingBody}
                className="h-9 px-4 bg-brand-cyan hover:bg-brand-orange disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                {savingBody ? 'Saving…' : 'Save Body Override'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-black/10 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">What It Does</p>
            <p className="text-xs text-white/70 leading-relaxed">{template.description}</p>
          </div>

          {/* Send test email */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
              🧪 Send Test Email
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={e => { setTestEmail(e.target.value); setStatus('idle'); }}
                placeholder="your@email.com"
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-xs font-bold placeholder-white/30 focus:border-white/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sending || !testEmail.trim()}
                className="h-10 px-4 bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {sending
                  ? <Loader className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />
                }
                {sending ? 'Sending…' : 'Send Test'}
              </button>
            </div>

            {/* Status feedback */}
            {status === 'success' && (
              <div className="flex items-center gap-2 mt-2 text-emerald-300 text-xs font-bold">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Test email sent to {testEmail} — check your inbox!
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-start gap-2 mt-2 text-rose-300 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Settings page ────────────────────────────────────────────────────────

export default function Settings() {
  const { token } = useAuth();
  const settings = useQuery(api.admin.getSettings, token ? { token } : 'skip');
  const updateSetting = useMutation(api.admin.updateSetting);
  const cyclists = useQuery(api.cyclists.listAll) || [];

  const cyclistCount = useMemo(() => {
    return cyclists.filter((c: any) => !c.isArchived && (c.role || 'Cyclist') === 'Cyclist').length;
  }, [cyclists]);

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  if (settings === undefined) {
    return <div className="text-brand-slate font-bold animate-pulse">Loading settings...</div>;
  }

  const enginemailerConfigured = settings.some(s => s.key === 'enginemailer_api_key' && s.value);

  const handleUpdate = async (key: string, value: string, secret: boolean) => {
    if (!token) return;
    try {
      await updateSetting({ token, key, value, isSecret: secret });
      alert(`Saved ${key}`);
      setEditingValues(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e) {
      alert("Failed to update setting");
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newKey.trim()) return;
    try {
      await updateSetting({ token, key: newKey.trim(), value: newValue.trim(), isSecret });
      setNewKey('');
      setNewValue('');
      setIsSecret(false);
    } catch (e) {
      alert("Failed to add setting");
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-cyan">
          <Key className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-heading text-brand-navy">System Settings</h1>
          <p className="text-brand-slate font-medium text-sm">Manage API keys, email templates, and global configurations.</p>
        </div>
      </div>

      {/* ── PINNED CONTROL CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Card 1: Raised Amount */}
        <div className="bg-gradient-to-br from-brand-navy to-brand-slate rounded-3xl p-6 border border-white/10 shadow-xl">
          <p className="text-brand-cyan font-black text-xs uppercase tracking-widest mb-1">💰 Amount Raised (Manual Override)</p>
          <p className="text-white font-black text-xl font-heading mb-1">
            {settings.find(s => s.key === 'raised_amount')?.value
              ? `RM ${parseFloat(settings.find(s => s.key === 'raised_amount')!.value).toLocaleString()}`
              : 'Auto from donations DB'}
          </p>
          <p className="text-white/40 text-xs mb-4">Overrides the live donation total on the thermometer. Leave blank to use live data.</p>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="e.g. 1500000" id="raised-input"
              className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none" />
            <button onClick={async () => {
              const input = document.getElementById('raised-input') as HTMLInputElement;
              if (!token) return;
              await updateSetting({ token, key: 'raised_amount', value: input.value, isSecret: false });
              input.value = ''; alert('Raised amount updated!');
            }} className="h-10 px-4 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Card 2: Donation Goal */}
        <div className="bg-gradient-to-br from-brand-navy to-brand-slate rounded-3xl p-6 border border-white/10 shadow-xl">
          <p className="text-brand-cyan font-black text-xs uppercase tracking-widest mb-1">📊 Fundraising Goal (Thermometer Target)</p>
          <p className="text-white font-black text-xl font-heading mb-1">
            {settings.find(s => s.key === 'donation_goal')?.value
              ? `RM ${parseFloat(settings.find(s => s.key === 'donation_goal')!.value).toLocaleString()}`
              : 'Not set — defaults to RM 2,000,000'}
          </p>
          <p className="text-white/40 text-xs mb-4">Controls the 100% target on the public homepage thermometer.</p>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="e.g. 2000000" id="goal-quick-input"
              className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none" />
            <button onClick={async () => {
              const input = document.getElementById('goal-quick-input') as HTMLInputElement;
              if (!token || !input.value) return;
              await updateSetting({ token, key: 'donation_goal', value: input.value, isSecret: false });
              input.value = ''; alert('Goal updated!');
            }} className="h-10 px-4 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* ── RIDE STATISTICS & EVENT SETTINGS ── */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-slate rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
        <p className="text-brand-orange font-black text-xs uppercase tracking-widest mb-4">🚴 Ride Statistics & Event Settings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Date */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Event Date</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'ride.event_date')?.value || '26 July - 31 July 2026'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 26 July - 31 July 2026" id="event-date-input"
                defaultValue={settings.find(s => s.key === 'ride.event_date')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('event-date-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'ride.event_date', value: input.value, isSecret: false });
                alert('Event date updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Ride Days */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Ride Days</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'ride.days')?.value || '6'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 6" id="ride-days-input"
                defaultValue={settings.find(s => s.key === 'ride.days')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('ride-days-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'ride.days', value: input.value, isSecret: false });
                alert('Ride days updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Ride Distance */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Ride Distance</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'ride.distance')?.value || '680 KM'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 680 KM" id="ride-distance-input"
                defaultValue={settings.find(s => s.key === 'ride.distance')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('ride-distance-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'ride.distance', value: input.value, isSecret: false });
                alert('Ride distance updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Ride Territories */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Ride Territories</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'ride.territories')?.value || '4'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 4" id="ride-territories-input"
                defaultValue={settings.find(s => s.key === 'ride.territories')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('ride-territories-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'ride.territories', value: input.value, isSecret: false });
                alert('Ride territories updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Cycled KM Override */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Cycled KM Override (Home Page Stats Strip)</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'home.stats_cycled_value')?.value || '3,900 KM'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 3,900 KM" id="cycled-override-input"
                defaultValue={settings.find(s => s.key === 'home.stats_cycled_value')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('cycled-override-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'home.stats_cycled_value', value: input.value, isSecret: false });
                alert('Cycled KM override updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Charities Count */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Charities Count (Home Page Stats Strip)</p>
            <p className="text-white font-bold text-sm mb-2">
              Current: {settings.find(s => s.key === 'home.stats_charities_value')?.value || '5'}
            </p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="e.g. 5" id="charities-count-input"
                defaultValue={settings.find(s => s.key === 'home.stats_charities_value')?.value || ''}
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0" />
              <button onClick={async () => {
                const input = document.getElementById('charities-count-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'home.stats_charities_value', value: input.value, isSecret: false });
                alert('Charities count updated!');
              }} className="h-10 px-3 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Synced Registered Cyclists */}
          <div className="md:col-span-2 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-brand-cyan font-black text-xs uppercase tracking-widest mb-1">🚴 Synced Cyclists Count</p>
              <p className="text-white/60 text-xs">Automatically synced from active registered cyclists in the database (role = "Cyclist").</p>
            </div>
            <div className="bg-brand-cyan/20 border border-brand-cyan/40 rounded-2xl px-6 py-3 text-center sm:text-right shrink-0">
              <span className="text-brand-cyan font-black text-3xl font-heading block">{cyclistCount}</span>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-bold">Active Cyclists</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FUNDRAISING PROGRESS BAR TOGGLE ── */}
      <div className="bg-gradient-to-br from-violet-900 to-violet-800 rounded-3xl p-6 mb-8 border border-violet-500/20 shadow-xl">
        <p className="text-violet-300 font-black text-xs uppercase tracking-widest mb-1">📊 Fundraising Progress Bar</p>
        <p className="text-white font-black text-xl font-heading mb-1">
          {(() => {
            const val = settings.find(s => s.key === 'show_fundraising_progress')?.value;
            return val === 'false' ? '🔴 Hidden (OFF)' : '🟢 Visible (ON)';
          })()}
        </p>
        <p className="text-white/40 text-xs mb-4">
          Controls whether the Raised vs Goal progress bar is shown on each cyclist's card (Home, Ride, Profile pages).
          Turn OFF to hide fundraising totals from the public.
        </p>
        <div className="flex gap-3">
          {(['true', 'false'] as const).map(val => {
            const current = settings.find(s => s.key === 'show_fundraising_progress')?.value ?? 'true';
            const isActive = current === val;
            return (
              <button
                key={val}
                onClick={async () => {
                  if (!token) return;
                  await updateSetting({ token, key: 'show_fundraising_progress', value: val, isSecret: false });
                }}
                className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                  isActive
                    ? val === 'false' ? 'bg-red-500 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/40 hover:bg-white/20'
                }`}
              >
                {val === 'true' ? '✅ Show (ON)' : '🔴 Hide (OFF)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 3: Registration Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-8 border border-white/10 shadow-xl">
        <p className="text-brand-orange font-black text-xs uppercase tracking-widest mb-4">🚴 Cyclist Registration Settings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status toggle */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Registration Status</p>
            <div className="flex gap-3">
              {['open', 'full'].map(status => {
                const current = settings.find(s => s.key === 'registration_status')?.value || 'open';
                const isActive = current === status;
                return (
                  <button key={status} onClick={async () => {
                    if (!token) return;
                    await updateSetting({ token, key: 'registration_status', value: status, isSecret: false });
                  }}
                    className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                      isActive
                        ? status === 'full' ? 'bg-red-500 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg'
                        : 'bg-white/10 text-white/40 hover:bg-white/20'
                    }`}>
                    {status === 'open' ? '✅ Open' : '🔒 Full'}
                  </button>
                );
              })}
            </div>
            <p className="text-white/30 text-xs mt-2">Controls what users see when they click "Register to Ride".</p>
          </div>
          {/* Form URL */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Google Form URL</p>
            <div className="flex items-center gap-2">
              <input
                type="url"
                id="form-url-input"
                defaultValue={settings.find(s => s.key === 'registration_form_url')?.value || ''}
                placeholder="https://docs.google.com/forms/..."
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:border-brand-cyan outline-none min-w-0"
              />
              <button onClick={async () => {
                const input = document.getElementById('form-url-input') as HTMLInputElement;
                if (!token) return;
                await updateSetting({ token, key: 'registration_form_url', value: input.value, isSecret: false });
                alert('Form URL saved!');
              }} className="h-10 px-4 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-orange transition-colors flex items-center gap-2 whitespace-nowrap">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
            <p className="text-white/30 text-xs mt-2">Shown as a button when registration is Open. Ignored when Full.</p>
          </div>
        </div>
      </div>

      {/* ── EMAIL TEMPLATES ── */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-brand-navy">📧 Email Templates</h2>
            <p className="text-brand-slate text-xs font-medium">
              5 transactional emails sent via EngineMailer API — click any card to expand and send a test.
            </p>
          </div>
          {/* API key status badge */}
          <div className="ml-auto shrink-0">
            {enginemailerConfigured ? (
              <span className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
                <CheckCircle className="h-3 w-3" /> API Key Set
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-widest">
                <AlertCircle className="h-3 w-3" /> No API Key
              </span>
            )}
          </div>
        </div>

        {/* API key warning */}
        {!enginemailerConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4">
            <p className="text-sm font-black text-amber-800 mb-1">⚠️ EngineMailer API Key Not Configured</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Emails will be silently skipped until you set <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">ENGINEMAILER_API_KEY</code> in your{' '}
              <strong>Convex Dashboard → Settings → Environment Variables</strong>.
              You can also save the key below under <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">enginemailer_api_key</code> for reference.
            </p>
          </div>
        )}

        {/* Sender info strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 mb-4 flex flex-wrap gap-6 text-xs">
          <div>
            <span className="font-black text-slate-400 uppercase tracking-widest">Sender</span>
            <p className="font-bold text-brand-navy mt-0.5">SAB2026 — MMA Foundation</p>
          </div>
          <div>
            <span className="font-black text-slate-400 uppercase tracking-widest">From</span>
            <p className="font-bold text-brand-navy mt-0.5">mmafoundation1976@gmail.com</p>
          </div>
          <div>
            <span className="font-black text-slate-400 uppercase tracking-widest">Admin Inbox</span>
            <p className="font-bold text-brand-navy mt-0.5">sab2026@mma.org.my</p>
          </div>
          <div>
            <span className="font-black text-slate-400 uppercase tracking-widest">Provider</span>
            <p className="font-bold text-brand-navy mt-0.5">EngineMailer REST API V2</p>
          </div>
        </div>

        {/* Template cards */}
        <div className="space-y-3">
          {token && EMAIL_TEMPLATES.map(template => {
            const subjectKey = `email_subject_${template.id}`;
            const bodyKey = `email_body_${template.id}`;
            const templateIdKey = `email_template_id_${template.id}`;
            const savedSubject = settings?.find(s => s.key === subjectKey)?.value || '';
            const savedBody = settings?.find(s => s.key === bodyKey)?.value || '';
            const savedTemplateId = settings?.find(s => s.key === templateIdKey)?.value || '';

            return (
              <TemplateCard 
                key={template.id} 
                template={template} 
                token={token} 
                savedSubject={savedSubject}
                savedBody={savedBody}
                onSaveSubject={async (val) => handleUpdate(subjectKey, val, false)}
                onSaveBody={async (val) => handleUpdate(bodyKey, val, false)}
                savedTemplateId={savedTemplateId}
                onSaveTemplateId={async (val) => handleUpdate(templateIdKey, val, false)}
              />
            );
          })}
        </div>
      </div>

      {/* ── CURRENT CONFIGURATIONS ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-black uppercase tracking-widest text-brand-navy">Current Configurations</h2>
        </div>
        <div className="p-6 space-y-6">
          {settings.length === 0 ? (
            <p className="text-slate-400 font-medium text-sm">No settings found. Add one below.</p>
          ) : (
            settings.map((s) => {
              const isEditing = editingValues[s.key] !== undefined;
              const currentValue = isEditing ? editingValues[s.key] : s.value;

              return (
                <div key={s._id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="md:w-1/3">
                    <p className="font-bold text-brand-navy text-sm">{s.key}</p>
                    {s.isSecret && <span className="text-[10px] font-black bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded uppercase tracking-widest mt-1 inline-block">Secret</span>}
                  </div>

                  <div className="flex-grow flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type={s.isSecret && !showSecret[s.key] ? "password" : "text"}
                        value={currentValue}
                        onChange={(e) => setEditingValues({ ...editingValues, [s.key]: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-brand-cyan outline-none transition-all"
                      />
                      {s.isSecret && (
                        <button
                          onClick={() => setShowSecret({ ...showSecret, [s.key]: !showSecret[s.key] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy transition-colors"
                        >
                          {showSecret[s.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleUpdate(s.key, currentValue, s.isSecret)}
                        className="h-10 px-4 bg-brand-cyan text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-navy transition-colors flex flex-shrink-0 items-center gap-2"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── ADD NEW SETTING ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-black uppercase tracking-widest text-brand-navy">Add New Setting</h2>
        </div>
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Name</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. enginemailer_api_key"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-brand-cyan outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-brand-cyan outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan"
              />
              <span className="text-sm font-bold text-slate-500 group-hover:text-brand-navy">Mark as Secret (Password mask)</span>
            </label>
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-md"
            >
              <Plus className="h-4 w-4" /> Add Key
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
