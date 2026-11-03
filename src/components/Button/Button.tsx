import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/classNames';
import styles from './Button.module.scss';

type Variant = 'solid' | 'outline';

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'solid', className, children, ...rest } = props;
  const classes = cx(styles.button, styles[variant], className);

  if ('href' in rest && rest.href !== undefined) {
    const { href, target, rel, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const external = /^https?:\/\//.test(href);
    return (
      <a
        className={classes}
        href={href}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        {...anchor}
      >
        {children}
      </a>
    );
  }

  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} type={type} {...button}>
      {children}
    </button>
  );
}
