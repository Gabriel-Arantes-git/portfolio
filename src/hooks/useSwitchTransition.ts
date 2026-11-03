import { useCallback, useEffect, useRef, useState } from 'react';

export type Phase = 'idle' | 'out' | 'in';

export interface SwitchTransition<T> {
  active: T;

  shown: T;
  phase: Phase;

  direction: 1 | -1;
  select: (next: T) => void;
}

export function useSwitchTransition<T>(
  initial: T,
  order: readonly T[],
  reducedMotion: boolean,
  duration = 240,
): SwitchTransition<T> {
  const [active, setActive] = useState<T>(initial);
  const [shown, setShown] = useState<T>(initial);
  const [phase, setPhase] = useState<Phase>('idle');
  const [direction, setDirection] = useState<1 | -1>(1);
  const timers = useRef<number[]>([]);
  const activeRef = useRef<T>(initial);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => clear, []);

  const select = useCallback(
    (next: T) => {
      if (next === activeRef.current) return;
      const dir = order.indexOf(next) > order.indexOf(activeRef.current) ? 1 : -1;
      activeRef.current = next;
      setActive(next);
      clear();

      if (reducedMotion) {
        setShown(next);
        setPhase('idle');
        return;
      }

      setDirection(dir);
      setPhase('out');
      timers.current.push(
        window.setTimeout(() => {
          setShown(next);
          setPhase('in');
          timers.current.push(window.setTimeout(() => setPhase('idle'), duration));
        }, duration),
      );
    },
    [order, reducedMotion, duration],
  );

  return { active, shown, phase, direction, select };
}
