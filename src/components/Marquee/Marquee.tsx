import { cx } from '@/utils/classNames';
import styles from './Marquee.module.scss';

interface MarqueeProps {
  words: readonly string[];

  repeat?: number;
  className?: string;
}

export function Marquee({ words, repeat = 1, className }: MarqueeProps) {
  const half = Array.from({ length: repeat }, (_, round) =>
    words.map((word) => (
      <span key={`${round}-${word}`} className={styles.item}>
        {word}
        <span className={styles.sep}>■</span>
      </span>
    )),
  );

  return (
    <div className={cx(styles.marquee, className)} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.half}>{half}</div>
        <div className={styles.half}>{half}</div>
      </div>
    </div>
  );
}
