import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/utils/classNames';
import styles from './Section.module.scss';

export type RevealStyle = 'rise' | 'drop' | 'fade';

interface SectionProps {
  id: string;

  index: string;
  title: ReactNode;

  kicker?: string;
  children: ReactNode;

  dark?: boolean;
  compact?: boolean;
  reveal?: RevealStyle;
  className?: string;
}

export function Section({
  id,
  index,
  title,
  kicker,
  children,
  dark = false,
  compact = false,
  reveal = 'rise',
  className,
}: SectionProps) {
  const headingId = `${id}-title`;
  const ref = useRef<HTMLElement>(null);
  const seen = useReveal(ref);
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      data-revealed={seen || undefined}
      className={cx(
        styles.section,
        dark && styles.dark,
        compact && styles.compact,
        styles[reveal],
        seen ? styles.revealed : styles.pending,
        className,
      )}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.index} aria-hidden="true">
            {index}
          </span>
          <div className={styles.heading}>
            {kicker && <span className={styles.kicker}>{kicker}</span>}
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
