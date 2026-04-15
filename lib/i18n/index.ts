import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  Component,
} from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { en } from './en';

// ── ConvexErrorBoundary: Catch Convex query errors so they don't crash the app ──
interface EBState { hasError: boolean }
class ConvexErrorBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn('[i18n] Convex query failed, falling back to English only:', error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────
type Language = string;

interface I18nContextValue {
  /** Active ISO language code, e.g. "en", "ms" */
  lang: Language;
  /** Switch the active language (persisted to localStorage) */
  setLang: (lang: Language) => void;
  /** Translate a dot-notation key, e.g. t('navbar.home') */
  t: (key: string, fallback?: string) => string;
  /** All language codes available (always includes "en") */
  availableLangs: string[];
  /** Trigger the lazy fetch of available languages (call when opening the lang picker) */
  loadAvailableLangs: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────
const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  availableLangs: ['en'],
  loadAvailableLangs: () => {},
});

// ── Helper: walk the nested `en` object using a dot-notation key ───────────
function getEnValue(key: string): string | undefined {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = en;
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = node[part];
    } else {
      return undefined;
    }
  }
  return typeof node === 'string' ? node : undefined;
}

// ── Provider ───────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('sab_lang');
    return stored ?? 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem('sab_lang', newLang);
    setLangState(newLang);
  }, []);

  // Only fetch available languages when the user opens the language picker.
  // This avoids a constant Convex subscription on every page of the app.
  const [shouldFetchLangs, setShouldFetchLangs] = useState(false);
  const loadAvailableLangs = useCallback(() => setShouldFetchLangs(true), []);

  // Fetch Convex translations only when a non-English language is selected.
  const convexTranslations = useQuery(
    api.translations.getByLang,
    lang !== 'en' ? { lang } : 'skip'
  );

  // Lazy: only subscribe to listLanguages after the user opens the lang dropdown.
  // NOTE: This query may throw if Convex plan limits are exceeded;
  // it is wrapped in a ConvexErrorBoundary below to catch that case.
  const langsFromDB = useQuery(
    api.translations.listLanguages,
    shouldFetchLangs ? {} : 'skip'
  );

  const availableLangs = useMemo(() => {
    const set: string[] = ['en'];
    if (Array.isArray(langsFromDB)) {
      langsFromDB.forEach((l: string) => {
        if (l !== 'en' && !set.includes(l)) set.push(l);
      });
    }
    return set;
  }, [langsFromDB]);

  // Build a flat key → value map from the Convex rows.
  const translationMap = useMemo(() => {
    if (!convexTranslations) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    convexTranslations.forEach((row: { key: string; value: string }) => {
      if (row.value) map[row.key] = row.value;
    });
    return map;
  }, [convexTranslations]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      // 1️⃣ Convex translation for non-English language
      if (lang !== 'en' && translationMap[key]) {
        return translationMap[key];
      }
      
      // 2️⃣ English default from en.ts
      const enValue = getEnValue(key);
      if (enValue !== undefined) return enValue;
      // 3️⃣ Provided fallback or the raw key
      return fallback ?? key;
    },
    [lang, translationMap]
  );

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t, availableLangs, loadAvailableLangs } },
    children
  );
}

// ── Fallback provider used when Convex queries throw ──────────────────────
function I18nFallbackProvider({ children }: { children: React.ReactNode }) {
  const [lang] = useState<Language>('en');
  const setLang = useCallback(() => {}, []);
  const loadAvailableLangs = useCallback(() => {}, []);
  const t = useCallback((key: string, fallback?: string): string => {
    const enValue = (function getEnValue(key: string) {
      const parts = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = en;
      for (const part of parts) {
        if (node && typeof node === 'object' && part in node) node = node[part];
        else return undefined;
      }
      return typeof node === 'string' ? node : undefined;
    })(key);
    return enValue ?? fallback ?? key;
  }, []);
  const availableLangs = ['en'];
  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t, availableLangs, loadAvailableLangs } },
    children
  );
}

// ── Safe wrapper that catches Convex errors and falls back gracefully ─────
export function SafeI18nProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    ConvexErrorBoundary,
    { fallback: React.createElement(I18nFallbackProvider, null, children) },
    React.createElement(I18nProvider, null, children)
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useTranslation() {
  return useContext(I18nContext);
}

/**
 * Utility: flatten the `en` object into a dot-notation map.
 * Used by the admin Translations page to show every available key.
 */
export function flattenEn(): Record<string, string> {
  const result: Record<string, string> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(obj: any, prefix: string) {
    for (const k of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'string') {
        result[fullKey] = obj[k];
      } else if (typeof obj[k] === 'object') {
        walk(obj[k], fullKey);
      }
    }
  }

  walk(en, '');
  return result;
}
