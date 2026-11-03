import { useLang } from '@/i18n/hooks';
import { LANGS, type Lang } from '@/i18n/types';
import { cx } from '@/utils/classNames';
import styles from './LanguageToggle.module.scss';

const LABEL: Record<Lang, string> = { pt: 'PT', en: 'EN' };

export function LanguageToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div className={styles.toggle} role="group" aria-label={t.common.langGroup}>
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            className={cx(styles.option, active && styles.active)}
            aria-pressed={active}
            lang={code === 'pt' ? 'pt-BR' : 'en'}
            aria-label={code === 'pt' ? t.common.switchToPt : t.common.switchToEn}
            onClick={() => setLang(code)}
          >
            {LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
