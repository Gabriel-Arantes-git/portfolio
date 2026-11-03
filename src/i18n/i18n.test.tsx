import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { mergeDict } from '@/utils/mergeDict';
import { LanguageProvider, STORAGE_KEY } from './LanguageProvider';
import { pickLocalized, useLang, useT } from './hooks';

function Probe() {
  const t = useT();
  const { lang, toggle } = useLang();
  return (
    <div>
      <p data-testid="text">{t.nav.about}</p>
      <p data-testid="lang">{lang}</p>
      <button onClick={toggle}>trocar</button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );

describe('idioma', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.lang = '';
  });

  it('abre em PT-BR e reflete o atributo lang', () => {
    renderProbe();
    expect(screen.getByTestId('text')).toHaveTextContent('Sobre');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('alterna para inglês sem recarregar e atualiza lang', async () => {
    renderProbe();
    await userEvent.click(screen.getByText('trocar'));
    expect(screen.getByTestId('text')).toHaveTextContent('About');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('lembra a escolha do visitante', () => {
    window.localStorage.setItem(STORAGE_KEY, 'en');
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });

  it('ignora valor salvo inválido', () => {
    window.localStorage.setItem(STORAGE_KEY, 'fr');
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
  });

  it('funciona com armazenamento bloqueado', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
    await userEvent.click(screen.getByText('trocar'));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });
});

describe('fallback de tradução', () => {
  it('mergeDict usa o português quando falta ou vem vazia a chave em inglês', () => {
    const base = { a: 'um', nested: { b: 'dois', c: 'três' } };
    const merged = mergeDict(base, { a: '', nested: { b: 'two' } });
    expect(merged).toEqual({ a: 'um', nested: { b: 'two', c: 'três' } });
  });

  it('mergeDict tolera override inválido', () => {
    expect(mergeDict({ a: 'um' }, undefined)).toEqual({ a: 'um' });
    expect(mergeDict({ a: 'um' }, 42)).toEqual({ a: 'um' });
  });

  it('pickLocalized cai para o PT quando o EN está vazio', () => {
    expect(pickLocalized({ pt: 'olá', en: '' }, 'en')).toBe('olá');
    expect(pickLocalized({ pt: 'olá', en: 'hi' }, 'en')).toBe('hi');
  });
});
