import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  buildPolyline,
  lengthAtY,
  pointAtLength,
  reachedCount,
  toPathD,
  trail,
  type Polyline,
} from '@/utils/timelineMap';
import styles from './TimelineMap.module.scss';

interface TimelineMapProps {
  containerRef: RefObject<HTMLElement | null>;

  onReach?: (count: number) => void;
}

const READ_LINE = 0.55;

export function TimelineMap({ containerRef, onReach }: TimelineMapProps) {
  const reduced = useReducedMotion();
  const [poly, setPoly] = useState<Polyline | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [head, setHead] = useState(0);
  const polyRef = useRef<Polyline | null>(null);
  polyRef.current = poly;

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const markers = [...container.querySelectorAll<HTMLElement>('[data-marker]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    const amplitude = box.width < 640 ? 10 : box.width < 960 ? 18 : 28;
    setPoly(buildPolyline(markers, { amplitude }));
    setSize({ w: box.width, h: box.height });
  }, [containerRef]);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    window.addEventListener('resize', measure);
    let observer: ResizeObserver | undefined;
    if (container && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(container);
    }
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [measure, containerRef]);

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const current = polyRef.current;
      if (!container || !current) return;
      if (reduced) {
        setHead(current.total);
        return;
      }
      const lineY = window.innerHeight * READ_LINE - container.getBoundingClientRect().top;
      setHead(lengthAtY(current, lineY));
    };

    update();
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [poly, reduced, containerRef]);

  const reached = poly ? reachedCount(poly, head) : 0;
  useEffect(() => {
    onReach?.(reached);
  }, [reached, onReach]);

  if (!poly || poly.points.length < 2 || size.w === 0) return null;

  const d = toPathD(poly);
  const headPoint = pointAtLength(poly, head);
  const squares = reduced ? [] : trail(poly, head, 8, 20, head * 0.045, 9);
  const progress = poly.total > 0 ? head / poly.total : 0;

  return (
    <svg
      className={styles.map}
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden="true"
      focusable="false"
      data-progress={progress.toFixed(3)}
    >
      <defs>
        <clipPath id="timeline-done">
          <rect x="0" y="0" width={size.w} height={Math.max(0, headPoint.y)} />
        </clipPath>
      </defs>
      <path className={styles.track} d={d} />
      <path className={styles.done} d={d} clipPath="url(#timeline-done)" />
      {squares.map((sq, i) => (
        <rect
          key={i}
          className={styles.square}
          x={sq.x - (i === 0 ? 7 : 5)}
          y={sq.y - (i === 0 ? 7 : 5)}
          width={i === 0 ? 14 : 10}
          height={i === 0 ? 14 : 10}
          opacity={0.25 + sq.strength * 0.75}
        />
      ))}
    </svg>
  );
}
