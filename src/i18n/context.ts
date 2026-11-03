import { createContext } from 'react';
import type { Dictionary } from './pt';
import type { Lang } from './types';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: Dictionary;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
