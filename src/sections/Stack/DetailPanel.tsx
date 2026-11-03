import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import type { Detail } from './model';
import styles from './Stack.module.scss';

interface DetailPanelProps {
  detail: Detail;
  closing: boolean;
  onClose: () => void;
}

export function DetailPanel({ detail, closing, onClose }: DetailPanelProps) {
  const { stack } = useT();
  const closeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, []);

  return (
    <aside
      className={cx(styles.panel, closing && styles.closing)}
      aria-label={detail.title}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <header className={styles.bar}>
        <span className={styles.barTitle}>{stack.windowTitle}</span>
        <div ref={closeRef}>
          <Button variant="outline" onClick={onClose}>
            {stack.close}
          </Button>
        </div>
      </header>

      <div className={styles.panelBody}>
        <p className={styles.panelKind}>{detail.kind}</p>
        <h3 className={styles.panelTitle}>{detail.title}</h3>
        {detail.detail && <p className={styles.panelDetail}>{detail.detail}</p>}
        {detail.banner && <p className={styles.banner}>{detail.banner}</p>}

        {detail.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h4 className={styles.sectionHeading}>{section.heading}</h4>
            {section.chips && (
              <p className={styles.chips}>
                {section.chips.map((chip) => (
                  <span key={chip} className={styles.chip}>
                    {chip}
                  </span>
                ))}
              </p>
            )}
            {section.text && <p className={styles.sectionText}>{section.text}</p>}
            {section.items && (
              <ul className={styles.items}>
                {section.items.map((item) => (
                  <li key={(item.title ?? '') + item.text}>
                    {item.title && <strong>{item.title}</strong>}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}
