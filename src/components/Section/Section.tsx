import type { ReactNode } from 'react';
import { cx } from '@/utils/classNames';
import styles from './Section.module.scss';

interface SectionProps {
  id: string;

  index: string;
  title: ReactNode;

  kicker?: string;
  children: ReactNode;

  dark?: boolean;
  className?: string;
}

export function Section({ id, index, title, kicker, children, dark = false, className }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cx(styles.section, dark && styles.dark, className)}>
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
