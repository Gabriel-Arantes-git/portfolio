import { Card } from '@/components/Card/Card';
import { recommendations } from '@/data/recommendations';
import { useLang, useLocalized, useT } from '@/i18n/hooks';
import styles from './Recommendations.module.scss';

export function Recommendations() {
  const { about } = useT();
  const { lang } = useLang();
  const l = useLocalized();

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{about.recommendationsTitle}</h3>
      <div className={styles.grid}>
        {recommendations.map((rec) => (
          <Card key={rec.id} className={styles.card}>
            <blockquote className={styles.quote} lang={lang === 'pt' ? 'pt-BR' : 'en'}>
              {l(rec.text).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </blockquote>
            <footer className={styles.author}>
              <img
                className={styles.avatar}
                src={rec.photo}
                alt={`${rec.author}`}
                width={72}
                height={72}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.who}>
                <strong>{rec.author}</strong>
                <span>{l(rec.role)}</span>
                <span className={styles.date}>
                  {l(rec.date)} · {l(rec.relation)}
                </span>
              </div>
            </footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
