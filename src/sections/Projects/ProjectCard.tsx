import type { CSSProperties } from 'react';
import { CodeSnippet } from '@/components/CodeSnippet/CodeSnippet';
import { Tag } from '@/components/Tag/Tag';
import type { Project } from '@/data/projects';
import { useLocalized, useT } from '@/i18n/hooks';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const { projects: tp } = useT();
  const l = useLocalized();
  const badge = typeof project.badge === 'string' ? project.badge : l(project.badge);
  const lines = project.snippet.map((line) => ({
    kind: line.kind,
    text: typeof line.text === 'string' ? line.text : l(line.text),
  }));

  return (
    <li className={styles.item} style={{ '--i': index } as CSSProperties}>
      <article className={styles.card} onClick={() => onOpen(project)}>
        <header className={styles.top}>
          <span className={styles.kicker}>{l(project.kicker)}</span>
          <span className={styles.meta}>
            <span className={styles.metaText}>{project.credit ? l(project.credit.text) : l(project.meta)}</span>
            <span className={styles.badge}>{badge}</span>
          </span>
        </header>

        <div className={styles.body}>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.tagline}>{l(project.tagline)}</p>
          <ul className={styles.bullets}>
            {l(project.highlights)
              .slice(0, 3)
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </ul>
          <CodeSnippet lines={lines} />
        </div>

        <footer className={styles.foot}>
          <p className={styles.tags}>
            {project.tech.map((tech) => {
              const text = typeof tech === 'string' ? tech : l(tech);
              return <Tag key={text}>{text}</Tag>;
            })}
          </p>
          <button type="button" className={styles.more} aria-haspopup="dialog">
            {tp.details} <span aria-hidden="true">↗</span>
            <span className="sr-only"> — {project.name}</span>
          </button>
        </footer>
      </article>
    </li>
  );
}
