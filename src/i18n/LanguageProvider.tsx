import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mergeDict } from '@/utils/mergeDict';
import { readStorage, writeStorage } from '@/utils/storage';
import { LanguageContext } from './context';
import { en } from './en';
import { pt } from './pt';
import { HTML_LANG, LANGS, type Lang } from './types';

export const STORAGE_KEY = 'portfolio:lang';

function initialLang(): Lang {
  const saved = readStorage(STORAGE_KEY);
  return (LANGS as readonly string[]).includes(saved ?? '') ? (saved as Lang) : 'pt';
}

const dictionaries = { pt, en: mergeDict(pt, en) };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeStorage(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => setLang(lang === 'pt' ? 'en' : 'pt'), [lang, setLang]);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: dictionaries[lang] }),
    [lang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
