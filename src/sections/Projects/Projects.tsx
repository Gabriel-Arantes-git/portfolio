import { useState } from 'react';
import { Section } from '@/components/Section/Section';
import { SCOPES, projectsByScope, type Project } from '@/data/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSwitchTransition } from '@/hooks/useSwitchTransition';
import { useT } from '@/i18n/hooks';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { ScopeTabs, panelId, tabId } from './ScopeTabs';
import styles from './Projects.module.scss';

export function Projects() {
  const { projects: tp } = useT();
  const reduced = useReducedMotion();
  const { active, shown, phase, direction, select } = useSwitchTransition(SCOPES[0], SCOPES, reduced);
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <Section id="projects" index="03" title={tp.sectionTitle}>
      <ScopeTabs active={active} onSelect={select} />

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        className={styles.panel}
        data-phase={phase}
        style={{ '--dir': direction } as React.CSSProperties}
      >
        <ul className={styles.grid}>
          {projectsByScope(shown).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={setOpen} />
          ))}
        </ul>
      </div>

      <ProjectDetail project={open} onClose={() => setOpen(null)} />
    </Section>
  );
}
