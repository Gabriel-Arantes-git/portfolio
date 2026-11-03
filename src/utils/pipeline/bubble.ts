export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BubbleOptions {
  gap?: number;

  margin?: number;

  pad?: number;
}

function overlap(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

const inflate = (r: Rect, pad: number): Rect => ({ x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 });

export function placeBubble(
  area: { w: number; h: number },
  cube: Rect,
  bubble: { w: number; h: number },
  obstacles: readonly Rect[],
  { gap = 18, margin = 8, pad = 8 }: BubbleOptions = {},
): { x: number; y: number } {
  const { w, h } = bubble;
  const keepOut = obstacles.map((o) => inflate(o, pad));
  const cubeBox = inflate(cube, 3);
  const cx = cube.x + cube.w / 2;
  const cy = cube.y + cube.h / 2;
  const maxX = Math.max(margin, area.w - w - margin);
  const maxY = Math.max(margin, area.h - h - margin);

  let best = { x: Math.min(maxX, Math.max(margin, cx - w / 2)), y: Math.min(maxY, Math.max(margin, cube.y - gap - h)) };
  let bestScore = Infinity;

  for (const g of [gap, gap + 44, gap + 100, gap + 170]) {
    const raw: Array<[number, number]> = [
      [cx - w / 2, cube.y - g - h],
      [cx - w / 2, cube.y + cube.h + g],
      [cube.x + cube.w + g, cy - h / 2],
      [cube.x - g - w, cy - h / 2],
      [cube.x - 20, cube.y - g - h],
      [cube.x + cube.w + 20 - w, cube.y - g - h],
      [cube.x - 20, cube.y + cube.h + g],
      [cube.x + cube.w + 20 - w, cube.y + cube.h + g],
    ];

    for (const [rx, ry] of raw) {
      const x = Math.min(maxX, Math.max(margin, rx));
      const y = Math.min(maxY, Math.max(margin, ry));
      const box: Rect = { x, y, w, h };
      const coversCube = overlap(box, cubeBox) > 0;
      const hit = keepOut.reduce((sum, o) => sum + overlap(box, o), 0);

      const score = hit + (coversCube ? 1e9 : 0);
      if (score === 0) return { x, y };
      if (score < bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }
  }

  let nearest = Infinity;
  let free: { x: number; y: number } | null = null;
  for (let y = margin; y <= maxY; y += 16) {
    for (let x = margin; x <= maxX; x += 16) {
      const box: Rect = { x, y, w, h };
      if (overlap(box, cubeBox) > 0) continue;
      if (keepOut.some((o) => overlap(box, o) > 0)) continue;
      const d = Math.hypot(x + w / 2 - cx, y + h / 2 - cy);
      if (d < nearest) {
        nearest = d;
        free = { x, y };
      }
    }
  }
  return free ?? best;
}
