import { act, render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAnimationLoop } from './useAnimationLoop';
import { usePointerParallax } from './usePointerParallax';
import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

function mockRaf() {
  let id = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    id += 1;
    callbacks.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
    callbacks.delete(handle);
  });
  return {
    pending: () => callbacks.size,
    flush(time: number) {
      const batch = [...callbacks.entries()];
      callbacks.clear();
      batch.forEach(([, cb]) => cb(time));
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useAnimationLoop', () => {
  it('chama o callback a cada quadro com dt em segundos', () => {
    const raf = mockRaf();
    const cb = vi.fn();
    renderHook(() => useAnimationLoop(cb, true));
    raf.flush(1000);
    raf.flush(1016);
    expect(cb).toHaveBeenNthCalledWith(1, 0);
    expect(cb.mock.calls[1][0]).toBeCloseTo(0.016, 3);
  });

  it('não agenda quadros quando inativo e para ao desativar', () => {
    const raf = mockRaf();
    const cb = vi.fn();
    const { rerender } = renderHook(({ active }) => useAnimationLoop(cb, active), {
      initialProps: { active: false },
    });
    expect(raf.pending()).toBe(0);

    rerender({ active: true });
    expect(raf.pending()).toBe(1);

    rerender({ active: false });
    expect(raf.pending()).toBe(0);
  });

  it('pausa com a aba oculta e retoma ao voltar', () => {
    const raf = mockRaf();
    renderHook(() => useAnimationLoop(() => {}, true));
    expect(raf.pending()).toBe(1);

    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(raf.pending()).toBe(0);

    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(raf.pending()).toBe(1);
  });
});

describe('useReducedMotion', () => {
  it('lê a preferência do sistema', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('assume movimento normal sem matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});

describe('useInView', () => {
  it('acompanha a interseção reportada pelo observer', () => {
    let notify: (entries: Array<Partial<IntersectionObserverEntry>>) => void = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: (e: Array<Partial<IntersectionObserverEntry>>) => void) {
          notify = cb;
        }
        observe() {}
        disconnect() {}
      },
    );

    function Probe() {
      const ref = { current: document.createElement('div') };
      const inView = useInView(ref);
      return <span data-testid="v">{String(inView)}</span>;
    }
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('v')).toHaveTextContent('true');

    act(() => notify([{ isIntersecting: false }]));
    expect(getByTestId('v')).toHaveTextContent('false');

    act(() => notify([{ isIntersecting: true }]));
    expect(getByTestId('v')).toHaveTextContent('true');
  });
});

describe('usePointerParallax', () => {
  function setup() {
    const el = document.createElement('div');
    el.getBoundingClientRect = () =>
      ({ left: 100, top: 100, width: 200, height: 100, right: 300, bottom: 200, x: 100, y: 100, toJSON: () => ({}) }) as DOMRect;
    document.body.appendChild(el);
    return el;
  }

  it('grava --px e --py de -1 a 1 relativos ao centro e zera ao sair', () => {
    const el = setup();
    renderHook(() => usePointerParallax({ current: el }));
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 100 }));
    expect(el.style.getPropertyValue('--px')).toBe('1.000');
    expect(el.style.getPropertyValue('--py')).toBe('-1.000');
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 200, clientY: 150 }));
    expect(el.style.getPropertyValue('--px')).toBe('0.000');
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 900, clientY: 900 }));
    expect(el.style.getPropertyValue('--px')).toBe('1.000');
    el.dispatchEvent(new MouseEvent('pointerleave'));
    expect(el.style.getPropertyValue('--px')).toBe('0.000');
    expect(el.style.getPropertyValue('--py')).toBe('0.000');
    el.remove();
  });

  it('não faz nada com movimento reduzido', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const el = setup();
    renderHook(() => usePointerParallax({ current: el }));
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 100 }));
    expect(el.style.getPropertyValue('--px')).toBe('');
    el.remove();
  });
});
