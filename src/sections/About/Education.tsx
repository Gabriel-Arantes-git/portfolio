import { Card } from '@/components/Card/Card';
import { Tag } from '@/components/Tag/Tag';
import { education } from '@/data/education';
import { useLocalized, useT } from '@/i18n/hooks';
import styles from './Education.module.scss';

export function Education() {
  const { about } = useT();
  const l = useLocalized();

  return (
    <div className={styles.grid}>
      <Card className={styles.block}>
        <h3 className={styles.heading}>{about.educationTitle}</h3>
        <p className={styles.strong}>{l(education.degree.title)}</p>
        <p>{education.degree.school}</p>
        <p className={styles.muted}>{l(education.degree.period)}</p>
      </Card>

      <Card className={styles.block}>
        <h3 className={styles.heading}>{about.certificationsTitle}</h3>
        <ul className={styles.list}>
          {education.certifications.map((cert) => (
            <li key={cert.en}>{l(cert)}</li>
          ))}
        </ul>
      </Card>

      <Card className={styles.block}>
        <h3 className={styles.heading}>{about.englishTitle}</h3>
        <Tag highlight>{l(education.english.level)}</Tag>
        <p className={styles.muted}>{l(education.english.course)}</p>
      </Card>
    </div>
  );
}
