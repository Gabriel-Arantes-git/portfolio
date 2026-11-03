import { useEffect, useRef } from 'react';

export function useAnimationLoop(callback: (dt: number) => void, active: boolean): void {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    let last = 0;

    const tick = (time: number) => {
      const dt = last === 0 ? 0 : (time - last) / 1000;
      last = time;
      saved.current(dt);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame !== 0) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame === 0) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) start();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [active]);
}
