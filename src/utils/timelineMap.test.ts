import {
  buildPolyline,
  lengthAtY,
  pointAtLength,
  reachedCount,
  toPathD,
  trail,
  type Pt,
} from './timelineMap';

const markers: Pt[] = [
  { x: 40, y: 20 },
  { x: 40, y: 320 },
  { x: 40, y: 620 },
  { x: 40, y: 1000 },
];

describe('timelineMap: caminho ondulado', () => {
  it('passa exatamente por todos os marcadores, em ordem', () => {
    const poly = buildPolyline(markers);
    expect(poly.points[0]).toEqual(markers[0]);
    expect(poly.points[poly.points.length - 1]).toEqual(markers[3]);
    expect(poly.anchors.length).toBe(markers.length);
    poly.anchors.forEach((len, i) => {
      const p = pointAtLength(poly, len);
      expect(p.x).toBeCloseTo(markers[i].x, 4);
      expect(p.y).toBeCloseTo(markers[i].y, 4);
    });
    for (let i = 1; i < poly.anchors.length; i += 1) expect(poly.anchors[i]).toBeGreaterThan(poly.anchors[i - 1]);
  });

  it('ondula de verdade: sai da reta entre os marcadores, mas é mais longo que ela', () => {
    const poly = buildPolyline(markers, { amplitude: 30 });
    const xs = poly.points.map((p) => p.x);
    expect(Math.max(...xs) - 40).toBeGreaterThan(15);
    expect(40 - Math.min(...xs)).toBeGreaterThan(15);
    expect(poly.total).toBeGreaterThan(980);
  });

  it('sem amplitude é uma reta', () => {
    const poly = buildPolyline(markers, { amplitude: 0 });
    expect(poly.points.every((p) => p.x === 40)).toBe(true);
    expect(poly.total).toBeCloseTo(980, 3);
  });

  it('trechos vizinhos ondulam em fases opostas', () => {
    const poly = buildPolyline(markers, { amplitude: 30, waves: 1 });
    const firstHalf = poly.points.filter((p) => p.y > 20 && p.y < 170);
    const secondSegHalf = poly.points.filter((p) => p.y > 320 && p.y < 470);
    expect(Math.sign(firstHalf[Math.floor(firstHalf.length / 2)].x - 40)).not.toBe(
      Math.sign(secondSegHalf[Math.floor(secondSegHalf.length / 2)].x - 40),
    );
  });

  it('a altura cresce junto com o comprimento (a cabeça sempre desce)', () => {
    const poly = buildPolyline(markers);
    expect(lengthAtY(poly, -50)).toBe(0);
    expect(lengthAtY(poly, 5000)).toBe(poly.total);
    let last = -1;
    for (let y = 0; y <= 1000; y += 25) {
      const len = lengthAtY(poly, y);
      expect(len).toBeGreaterThanOrEqual(last);
      last = len;
    }
    expect(pointAtLength(poly, lengthAtY(poly, 500)).y).toBeCloseTo(500, 0);
  });

  it('reachedCount conta os X já alcançados', () => {
    const poly = buildPolyline(markers);
    expect(reachedCount(poly, 0)).toBe(1);
    expect(reachedCount(poly, poly.anchors[1] - 5)).toBe(1);
    expect(reachedCount(poly, poly.anchors[1])).toBe(2);
    expect(reachedCount(poly, poly.total)).toBe(4);
  });

  it('o rastro de quadrados segue a cabeça, espaçado e ondulando para os lados', () => {
    const poly = buildPolyline(markers, { amplitude: 0 });
    const head = 400;
    const squares = trail(poly, head, 6, 20, 0, 8);
    expect(squares.length).toBe(6);
    expect(squares[0].y).toBeCloseTo(pointAtLength(poly, head).y, 3);
    for (let i = 1; i < squares.length; i += 1) expect(squares[i].y).toBeLessThan(squares[i - 1].y);
    expect(squares[0].strength).toBe(1);
    expect(squares[5].strength).toBeLessThan(squares[0].strength);

    expect(new Set(squares.map((s) => s.x.toFixed(2))).size).toBeGreaterThan(1);

    expect(trail(poly, head, 6, 20, 1.5, 8)[0].x).not.toBeCloseTo(squares[0].x, 2);
  });

  it('o rastro não passa do começo do caminho', () => {
    const poly = buildPolyline(markers);
    expect(trail(poly, 30, 8, 20, 0, 6).length).toBe(2);
    expect(trail(poly, 0, 8, 20, 0, 6).length).toBe(1);
  });

  it('é robusto a marcadores sobrepostos e a lista vazia', () => {
    const same = buildPolyline([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
    expect(Number.isFinite(same.total)).toBe(true);
    expect(same.total).toBe(0);
    const empty = buildPolyline([]);
    expect(empty.total).toBe(0);
    expect(pointAtLength(empty, 10)).toEqual({ x: 0, y: 0 });
    expect(lengthAtY(empty, 10)).toBe(0);
  });

  it('toPathD começa com M e tem um ponto por vértice', () => {
    const poly = buildPolyline(markers);
    const d = toPathD(poly);
    expect(d.startsWith('M 40.0 20.0')).toBe(true);
    expect(d.split(/[ML]/).filter(Boolean).length).toBe(poly.points.length);
  });
});
