import { useEffect, useState } from 'react';

export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > threshold,
  );

  useEffect(() => {
    let queued = false;
    let frame = 0;
    const update = () => {
      queued = false;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (queued) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
