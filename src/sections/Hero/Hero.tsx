import { useCallback, useRef } from 'react';
import { PipelineCanvas } from '@/components/PipelineCanvas/PipelineCanvas';
import { profile } from '@/data/profile';
import { useT } from '@/i18n/hooks';
import type { Rect } from '@/utils/pipeline';
import styles from './Hero.module.scss';

export function Hero() {
  const t = useT();
  const { hero } = t;
  const heroRef = useRef<HTMLElement>(null);
  const stages = [hero.stageExtract, hero.stageTransform, hero.stageLoad, hero.stageApi];

  const getObstacles = useCallback((): Rect[] => {
    const root = heroRef.current;
    if (!root) return [];
    const base = root.getBoundingClientRect();
    const marked = [...root.querySelectorAll<HTMLElement>('[data-avoid]')];
    const bar = document.querySelector<HTMLElement>('header nav');
    return (bar ? [...marked, bar] : marked).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
    });
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
      <PipelineCanvas
        labels={stages}
        counterLabel={hero.processed}
        rejectedLabel={hero.rejected}
        bubbleText={{
          source: hero.bubbleSource,
          rows: hero.bubbleRows,
          normalizing: hero.bubbleNormalizing,
          batch: hero.bubbleBatch,
        }}
        getObstacles={getObstacles}
      />

      <div className={styles.content}>
        <p className={styles.kicker} data-avoid>
          {hero.kicker}
        </p>
        <h1 id="hero-title" className={styles.name}>
          <span data-avoid>{profile.firstName}</span>
          <span className={styles.accent} data-avoid>
            {profile.lastName}
          </span>
        </h1>
        <p className={styles.role} data-avoid>
          {hero.role}
        </p>
      </div>
    </section>
  );
}
