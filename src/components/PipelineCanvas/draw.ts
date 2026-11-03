import { placeBubble, shakeOffset, stageWidth } from '@/utils/pipeline';
import type { PipelineRecord, PipelineWorld, Pointer, Rect } from '@/utils/pipeline';

export interface Palette {
  cranberry: string;
  plum: string;
  taupe: string;
  beige: string;
  signal: string;
  mono: string;
}

export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => css.getPropertyValue(name).trim();
  return {
    cranberry: get('--c-cranberry'),
    plum: get('--c-plum'),
    taupe: get('--c-taupe'),
    beige: get('--c-beige'),
    signal: get('--c-signal'),
    mono: get('--font-mono'),
  };
}

export interface BubbleText {
  source: string;
  rows: string;
  normalizing: string;
  batch: string;
}

export interface DrawOptions {
  labels: string[];
  counterLabel: string;
  rejectedLabel: string;
  pointer: Pointer | null;

  hovered: PipelineRecord | null;

  time: number;

  animate: boolean;
  bubble: BubbleText;

  obstacles: readonly Rect[];
}

export const BUBBLE_W = 224;
export const BUBBLE_H = 100;
const HEADER_H = 22;

const pad4 = (n: number) => String(n).padStart(4, '0');
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const fake = {
  rows: (id: number) => 120 + ((id * 379) % 880),
  batch: (id: number) => 10 + ((id * 13) % 90),
  latency: (id: number) => 8 + ((id * 7) % 34),
};

type PacketKind = 'hollow' | 'solid' | 'signal';

function packet(ctx: CanvasRenderingContext2D, p: Palette, x: number, y: number, size: number, kind: PacketKind): void {
  if (kind === 'hollow') {
    ctx.strokeStyle = p.cranberry;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
  } else {
    ctx.fillStyle = kind === 'signal' ? p.signal : p.cranberry;
    ctx.fillRect(x, y, size, size);
  }
}

interface Body {
  ctx: CanvasRenderingContext2D;
  p: Palette;

  x: number;
  y: number;
  w: number;
  record: PipelineRecord;
  text: BubbleText;

  phase: (i: number, speed: number) => number;
  time: number;
  animate: boolean;
}

function line(b: Body, text: string, dy: number, color: string): void {
  b.ctx.fillStyle = color;
  b.ctx.font = `700 11px ${b.p.mono}`;
  b.ctx.textAlign = 'left';
  b.ctx.fillText(text, b.x, b.y + dy);
}

function dots(b: Body, x0: number, x1: number, ty: number): void {
  b.ctx.fillStyle = b.p.plum;
  for (let x = x0; x < x1; x += 9) b.ctx.fillRect(x, ty - 1, 3, 3);
}

function bodyExtract(b: Body): void {
  const { ctx, p, x, y, w, record, text } = b;
  line(b, `${text.source.toUpperCase()}: erp_legado`, 14, p.cranberry);
  line(b, `${text.rows.toUpperCase()}: ${fake.rows(record.id)}`, 29, p.plum);
  const ty = y + 56;
  const x0 = x + 20;
  const x1 = x + w - 12;
  ctx.fillStyle = p.cranberry;
  for (let k = 0; k < 3; k += 1) ctx.fillRect(x, ty - 8 + k * 6, 14, 4);
  dots(b, x0, x1, ty);
  for (let i = 0; i < 3; i += 1) packet(ctx, p, x0 + b.phase(i, 0.0006) * (x1 - x0 - 10), ty - 5, 10, 'hollow');
}

function bodyTransform(b: Body): void {
  const { ctx, p, x, y, w, record, text } = b;
  line(b, `${text.normalizing.toUpperCase()}…`, 14, p.cranberry);
  const pct = b.animate ? (b.time * 0.00035 + record.id * 0.13) % 1 : 0.62;
  ctx.strokeStyle = p.cranberry;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 21, w - 2, 10);
  ctx.fillStyle = p.signal;
  ctx.fillRect(x + 3, y + 23, (w - 6) * pct, 6);

  const ty = y + 56;
  const x0 = x + 2;
  const x1 = x + w - 12;
  dots(b, x0, x1, ty);
  const mid = (x0 + x1) / 2;
  ctx.strokeStyle = p.cranberry;
  ctx.lineWidth = 2;
  ctx.strokeRect(mid - 9, ty - 9, 18, 18);
  ctx.beginPath();
  ctx.moveTo(mid - 9, ty + 9);
  ctx.lineTo(mid + 9, ty - 9);
  ctx.stroke();
  for (let i = 0; i < 3; i += 1) {
    const ph = b.phase(i, 0.0006);
    packet(ctx, p, x0 + ph * (x1 - x0 - 10), ty - 5, 10, ph < 0.5 ? 'hollow' : 'solid');
  }
}

