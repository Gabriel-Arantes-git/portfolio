import { createWorld, inject, reject, SHAKE_TIME, step } from '@/utils/pipeline';
import type { PipelineWorld, Rect } from '@/utils/pipeline';
import { BUBBLE_H, BUBBLE_W, drawPipeline, fake, type DrawOptions, type Palette } from './draw';

const palette: Palette = {
  cranberry: 'c',
  plum: 'p',
  taupe: 't',
  beige: 'b',
  signal: 's',
  mono: 'monospace',
};

function fakeCtx() {
  const texts: string[] = [];
  const rects: Array<{ fill: string; args: number[] }> = [];
  const moves: number[][] = [];
  const lines: number[][] = [];
  let fill = '';
  const ctx = new Proxy(
    {},
    {
      get: (_t, prop: string) => {
        if (prop === 'fillText') return (text: string) => texts.push(text);
        if (prop === 'fillRect') return (...args: number[]) => rects.push({ fill, args });
        if (prop === 'strokeRect') return (...args: number[]) => rects.push({ fill: 'stroke', args });
        if (prop === 'moveTo') return (...args: number[]) => moves.push(args);
        if (prop === 'lineTo') return (...args: number[]) => lines.push(args);
        return () => {};
      },
      set: (_t, prop: string, value: unknown) => {
        if (prop === 'fillStyle') fill = String(value);
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
  return { ctx, texts, rects, moves, lines };
}

const labels = ['Extrair', 'Transformar', 'Carregar', 'API'];

const base: DrawOptions = {
  labels,
  counterLabel: 'Processados',
  rejectedLabel: 'Reprovados',
  pointer: null,
  hovered: null,
  time: 0,
  animate: true,
  bubble: { source: 'fonte', rows: 'linhas', normalizing: 'normalizando', batch: 'lote' },
  obstacles: [],
};

function scene(stage = 1) {
  const world = createWorld(800, 500, {}, () => 0.5);
  const record = inject(world, stage * 200 + 100, 250)!;
  return { world, record };
}

const bubbleBody = (rects: Array<{ fill: string; args: number[] }>) =>
  rects.find((r) => r.fill === 'b' && r.args[2] === BUBBLE_W && r.args[3] === BUBBLE_H)!;

const intersects = (a: Rect, b: Rect) =>
  Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) && Math.min(a.y + a.h, b.y + b.h) > Math.max(a.y, b.y);

describe('drawPipeline: balão de fala', () => {
  it('sem registro sob o cursor não desenha balão', () => {
    const { world } = scene();
    const { ctx, texts } = fakeCtx();
    drawPipeline(ctx, world, palette, base);
    expect(texts.some((t) => t.startsWith('#'))).toBe(false);
  });

  it('o balão de cada etapa tem título, texto e animação próprios', () => {
    const expected: Array<[number, RegExp[]]> = [
      [0, [/^01 EXTRAIR$/, /^FONTE: erp_legado$/, /^LINHAS: \d+$/]],
      [1, [/^02 TRANSFORMAR$/, /^NORMALIZANDO…$/]],
      [2, [/^03 CARREGAR$/, /^INSERT → postgres$/, /^LOTE #\d+$/]],
      [3, [/^04 API$/, /^GET \/registros\/\d{4}$/, /^200 OK · \d+ ms$/]],
    ];
    const seen = new Set<string>();
    for (const [stage, patterns] of expected) {
      const { world, record } = scene(stage);
      const { ctx, texts } = fakeCtx();
      drawPipeline(ctx, world, palette, { ...base, hovered: record });
      for (const pattern of patterns) expect(texts.some((t) => pattern.test(t))).toBe(true);
      seen.add(texts.filter((t) => !/^\d|^#|PROCESS|REPROV/i.test(t)).join('|'));
    }
    expect(seen.size).toBe(4);
  });

  it('cada etapa pinta o cabeçalho com uma cor diferente', () => {
    const headerFill = (stage: number) => {
      const { world, record } = scene(stage);
      const { ctx, rects } = fakeCtx();
      drawPipeline(ctx, world, palette, { ...base, hovered: record });
      const body = bubbleBody(rects);
      return rects.find((r) => r.args[0] === body.args[0] + 3 && r.args[1] === body.args[1] + 3 && r.args[3] === 19)!.fill;
    };
    expect(new Set([0, 1, 2, 3].map(headerFill)).size).toBe(4);
  });

  it('os valores mostrados são fictícios e sempre os mesmos para o mesmo id', () => {
    expect(fake.rows(8)).toBe(fake.rows(8));
    expect(fake.rows(8)).not.toBe(fake.rows(9));
    expect(fake.latency(8)).toBeGreaterThanOrEqual(8);
    expect(fake.latency(8)).toBeLessThan(42);
  });

  it('os pacotes se movem com o tempo e ficam parados sem animação, em todas as etapas', () => {
    for (const stage of [0, 1, 2, 3]) {
      const { world, record } = scene(stage);
      const snapshot = (time: number, animate: boolean) => {
        const { ctx, rects } = fakeCtx();
        drawPipeline(ctx, world, palette, { ...base, hovered: record, time, animate });
        return JSON.stringify(rects.map((r) => r.args));
      };
      expect(snapshot(0, true)).not.toBe(snapshot(700, true));
      expect(snapshot(0, false)).toBe(snapshot(700, false));
    }
  });

  it('o balão fica dentro da tela mesmo com o cubo na borda ou no topo', () => {
    const cases: Array<[number, number]> = [
      [2, 40],
      [780, 40],
      [400, 470],
    ];
    for (const [x, y] of cases) {
      const world = createWorld(800, 500, {}, () => 0.5);
      const record = inject(world, x, y)!;
      const { ctx, rects } = fakeCtx();
      drawPipeline(ctx, world, palette, { ...base, hovered: record, animate: false });
      const body = bubbleBody(rects);
      expect(body.args[0]).toBeGreaterThanOrEqual(8 - 0.001);
      expect(body.args[0] + body.args[2]).toBeLessThanOrEqual(800 - 8 + 0.001);
      expect(body.args[1]).toBeGreaterThanOrEqual(0);
      expect(body.args[1] + body.args[3]).toBeLessThanOrEqual(500);
    }
  });

  it('o balão desvia dos retângulos proibidos (nome, cargo e rótulo)', () => {
    const { world, record } = scene(1);
    const name: Rect = { x: 150, y: 90, w: 420, h: 150 };
    const { ctx, rects } = fakeCtx();
    drawPipeline(ctx, world, palette, { ...base, hovered: record, obstacles: [name] });
    const body = bubbleBody(rects);
    expect(intersects({ x: body.args[0], y: body.args[1], w: BUBBLE_W, h: BUBBLE_H }, name)).toBe(false);
  });
});

describe('drawPipeline: reprovados', () => {
  it('mostra os dois contadores com seus rótulos e valores', () => {
    const { world, record } = scene(0);
    world.processed = 7;
    reject(world, record);
    const { ctx, texts } = fakeCtx();
    drawPipeline(ctx, world, palette, base);
    expect(texts).toContain('PROCESSADOS');
    expect(texts).toContain('REPROVADOS');
    expect(texts).toContain('000007');
    expect(texts).toContain('000001');
  });

  it('o registro reprovado ganha um X (duas diagonais) e o ok não', () => {
    const { world, record } = scene(1);
    const ok = fakeCtx();
    drawPipeline(ok.ctx, world, palette, base);
    const diagonals = (c: ReturnType<typeof fakeCtx>) => c.lines.filter(([x, y]) => x !== undefined && y !== undefined).length;
    const before = diagonals(ok);

    reject(world, record);
    const bad = fakeCtx();
    drawPipeline(bad.ctx, world, palette, base);
    expect(diagonals(bad)).toBe(before + 2);
  });

  it('um registro reprovado não abre balão', () => {
    const { world, record } = scene(1);
    reject(world, record);

    expect(record.fate).not.toBe('ok');
  });

  it('o tremor acontece com o registro parado e depois ele cai reto', () => {
    const { world, record } = scene(1);
    const x0 = record.x;
    reject(world, record);
    const steps = Math.ceil(SHAKE_TIME / 0.05) + 6;
    for (let i = 0; i < steps; i += 1) step(world, 0.05, null);
    expect(record.fate).toBe('fall');
    expect(record.x).toBe(x0);
  });
});

export type { PipelineWorld };
