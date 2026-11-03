import { education } from '@/data/education';
import { pathNodes } from '@/data/path';
import { projects, type Project } from '@/data/projects';
import { stops, type Stop } from '@/data/experience';
import type { OriginId, StackItem } from '@/data/stack';
import type { Localized } from '@/i18n/types';

export interface StackUsage {
  roles: Stop[];
  projects: Project[];
  courses: Localized[];
  origins: OriginId[];
}

const MAIN_PROJECT = 'tributech-platform';

const normalize = (value: string) => value.trim().toLowerCase();
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function mentions(text: string, aliases: string[]): boolean {
  return aliases.some((alias) => new RegExp(`(^|[^\\p{L}\\d])${escape(alias)}($|[^\\p{L}\\d])`, 'iu').test(text));
}

function jobBefore(id: string): string | null {
  const position = pathNodes.findIndex((node) => node.id === id);
  for (let index = position - 1; index >= 0; index -= 1) {
    const node = pathNodes[index];
    if (node.type === 'job') return node.stop.id;
  }
  return null;
}

export function usageOf(item: StackItem): StackUsage {
  const wanted = new Set(item.aliases.map(normalize));
  const hit = (value: string) => wanted.has(normalize(value));
  const used = projects.filter((project) =>
    project.tech.some((tech) => hit(typeof tech === 'string' ? tech : tech.en)),
  );
  const certified = education.certifications.filter((course) => mentions(course.en, item.aliases));
  const roles = stops.filter(
    (stop) => stop.tags.some(hit) || (used.some((project) => project.id === MAIN_PROJECT) && stop.id === jobBefore(item.id)),
  );
  const courses = item.degree ? [...certified, education.degree.title] : certified;
  const origins = new Set<OriginId>(item.extraOrigins);
  if (roles.length) origins.add('job');
  if (courses.length) origins.add('course');
  if (used.length) origins.add('project');
  const order: OriginId[] = ['job', 'course', 'self', 'project'];
  return { roles, projects: used, courses, origins: order.filter((id) => origins.has(id)) };
}
