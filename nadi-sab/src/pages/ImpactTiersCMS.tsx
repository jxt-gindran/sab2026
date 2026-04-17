import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

type Charity = 'maps' | 'mypopi';

interface TierRow {
  _id?: string;
  charity: Charity;
  tier: number;
  title?: string;
  category?: string;
  description: string;
  isActive?: boolean;
  _dirty?: boolean;
  _isNew?: boolean;
}

const CHARITY_META: Record<Charity, { label: string; accent: string; fieldLabel: string }> = {
  maps:   { label: 'MAPS',   accent: 'brand-cyan',   fieldLabel: 'Title' },
  mypopi: { label: 'MyPOPI', accent: 'brand-orange',  fieldLabel: 'Category' },
};

export default function ImpactTiersCMS() {
  const allTiers = useQuery(api.impactTiers.listAll) ?? [];
  const upsert   = useMutation(api.impactTiers.upsert);
  const remove   = useMutation(api.impactTiers.remove);
  const seed     = useMutation(api.impactTiers.seedDefaults);

  const [activeTab, setActiveTab] = useState<Charity>('maps');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId,  setSavedId]  = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<TierRow>>>({});
  const [newRows,    setNewRows]    = useState<TierRow[]>([]);
  const [seeding,    setSeeding]    = useState(false);

  // Merge DB rows with local edits
  const rows = useMemo<TierRow[]>(() => {
    const dbRows = allTiers
      .filter((t) => t.charity === activeTab)
      .sort((a, b) => a.tier - b.tier)
      .map((t) => ({
        ...t,
        charity: t.charity as Charity,      // Convex returns string; narrow to Charity
        ...localEdits[t._id],
      } as TierRow));
    const addedRows = newRows.filter((r) => r.charity === activeTab);
    return [...dbRows, ...addedRows];
  }, [allTiers, localEdits, newRows, activeTab]);

  const getField = (row: TierRow) =>
    activeTab === 'maps' ? row.title ?? '' : row.category ?? '';

  const updateLocal = (id: string | undefined, key: string, val: unknown) => {
    if (!id) return;
    setLocalEdits((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  };

  const updateNew = (tmpId: string, key: string, val: unknown) => {
    setNewRows((prev) =>
      prev.map((r) => (r._id === tmpId ? { ...r, [key]: val } : r))
    );
  };

  const handleSave = async (row: TierRow) => {
    const id = row._id ?? undefined;
    setSavingId(id ?? 'new');
    try {
      await upsert({
        id: id as any,
        charity: row.charity,
        tier: row.tier,
        title: row.title,
        category: row.category,
        description: row.description,
        isActive: row.isActive ?? true,
      });
      // Clean up
      if (id) {
        setLocalEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
      } else {
        setNewRows((prev) => prev.filter((r) => r._id !== row._id));
      }
      setSavedId(id ?? 'new');
      setTimeout(() => setSavedId(null), 2000);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this impact tier? This cannot be undone.')) return;
    await remove({ id: id as any });
    setLocalEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const addNewRow = () => {
    const tmpId = 'new-' + Date.now();
    setNewRows((prev) => [
      ...prev,
      { _id: tmpId, charity: activeTab, tier: 0, title: '', category: '', description: '', isActive: true, _isNew: true },
    ]);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seed();
      alert(result.seeded
        ? `Seeded ${result.count} tiers successfully.`
        : `DB already has ${result.count} tiers — no seed needed.`);
    } finally {
      setSeeding(false);
    }
  };

  const renderRow = (row: TierRow) => {
    const id = row._id!;
    const isSaving = savingId === id;
    const isSaved  = savedId  === id;
    const meta = CHARITY_META[activeTab];
    const isDirty = !!(localEdits[id] && Object.keys(localEdits[id]).length) || !!row._isNew;

    return (
      <div
        key={id}
        className={`grid grid-cols-[80px_1fr_1fr_1fr_auto] gap-4 items-start px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isDirty ? 'bg-amber-50/40' : ''}`}
      >
        {/* Tier amount */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">RM Tier</label>
          <input
            type="number"
            value={row._isNew ? row.tier || '' : row.tier}
            onChange={(e) =>
              row._isNew
                ? updateNew(id, 'tier', parseInt(e.target.value) || 0)
                : updateLocal(id, 'tier', parseInt(e.target.value) || 0)
            }
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
          />
        </div>

        {/* Title / Category */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">{meta.fieldLabel}</label>
          <input
            type="text"
            value={getField(row)}
            onChange={(e) =>
              row._isNew
                ? updateNew(id, activeTab === 'maps' ? 'title' : 'category', e.target.value)
                : updateLocal(id, activeTab === 'maps' ? 'title' : 'category', e.target.value)
            }
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
          />
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Description</label>
          <textarea
            rows={3}
            value={row.description}
            onChange={(e) =>
              row._isNew
                ? updateNew(id, 'description', e.target.value)
                : updateLocal(id, 'description', e.target.value)
            }
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-brand-slate outline-none resize-none focus:border-brand-cyan"
          />
        </div>

        {/* Active toggle */}
        <div className="flex flex-col items-center gap-2 pt-5">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active</label>
          <button
            onClick={() =>
              row._isNew
                ? updateNew(id, 'isActive', !row.isActive)
                : updateLocal(id, 'isActive', !(row.isActive ?? true))
            }
            className={`w-10 h-6 rounded-full transition-colors ${(row.isActive ?? true) ? 'bg-brand-cyan' : 'bg-slate-200'}`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white shadow-sm mx-1 transition-transform ${(row.isActive ?? true) ? 'translate-x-4' : ''}`} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-5">
          {isSaving
            ? <div className="h-5 w-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
            : isSaved
            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
            : (
              <button
                onClick={() => handleSave(row)}
                className="p-1.5 rounded-lg bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy transition-all"
                title="Save"
              >
                <Save className="h-4 w-4" />
              </button>
            )
          }
          {!row._isNew && (
            <button
              onClick={() => handleDelete(id)}
              className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-brand-cyan" />
            Impact Tiers
          </h1>
          <p className="text-brand-slate mt-2">
            Manage MAPS and MyPOPI impact cards shown on the Donate page slider.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-slate-100 text-brand-slate px-4 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${seeding ? 'animate-spin' : ''}`} />
            Seed Defaults
          </button>
          <button
            onClick={addNewRow}
            className="flex items-center gap-2 bg-brand-cyan text-brand-navy px-5 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-navy hover:text-white transition-all shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add Tier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['maps', 'mypopi'] as Charity[]).map((c) => (
          <button
            key={c}
            onClick={() => setActiveTab(c)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border-2 transition-all ${
              activeTab === c
                ? c === 'maps'
                  ? 'bg-brand-cyan text-brand-navy border-brand-cyan'
                  : 'bg-brand-orange text-white border-brand-orange'
                : 'bg-white text-brand-navy border-brand-pale hover:border-brand-cyan'
            }`}
          >
            {CHARITY_META[c].label} ({allTiers.filter((t) => t.charity === c).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_auto] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-6 py-3 border-b border-slate-100 gap-4">
          <span>RM Tier</span>
          <span>{CHARITY_META[activeTab].fieldLabel}</span>
          <span>Description</span>
          <span>Active</span>
          <span />
        </div>

        <div className="divide-y divide-slate-50">
          {rows.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold">
              No tiers found. Add one above or click "Seed Defaults".
            </div>
          )}
          {rows.map(renderRow)}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4 font-bold">
        Changes are applied immediately. The donate page reflects updates in real-time.
      </p>
    </div>
  );
}
