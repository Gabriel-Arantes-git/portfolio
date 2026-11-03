import { cx } from '@/utils/classNames';
import styles from './CodeSnippet.module.scss';

type Kind = 'cmd' | 'out' | 'add' | 'del' | 'note' | 'ctx';

interface CodeSnippetProps {
  lines: ReadonlyArray<{ kind: Kind; text: string }>;
  className?: string;
}

export function CodeSnippet({ lines, className }: CodeSnippetProps) {
  return (
    <pre className={cx(styles.snippet, className)} aria-hidden="true">
      {lines.map((line, index) => (
        <span key={index} className={cx(styles.line, styles[line.kind])}>
          {line.text}
        </span>
      ))}
    </pre>
  );
}
