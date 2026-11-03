import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function usePointerParallax(ref: RefObject<HTMLElement | null>): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) return;

    const set = (x: number, y: number) => {
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      set(
        clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
        clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };
    const onLeave = () => set(0, 0);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      set(0, 0);
    };
  }, [ref, reduced]);
}
