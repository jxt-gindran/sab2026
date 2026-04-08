import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { flattenEn } from '../../lib/i18n';
import {
  Globe,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
} from 'lucide-react';

// ── Static list of all English keys ───────────────────────────────────────────
const EN_FLAT = flattenEn();
const ALL_KEYS = Object.keys(EN_FLAT).sort();

// ── Language display names ─────────────────────────────────────────────────────
const LANG_NAMES: Record<string, string> = {
  ms: 'Bahasa Malaysia',
  zh: 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  ar: 'Arabic',
  ta: 'Tamil',
};

const getLangName = (code: string) => LANG_NAMES[code] || code.toUpperCase();

// ── Component ─────────────────────────────────────────────────────────────────
export default function Translations() {
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [newLangInput, setNewLangInput] = useState('');
  const [showAddLang, setShowAddLang] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'translated' | 'untranslated'>('all');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Convex
  const dbLanguages = useQuery(api.translations.listLanguages) || [];
  const translations = useQuery(
    api.translations.getByLang,
    selectedLang ? { lang: selectedLang } : 'skip'
  ) || [];

  const upsertKey = useMutation(api.translations.upsertKey);
  const deleteKey = useMutation(api.translations.deleteKey);
  const deleteLang = useMutation(api.translations.deleteLanguage);

  // Build a map: key → translated value for the selected language
  const translationMap = useMemo(() => {
    const map: Record<string, string> = {};
    translations.forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value;
    });
    return map;
  }, [translations]);

  // Local edits buffer
  const [edits, setEdits] = useState<Record<string, string>>({});

  // Filtered keys
  const visibleKeys = useMemo(() => {
    let keys = ALL_KEYS;
    if (search) {
      const q = search.toLowerCase();
      keys = keys.filter(k => k.toLowerCase().includes(q) || EN_FLAT[k].toLowerCase().includes(q));
    }
    if (filter === 'translated') {
      keys = keys.filter(k => translationMap[k] || edits[k]);
    } else if (filter === 'untranslated') {
      keys = keys.filter(k => !translationMap[k] && !edits[k]);
    }
    return keys;
  }, [search, filter, translationMap, edits]);

  const translatedCount = ALL_KEYS.filter(k => translationMap[k]).length;
  const pct = Math.round((translatedCount / ALL_KEYS.length) * 100);

  // Get current value for a key (edit buffer → DB → empty)
  const getValue = (key: string) =>
    edits[key] !== undefined ? edits[key] : (translationMap[key] || '');

  const handleChange = (key: string, val: string) => {
    setEdits(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = useCallback(async (key: string) => {
    const value = getValue(key).trim();
    setSavingKey(key);
    try {
      if (value) {
        await upsertKey({ lang: selectedLang, key, value });
      } else {
        await deleteKey({ lang: selectedLang, key });
      }
      setEdits(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    } finally {
      setSavingKey(null);
    }
  }, [selectedLang, edits, upsertKey, deleteKey]);

  const handleAddLang = () => {
    const code = newLangInput.trim().toLowerCase();
    if (!code || dbLanguages.includes(code)) return;
    setSelectedLang(code);
    setNewLangInput('');
    setShowAddLang(false);
    setEdits({});
  };

  const handleDeleteLang = async () => {
    if (!selectedLang) return;
    if (!confirm(`Delete all translations for "${selectedLang}"? This cannot be undone.`)) return;
    await deleteLang({ lang: selectedLang });
    setSelectedLang('');
    setEdits({});
  };

  const pendingEdits = Object.keys(edits).filter(k => edits[k] !== (translationMap[k] || ''));

  const saveAll = async () => {
    for (const key of pendingEdits) {
      await handleSave(key);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <Globe className="h-8 w-8 text-brand-cyan" />
            Translations
          </h1>
          <p className="text-brand-slate mt-2">
            Manage multi-language UI strings. English is always the fallback and never stored here.
          </p>
        </div>
        {pendingEdits.length > 0 && (
          <button
            onClick={saveAll}
            className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-brand-navy transition-all shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save All ({pendingEdits.length})
          </button>
        )}
      </div>

      {/* Language Selector Row */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex flex-wrap gap-4 items-center">
        <span className="text-sm font-black text-brand-navy uppercase tracking-widest">Language:</span>

        <div className="flex flex-wrap gap-2">
          {dbLanguages.map((lang: string) => (
            <button
              key={lang}
              onClick={() => { setSelectedLang(lang); setEdits({}); }}
              className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                selectedLang === lang
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-navy border-brand-pale hover:border-brand-cyan'
              }`}
            >
              {lang.toUpperCase()}
              {selectedLang === lang && <span className="ml-2 opacity-60 text-xs">{getLangName(lang)}</span>}
            </button>
          ))}

          {/* Add Language */}
          {showAddLang ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={newLangInput}
                onChange={e => setNewLangInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddLang()}
                placeholder="e.g. ms, zh"
                className="border-2 border-brand-cyan px-3 py-2 rounded-xl text-sm font-bold w-28 outline-none"
              />
              <button
                onClick={handleAddLang}
                className="bg-brand-cyan text-brand-navy px-3 py-2 rounded-xl text-sm font-black hover:bg-brand-navy hover:text-white transition-all"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAddLang(false); setNewLangInput(''); }}
                className="text-slate-400 hover:text-brand-navy px-2 py-2 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddLang(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-black border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-cyan hover:text-brand-cyan transition-all"
            >
              <Plus className="h-4 w-4" /> Add Language
            </button>
          )}
        </div>

        {selectedLang && (
          <button
            onClick={handleDeleteLang}
            className="ml-auto flex items-center gap-1 text-xs font-black text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Delete {selectedLang.toUpperCase()}
          </button>
        )}
      </div>

      {/* Only show table when a language is selected */}
      {!selectedLang ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <Globe className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-lg">Select or add a language to begin translating.</p>
          <p className="text-slate-300 text-sm mt-2">English strings are shown as reference. Fill in translations on the right.</p>
        </div>
      ) : (
        <>
          {/* Stats + filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
            <div className="flex flex-wrap gap-6 items-center">
              {/* Progress */}
              <div className="flex-grow min-w-[200px]">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Translation Progress</span>
                  <span className={pct === 100 ? 'text-green-500' : 'text-brand-orange'}>{pct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-400' : 'bg-brand-orange'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">{translatedCount} / {ALL_KEYS.length} keys translated</div>
              </div>

              {/* Search */}
              <div className="relative flex-grow max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search keys or English text..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-brand-cyan"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                {(['all', 'translated', 'untranslated'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      filter === f ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Translation Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_auto] text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-6 py-3 border-b border-slate-100">
              <span>Key / English</span>
              <span>{selectedLang.toUpperCase()} Translation</span>
              <span></span>
            </div>

            <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
              {visibleKeys.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-bold">No keys match your search.</div>
              )}
              {visibleKeys.map(key => {
                const enValue = EN_FLAT[key];
                const currentValue = getValue(key);
                const dbValue = translationMap[key] || '';
                const isDirty = edits[key] !== undefined && edits[key] !== dbValue;
                const isTranslated = !!dbValue;
                const isSaving = savingKey === key;
                const isSaved = savedKey === key;

                return (
                  <div
                    key={key}
                    className={`grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 items-start hover:bg-slate-50/50 transition-colors ${
                      isDirty ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    {/* Key + English value */}
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 font-mono">{key}</div>
                      <div className="text-sm text-brand-slate leading-relaxed line-clamp-3">{enValue}</div>
                    </div>

                    {/* Translation input */}
                    <div className="relative">
                      <textarea
                        value={currentValue}
                        onChange={e => handleChange(key, e.target.value)}
                        onBlur={() => isDirty && handleSave(key)}
                        rows={Math.min(3, Math.ceil(enValue.length / 60))}
                        placeholder={`Translate to ${getLangName(selectedLang)}…`}
                        className={`w-full px-3 py-2 border-2 rounded-xl text-sm font-medium resize-none outline-none transition-all ${
                          isDirty
                            ? 'border-brand-orange focus:border-brand-orange'
                            : isTranslated
                            ? 'border-green-200 focus:border-brand-cyan'
                            : 'border-slate-200 focus:border-brand-cyan'
                        }`}
                      />
                    </div>

                    {/* Status icon */}
                    <div className="flex items-center pt-2 w-8">
                      {isSaving ? (
                        <div className="h-5 w-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                      ) : isSaved ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : isDirty ? (
                        <button onClick={() => handleSave(key)}>
                          <Save className="h-5 w-5 text-brand-orange hover:text-brand-navy transition-colors" />
                        </button>
                      ) : isTranslated ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-slate-200" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4 font-bold">
            Changes are saved instantly when you leave a field, or click the save icon. The public site reflects changes immediately.
          </p>
        </>
      )}
    </div>
  );
}
