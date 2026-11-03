import type { Point } from '@/utils/boardLayout';

export type SceneryKind =
  | 'tree'
  | 'pine'
  | 'mountain'
  | 'rock'
  | 'flag'
  | 'house'
  | 'tag'
  | 'braces'
  | 'terminal'
  | 'branch'
  | 'database';

export interface Prop {
  kind: SceneryKind;
  x: number;
  y: number;
  size: number;
}

const KINDS: SceneryKind[] = ['pine', 'tag', 'mountain', 'terminal', 'flag', 'braces', 'tree', 'branch', 'database', 'house'];

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

function segmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function placeScenery(points: Point[], width: number, height: number, size: number, limit = 9): Prop[] {
  const step = size * 0.5;
  const margin = size * 0.4;
  const prop = size * 0.5;
  const candidates: Point[] = [];

  for (let y = margin; y <= height - margin; y += step) {
    for (let x = margin; x <= width - margin; x += step) {
      const spot = { x, y };
      const clear =
        points.every((point) => Math.hypot(point.x - x, point.y - y) >= size * 0.85) &&
        points.every((point, index) => index === 0 || segmentDistance(spot, points[index - 1], point) >= size * 0.5);
      if (clear) candidates.push(spot);
    }
  }

  candidates.sort((a, b) => hash(a.x, a.y) - hash(b.x, b.y));
  const picked: Point[] = [];
  for (const spot of candidates) {
    if (picked.length >= limit) break;
    if (picked.every((other) => Math.hypot(other.x - spot.x, other.y - spot.y) >= size * 1.4)) picked.push(spot);
  }

  return picked.map((spot, index) => ({ kind: KINDS[index % KINDS.length], x: spot.x, y: spot.y, size: prop }));
}
