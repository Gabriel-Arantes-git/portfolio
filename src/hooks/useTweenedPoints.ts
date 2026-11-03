import { useEffect, useRef, useState } from 'react';
import type { Point } from '@/utils/boardLayout';

const DURATION = 560;
const STAGGER = 48;
const WAVE = 18;

export function useTweenedPoints(target: Point[], reducedMotion: boolean): Point[] {
  const [points, setPoints] = useState<Point[]>(target);
  const current = useRef<Point[]>(target);

  useEffect(() => {
    const from = current.current;
    if (reducedMotion || from.length !== target.length || typeof requestAnimationFrame !== 'function') {
      current.current = target;
      setPoints(target);
      return;
    }
    const start = performance.now();
    const last = target.length - 1;
    const total = DURATION + last * STAGGER;
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const next = target.map((point, index) => {
        const t = Math.min(1, Math.max(0, (elapsed - (last - index) * STAGGER) / DURATION));
        const eased = 1 - Math.pow(1 - t, 3);
        const dx = point.x - from[index].x;
        const dy = point.y - from[index].y;
        const length = Math.hypot(dx, dy) || 1;
        const wave = Math.sin(index * 0.9 - elapsed / 95) * WAVE * Math.sin(Math.PI * t);
        return {
          x: from[index].x + dx * eased + (-dy / length) * wave,
          y: from[index].y + dy * eased + (dx / length) * wave,
        };
      });
      current.current = next;
      setPoints(next);
      if (elapsed < total) {
        frame = requestAnimationFrame(tick);
      } else {
        current.current = target;
        setPoints(target);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reducedMotion]);

  return points;
}
