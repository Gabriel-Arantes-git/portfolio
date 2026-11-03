import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Section } from '@/components/Section/Section';
import { pathNodes, type PathNode } from '@/data/path';
import { useElementWidth } from '@/hooks/useElementWidth';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useTweenedPoints } from '@/hooks/useTweenedPoints';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useLocalized, useT } from '@/i18n/hooks';
import { layoutBoard, trailFraction, trailPath } from '@/utils/boardLayout';
import { cx } from '@/utils/classNames';
import { placeScenery } from '@/utils/scenery';
import { DetailPanel } from './DetailPanel';
import { detailOf, faceOf } from './model';
import { Scenery } from './Scenery';
import { Square, type Edge } from './Square';
import styles from './Stack.module.scss';

const PANEL_WIDTH = 352;
const PANEL_GAP = 24;
const WIDE = 860;
const BOTTOM = 48;
const MIN_AVAILABLE = 380;
const CLOSE_DELAY = 280;
const STEP = 70;

type Intro = 'wait' | 'play' | 'done';

function Die({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" />
      <circle cx="7.5" cy="7.5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="16.5" cy="16.5" r="1.8" />
    </svg>
  );
}

export function Stack() {
  const { stack } = useT();
  const l = useLocalized();
  const reduced = useReducedMotion();
  const viewport = useViewportHeight();
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const timer = useRef<number>(0);
  const width = useElementWidth(stage);
  const [top, setTop] = useState(230);
  const [shown, setShown] = useState<PathNode | null>(null);
  const [closing, setClosing] = useState(false);
  const seen = useReveal(stage, 0.3);
  const [intro, setIntro] = useState<Intro>(() => (reduced || typeof IntersectionObserver === 'undefined' ? 'done' : 'wait'));

  const wide = width >= WIDE;
  const open = shown !== null && !closing;
  const available = Math.max(MIN_AVAILABLE, viewport - top - BOTTOM);
  const fieldWidth = wide && open ? width - PANEL_WIDTH - PANEL_GAP : width;

  useScrollLock(open && !wide);

  useLayoutEffect(() => {
    const node = stage.current;
    const section = node?.closest('section');
    if (node && section) setTop(node.getBoundingClientRect().top - section.getBoundingClientRect().top);
  }, [width, viewport]);

  const layout = useMemo(
    () => layoutBoard(pathNodes.length, fieldWidth, wide ? available : null),
    [fieldWidth, wide, available],
  );
  const points = useTweenedPoints(layout.points, reduced);
  const props = useMemo(
    () => placeScenery(layout.points, fieldWidth, layout.height, layout.size),
    [layout, fieldWidth],
  );
  const reached = shown ? pathNodes.findIndex((node) => node.id === shown.id) : -1;
  const stageHeight = wide ? available : layout.height;
  const offset = wide ? Math.max(0, (available - layout.height) / 2) : 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (intro === 'wait' && seen) setIntro('play');
  }, [intro, seen]);

  useEffect(() => {
    if (intro !== 'play') return;
    const id = window.setTimeout(() => setIntro('done'), pathNodes.length * STEP + 1100);
    return () => window.clearTimeout(id);
  }, [intro]);

  const show = (node: PathNode, from: HTMLElement) => {
    window.clearTimeout(timer.current);
    trigger.current = from;
    setClosing(false);
    setShown(node);
  };

  const close = () => {
    setClosing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setShown(null);
        setClosing(false);
        trigger.current?.focus({ preventScroll: true });
      },
      reduced ? 0 : CLOSE_DELAY,
    );
  };

  return (
    <Section id="stack" index="04" title={stack.sectionTitle} compact reveal="fade">
      <div className={styles.legend}>
        <span className={styles.key} data-tier="primary">
          {stack.primaryTitle}
        </span>
        <span className={styles.key} data-tier="secondary">
          {stack.secondaryTitle}
        </span>
        <span className={styles.key} data-tier="featured">
          {stack.featuredTitle}
        </span>
        <span className={styles.key} data-tier="path">
          {stack.journeyTitle}
        </span>
        <Die className={styles.die} />
      </div>

      <div
        ref={stage}
        className={cx(styles.stage, open && styles.opened)}
        data-wide={wide || undefined}
        style={{ height: stageHeight } as CSSProperties}
      >
        <div
          className={styles.field}
          data-dim={(!wide && open) || undefined}
          data-intro={intro}
          style={{ width: fieldWidth, height: layout.height, top: offset } as CSSProperties}
        >
          <svg className={styles.frameSvg} width={fieldWidth} height={layout.height} aria-hidden="true" focusable="false">
            <rect className={styles.frame} x="2" y="2" width={fieldWidth - 4} height={layout.height - 4} />
            <rect className={styles.frameInner} x="9" y="9" width={fieldWidth - 18} height={layout.height - 18} />
          </svg>

          <div className={styles.scenery} aria-hidden="true">
            {props.map((prop, index) => (
              <span
                key={index}
                className={styles.prop}
                data-scenery={prop.kind}
                style={{
                  left: prop.x - prop.size / 2,
                  top: prop.y - prop.size / 2,
                  width: prop.size,
                  height: prop.size,
                  '--k': index,
                } as CSSProperties}
              >
                <Scenery kind={prop.kind} />
              </span>
            ))}
          </div>

          <svg className={styles.trail} width={fieldWidth} height={layout.height} aria-hidden="true" focusable="false">
            <defs>
              <mask id="stack-snake" maskUnits="userSpaceOnUse" x="0" y="0" width={fieldWidth} height={layout.height}>
                <path className={styles.snakeMask} pathLength={1} d={trailPath(points)} />
              </mask>
            </defs>
            <g mask="url(#stack-snake)">
                <path className={styles.dash} d={trailPath(points)} />
            </g>
            {reached > 0 && (
              <path
                key={shown?.id}
                className={styles.walked}
                pathLength={1}
                d={trailPath(points)}
                style={{ '--f': trailFraction(points, reached) } as CSSProperties}
              />
            )}
          </svg>

          <ol className={styles.board} aria-label={stack.boardLabel}>
            {pathNodes.map((node, index) => {
              const point = points[index];
              const edge: Edge = point.x < fieldWidth * 0.22 ? 'start' : point.x > fieldWidth * 0.78 ? 'end' : 'middle';
              return (
                <Square
                  key={node.id}
                  number={index + 1}
                  face={faceOf(node, l, stack)}
                  x={point.x}
                  y={point.y}
                  size={layout.size}
                  edge={edge}
                  up={point.y > layout.size * 1.7}
                  active={shown?.id === node.id}
                  walk={reached >= 0 && index <= reached ? index / Math.max(1, reached) : null}
                  onOpen={(from) => show(node, from)}
                />
              );
            })}
          </ol>
        </div>

        {shown && <DetailPanel key={shown.id} detail={detailOf(shown, l, stack)} closing={closing} onClose={close} />}
      </div>
    </Section>
  );
}