function bodyLoad(b: Body): void {
  const { ctx, p, x, y, w, record, text } = b;
  line(b, 'INSERT → postgres', 14, p.cranberry);
  line(b, `${text.batch.toUpperCase()} #${fake.batch(record.id)}`, 29, p.plum);
  const ty = y + 56;
  const dbx = x + w - 24;
  const lit = b.animate ? Math.floor(b.time / 450) % 4 : 2;
  for (let k = 0; k < 3; k += 1) {
    ctx.fillStyle = k < lit ? p.signal : p.plum;
    ctx.fillRect(dbx, ty - 12 + k * 8, 22, 6);
  }
  const x0 = x + 2;
  dots(b, x0, dbx - 6, ty);
  for (let i = 0; i < 3; i += 1) {
    const ph = b.phase(i, 0.0006);
    const size = 10 - 6 * ph;
    packet(ctx, p, x0 + ph * (dbx - x0 - 14), ty - size / 2, size, 'solid');
  }
}

function bodyApi(b: Body): void {
  const { ctx, p, x, y, w, record } = b;
  line(b, `GET /registros/${pad4(record.id)}`, 14, p.cranberry);
  line(b, `200 OK · ${fake.latency(record.id)} ms`, 29, p.plum);
  const ty = y + 56;
  const cx = x + w - 26;
  const x0 = x + 2;
  dots(b, x0, cx - 6, ty);
  ctx.strokeStyle = p.cranberry;
  ctx.lineWidth = 2;
  ctx.strokeRect(cx, ty - 9, 24, 16);
  ctx.fillStyle = p.cranberry;
  ctx.fillRect(cx + 8, ty + 8, 8, 3);
  ctx.beginPath();
  ctx.moveTo(cx + 6, ty - 1);
  ctx.lineTo(cx + 10, ty + 3);
  ctx.lineTo(cx + 18, ty - 5);
  ctx.strokeStyle = p.signal;
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 3; i += 1) packet(ctx, p, x0 + b.phase(i, 0.0009) * (cx - x0 - 16), ty - 5, 10, 'signal');
}

const BODY = [bodyExtract, bodyTransform, bodyLoad, bodyApi];

function headerColors(stage: number, p: Palette): { bg: string; fg: string } {
  switch (stage) {
    case 0:
      return { bg: p.plum, fg: p.beige };
    case 1:
      return { bg: p.taupe, fg: p.cranberry };
    case 2:
      return { bg: p.cranberry, fg: p.beige };
    default:
      return { bg: p.signal, fg: p.cranberry };
  }
}

