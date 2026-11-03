import { useRef } from 'react';
import { FramedPhoto } from '@/components/FramedPhoto/FramedPhoto';
import { Section } from '@/components/Section/Section';
import photo from '@/assets/gabriel.jpg';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { useT } from '@/i18n/hooks';
import { Education } from './Education';
import { ExchangeBlock } from './ExchangeBlock';
import { Recommendations } from './Recommendations';
import styles from './About.module.scss';

export function About() {
  const { about } = useT();
  const parallaxRef = useRef<HTMLDivElement>(null);
  usePointerParallax(parallaxRef);

  const title = (
    <>
      {about.titlePre}
      <mark className={styles.mark}>{about.titleHighlight}</mark>
      {about.titlePost}
    </>
  );

  const improving = [about.improving1, about.improving2, about.improving3, about.improving4];

  return (
    <Section id="about" index="01" kicker={about.sectionTitle} title={title}>
      <div className={styles.intro}>
        <div ref={parallaxRef} className={styles.photoWrap}>
          <FramedPhoto src={photo} alt={about.photoAlt} />
          <ul className={styles.floating}>
            <li className={`${styles.chip} ${styles.chipExchange}`}>
              <span className={styles.chipLabel}>{about.cardExchangeLabel}</span>
              <strong>{about.cardExchangeValue}</strong>
            </li>
            <li className={`${styles.chip} ${styles.chipFocus}`}>
              <span className={styles.chipLabel}>{about.cardFocusLabel}</span>
              <strong>{about.cardFocusValue}</strong>
            </li>
            <li className={`${styles.chip} ${styles.chipStack}`}>
              <span className={styles.chipLabel}>{about.cardStackLabel}</span>
              <strong>{about.cardStackValue}</strong>
            </li>
          </ul>
        </div>

        <div className={styles.copy}>
          <p className={styles.body}>{about.body}</p>

          <aside className={styles.improving} aria-labelledby="improving-title">
            <h3 id="improving-title" className={styles.improvingTitle}>
              {about.improvingTitle}
            </h3>
            <ul className={styles.improvingList}>
              {improving.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <Education />
      <ExchangeBlock />
      <Recommendations />
    </Section>
  );
}
