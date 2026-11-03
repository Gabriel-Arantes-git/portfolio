export type Lang = 'pt' | 'en';

export interface Localized {
  pt: string;
  en: string;
}

export interface LocalizedList {
  pt: string[];
  en: string[];
}

export const LANGS: readonly Lang[] = ['pt', 'en'];

export const HTML_LANG: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };
