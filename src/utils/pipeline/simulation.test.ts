import {
  createWorld,
  findHovered,
  HOLD_FACTOR,
  HOVER_FACTOR,
  GRAVITY,
  inject,
  reject,
  resize,
  SHAKE_TIME,
  shakeOffset,
  stageAt,
  step,
  warmUp,
} from './simulation';

function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const make = (seed = 1, cfg = {}) => createWorld(1000, 400, cfg, seeded(seed));

describe('pipeline: simulação', () => {
  it('stageAt divide a largura em etapas e limita nas bordas', () => {
    const w = make();
    expect(stageAt(w, 0)).toBe(0);
    expect(stageAt(w, 249)).toBe(0);
    expect(stageAt(w, 250)).toBe(1);
    expect(stageAt(w, 999)).toBe(3);
    expect(stageAt(w, -50)).toBe(0);
    expect(stageAt(w, 5000)).toBe(3);
  });

  it('gera registros ao longo do tempo e os move para a direita', () => {
    const w = make();
    step(w, 0.05, null);
    expect(w.records.length).toBe(0);
    for (let i = 0; i < 20; i++) step(w, 0.05, null);
    expect(w.records.length).toBeGreaterThan(0);

    const before = new Map(w.records.map((r) => [r.id, r.x]));
    step(w, 0.05, null);
    for (const r of w.records) {
      const x0 = before.get(r.id);
      if (x0 !== undefined) expect(r.x).toBeGreaterThan(x0);
    }
  });

  it('conta como processado o registro que sai pelo fim do pipeline', () => {
    const w = make();
    expect(w.processed).toBe(0);
    warmUp(w, 30);
    expect(w.processed).toBeGreaterThan(0);
    expect(w.records.every((r) => r.x - w.config.recordSize <= w.width)).toBe(true);
  });

  it('respeita o limite de registros vivos', () => {
    const w = make(1, { maxRecords: 5, spawnInterval: 0.01 });
    for (let i = 0; i < 40; i++) step(w, 0.05, null);
    expect(w.records.length).toBeLessThanOrEqual(5);
    expect(inject(w, 100, 100)).toBeNull();
  });

  it('cursor sobre uma etapa trava os registros dela', () => {
    const free = make(7);
    const held = make(7);

    inject(free, 300, 200);
    inject(held, 300, 200);
    const stageOneCursor = { x: 260, y: 20 };

    for (let i = 0; i < 10; i++) {
      step(free, 0.05, null);
      step(held, 0.05, stageOneCursor);
    }
    const dFree = free.records[0].x - 300;
    const dHeld = held.records[0].x - 300;
    expect(dHeld).toBeGreaterThan(0);
    expect(dHeld).toBeLessThan(dFree * (HOLD_FACTOR + 0.1));
  });

  it('findHovered acha o registro sob o cursor e ignora os distantes', () => {
    const w = make();
    const near = inject(w, 500, 200)!;
    inject(w, 700, 200);
    expect(findHovered(w, { x: 509, y: 209 })).toBe(near);
    expect(findHovered(w, { x: 515, y: 214 })).toBe(near);
    expect(findHovered(w, { x: 600, y: 209 })).toBeNull();
    expect(findHovered(w, null)).toBeNull();
  });

  it('findHovered escolhe o mais próximo quando dois se sobrepõem', () => {
    const w = make();
    const a = inject(w, 500, 200)!;
    const b = inject(w, 512, 200)!;
    expect(findHovered(w, { x: 509, y: 209 })).toBe(a);
    expect(findHovered(w, { x: 521, y: 209 })).toBe(b);
  });

  it('o registro sob o cursor quase para; os demais seguem mais rápido', () => {
    const w = make(5);
    const under = inject(w, 500, 200)!;
    const other = inject(w, 100, 300)!;
    const x0 = { under: under.x, other: other.x };
    for (let i = 0; i < 10; i++) step(w, 0.05, { x: under.x + 9, y: under.y + 9 });
    const movedUnder = under.x - x0.under;
    const movedOther = other.x - x0.other;
    expect(movedUnder).toBeLessThan(movedOther * (HOVER_FACTOR + 0.1));
    expect(movedUnder).toBeGreaterThanOrEqual(0);
  });

  it('o cursor não empurra o registro na vertical (dá para passar o mouse nele)', () => {
    const w = make(3);
    const r = inject(w, 500, 200)!;
    const y0 = r.y;
    for (let i = 0; i < 20; i++) step(w, 0.05, { x: 500, y: 170 });
    expect(r.y).toBe(y0);
  });

  it('cursor fora do raio e de outra etapa não altera o movimento', () => {
    const a = make(9);
    const b = make(9);
    inject(a, 100, 200);
    inject(b, 100, 200);
    for (let i = 0; i < 10; i++) {
      step(a, 0.05, null);
      step(b, 0.05, { x: 900, y: 380 });
    }
    expect(b.records[0].x).toBeCloseTo(a.records[0].x, 5);
    expect(b.records[0].y).toBeCloseTo(a.records[0].y, 5);
  });

  it('inject cria um registro na posição pedida, dentro dos limites verticais', () => {
    const w = make();
    const r = inject(w, 400, 10_000);
    expect(r).not.toBeNull();
    expect(r!.x).toBe(400);
    expect(r!.y).toBeLessThanOrEqual(w.height);
  });

  it('ignora dt inválido e limita saltos grandes', () => {
    const w = make();
    inject(w, 100, 200);
    step(w, 0, null);
    step(w, -1, null);
    expect(w.records[0].x).toBe(100);
    step(w, 100, null);
    expect(w.records[0].x).toBeLessThan(100 + w.width * w.config.baseSpeed * 2 * 0.05 + 1);
  });

  it('resize preserva posições relativas', () => {
    const w = make();
    inject(w, 500, 200);
    resize(w, 500, 200);
    expect(w.width).toBe(500);
    expect(w.records[0].x).toBeCloseTo(250);
  });

  describe('reprovar', () => {
    it('reject marca o registro, conta uma vez e não deixa reprovar duas vezes', () => {
      const w = make();
      const r = inject(w, 300, 200)!;
      expect(w.rejected).toBe(0);
      expect(reject(w, r)).toBe(true);
      expect(w.rejected).toBe(1);
      expect(r.fate).toBe('shake');
      expect(reject(w, r)).toBe(false);
      expect(w.rejected).toBe(1);
    });

    it('treme parado por SHAKE_TIME, sem andar para a frente', () => {
      const w = make();
      const r = inject(w, 300, 200)!;
      reject(w, r);
      const x0 = r.x;
      const y0 = r.y;
      let t = 0;
      while (t + 0.05 < SHAKE_TIME) {
        step(w, 0.05, null);
        t += 0.05;
        expect(r.fate).toBe('shake');
        expect(r.x).toBe(x0);
        expect(r.y).toBe(y0);
      }
      expect(Math.abs(shakeOffset(r))).toBeLessThanOrEqual(4);
    });

    it('o tremor existe e some no fim', () => {
      const w = make();
      const r = inject(w, 300, 200)!;
      reject(w, r);
      const offsets: number[] = [];
      for (let i = 0; i < 6; i++) {
        step(w, 0.05, null);
        offsets.push(shakeOffset(r));
      }
      expect(offsets.some((o) => Math.abs(o) > 0.5)).toBe(true);
      r.t = SHAKE_TIME;
      expect(Math.abs(shakeOffset(r))).toBeLessThan(1e-9);
      r.fate = 'fall';
      expect(shakeOffset(r)).toBe(0);
    });

    it('depois da tremida cai em linha reta (x fixo), acelerando', () => {
      const w = make();
      const r = inject(w, 300, 100)!;
      reject(w, r);
      const x0 = r.x;
      for (let i = 0; i < 8; i++) step(w, 0.05, null);
      expect(r.fate).toBe('fall');
      const ys: number[] = [];
      for (let i = 0; i < 4; i++) {
        step(w, 0.05, null);
        ys.push(r.y);
        expect(r.x).toBe(x0);
      }
      expect(ys[1] - ys[0]).toBeGreaterThan(0);
      expect(ys[3] - ys[2]).toBeGreaterThan(ys[1] - ys[0]);
      expect(r.vy).toBeGreaterThan(GRAVITY * 0.1);
    });

    it('sai pela base, deixa de existir e não conta como processado', () => {
      const w = make();
      const r = inject(w, 300, 100)!;
      reject(w, r);
      const processed = w.processed;
      for (let i = 0; i < 80; i++) step(w, 0.05, null);
      expect(w.records.includes(r)).toBe(false);
      expect(w.rejected).toBe(1);
      expect(w.processed).toBe(processed);
    });

    it('findHovered ignora registros reprovados', () => {
      const w = make();
      const r = inject(w, 500, 200)!;
      expect(findHovered(w, { x: 509, y: 209 })).toBe(r);
      reject(w, r);
      expect(findHovered(w, { x: 509, y: 209 })).toBeNull();
    });

    it('registros que seguem no pipeline não são afetados pelo reprovado', () => {
      const w = make(4);
      const a = inject(w, 100, 100)!;
      const b = inject(w, 100, 300)!;
      reject(w, a);
      const bx = b.x;
      step(w, 0.05, null);
      expect(b.x).toBeGreaterThan(bx);
      expect(b.fate).toBe('ok');
    });

    it('o contador de processados continua subindo e é independente do de reprovados', () => {
      const w = make();
      const r = inject(w, 100, 200)!;
      reject(w, r);
      warmUp(w, 30);
      expect(w.processed).toBeGreaterThan(0);
      expect(w.rejected).toBe(1);
    });
  });
});
