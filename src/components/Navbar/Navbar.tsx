import { useEffect, useState } from 'react';
import { LanguageToggle } from '@/components/LanguageToggle/LanguageToggle';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolled } from '@/hooks/useScrolled';
import { useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import styles from './Navbar.module.scss';

const SECTION_IDS = ['about', 'timeline', 'projects', 'stack', 'contact'] as const;

export function Navbar() {
  const { nav } = useT();
  const floating = useScrolled(80);
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const labels: Record<(typeof SECTION_IDS)[number], string> = {
    about: nav.about,
    timeline: nav.timeline,
    projects: nav.projects,
    stack: nav.stack,
    contact: nav.contact,
  };

  return (
    <header className={cx(styles.nav, floating && styles.floating)} data-state={floating ? 'floating' : 'top'}>
      <nav className={styles.bar} aria-label={nav.label}>
        <a className={styles.brand} href="#top" aria-label={nav.home} onClick={() => setOpen(false)}>
          GA
        </a>

        <ul id="nav-links" className={cx(styles.links, open && styles.open)}>
          {SECTION_IDS.map((id) => (
            <li key={id}>
              <a
                className={styles.link}
                href={`#${id}`}
                aria-current={active === id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {labels[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.tools}>
          <LanguageToggle />
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={open ? nav.closeMenu : nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burger} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
