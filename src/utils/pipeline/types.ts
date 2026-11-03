export interface PipelineConfig {
  stageCount: number;

  maxRecords: number;

  spawnInterval: number;

  baseSpeed: number;

  recordSize: number;

  pointerRadius: number;
}

export type Fate = 'ok' | 'shake' | 'fall';

export interface PipelineRecord {
  id: number;

  x: number;
  y: number;

  speed: number;

  stage: number;
  fate: Fate;

  t: number;

  vy: number;
}

export interface Pointer {
  x: number;
  y: number;
}

export interface PipelineWorld {
  width: number;
  height: number;
  config: PipelineConfig;
  records: PipelineRecord[];

  processed: number;

  rejected: number;
  nextId: number;
  spawnTimer: number;
  rng: () => number;
}

export const DEFAULT_CONFIG: PipelineConfig = {
  stageCount: 4,
  maxRecords: 70,
  spawnInterval: 0.28,
  baseSpeed: 0.09,
  recordSize: 18,
  pointerRadius: 90,
};
