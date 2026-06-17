import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { Key, Save, Eye, EyeOff, Plus } from 'lucide-react';

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

  const handleUpdate = async (key: string, value: string, secret: boolean) => {
    if (!token) return;
    try {
      await updateSetting({ token, key, value, isSecret: secret });
      alert(`Saved ${key}`);
      // Clear editing state for this key
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
          <p className="text-brand-slate font-medium text-sm">Manage API keys and global configurations.</p>
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

          {/* Cycled KM Override (Home Page stats) */}
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

          {/* Charities Count (Home Page stats) */}
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

          {/* Synced Registered Cyclists (Read-only status) */}
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
                placeholder="e.g. hitpay_api_key"
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
