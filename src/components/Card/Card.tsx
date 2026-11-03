import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/classNames';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  dark?: boolean;
}

export function Card({ children, dark = false, className, ...rest }: CardProps) {
  return (
    <div className={cx(styles.card, dark && styles.dark, className)} {...rest}>
      {children}
    </div>
  );
}
