import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { Key, Save, Eye, EyeOff, Plus } from 'lucide-react';

export default function Settings() {
  const { token } = useAuth();
  const settings = useQuery(api.admin.getSettings, token ? { token } : 'skip');
  const updateSetting = useMutation(api.admin.updateSetting);

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
