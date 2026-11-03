import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { Tag } from '@/components/Tag/Tag';
import type { Project } from '@/data/projects';
import { useLocalized, useT } from '@/i18n/hooks';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const { projects: tp } = useT();
  const l = useLocalized();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    if (!project && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [project]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="project-detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className={styles.body}>
          <header className={styles.header}>
            <h3 id="project-detail-title" className={styles.title}>
              {project.name}
            </h3>
            <Button variant="outline" onClick={onClose}>
              {tp.close}
            </Button>
          </header>

          <p className={styles.tagline}>{l(project.tagline)}</p>

          {l(project.description).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <h4 className={styles.label}>{tp.highlightsTitle}</h4>
          <ul className={styles.list}>
            {l(project.highlights).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {project.quote && (
            <blockquote className={styles.quote}>
              <p>“{l(project.quote.text)}”</p>
              <footer>
                {tp.quoteBy}: {project.quote.author}
              </footer>
            </blockquote>
          )}

          <h4 className={styles.label}>{tp.techTitle}</h4>
          <p className={styles.tags}>
            {project.tech.map((tech) => {
              const text = typeof tech === 'string' ? tech : l(tech);
              return <Tag key={text}>{text}</Tag>;
            })}
          </p>

          {project.team && (
            <>
              <h4 className={styles.label}>{tp.teamTitle}</h4>
              <p>{project.team.join(' · ')}</p>
            </>
          )}

          {project.credit && (
            <p className={styles.credit}>
              <a href={project.credit.href} target="_blank" rel="noopener noreferrer">
                {l(project.credit.text)}
              </a>
            </p>
          )}

          {project.status && <p className={styles.status}>{l(project.status)}</p>}

          {project.links.length > 0 && (
            <p className={styles.links}>
              {project.links.map((link) => (
                <Button key={link.href} href={link.href}>
                  {l(link.label)}
                </Button>
              ))}
            </p>
          )}
        </div>
      )}
    </dialog>
  );
}
