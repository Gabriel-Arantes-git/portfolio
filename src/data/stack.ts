import type { Localized } from '@/i18n/types';

export interface PrimaryTech {
  name: string | Localized;
  detail?: string | Localized;
  kind: Localized;

  featured?: boolean;
}

export const primaryStack: PrimaryTech[] = [
  { name: 'Java', detail: 'Spring Boot', kind: { pt: 'Backend', en: 'Backend' }, featured: true },
  { name: 'PostgreSQL', kind: { pt: 'Dados', en: 'Data' } },
  { name: 'Node.js', kind: { pt: 'Backend', en: 'Backend' } },
  { name: 'Angular', detail: 'TypeScript', kind: { pt: 'Frontend', en: 'Frontend' }, featured: true },
  { name: 'React', detail: 'TypeScript', kind: { pt: 'Frontend', en: 'Frontend' } },
  {
    name: { pt: 'IA', en: 'AI' },
    detail: { pt: 'Arquitetura em fluxos de trabalho', en: 'Architecture in workflows' },
    kind: { pt: 'Arquitetura', en: 'Architecture' },
  },
];

export const secondaryStack: string[] = [
  'Go',
  'AWS',
  'RabbitMQ',
  'Kafka',
  'Docker',
  'Kubernetes',
  'MySQL',
  'Oracle',
  'MongoDB',
];

export const marqueeStack: Array<string | Localized> = [
  'Java · Spring Boot',
  'PostgreSQL',
  'Node.js',
  'Angular',
  'React',
  { pt: 'IA', en: 'AI' },
  ...secondaryStack,
];
