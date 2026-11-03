import { Section } from '@/components/Section/Section';
import { cx } from '@/utils/classNames';
import { primaryStack, secondaryStack } from '@/data/stack';
import { useLocalized, useT } from '@/i18n/hooks';
import styles from './Stack.module.scss';

export function Stack() {
  const { stack } = useT();
  const l = useLocalized();

  return (
    <Section id="stack" index="04" title={stack.sectionTitle}>
      <h3 className={styles.label}>{stack.primaryTitle}</h3>
      <ul className={styles.primary}>
        {primaryStack.map((tech) => {
          const name = typeof tech.name === 'string' ? tech.name : l(tech.name);
          const detail = typeof tech.detail === 'string' ? tech.detail : tech.detail ? l(tech.detail) : null;
          return (
            <li key={tech.kind.en + name} className={cx(styles.big, tech.featured && styles.featured)}>
              <span className={styles.kind}>{l(tech.kind)}</span>
              <strong className={styles.name}>{name}</strong>
              {detail && <span className={styles.detail}>{detail}</span>}
            </li>
          );
        })}
      </ul>

      <h3 className={styles.label}>{stack.secondaryTitle}</h3>
      <ul className={styles.secondary}>
        {secondaryStack.map((name) => (
          <li key={name} className={styles.chip}>
            {name}
          </li>
        ))}
      </ul>
    </Section>
  );
}
