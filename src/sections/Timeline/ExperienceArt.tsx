import type { ArtKind } from '@/data/experience';
import styles from './ExperienceArt.module.scss';

interface ExperienceArtProps {
  kind: ArtKind;
}

export function ExperienceArt({ kind }: ExperienceArtProps) {
  return (
    <svg
      className={styles.art}
      data-art={kind}
      viewBox="0 0 200 130"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'city-map' && <CityMap />}
      {kind === 'data-flow' && <DataFlow />}
      {kind === 'reports' && <Reports />}
      {kind === 'events' && <Events />}
    </svg>
  );
}

function CityMap() {
  return (
    <>
      <rect className={styles.bg} x="0" y="0" width="200" height="130" />

      <rect className={styles.block} x="8" y="10" width="40" height="26" />
      <rect className={styles.block} x="54" y="10" width="28" height="26" />
      <rect className={styles.block} x="8" y="42" width="24" height="30" />
      <rect className={styles.block} x="38" y="42" width="44" height="30" />
      <rect className={styles.block} x="8" y="78" width="36" height="42" />
      <rect className={styles.block} x="50" y="78" width="32" height="42" />

      <path className={styles.river} d="M 92 0 C 80 40, 112 70, 96 130" />

      <g className={styles.hall}>
        <path d="M 112 52 L 152 30 L 192 52 Z" />
        <rect x="116" y="56" width="8" height="34" />
        <rect x="132" y="56" width="8" height="34" />
        <rect x="148" y="56" width="8" height="34" />
        <rect x="164" y="56" width="8" height="34" />
        <rect x="180" y="56" width="8" height="34" />
        <rect x="108" y="94" width="88" height="8" />
        <rect x="102" y="104" width="100" height="8" />
      </g>

      <path className={styles.route} d="M 20 100 L 20 56 L 60 56 L 60 24 L 96 24" />
      <rect className={styles.pin} x="14" y="94" width="12" height="12" />
      <rect className={styles.pin} x="90" y="18" width="12" height="12" />
      <rect className={styles.pin} x="54" y="50" width="12" height="12" />
    </>
  );
}

function DataFlow() {
  return (
    <>
      <rect className={styles.bg} x="0" y="0" width="200" height="130" />
      <g className={styles.db}>
        <rect x="14" y="22" width="48" height="14" />
        <rect x="14" y="40" width="48" height="14" />
        <rect x="14" y="58" width="48" height="14" />
        <rect className={styles.signalFill} x="20" y="26" width="8" height="6" />
        <rect className={styles.signalFill} x="20" y="44" width="8" height="6" />
        <rect className={styles.signalFill} x="20" y="62" width="8" height="6" />
      </g>
      <path className={styles.route} d="M 62 47 L 96 47 L 96 24 L 134 24 M 96 47 L 134 47 M 96 47 L 96 70 L 134 70" />
      <rect className={styles.node} x="134" y="16" width="20" height="16" />
      <rect className={styles.node} x="134" y="39" width="20" height="16" />
      <rect className={styles.node} x="134" y="62" width="20" height="16" />
      <rect className={styles.pin} x="78" y="41" width="12" height="12" />
      <rect className={styles.pin} x="112" y="18" width="12" height="12" />
      <rect className={styles.pin} x="112" y="64" width="12" height="12" />

      <g className={styles.bars}>
        <rect x="20" y="104" width="14" height="16" />
        <rect x="40" y="94" width="14" height="26" />
        <rect x="60" y="84" width="14" height="36" />
        <rect x="80" y="98" width="14" height="22" />
        <rect x="100" y="78" width="14" height="42" />
        <rect x="120" y="90" width="14" height="30" />
        <rect x="140" y="70" width="14" height="50" />
      </g>
      <rect className={styles.node} x="164" y="22" width="26" height="62" />
      <rect className={styles.pin} x="170" y="30" width="14" height="6" />
      <rect className={styles.pin} x="170" y="42" width="14" height="6" />
    </>
  );
}

function Reports() {
  return (
    <>
      <rect className={styles.bg} x="0" y="0" width="200" height="130" />
      <g className={styles.sheet}>
        <rect x="10" y="12" width="104" height="104" />
        <rect className={styles.head} x="10" y="12" width="104" height="14" />
        <path d="M 10 42 H 114 M 10 58 H 114 M 10 74 H 114 M 10 90 H 114 M 46 12 V 116 M 80 12 V 116" />
        <rect className={styles.signalFill} x="14" y="45" width="28" height="9" />
        <rect className={styles.signalFill} x="84" y="77" width="26" height="9" />
      </g>

      <rect className={styles.node} x="124" y="12" width="68" height="60" />
      <path className={styles.line} d="M 130 62 L 144 48 L 158 54 L 172 30 L 186 22" />
      <rect className={styles.pin} x="141" y="45" width="6" height="6" />
      <rect className={styles.pin} x="169" y="27" width="6" height="6" />
      <rect className={styles.pin} x="183" y="19" width="6" height="6" />

      <rect className={styles.lens} x="132" y="84" width="32" height="32" />
      <path className={styles.handle} d="M 162 114 L 188 124" />
    </>
  );
}

function Events() {
  return (
    <>
      <rect className={styles.bg} x="0" y="0" width="200" height="130" />
      <g className={styles.sheet}>
        <rect x="10" y="10" width="76" height="68" />
        <rect className={styles.head} x="10" y="10" width="76" height="14" />
        <path d="M 10 40 H 86 M 10 54 H 86 M 10 66 H 86 M 29 24 V 78 M 48 24 V 78 M 67 24 V 78" />
        <rect className={styles.signalFill} x="49" y="42" width="18" height="12" />
      </g>

      <g className={styles.ticket}>
        <path d="M 100 14 H 188 V 34 A 6 6 0 0 0 188 46 V 66 H 100 V 46 A 6 6 0 0 0 100 34 Z" />
        <path className={styles.perf} d="M 148 14 V 66" />
        <rect className={styles.signalFill} x="108" y="24" width="30" height="8" />
        <rect className={styles.node} x="108" y="40" width="22" height="6" />
      </g>

      <g className={styles.people}>
        <rect x="26" y="86" width="14" height="14" />
        <rect x="18" y="104" width="30" height="20" />
        <rect x="76" y="82" width="16" height="16" className={styles.signalFill} />
        <rect x="66" y="102" width="36" height="22" className={styles.signalFill} />
        <rect x="126" y="86" width="14" height="14" />
        <rect x="118" y="104" width="30" height="20" />
      </g>
      <path className={styles.route} d="M 48 112 H 66 M 102 112 H 118" />
      <path className={styles.star} d="M 168 84 L 173 98 L 188 98 L 176 107 L 181 121 L 168 112 L 155 121 L 160 107 L 148 98 L 163 98 Z" />
    </>
  );
}
