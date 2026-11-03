import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './ExchangeArt.module.scss';

interface ExchangeArtProps {
  from: string;
  to: string;
}

export function ExchangeArt({ from, to }: ExchangeArtProps) {
  const reduced = useReducedMotion();
  const route = 'M 36 92 C 110 -6, 250 -6, 324 82';

  return (
    <svg
      className={styles.art}
      viewBox="0 0 360 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.sun} x="292" y="12" width="22" height="22" />
      <g className={styles.clouds}>
        <rect className={styles.cloud} x="56" y="26" width="30" height="8" />
        <rect className={styles.cloud} x="66" y="18" width="16" height="8" />
        <rect className={styles.cloud} x="196" y="14" width="34" height="8" />
        <rect className={styles.cloud} x="206" y="6" width="18" height="8" />
      </g>

      <path id="exchange-route" className={styles.route} d={route} />

      <rect className={styles.city} x="28" y="88" width="16" height="16" />
      <rect className={styles.cityDest} x="316" y="78" width="16" height="16" />
      <text className={styles.label} x="20" y="116">
        {from}
      </text>
      <text className={styles.label} x="236" y="116">
        {to}
      </text>

      <g className={styles.plane} transform={reduced ? 'translate(180 22)' : undefined}>
        <path d="M14 0 L-10 -3 L-10 3 Z" />
        <path d="M3 0 L-6 -13 L-9 -13 L-4 0 L-9 13 L-6 13 Z" />
        <path d="M-9 0 L-15 -6 L-13 0 L-15 6 Z" />
        {!reduced && (
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={route} calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" />
        )}
      </g>
    </svg>
  );
}
