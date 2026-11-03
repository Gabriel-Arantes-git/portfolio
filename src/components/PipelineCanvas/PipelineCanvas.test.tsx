import { act, render } from '@testing-library/react';
import { vi } from 'vitest';
import { PipelineCanvas } from './PipelineCanvas';

const extra = {
  rejectedLabel: 'Reprovados',
  bubbleText: { source: 'fonte', rows: 'linhas', normalizing: 'normalizando', batch: 'lote' },
};

function stubContext() {
  const calls: string[] = [];
  const ctx = new Proxy(
    {},
    {
      get: (_t, prop: string) => {
        if (prop === 'canvas') return null;
        return (...args: unknown[]) => {
          calls.push(`${prop}:${args.length}`);
        };
      },
      set: () => true,
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  return calls;
}

function stubSize(width: number, height: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('PipelineCanvas', () => {
  it('é decorativo (aria-hidden) e desenha o quadro inicial', () => {
    const calls = stubContext();
    stubSize(800, 500);
    stubReducedMotion(false);
    const raf = vi.fn(() => 1);
    vi.stubGlobal('requestAnimationFrame', raf);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const { container } = render(
      <PipelineCanvas labels={['Extrair', 'Transformar', 'Carregar', 'API']} counterLabel="Processados" {...extra} />,
    );

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(calls.some((c) => c.startsWith('fillRect'))).toBe(true);
    expect(calls.some((c) => c.startsWith('fillText'))).toBe(true);
    expect(raf).toHaveBeenCalled();
  });

  it('com movimento reduzido desenha parado e não agenda quadros', () => {
    const calls = stubContext();
    stubSize(800, 500);
    stubReducedMotion(true);
    const raf = vi.fn(() => 1);
    vi.stubGlobal('requestAnimationFrame', raf);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    render(<PipelineCanvas labels={['A', 'B', 'C', 'D']} counterLabel="n" {...extra} />);

    expect(calls.some((c) => c.startsWith('fillRect'))).toBe(true);
    expect(raf).not.toHaveBeenCalled();
  });

  it('cancela o laço quando sai da viewport', () => {
    stubContext();
    stubSize(800, 500);
    stubReducedMotion(false);
    const raf = vi.fn(() => 7);
    const cancel = vi.fn();
    vi.stubGlobal('requestAnimationFrame', raf);
    vi.stubGlobal('cancelAnimationFrame', cancel);

    let notify: (entries: Array<{ isIntersecting: boolean }>) => void = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: (e: Array<{ isIntersecting: boolean }>) => void) {
          notify = cb;
        }
        observe() {}
        disconnect() {}
      },
    );

    render(<PipelineCanvas labels={['A', 'B', 'C', 'D']} counterLabel="n" {...extra} />);
    expect(raf).toHaveBeenCalledTimes(1);
    expect(cancel).not.toHaveBeenCalled();

    act(() => notify([{ isIntersecting: false }]));
    expect(cancel).toHaveBeenCalledWith(7);

    raf.mockClear();
    act(() => notify([{ isIntersecting: true }]));
    expect(raf).toHaveBeenCalledTimes(1);
  });
});
