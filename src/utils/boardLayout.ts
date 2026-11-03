export interface Point {
  x: number;
  y: number;
}

export interface BoardLayout {
  points: Point[];
  height: number;
  size: number;
  perRow: number;
}

const MAX_SIZE = 120;
const MIN_SIZE = 50;
const ROW = 1.34;
const TAIL = 0.3;
const SPAN = 0.8;

interface Plan {
  rows: number;
  perRow: number;
  size: number;
}

function plan(count: number, width: number, height: number | null): Plan {
  if (height !== null) {
    let best: Plan | null = null;
    for (let rows = 1; rows <= count; rows += 1) {
      const perRow = Math.ceil(count / rows);
      if (perRow < 3 || rows !== Math.ceil(count / perRow)) continue;
      const size = Math.min((width / perRow) * SPAN, height / (rows * ROW + TAIL), MAX_SIZE);
      if (!best || size > best.size + 0.5) best = { rows, perRow, size };
    }
    if (best && best.size >= MIN_SIZE) return best;
  }
  const perRow = width >= 520 ? 4 : 3;
  const rows = Math.ceil(count / perRow);
  return { rows, perRow: Math.ceil(count / rows), size: Math.min((width / perRow) * SPAN, MAX_SIZE + 24) };
}

export function layoutBoard(count: number, width: number, height: number | null): BoardLayout {
  const { rows, perRow, size } = plan(count, width, height);
  const cell = width / perRow;
  const rowHeight = size * ROW;
  const margin = size / 2 + 12;

  const points = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / perRow);
    const offset = index % perRow;
    const column = row % 2 === 0 ? offset : perRow - 1 - offset;
    const arch = perRow > 1 ? Math.sin((offset / (perRow - 1)) * Math.PI) : 0;
    const sway = Math.sin(index * 2.1) * cell * 0.06;
    const x = Math.min(width - margin, Math.max(margin, (column + 0.5) * cell + sway));
    const y =
      (size * TAIL) / 2 + row * rowHeight + rowHeight / 2 - arch * rowHeight * 0.1 + Math.sin(index * 1.3 + 0.7) * rowHeight * 0.05;
    return { x, y };
  });

  return { points, height: rows * rowHeight + size * TAIL, size, perRow };
}

const fixed = (value: number) => value.toFixed(1);

interface Curve {
  from: Point;
  c1: Point;
  c2: Point;
  to: Point;
}

function curves(points: Point[]): Curve[] {
  const list: Curve[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    list.push({
      from: p1,
      c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      to: p2,
    });
  }
  return list;
}

export function trailPath(points: Point[]): string {
  if (points.length < 2) return '';
  let d = `M${fixed(points[0].x)} ${fixed(points[0].y)}`;
  for (const { c1, c2, to } of curves(points)) {
    d += ` C${fixed(c1.x)} ${fixed(c1.y)} ${fixed(c2.x)} ${fixed(c2.y)} ${fixed(to.x)} ${fixed(to.y)}`;
  }
  return d;
}

function curveLength({ from, c1, c2, to }: Curve): number {
  const steps = 16;
  let length = 0;
  let last = from;
  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const u = 1 - t;
    const x = u * u * u * from.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * to.x;
    const y = u * u * u * from.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * to.y;
    length += Math.hypot(x - last.x, y - last.y);
    last = { x, y };
  }
  return length;
}

export function trailFraction(points: Point[], index: number): number {
  const lengths = curves(points).map(curveLength);
  const total = lengths.reduce((sum, value) => sum + value, 0);
  if (total === 0) return 0;
  const walked = lengths.slice(0, Math.max(0, index)).reduce((sum, value) => sum + value, 0);
  return Math.min(1, walked / total);
}
