import { placeBubble, type Rect } from './bubble';

const area = { w: 1000, h: 600 };
const bubble = { w: 224, h: 100 };
const cubeAt = (x: number, y: number): Rect => ({ x, y, w: 18, h: 18 });

const overlaps = (a: Rect, b: Rect) =>
  Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) && Math.min(a.y + a.h, b.y + b.h) > Math.max(a.y, b.y);
const rectOf = (p: { x: number; y: number }): Rect => ({ x: p.x, y: p.y, w: bubble.w, h: bubble.h });

describe('placeBubble', () => {
  it('sem obstáculos fica acima do cubo, centrado', () => {
    const cube = cubeAt(500, 300);
    const p = placeBubble(area, cube, bubble, []);
    expect(p.y + bubble.h).toBeLessThanOrEqual(cube.y);
    expect(p.x + bubble.w / 2).toBeCloseTo(cube.x + cube.w / 2, 0);
  });

  it('desvia para outro lado quando o balão cobriria o nome', () => {
    const cube = cubeAt(300, 300);
    const name: Rect = { x: 150, y: 110, w: 400, h: 170 };
    const p = placeBubble(area, cube, bubble, [name]);
    expect(overlaps(rectOf(p), name)).toBe(false);
    expect(overlaps(rectOf(p), cube)).toBe(false);
  });

  it('com o cubo sobre o texto, leva o balão a uma área livre mesmo longe do cubo', () => {
    const name: Rect = { x: 40, y: 80, w: 620, h: 360 };
    const cube = cubeAt(300, 250);
    const p = placeBubble(area, cube, bubble, [name]);
    expect(overlaps(rectOf(p), name)).toBe(false);
    expect(overlaps(rectOf(p), cube)).toBe(false);
  });

  it('respeita as bordas da área', () => {
    for (const cube of [cubeAt(2, 2), cubeAt(980, 2), cubeAt(2, 580), cubeAt(980, 580)]) {
      const p = placeBubble(area, cube, bubble, []);
      expect(p.x).toBeGreaterThanOrEqual(8);
      expect(p.y).toBeGreaterThanOrEqual(8);
      expect(p.x + bubble.w).toBeLessThanOrEqual(area.w - 8);
      expect(p.y + bubble.h).toBeLessThanOrEqual(area.h - 8);
    }
  });

  it('nunca cobre o cubo, em qualquer posição da tela', () => {
    const name: Rect = { x: 40, y: 80, w: 620, h: 360 };
    for (let x = 0; x <= 980; x += 70) {
      for (let y = 0; y <= 580; y += 60) {
        const cube = cubeAt(x, y);
        const p = placeBubble(area, cube, bubble, [name]);
        expect(overlaps(rectOf(p), cube)).toBe(false);
      }
    }
  });

  it('prefere a posição mais próxima que esteja livre', () => {
    const cube = cubeAt(700, 300);
    const near = placeBubble(area, cube, bubble, []);
    const far: Rect = { x: 0, y: 0, w: 100, h: 100 };
    expect(placeBubble(area, cube, bubble, [far])).toEqual(near);
  });

  it('com obstáculo grande demais, ainda devolve uma posição válida (a de menor sobreposição)', () => {
    const everything: Rect = { x: 0, y: 0, w: 1000, h: 600 };
    const cube = cubeAt(500, 300);
    const p = placeBubble(area, cube, bubble, [everything]);
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    expect(overlaps(rectOf(p), cube)).toBe(false);
  });

  it('com todo o entorno do cubo ocupado por texto, vai para a área livre mais próxima', () => {
    const wall: Rect = { x: 0, y: 0, w: 700, h: 600 };
    const cube = cubeAt(300, 300);
    const p = placeBubble(area, cube, bubble, [wall]);
    expect(overlaps(rectOf(p), wall)).toBe(false);
    expect(overlaps(rectOf(p), cube)).toBe(false);
    expect(p.x).toBeGreaterThanOrEqual(700);

    expect(p.x).toBeLessThan(760);
  });

  it('desvia também da barra de navegação no topo', () => {
    const bar: Rect = { x: 0, y: 0, w: 1000, h: 70 };
    const cube = cubeAt(400, 120);
    const p = placeBubble(area, cube, bubble, [bar]);
    expect(overlaps(rectOf(p), bar)).toBe(false);
    expect(overlaps(rectOf(p), cube)).toBe(false);
  });
});
