import {
  DEFAULT_CONFIG,
  type PipelineConfig,
  type PipelineRecord,
  type PipelineWorld,
  type Pointer,
} from './types';

export const HOLD_FACTOR = 0.15;

export const NEAR_FACTOR = 0.4;

export const HOVER_FACTOR = 0.03;

export const SHAKE_TIME = 0.35;

export const GRAVITY = 1500;

const MAX_DT = 0.05;

export function createWorld(
  width: number,
  height: number,
  config: Partial<PipelineConfig> = {},
  rng: () => number = Math.random,
): PipelineWorld {
  return {
    width,
    height,
    config: { ...DEFAULT_CONFIG, ...config },
    records: [],
    processed: 0,
    rejected: 0,
    nextId: 1,
    spawnTimer: 0,
    rng,
  };
}

export function stageWidth(world: PipelineWorld): number {
  return world.width / world.config.stageCount;
}

export function stageAt(world: PipelineWorld, x: number): number {
  const index = Math.floor(x / stageWidth(world));
  return Math.min(world.config.stageCount - 1, Math.max(0, index));
}

function margin(world: PipelineWorld): number {
  return world.config.recordSize * 2;
}

function clampY(world: PipelineWorld, y: number): number {
  const m = margin(world);
  return Math.min(world.height - m, Math.max(m, y));
}

function center(world: PipelineWorld, r: PipelineRecord): Pointer {
  const half = world.config.recordSize / 2;
  return { x: r.x + half, y: r.y + half };
}

export function findHovered(world: PipelineWorld, pointer: Pointer | null): PipelineRecord | null {
  if (!pointer) return null;
  const reach = world.config.recordSize * 1.2;
  let best: PipelineRecord | null = null;
  let bestDist = reach;
  for (const r of world.records) {
    if (r.fate !== 'ok') continue;
    const c = center(world, r);
    const dist = Math.hypot(c.x - pointer.x, c.y - pointer.y);
    if (dist <= bestDist) {
      best = r;
      bestDist = dist;
    }
  }
  return best;
}

function spawn(world: PipelineWorld, x: number, y: number): PipelineRecord | null {
  if (world.records.length >= world.config.maxRecords) return null;
  const record: PipelineRecord = {
    id: world.nextId++,
    x,
    y: clampY(world, y),
    speed: 0.8 + world.rng() * 0.4,
    stage: stageAt(world, x),
    fate: 'ok',
    t: 0,
    vy: 0,
  };
  world.records.push(record);
  return record;
}

export function inject(world: PipelineWorld, x: number, y: number): PipelineRecord | null {
  return spawn(world, x, y);
}

export function reject(world: PipelineWorld, record: PipelineRecord): boolean {
  if (record.fate !== 'ok') return false;
  record.fate = 'shake';
  record.t = 0;
  record.vy = 0;
  world.rejected += 1;
  return true;
}

export function shakeOffset(record: PipelineRecord): number {
  if (record.fate !== 'shake') return 0;
  const decay = Math.max(0, 1 - record.t / SHAKE_TIME);
  return Math.sin(record.t * 75) * 4 * decay;
}

export function resize(world: PipelineWorld, width: number, height: number): void {
  if (width <= 0 || height <= 0) return;
  const sx = world.width > 0 ? width / world.width : 1;
  const sy = world.height > 0 ? height / world.height : 1;
  for (const r of world.records) {
    r.x *= sx;
    r.y = r.fate === 'ok' ? clampY({ ...world, width, height }, r.y * sy) : r.y * sy;
  }
  world.width = width;
  world.height = height;
}

export function step(world: PipelineWorld, dt: number, pointer: Pointer | null): void {
  const delta = Math.min(Math.max(dt, 0), MAX_DT);
  if (delta === 0) return;
  const { config } = world;

  world.spawnTimer += delta;
  while (world.spawnTimer >= config.spawnInterval) {
    world.spawnTimer -= config.spawnInterval;
    const y = margin(world) + world.rng() * Math.max(1, world.height - margin(world) * 2);
    if (!spawn(world, -config.recordSize, y)) {
      world.spawnTimer = 0;
      break;
    }
  }

  const pointerStage = pointer ? stageAt(world, pointer.x) : -1;
  const hovered = findHovered(world, pointer);
  const alive: PipelineRecord[] = [];

  for (const r of world.records) {
    if (r.fate === 'shake') {
      r.t += delta;
      if (r.t >= SHAKE_TIME) {
        r.fate = 'fall';
        r.vy = 0;
      }
      alive.push(r);
      continue;
    }
    if (r.fate === 'fall') {
      r.vy += GRAVITY * delta;
      r.y += r.vy * delta;
      if (r.y <= world.height + config.recordSize) alive.push(r);
      continue;
    }

    let factor = 1;
    if (pointer) {
      if (r.x >= 0 && r.stage === pointerStage) factor = HOLD_FACTOR;
      const c = center(world, r);
      if (Math.hypot(c.x - pointer.x, c.y - pointer.y) < config.pointerRadius) {
        factor = Math.min(factor, NEAR_FACTOR);
      }
      if (r === hovered) factor = HOVER_FACTOR;
    }

    r.x += config.baseSpeed * world.width * r.speed * factor * delta;
    r.stage = stageAt(world, r.x);

    if (r.x - config.recordSize > world.width) {
      world.processed += 1;
    } else {
      alive.push(r);
    }
  }

  world.records = alive;
}

export function warmUp(world: PipelineWorld, seconds: number, stepSize = 0.05): void {
  for (let t = 0; t < seconds; t += stepSize) step(world, stepSize, null);
}
