import type { ReactNode } from 'react';
import { cx } from '@/utils/classNames';
import styles from './Tag.module.scss';

interface TagProps {
  children: ReactNode;

  highlight?: boolean;
  className?: string;
}

export function Tag({ children, highlight = false, className }: TagProps) {
  return <span className={cx(styles.tag, highlight && styles.highlight, className)}>{children}</span>;
}
