import { useRef, type KeyboardEvent } from 'react';
import { SCOPES, projectsByScope, type ScopeId } from '@/data/projects';
import { useT } from '@/i18n/hooks';
import { cx } from '@/utils/classNames';
import styles from './ScopeTabs.module.scss';

export const tabId = (scope: ScopeId) => `scope-tab-${scope}`;
export const panelId = 'scope-panel';

interface ScopeTabsProps {
  active: ScopeId;
  onSelect: (scope: ScopeId) => void;
}

export function ScopeTabs({ active, onSelect }: ScopeTabsProps) {
  const { projects: tp } = useT();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const labels: Record<ScopeId, string> = {
    own: tp.scopeOwn,
    consulting: tp.scopeConsulting,
    professional: tp.scopeProfessional,
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % SCOPES.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + SCOPES.length) % SCOPES.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = SCOPES.length - 1;
    else return;
    event.preventDefault();
    const scope = SCOPES[next];
    onSelect(scope);
    refs.current[scope]?.focus();
  };

  return (
    <div className={styles.tabs} role="tablist" aria-label={tp.scopesLabel}>
      {SCOPES.map((scope, index) => {
        const selected = scope === active;
        return (
          <button
            key={scope}
            ref={(el) => {
              refs.current[scope] = el;
            }}
            id={tabId(scope)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={cx(styles.tab, selected && styles.selected)}
            onClick={() => onSelect(scope)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            <span className={styles.count} aria-hidden="true">
              {String(projectsByScope(scope).length).padStart(2, '0')}
            </span>
            <span className={styles.label}>{labels[scope]}</span>
          </button>
        );
      })}
    </div>
  );
}
