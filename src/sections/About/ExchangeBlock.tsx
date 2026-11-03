import { useId, useState, type CSSProperties } from 'react';
import { exchange } from '@/data/exchange';
import { useLocalized, useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import { ExchangeArt } from './ExchangeArt';
import styles from './ExchangeBlock.module.scss';

export function ExchangeBlock() {
  const { about } = useT();
  const l = useLocalized();
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <section className={cx(styles.exchange, open && styles.open)} aria-label={about.exchangeSummary}>
      <button
        type="button"
        className={styles.summary}
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.heading}>
          <span className={styles.summaryTitle}>{about.exchangeSummary}</span>
          <span className={styles.program}>{exchange.program}</span>
          <span className={styles.meta}>
            {exchange.university} · {l(exchange.planned)}
          </span>
        </span>
        <span className={styles.art}>
          <ExchangeArt from={about.routeFrom} to={about.routeTo} />
        </span>
        <span className={styles.toggle} aria-hidden="true" />
      </button>

      <div id={regionId} className={styles.region} aria-hidden={!open} inert={!open}>
        <div className={styles.regionInner}>
          <div className={styles.content}>
            <p className={styles.format}>{l(exchange.format)}</p>

            <dl className={styles.facts}>
              <div>
                <dt>{about.exchangeThemeLabel}</dt>
                <dd>{l(exchange.theme)}</dd>
              </div>
              <div>
                <dt>{about.exchangeDurationLabel}</dt>
                <dd>{l(exchange.duration)}</dd>
              </div>
              <div>
                <dt>{about.exchangeObjectiveLabel}</dt>
                <dd>{l(exchange.objective)}</dd>
              </div>
            </dl>

            <h3 className={styles.modulesTitle}>{about.exchangeModulesLabel}</h3>
            <ol className={styles.modules}>
              {exchange.modules.map((module, index) => (
                <li key={module.title} className={styles.module} style={{ '--i': index } as CSSProperties}>
                  <span className={styles.badge}>
                    <span className={styles.star} aria-hidden="true" />
                    {l(module.badge)}
                  </span>
                  <h4 className={styles.moduleTitle}>{module.title}</h4>
                  <p>{l(module.description)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
