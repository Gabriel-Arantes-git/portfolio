import type { CSSProperties } from 'react';
import { useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import type { Face } from './model';
import { Pawn } from './Pawn';
import styles from './Stack.module.scss';

export type Edge = 'start' | 'middle' | 'end';

interface SquareProps {
  number: number;
  face: Face;
  x: number;
  y: number;
  size: number;
  edge: Edge;
  up: boolean;
  active: boolean;
  walk: number | null;
  onOpen: (trigger: HTMLElement) => void;
}

export function Square({ number, face, x, y, size, edge, up, active, walk, onOpen }: SquareProps) {
  const { stack } = useT();
  const side = face.tier === 'secondary' ? size * 0.76 : face.tier === 'primary' ? size : size * 0.92;
  const style = {
    left: x - side / 2,
    top: y - side / 2,
    width: side,
    height: side,
    '--half': `${side / 2}px`,
    '--walk': walk ?? 0,
    '--i': number - 1,
  } as CSSProperties;
  const tag = String(number).padStart(2, '0');

  if (face.isStatic) {
    return (
      <li className={cx(styles.cell, styles.now)} data-active={active || undefined} style={style}>
        <button
          type="button"
          className={styles.piece}
          aria-haspopup="true"
          onClick={(event) => onOpen(event.currentTarget)}
        >
          <Pawn className={styles.pawnIcon} />
          <strong className={styles.pieceName}>{face.name}</strong>
        </button>
      </li>
    );
  }

  return (
    <li
      className={cx(styles.cell, styles[face.tier], face.featured && styles.featured)}
      data-edge={edge}
      data-up={up || undefined}
      data-active={active || undefined}
      data-walked={walk !== null || undefined}
      style={style}
    >
      <button type="button" className={styles.stone} aria-haspopup="true" onClick={(event) => onOpen(event.currentTarget)}>
        <span className={styles.number}>{tag}</span>
        <span className={styles.kind}>{face.kind}</span>
        <strong className={styles.name}>{face.name}</strong>
        {face.detail && <span className={styles.detail}>{face.detail}</span>}
      </button>

      <div className={styles.bubble} role="group" aria-label={face.name}>
        <p className={styles.popKind}>{face.kind}</p>
        <p className={styles.popName}>{face.name}</p>
        {face.chips.length > 0 && (
          <p className={styles.chips}>
            {face.chips.map((chip) => (
              <span key={chip} className={styles.chip}>
                {chip}
              </span>
            ))}
          </p>
        )}
        <p className={styles.popText}>{face.meta}</p>
        <p className={styles.more} aria-hidden="true">
          {stack.more} ↗
        </p>
      </div>
    </li>
  );
}
