import { useContext } from 'react';
import { LanguageContext, type LanguageContextValue } from './context';
import type { Dictionary } from './pt';
import type { Lang } from './types';

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang precisa estar dentro de <LanguageProvider>');
  return ctx;
}

export function useT(): Dictionary {
  return useLang().t;
}

type Bilingual<T extends string | string[]> = { pt: T; en: T };

export function useLocalized(): <T extends string | string[]>(text: Bilingual<T>) => T {
  const { lang } = useLang();
  return (text) => pickLocalized(text, lang);
}

export function pickLocalized<T extends string | string[]>(text: Bilingual<T>, lang: Lang): T {
  const value = text[lang];
  const empty = Array.isArray(value)
    ? value.length === 0
    : typeof value !== 'string' || value.trim() === '';
  return empty ? text.pt : value;
}
