import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, RefreshCw, Globe, ChevronUp } from 'lucide-react';

type Charity = 'maps' | 'mypopi';

// All language display names — kept in sync with Translations.tsx LANG_NAMES
const LANG_NAMES: Record<string, string> = {
  ms:    'Bahasa Melayu',
  zh:    '中文 (Simplified)',
  'zh-TW': '中文 (Traditional)',
  ar:    'Arabic (عربي)',
  ta:    'Tamil (தமிழ்)',
};
const getLangLabel = (code: string) => LANG_NAMES[code] || code.toUpperCase();

interface TierTranslation {
  title?: string;
  category?: string;
  description?: string;
}

interface TierRow {
  _id?: string;
  charity: Charity;
  tier: number;
  title?: string;
  category?: string;
  description: string;
  isActive?: boolean;
  translations?: Record<string, TierTranslation>;
  _isNew?: boolean;
}

const CHARITY_META: Record<Charity, { label: string; fieldLabel: string }> = {
  maps:   { label: 'MAPS',   fieldLabel: 'Title' },
  mypopi: { label: 'MyPOPI', fieldLabel: 'Category' },
};

// ── Translation sub-panel for a single tier ───────────────────────────────────
interface TranslationPanelProps {
  row: TierRow;
  activeTab: Charity;
  availableLangs: string[];   // ← now passed from parent (dynamic)
  onUpdate: (id: string, translations: Record<string, TierTranslation>) => void;
}
function TranslationPanel({ row, activeTab, availableLangs, onUpdate }: TranslationPanelProps) {
  const [activeLang, setActiveLang] = useState(availableLangs[0] ?? 'ms');
  const id = row._id!;
  const translations = row.translations ?? {};
  const current = translations[activeLang] ?? {};
  const fieldLabel = CHARITY_META[activeTab].fieldLabel;

  function setField(key: keyof TierTranslation, value: string) {
    const updated = {
      ...translations,
      [activeLang]: { ...current, [key]: value },
    };
    onUpdate(id, updated);
  }

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-3.5 w-3.5 text-brand-cyan" />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Translations</span>
        <div className="flex gap-1 ml-auto flex-wrap justify-end">
          {availableLangs.length === 0 && (
            <span className="text-[9px] text-slate-400 italic">No languages added in Translations panel yet.</span>
          )}
          {availableLangs.map((code) => (
            <button
              key={code}
              onClick={() => setActiveLang(code)}
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all ${
                activeLang === code ? 'bg-brand-navy text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-brand-cyan'
              }`}
              title={getLangLabel(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            {fieldLabel} ({activeLang.toUpperCase()}) — {getLangLabel(activeLang)}
          </label>
          <input
            type="text"
            value={activeTab === 'maps' ? current.title ?? '' : current.category ?? ''}
            onChange={(e) => setField(activeTab === 'maps' ? 'title' : 'category', e.target.value)}
            placeholder={`${fieldLabel} in ${SUPPORTED_LANGS.find(l => l.code === activeLang)?.label}`}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-navy outline-none focus:border-brand-cyan"
          />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Description ({activeLang.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={current.description ?? ''}
            onChange={(e) => setField('description', e.target.value)}
            placeholder={`Description in ${SUPPORTED_LANGS.find(l => l.code === activeLang)?.label}`}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-brand-slate outline-none resize-none focus:border-brand-cyan"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ImpactTiersCMS() {
  // Fetch available languages from the same source as the Translations admin panel
  const dbLanguages = useQuery(api.translations.listLanguages) ?? [];
  const allTiers = useQuery(api.impactTiers.listAll) ?? [];
  const upsert   = useMutation(api.impactTiers.upsert);
  const remove   = useMutation(api.impactTiers.remove);
  const seed     = useMutation(api.impactTiers.seedDefaults);

  const [activeTab,   setActiveTab]   = useState<Charity>('maps');
  const [savingId,    setSavingId]    = useState<string | null>(null);
  const [savedId,     setSavedId]     = useState<string | null>(null);
  const [localEdits,  setLocalEdits]  = useState<Record<string, Partial<TierRow>>>({});
  const [newRows,     setNewRows]     = useState<TierRow[]>([]);
  const [seeding,     setSeeding]     = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const rows = useMemo<TierRow[]>(() => {
    const dbRows = allTiers
      .filter((t) => t.charity === activeTab)
      .sort((a, b) => a.tier - b.tier)
      .map((t) => ({
        ...t,
        charity: t.charity as Charity,
        ...localEdits[t._id],
      } as TierRow));
    return [...dbRows, ...newRows.filter((r) => r.charity === activeTab)];
  }, [allTiers, localEdits, newRows, activeTab]);

  const getField = (row: TierRow) =>
    activeTab === 'maps' ? row.title ?? '' : row.category ?? '';

  const update = (id: string, key: string, val: unknown) => {
    setLocalEdits((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  };

  const updateNew = (tmpId: string, key: string, val: unknown) => {
    setNewRows((prev) => prev.map((r) => r._id === tmpId ? { ...r, [key]: val } : r));
  };

  const updateTranslations = (id: string, translations: Record<string, TierTranslation>) => {
    const isExisting = allTiers.some((t) => t._id === id);
    if (isExisting) {
      setLocalEdits((prev) => ({ ...prev, [id]: { ...prev[id], translations } }));
    } else {
      setNewRows((prev) => prev.map((r) => r._id === id ? { ...r, translations } : r));
    }
  };

  const handleSave = async (row: TierRow) => {
    const id = row._id && !row._isNew ? row._id : undefined;
    const saveKey = id ?? 'new';
    setSavingId(saveKey);
    try {
      await upsert({
        id: id as any,
        charity: row.charity,
        tier: row.tier,
        title: row.title,
        category: row.category,
        description: row.description,
        isActive: row.isActive ?? true,
        // translations is accepted by the backend mutation but the Convex
        // generated types lag until next deploy — cast to bypass the check.
        ...(row.translations ? { translations: row.translations } : {}),
      } as any);
      if (id) {
        setLocalEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
      } else {
        setNewRows((prev) => prev.filter((r) => r._id !== row._id));
      }
      setSavedId(saveKey);
      setTimeout(() => setSavedId(null), 2000);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this impact tier? This cannot be undone.')) return;
    await remove({ id: id as any });
    setLocalEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setExpandedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
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

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const renderRow = (row: TierRow) => {
    const id = row._id!;
    const isSaving   = savingId === id;
    const isSaved    = savedId  === id;
    const isExpanded = expandedIds.has(id);
    const meta       = CHARITY_META[activeTab];
    const isDirty    = !!(localEdits[id] && Object.keys(localEdits[id]).length) || !!row._isNew;
    const isNewRow   = !!row._isNew;

    const doUpdate = (key: string, val: unknown) =>
      isNewRow ? updateNew(id, key, val) : update(id, key, val);

    return (
      <div key={id} className={`border-b border-slate-50 transition-colors ${isDirty ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'}`}>
        <div className="grid grid-cols-[72px_1fr_1fr_50px_50px_auto] gap-3 items-start px-5 py-4">
          {/* Tier amount */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">RM Tier</label>
            <input
              type="number"
              value={isNewRow ? row.tier || '' : row.tier}
              onChange={(e) => doUpdate('tier', parseInt(e.target.value) || 0)}
              className="w-full border-2 border-slate-200 rounded-xl px-2 py-1.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Title / Category */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">{meta.fieldLabel}</label>
            <input
              type="text"
              value={getField(row)}
              onChange={(e) => doUpdate(activeTab === 'maps' ? 'title' : 'category', e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-2 py-1.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Description (EN)</label>
            <textarea
              rows={3}
              value={row.description}
              onChange={(e) => doUpdate('description', e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-2 py-1.5 text-sm font-medium text-brand-slate outline-none resize-none focus:border-brand-cyan"
            />
          </div>

          {/* Active toggle */}
          <div className="flex flex-col items-center gap-2 pt-5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">On</label>
            <button
              onClick={() => doUpdate('isActive', !(row.isActive ?? true))}
              className={`w-10 h-6 rounded-full transition-colors ${(row.isActive ?? true) ? 'bg-brand-cyan' : 'bg-slate-200'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow-sm mx-1 transition-transform ${(row.isActive ?? true) ? 'translate-x-4' : ''}`} />
            </button>
          </div>

          {/* Translate toggle */}
          <div className="flex flex-col items-center gap-2 pt-5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Trans.</label>
            <button
              onClick={() => toggleExpand(id)}
              className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-brand-navy text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-brand-navy'}`}
              title="Toggle translations"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            </button>
          </div>

          {/* Save / Delete */}
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
            {!isNewRow && (
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

        {/* Translation panel — expandable */}
        {isExpanded && !isNewRow && (
          <div className="px-5 pb-4">
            <TranslationPanel
              row={row}
              activeTab={activeTab}
              availableLangs={dbLanguages}
              onUpdate={updateTranslations}
            />
          </div>
        )}
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
            Manage MAPS and MyPOPI impact cards. Click <Globe className="inline h-3.5 w-3.5 text-brand-cyan" /> to add translations per tier.
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
        <div className="grid grid-cols-[72px_1fr_1fr_50px_50px_auto] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-5 py-3 border-b border-slate-100 gap-3">
          <span>RM Tier</span>
          <span>{CHARITY_META[activeTab].fieldLabel}</span>
          <span>Description (EN)</span>
          <span>Active</span>
          <span>Trans.</span>
          <span />
        </div>
        <div>
          {rows.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold">
              No tiers found. Add one above or click "Seed Defaults".
            </div>
          )}
          {rows.map(renderRow)}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4 font-bold">
        Changes are applied immediately. The donate page reflects updates in real-time via Convex.
      </p>
    </div>
  );
}
