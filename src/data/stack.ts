import type { Localized } from '@/i18n/types';

export type OriginId = 'job' | 'course' | 'self' | 'project';

export const origins: Record<OriginId, Localized> = {
  job: { pt: 'Cargo', en: 'Job' },
  course: { pt: 'Curso', en: 'Course' },
  self: { pt: 'Estudo próprio', en: 'Self-study' },
  project: { pt: 'Projeto', en: 'Project' },
};

export const originIds = Object.keys(origins) as OriginId[];

export type Tier = 'primary' | 'secondary';

export interface StackItem {
  id: string;
  name: string | Localized;
  detail?: string | Localized;
  kind: Localized;
  tier: Tier;
  aliases: string[];
  featured?: boolean;
  extraOrigins?: OriginId[];
  degree?: boolean;
}

const backend: Localized = { pt: 'Backend', en: 'Backend' };
const frontend: Localized = { pt: 'Frontend', en: 'Frontend' };
const data: Localized = { pt: 'Dados', en: 'Data' };
const infra: Localized = { pt: 'Infra', en: 'Infra' };
const messaging: Localized = { pt: 'Mensageria', en: 'Messaging' };

export const board: StackItem[] = [
  {
    id: 'java',
    name: 'Java',
    detail: 'Spring Boot',
    kind: backend,
    tier: 'primary',
    featured: true,
    aliases: ['Java', 'Spring', 'Spring Boot'],
  },
  { id: 'go', name: 'Go', kind: backend, tier: 'secondary', aliases: ['Go'] },
  { id: 'postgresql', name: 'PostgreSQL', kind: data, tier: 'primary', aliases: ['PostgreSQL'] },
  { id: 'aws', name: 'AWS', kind: infra, tier: 'secondary', aliases: ['AWS'], degree: true },
  {
    id: 'nodejs',
    name: 'Node.js',
    detail: 'TypeScript',
    kind: backend,
    tier: 'primary',
    aliases: ['Node.js'],
    degree: true,
  },
  { id: 'rabbitmq', name: 'RabbitMQ', kind: messaging, tier: 'primary', aliases: ['RabbitMQ'] },
  {
    id: 'angular',
    name: 'Angular',
    detail: 'TypeScript',
    kind: frontend,
    tier: 'primary',
    featured: true,
    aliases: ['Angular', 'Angular TS'],
  },
  { id: 'docker', name: 'Docker', kind: infra, tier: 'secondary', aliases: ['Docker'], degree: true },
  { id: 'kubernetes', name: 'Kubernetes', kind: infra, tier: 'secondary', aliases: ['Kubernetes'], degree: true },
  {
    id: 'react',
    name: 'React',
    detail: 'TypeScript',
    kind: frontend,
    tier: 'primary',
    aliases: ['React'],
    degree: true,
  },
  { id: 'mysql', name: 'MySQL', kind: data, tier: 'secondary', aliases: ['MySQL'], degree: true },
  { id: 'oracle', name: 'Oracle', kind: data, tier: 'primary', aliases: ['Oracle'], degree: true },
  {
    id: 'ai',
    name: { pt: 'IA', en: 'AI' },
    detail: { pt: 'Arquitetura em fluxos de trabalho', en: 'Architecture in workflows' },
    kind: { pt: 'Arquitetura', en: 'Architecture' },
    tier: 'primary',
    aliases: ['Claude Code', 'Ollama'],
  },
  { id: 'mongodb', name: 'MongoDB', kind: data, tier: 'secondary', aliases: ['MongoDB'], degree: true },
];

export const primaryStack: StackItem[] = board.filter((item) => item.tier === 'primary');

export const secondaryStack: string[] = board
  .filter((item) => item.tier === 'secondary')
  .map((item) => item.name as string);

export const marqueeStack: Array<string | Localized> = [...primaryStack, ...board.filter((item) => item.tier === 'secondary')].map(
  (item) => (item.id === 'java' ? 'Java · Spring Boot' : item.name),
);
