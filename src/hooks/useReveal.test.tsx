import { act, render, screen } from '@testing-library/react';
import { Section } from '@/components/Section/Section';
import { Stack } from '@/sections/Stack/Stack';
import { renderWithLang } from '@/test/renderWithLang';

type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

let callbacks: Callback[] = [];

class FakeObserver {
  constructor(callback: Callback) {
    callbacks.push(callback);
  }
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeEach(() => {
  callbacks = [];
  vi.stubGlobal('IntersectionObserver', FakeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('aparição ao rolar', () => {
  it('a seção começa escondida e é revelada quando entra na tela', () => {
    render(
      <Section id="demo" index="01" title="Demo">
        <p>conteúdo</p>
      </Section>,
    );
    const section = document.getElementById('demo')!;
    expect(section.className).toContain('pending');
    expect(section).not.toHaveAttribute('data-revealed');

    act(() => callbacks.forEach((callback) => callback([{ isIntersecting: true, boundingClientRect: { top: 100 } as DOMRectReadOnly }])));
    expect(section.className).toContain('revealed');
    expect(section).toHaveAttribute('data-revealed');
  });

  it('uma seção que já ficou para cima da tela também é revelada', () => {
    render(
      <Section id="demo" index="01" title="Demo">
        <p>conteúdo</p>
      </Section>,
    );
    act(() => callbacks.forEach((callback) => callback([{ isIntersecting: false, boundingClientRect: { top: -400 } as DOMRectReadOnly }])));
    expect(document.getElementById('demo')).toHaveAttribute('data-revealed');
  });

  it('sem IntersectionObserver o conteúdo aparece direto', () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <Section id="demo" index="01" title="Demo">
        <p>conteúdo</p>
      </Section>,
    );
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
    expect(document.getElementById('demo')).toHaveAttribute('data-revealed');
  });

  it('a Stack monta o tabuleiro em cobrinha: espera, toca ao entrar na tela e termina', () => {
    vi.useFakeTimers();
    renderWithLang(<Stack />);
    const field = () => document.querySelector('[data-intro]')!;
    expect(field()).toHaveAttribute('data-intro', 'wait');
    expect(document.querySelector('mask')).toBeInTheDocument();

    act(() => callbacks.forEach((callback) => callback([{ isIntersecting: true, boundingClientRect: { top: 50 } as DOMRectReadOnly }])));
    expect(field()).toHaveAttribute('data-intro', 'play');

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(field()).toHaveAttribute('data-intro', 'done');
    vi.useRealTimers();
  });
});
