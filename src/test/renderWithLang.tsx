import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { LanguageProvider, STORAGE_KEY } from '@/i18n/LanguageProvider';
import type { Lang } from '@/i18n/types';

export function renderWithLang(ui: ReactElement, lang: Lang = 'pt') {
  window.localStorage.setItem(STORAGE_KEY, lang);
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
