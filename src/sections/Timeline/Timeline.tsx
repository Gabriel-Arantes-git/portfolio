import { useRef, useState } from 'react';
import { Section } from '@/components/Section/Section';
import { Tag } from '@/components/Tag/Tag';
import { stops } from '@/data/experience';
import { useLocalized, useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import { ExperienceArt } from './ExperienceArt';
import { TimelineMap } from './TimelineMap';
import styles from './Timeline.module.scss';

export function Timeline() {
  const { timeline } = useT();
  const l = useLocalized();
  const containerRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  return (
    <Section id="timeline" index="02" title={timeline.sectionTitle} dark reveal="fade">
      <div ref={containerRef} className={styles.mapWrap}>
        <TimelineMap containerRef={containerRef} onReach={setReached} />

        <ol className={styles.list}>
          {stops.map((stop, index) => {
            const isReached = reached > index;
            const footer = stop.footer
              ? l(stop.footer)
              : stop.totalDuration
                ? `${timeline.totalLabel}: ${l(stop.totalDuration)}`
                : null;
            return (
              <li key={stop.id} className={styles.stop} data-reached={isReached}>
                <span className={cx(styles.marker, isReached && styles.markerReached)} data-marker={index} aria-hidden="true" />

                <article className={styles.card}>
                  <header className={styles.head}>
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className={styles.company}>{l(stop.role)}</h3>
                      <p className={styles.meta}>
                        {stop.company} · {stop.location}
                      </p>
                    </div>
                  </header>

                  <div className={styles.body}>
                    <div className={styles.text}>
                      <div className={styles.roleHead}>
                        <span className={styles.period}>
                          {stop.current && <Tag highlight>{timeline.current}</Tag>} {l(stop.period)}
                        </span>
                      </div>
                      <ul className={styles.summary}>
                        {l(stop.summary).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className={styles.tags}>
                        {stop.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </p>
                    </div>

                    <div className={styles.art}>
                      <ExperienceArt kind={stop.art} />
                    </div>
                  </div>

                  {footer && <footer className={styles.footer}>{footer}</footer>}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
