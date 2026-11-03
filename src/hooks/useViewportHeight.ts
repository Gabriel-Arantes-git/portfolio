import { useEffect, useState } from 'react';

export function useViewportHeight(fallback = 800): number {
  const [height, setHeight] = useState(() => (typeof window === 'undefined' || !window.innerHeight ? fallback : window.innerHeight));

  useEffect(() => {
    const read = () => {
      if (window.innerHeight > 0) setHeight(window.innerHeight);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  return height;
}
