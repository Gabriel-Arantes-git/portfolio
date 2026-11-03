export interface Pt {
  x: number;
  y: number;
}

export interface Polyline {
  points: Pt[];

  cum: number[];
  total: number;

  anchors: number[];
}

export interface WaveOptions {
  amplitude?: number;

  waves?: number;

  step?: number;
}

export function buildPolyline(markers: readonly Pt[], { amplitude = 30, waves = 2, step = 12 }: WaveOptions = {}): Polyline {
  const points: Pt[] = [];
  const anchors: number[] = [];
  if (markers.length === 0) return { points, cum: [], total: 0, anchors };

  points.push({ ...markers[0] });
  for (let i = 0; i < markers.length - 1; i += 1) {
    const a = markers[i];
    const b = markers[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) {
      points.push({ ...b });
      continue;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const px = -uy;
    const py = ux;
    const n = Math.max(8, Math.ceil(dist / step));
    const phase = i % 2 === 0 ? 0 : Math.PI;
    for (let k = 1; k <= n; k += 1) {
      const t = k / n;
      const offset = amplitude * Math.sin(Math.PI * t) * Math.sin(2 * Math.PI * waves * t + phase);
      points.push({ x: a.x + dx * t + px * offset, y: a.y + dy * t + py * offset });
    }
  }

  const cum: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }

  anchors.push(0);
  let index = 0;
  for (let i = 0; i < markers.length - 1; i += 1) {
    const dist = Math.hypot(markers[i + 1].x - markers[i].x, markers[i + 1].y - markers[i].y);
    index += dist === 0 ? 1 : Math.max(8, Math.ceil(dist / step));
    anchors.push(cum[index]);
  }

  return { points, cum, total: cum[cum.length - 1] ?? 0, anchors };
}

export function pointAtLength(poly: Polyline, length: number): Pt {
  const { points, cum, total } = poly;
  if (points.length === 0) return { x: 0, y: 0 };
  const len = Math.min(total, Math.max(0, length));
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= len) lo = mid;
    else hi = mid;
  }
  const span = cum[hi] - cum[lo];
  const t = span === 0 ? 0 : (len - cum[lo]) / span;
  return {
    x: points[lo].x + (points[hi].x - points[lo].x) * t,
    y: points[lo].y + (points[hi].y - points[lo].y) * t,
  };
}

export function lengthAtY(poly: Polyline, y: number): number {
  const { points, cum, total } = poly;
  if (points.length === 0) return 0;
  if (y <= points[0].y) return 0;
  if (y >= points[points.length - 1].y) return total;
  for (let i = 1; i < points.length; i += 1) {
    if (points[i].y >= y) {
      const dy = points[i].y - points[i - 1].y;
      const t = dy === 0 ? 0 : (y - points[i - 1].y) / dy;
      return cum[i - 1] + (cum[i] - cum[i - 1]) * t;
    }
  }
  return total;
}

export function reachedCount(poly: Polyline, headLength: number): number {
  return poly.anchors.filter((a) => a <= headLength + 0.5).length;
}

export interface TrailSquare extends Pt {
  strength: number;
}

export function trail(poly: Polyline, headLength: number, count: number, gap: number, phase: number, wobble: number): TrailSquare[] {
  const out: TrailSquare[] = [];
  for (let i = 0; i < count; i += 1) {
    const len = headLength - i * gap;
    if (len < 0) break;
    const p = pointAtLength(poly, len);
    const ahead = pointAtLength(poly, len + 2);
    const behind = pointAtLength(poly, len - 2);
    const tx = ahead.x - behind.x;
    const ty = ahead.y - behind.y;
    const tl = Math.hypot(tx, ty) || 1;
    const side = Math.sin(phase + i * 0.9) * wobble;
    out.push({
      x: p.x + (-ty / tl) * side,
      y: p.y + (tx / tl) * side,
      strength: 1 - i / count,
    });
  }
  return out;
}

export function toPathD(poly: Polyline): string {
  return poly.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}
