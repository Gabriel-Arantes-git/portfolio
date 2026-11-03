import { act, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithLang } from '@/test/renderWithLang';
import { Timeline } from './Timeline';

const MARKER_Y = [60, 360, 660, 960];
let containerTop = 0;

beforeEach(() => {
  containerTop = 0;
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const marker = this.getAttribute?.('data-marker');
    if (marker !== null && marker !== undefined) {
      const y = containerTop + MARKER_Y[Number(marker)];
      return { left: 20, top: y - 12, width: 24, height: 24, right: 44, bottom: y + 12, x: 20, y: y - 12, toJSON: () => ({}) } as DOMRect;
    }
    if (this.className && String(this.className).includes('mapWrap')) {
      return { left: 0, top: containerTop, width: 900, height: 1100, right: 900, bottom: containerTop + 1100, x: 0, y: containerTop, toJSON: () => ({}) } as DOMRect;
    }
    return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function scrollTo(y: number) {
  containerTop = -y;
  act(() => {
    fireEvent.scroll(window);
  });
}

const overlay = (c: HTMLElement) => c.querySelector('svg[data-progress]') as SVGElement | null;
const progress = (c: HTMLElement) => Number(overlay(c)!.getAttribute('data-progress'));
const reachedMarkers = (c: HTMLElement) => c.querySelectorAll('[data-marker][class*="markerReached"]').length;

describe('mapa da trajetória', () => {
  it('desenha o caminho pontilhado e o rastro decorativo, escondidos de leitores de tela', () => {
    const { container } = renderWithLang(<Timeline />);
    const svg = overlay(container)!;
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelectorAll('path').length).toBe(2);
  });

  it('com a primeira parada na linha de leitura o rastro está no início; rolando, avança até o X seguinte', () => {
    const { container } = renderWithLang(<Timeline />);

    expect(reachedMarkers(container)).toBe(2);

    scrollTo(300);
    expect(reachedMarkers(container)).toBe(3);
    const p3 = progress(container);

    scrollTo(700);
    expect(reachedMarkers(container)).toBe(4);
    expect(progress(container)).toBe(1);
    expect(progress(container)).toBeGreaterThan(p3);
  });

  it('ao rolar de volta o rastro recua pelo mesmo caminho', () => {
    const { container } = renderWithLang(<Timeline />);
    scrollTo(700);
    expect(progress(container)).toBe(1);
    scrollTo(300);
    const mid = progress(container);
    expect(mid).toBeLessThan(1);
    scrollTo(-500);
    expect(progress(container)).toBe(0);
    expect(reachedMarkers(container)).toBe(1);
  });

  it('os quadrados do rastro andam com a rolagem e somem sem movimento', () => {
    const { container } = renderWithLang(<Timeline />);
    scrollTo(200);
    const squares = container.querySelectorAll('svg[data-progress] rect.square');
    expect(squares.length).toBeGreaterThan(3);
    const first = (): [string | null, string | null] => {
      const r = container.querySelector('svg[data-progress] rect.square')!;
      return [r.getAttribute('x'), r.getAttribute('y')];
    };
    const before = first();
    scrollTo(100);
    expect(first()).not.toEqual(before);
  });

  it('com movimento reduzido o caminho aparece completo e parado, sem quadrados', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { container } = renderWithLang(<Timeline />);
    expect(progress(container)).toBe(1);
    expect(container.querySelectorAll('svg[data-progress] rect.square').length).toBe(0);
    expect(reachedMarkers(container)).toBe(4);
  });
});
