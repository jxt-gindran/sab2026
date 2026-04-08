import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { en } from './en';

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
}

// ── Context ────────────────────────────────────────────────────────────────
const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  availableLangs: ['en'],
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

  // Fetch Convex translations only when a non-English language is selected.
  const convexTranslations = useQuery(
    api.translations.getByLang,
    lang !== 'en' ? { lang } : 'skip'
  );

  // Get all languages that have rows in Convex.
  const langsFromDB = useQuery(api.translations.listLanguages);

  const availableLangs = useMemo(() => {
    const set: string[] = ['en'];
    if (langsFromDB) {
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
    { value: { lang, setLang, t, availableLangs } },
    children
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
