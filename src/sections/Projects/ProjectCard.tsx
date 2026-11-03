import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
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

  return (
    <li className={styles.item} style={{ '--i': index } as React.CSSProperties}>
      <Card className={styles.card}>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.tagline}>{l(project.tagline)}</p>
        <p className={styles.tags}>
          {project.tech.map((tech) => {
            const text = typeof tech === 'string' ? tech : l(tech);
            return <Tag key={text}>{text}</Tag>;
          })}
        </p>
        {project.credit && <p className={styles.credit}>{l(project.credit.text)}</p>}
        <Button className={styles.open} onClick={() => onOpen(project)} aria-haspopup="dialog">
          {tp.details}{' '}
          <span className="sr-only">— {project.name}</span>
        </Button>
      </Card>
    </li>
  );
}
