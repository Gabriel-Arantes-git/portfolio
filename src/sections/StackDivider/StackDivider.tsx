import { Marquee } from '@/components/Marquee/Marquee';
import { marqueeStack } from '@/data/stack';
import { useLocalized } from '@/i18n/hooks';
import styles from './StackDivider.module.scss';

export function StackDivider() {
  const l = useLocalized();
  const words = marqueeStack.map((w) => (typeof w === 'string' ? w : l(w)));
  return (
    <div className={styles.divider} role="presentation">
      <div className={styles.shadowBand} />
      <div className={styles.band}>
        <Marquee words={words} />
      </div>
    </div>
  );
}