function drawTail(ctx: CanvasRenderingContext2D, p: Palette, bubble: Rect, cube: Rect): void {
  const cx = cube.x + cube.w / 2;
  const cy = cube.y + cube.h / 2;
  const half = 9;
  let ax: number;
  let ay: number;
  let patch: [number, number, number, number];
  let b1: [number, number];
  let b2: [number, number];

  if (cy < bubble.y) {
    ax = clamp(cx, bubble.x + 26, bubble.x + bubble.w - 26);
    ay = bubble.y;
    b1 = [ax - half, ay];
    b2 = [ax + half, ay];
    patch = [ax - half + 1, ay - 0.5, half * 2 - 2, 4];
  } else if (cy > bubble.y + bubble.h) {
    ax = clamp(cx, bubble.x + 26, bubble.x + bubble.w - 26);
    ay = bubble.y + bubble.h;
    b1 = [ax - half, ay];
    b2 = [ax + half, ay];
    patch = [ax - half + 1, ay - 3.5, half * 2 - 2, 4];
  } else if (cx < bubble.x) {
    ax = bubble.x;
    ay = clamp(cy, bubble.y + HEADER_H + 14, bubble.y + bubble.h - 14);
    b1 = [ax, ay - half];
    b2 = [ax, ay + half];
    patch = [ax - 0.5, ay - half + 1, 4, half * 2 - 2];
  } else {
    ax = bubble.x + bubble.w;
    ay = clamp(cy, bubble.y + HEADER_H + 14, bubble.y + bubble.h - 14);
    b1 = [ax, ay - half];
    b2 = [ax, ay + half];
    patch = [ax - 3.5, ay - half + 1, 4, half * 2 - 2];
  }

  const tip = { x: clamp(ax, cube.x, cube.x + cube.w), y: clamp(ay, cube.y, cube.y + cube.h) };
  ctx.beginPath();
  ctx.moveTo(b1[0], b1[1]);
  ctx.lineTo(tip.x, tip.y);
  ctx.lineTo(b2[0], b2[1]);
  ctx.closePath();
  ctx.fillStyle = p.beige;
  ctx.fill();
  ctx.strokeStyle = p.cranberry;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = p.beige;
  ctx.fillRect(patch[0], patch[1], patch[2], patch[3]);
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  world: PipelineWorld,
  record: PipelineRecord,
  p: Palette,
  o: DrawOptions,
): void {
  const size = world.config.recordSize;
  const w = Math.min(BUBBLE_W, world.width - 16);
  const h = BUBBLE_H;
  const cube: Rect = { x: record.x, y: record.y, w: size, h: size };
  const at = placeBubble({ w: world.width, h: world.height }, cube, { w, h }, o.obstacles);
  const bubble: Rect = { x: at.x, y: at.y, w, h };
  const { bg, fg } = headerColors(record.stage, p);

  ctx.fillStyle = p.plum;
  ctx.fillRect(bubble.x + 5, bubble.y + 5, w, h);
  ctx.fillStyle = p.beige;
  ctx.fillRect(bubble.x, bubble.y, w, h);
  ctx.strokeStyle = p.cranberry;
  ctx.lineWidth = 3;
  ctx.strokeRect(bubble.x + 1.5, bubble.y + 1.5, w - 3, h - 3);

  ctx.fillStyle = bg;
  ctx.fillRect(bubble.x + 3, bubble.y + 3, w - 6, HEADER_H - 3);
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 11px ${p.mono}`;
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  const label = (o.labels[record.stage] ?? '').toUpperCase();
  ctx.fillText(`${String(record.stage + 1).padStart(2, '0')} ${label}`, bubble.x + 10, bubble.y + 17);
  ctx.textAlign = 'right';
  ctx.fillText(`#${pad4(record.id)}`, bubble.x + w - 10, bubble.y + 17);

  drawTail(ctx, p, bubble, cube);

  const phase = (i: number, speed: number) => (o.animate ? (o.time * speed + i / 3) % 1 : (i + 0.5) / 3);
  BODY[Math.min(record.stage, BODY.length - 1)]({
    ctx,
    p,
    x: bubble.x + 12,
    y: bubble.y + HEADER_H + 6,
    w: w - 24,
    record,
    text: o.bubble,
    phase,
    time: o.time,
    animate: o.animate,
  });
}

function recordFill(stage: number, count: number, p: Palette): { fill: string; hollow: boolean } {
  if (stage === 0) return { fill: p.beige, hollow: true };
  if (stage === count - 1) return { fill: p.signal, hollow: false };
  return { fill: stage % 2 === 1 ? p.taupe : p.beige, hollow: false };
}

