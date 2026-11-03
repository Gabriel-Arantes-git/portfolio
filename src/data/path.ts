import { education } from '@/data/education';
import { stops, type Stop } from '@/data/experience';
import { board, type StackItem } from '@/data/stack';
import type { Localized } from '@/i18n/types';

export type PathNode =
  | { id: string; type: 'degree'; short: Localized }
  | { id: string; type: 'stack'; item: StackItem }
  | { id: string; type: 'job'; stop: Stop; short: Localized }
  | { id: string; type: 'now'; short: Localized };

const shortNames: Record<string, Localized> = {
  'tributech-intern': { pt: 'Estágio', en: 'Internship' },
  'tributech-data': { pt: 'Dados', en: 'Data' },
  'tributech-fullstack': { pt: 'Full Stack', en: 'Full Stack' },
  axion: { pt: 'Axion', en: 'Axion' },
};

const chronology = ['tributech-intern', 'tributech-data', 'tributech-fullstack', 'axion'];

const jobs: PathNode[] = chronology.map((id) => ({
  id,
  type: 'job',
  stop: stops.find((stop) => stop.id === id)!,
  short: shortNames[id],
}));

const byId = new Map<string, PathNode>([
  ['degree', { id: 'degree', type: 'degree', short: { pt: 'Faculdade', en: 'College' } }],
  ...board.map((item): [string, PathNode] => [item.id, { id: item.id, type: 'stack', item }]),
  ...jobs.map((job): [string, PathNode] => [job.id, job]),
  ['now', { id: 'now', type: 'now', short: { pt: 'Atualmente', en: 'Currently' } }],
]);

export const journeyOrder = [
  'degree',
  'tributech-intern',
  'postgresql',
  'mysql',
  'tributech-data',
  'nodejs',
  'react',
  'docker',
  'tributech-fullstack',
  'java',
  'angular',
  'go',
  'kubernetes',
  'aws',
  'oracle',
  'mongodb',
  'rabbitmq',
  'ai',
  'axion',
  'now',
];

export const pathNodes: PathNode[] = journeyOrder.map((id) => byId.get(id)!);

export const degreeSchool = education.degree.school;
