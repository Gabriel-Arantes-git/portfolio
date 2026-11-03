import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createWorld, findHovered, inject, reject, resize, step, warmUp } from '@/utils/pipeline';
import type { PipelineWorld, Pointer, Rect } from '@/utils/pipeline';
import { drawPipeline, readPalette, type BubbleText, type Palette } from './draw';
import styles from './PipelineCanvas.module.scss';

interface PipelineCanvasProps {
  labels: string[];

  counterLabel: string;

  rejectedLabel: string;

  bubbleText: BubbleText;

  getObstacles?: () => Rect[];
  className?: string;
}

const MAX_DPR = 2;
const SMALL_SCREEN = 640;

export function PipelineCanvas({
  labels,
  counterLabel,
  rejectedLabel,
  bubbleText,
  getObstacles,
  className,
}: PipelineCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<PipelineWorld | null>(null);
  const pointerRef = useRef<Pointer | null>(null);
  const paletteRef = useRef<Palette | null>(null);
  const textRef = useRef({ labels, counterLabel, rejectedLabel, bubbleText });
  textRef.current = { labels, counterLabel, rejectedLabel, bubbleText };
  const obstaclesRef = useRef(getObstacles);
  obstaclesRef.current = getObstacles;

  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const inView = useInView(wrapRef);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const world = worldRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !world || !ctx) return;
    paletteRef.current ??= readPalette();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const hovered = findHovered(world, pointerRef.current);
    drawPipeline(ctx, world, paletteRef.current, {
      labels: textRef.current.labels,
      counterLabel: textRef.current.counterLabel,
      rejectedLabel: textRef.current.rejectedLabel,
      bubble: textRef.current.bubbleText,
      pointer: pointerRef.current,
      hovered,
      obstacles: hovered ? (obstaclesRef.current?.() ?? []) : [],
      time: performance.now(),
      animate: !reducedRef.current,
    });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const fit = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      if (worldRef.current) {
        resize(worldRef.current, width, height);
      } else {
        const world = createWorld(width, height, {
          maxRecords: width < SMALL_SCREEN ? 30 : 70,
        });
        warmUp(world, 8);
        worldRef.current = world;
      }
      render();
    };

    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [render]);

  const labelKey = labels.join('|');
  const bubbleKey = Object.values(bubbleText).join('|');
  useEffect(() => {
    render();
  }, [labelKey, counterLabel, rejectedLabel, bubbleKey, reduced, render]);

  useAnimationLoop((dt) => {
    const world = worldRef.current;
    if (!world) return;
    step(world, dt, pointerRef.current);
    render();
  }, inView && !reduced);

  const toLocal = (event: PointerEvent<HTMLDivElement>): Pointer => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${className ?? ''}`.trim()}
      aria-hidden="true"
      onPointerMove={(e) => {
        pointerRef.current = toLocal(e);
        if (reduced) render();
      }}
      onPointerLeave={() => {
        pointerRef.current = null;
        if (reduced) render();
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== 'mouse') pointerRef.current = null;
      }}
      onPointerDown={(e) => {
        const world = worldRef.current;
        if (!world || reduced) return;
        const p = toLocal(e);
        pointerRef.current = p;

        const hit = findHovered(world, p);
        if (hit) reject(world, hit);
        else inject(world, p.x, p.y);
      }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
