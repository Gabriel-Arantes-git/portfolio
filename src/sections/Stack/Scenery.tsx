import type { ReactElement } from 'react';
import type { SceneryKind } from '@/utils/scenery';
import styles from './Stack.module.scss';

interface SceneryProps {
  kind: SceneryKind;
}

const shapes: Record<SceneryKind, ReactElement> = {
  tree: (
    <>
      <rect className={styles.trunk} x="17" y="26" width="6" height="11" />
      <rect className={styles.leaf} x="7" y="6" width="26" height="22" />
    </>
  ),
  pine: (
    <>
      <rect className={styles.trunk} x="18" y="30" width="5" height="8" />
      <polygon className={styles.leaf} points="20,3 32,18 8,18" />
      <polygon className={styles.leaf} points="20,13 35,32 5,32" />
    </>
  ),
  mountain: (
    <>
      <polygon className={styles.rock} points="2,36 16,8 30,36" />
      <polygon className={styles.leaf} points="16,8 21,18 11,18" />
      <polygon className={styles.rock} points="20,36 29,18 38,36" />
    </>
  ),
  rock: (
    <>
      <polygon className={styles.rock} points="4,34 10,18 22,14 34,22 36,34" />
      <polygon className={styles.leaf} points="22,14 26,22 18,22" />
    </>
  ),
  flag: (
    <>
      <rect className={styles.trunk} x="10" y="4" width="4" height="34" />
      <polygon className={styles.pennant} points="14,5 34,12 14,19" />
    </>
  ),
  tag: (
    <>
      <rect className={styles.leaf} x="3" y="6" width="34" height="28" />
      <polyline className={styles.glyphLine} points="15,13 8,20 15,27" />
      <polyline className={styles.glyphLine} points="25,13 32,20 25,27" />
      <line className={styles.glyphLine} x1="22" y1="11" x2="18" y2="29" />
    </>
  ),
  braces: (
    <>
      <rect className={styles.leaf} x="3" y="6" width="34" height="28" />
      <path className={styles.glyphLine} d="M16 10 C12 10 13 15 13 18 C13 20 11 20 9 20 C11 20 13 20 13 22 C13 25 12 30 16 30" />
      <path className={styles.glyphLine} d="M24 10 C28 10 27 15 27 18 C27 20 29 20 31 20 C29 20 27 20 27 22 C27 25 28 30 24 30" />
    </>
  ),
  terminal: (
    <>
      <rect className={styles.screen} x="3" y="6" width="34" height="28" />
      <rect className={styles.pennant} x="3" y="6" width="34" height="6" />
      <polyline className={styles.glyph} points="9,19 15,24 9,29" />
      <line className={styles.glyph} x1="19" y1="29" x2="30" y2="29" />
    </>
  ),
  branch: (
    <>
      <line className={styles.glyphLine} x1="12" y1="10" x2="12" y2="30" />
      <path className={styles.glyphLine} d="M12 26 C12 18 28 22 28 14" />
      <rect className={styles.pennant} x="8" y="5" width="8" height="8" />
      <rect className={styles.pennant} x="8" y="27" width="8" height="8" />
      <rect className={styles.leaf} x="24" y="8" width="8" height="8" />
    </>
  ),
  database: (
    <>
      <rect className={styles.rock} x="7" y="9" width="26" height="22" />
      <ellipse className={styles.rock} cx="20" cy="31" rx="13" ry="5" />
      <ellipse className={styles.leaf} cx="20" cy="9" rx="13" ry="5" />
      <path className={styles.glyphLine} d="M7 20 C7 26 33 26 33 20" />
    </>
  ),
  house: (
    <>
      <rect className={styles.rock} x="7" y="19" width="26" height="17" />
      <polygon className={styles.pennant} points="4,19 20,5 36,19" />
      <rect className={styles.trunk} x="17" y="26" width="7" height="10" />
    </>
  ),
};

export function Scenery({ kind }: SceneryProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {shapes[kind]}
    </svg>
  );
}