function drawCounters(ctx: CanvasRenderingContext2D, world: PipelineWorld, p: Palette, o: DrawOptions): void {
  const { width, height, config } = world;
  const small = width < 640;
  const right = width - 14;
  const labelPx = small ? 12 : 14;
  const numberPx = small ? 20 : 28;

  const lift = small ? 52 : 0;

  const widthOf = (label: string): number => {
    ctx.font = `700 ${labelPx}px ${p.mono}`;
    const wl = ctx.measureText?.(label.toUpperCase())?.width ?? label.length * labelPx * 0.62;
    ctx.font = `700 ${numberPx}px ${p.mono}`;
    const wn = ctx.measureText?.('000000')?.width ?? 6 * numberPx * 0.62;
    return Math.max(wl, wn);
  };

  const processedW = widthOf(o.counterLabel);
  const rejectedW = widthOf(o.rejectedLabel);
  const gap = 28;
  const rejectedRight = right - processedW - gap;

  const lastLabel = o.labels[config.stageCount - 1] ?? '';
  const lastLabelEnd = (config.stageCount - 1) * stageWidth(world) + 14 + lastLabel.length * 10;
  const sideBySide = !small && rejectedRight - rejectedW >= lastLabelEnd + 16;

  const block = (x: number, label: string, value: number, valueColor: string, extra: number) => {
    ctx.textAlign = 'right';
    ctx.font = `700 ${labelPx}px ${p.mono}`;
    ctx.fillStyle = p.beige;
    ctx.globalAlpha = 0.72;
    ctx.fillText(label.toUpperCase(), x, height - 36 - lift - extra);
    ctx.globalAlpha = 1;
    ctx.fillStyle = valueColor;
    ctx.font = `700 ${numberPx}px ${p.mono}`;
    ctx.fillText(String(value).padStart(6, '0'), x, height - 10 - lift - extra);
  };

  block(right, o.counterLabel, world.processed, p.signal, 0);

  block(sideBySide ? rejectedRight : right, o.rejectedLabel, world.rejected, p.beige, sideBySide ? 0 : small ? 46 : 52);
}

export function drawPipeline(ctx: CanvasRenderingContext2D, world: PipelineWorld, palette: Palette, o: DrawOptions): void {
  const { width, height, config } = world;
  const sw = stageWidth(world);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.cranberry;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < config.stageCount; i += 1) {
    if (i % 2 === 1) {
      ctx.fillStyle = palette.plum;
      ctx.fillRect(i * sw, 0, sw, height);
    }
  }
  ctx.restore();

  ctx.strokeStyle = palette.plum;
  ctx.lineWidth = 4;
  for (let i = 1; i < config.stageCount; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * sw, 0);
    ctx.lineTo(i * sw, height);
    ctx.stroke();
  }

  if (o.pointer) {
    const index = Math.min(config.stageCount - 1, Math.max(0, Math.floor(o.pointer.x / sw)));
    ctx.strokeStyle = palette.signal;
    ctx.lineWidth = 4;
    ctx.strokeRect(index * sw + 2, 2, sw - 4, height - 4);
  }

  ctx.font = `700 ${Math.max(11, Math.min(15, sw / 12))}px ${palette.mono}`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  for (let i = 0; i < config.stageCount; i += 1) {
    const label = o.labels[i] ?? '';
    ctx.fillStyle = palette.beige;
    ctx.globalAlpha = 0.72;
    ctx.fillText(`0${i + 1}`, i * sw + 14, height - 36);
    ctx.globalAlpha = 1;
    ctx.fillText(label.toUpperCase(), i * sw + 14, height - 16);
  }

  const size = config.recordSize;
  for (const r of world.records) {
    const x = Math.round(r.x + shakeOffset(r));
    const y = Math.round(r.y);
    const { fill, hollow } = recordFill(r.stage, config.stageCount, palette);
    ctx.fillStyle = palette.plum;
    ctx.fillRect(x + 4, y + 4, size, size);
    if (hollow) {
      ctx.fillStyle = palette.cranberry;
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = fill;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
    } else {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, size, size);
    }
    if (r.fate !== 'ok') {
      ctx.strokeStyle = palette.signal;
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 1.5, y - 1.5, size + 3, size + 3);
      ctx.strokeStyle = palette.cranberry;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + size - 4, y + size - 4);
      ctx.moveTo(x + size - 4, y + 4);
      ctx.lineTo(x + 4, y + size - 4);
      ctx.stroke();
    }
  }

  if (o.hovered) {
    ctx.strokeStyle = palette.signal;
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.round(o.hovered.x) - 4, Math.round(o.hovered.y) - 4, size + 8, size + 8);
    drawBubble(ctx, world, o.hovered, palette, o);
  }

  drawCounters(ctx, world, palette, o);
}
