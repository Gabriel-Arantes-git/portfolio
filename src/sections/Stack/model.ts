import { education } from '@/data/education';
import type { PathNode } from '@/data/path';
import { origins } from '@/data/stack';
import { usageOf } from '@/data/stackUsage';
import type { Dictionary } from '@/i18n/pt';
import type { useLocalized } from '@/i18n/hooks';

type Localize = ReturnType<typeof useLocalized>;
type Words = Dictionary['stack'];

export type Tier = 'primary' | 'secondary' | 'path' | 'now';

export interface Face {
  tier: Tier;
  featured: boolean;
  kind: string;
  name: string;
  detail?: string;
  chips: string[];
  meta: string;
  isStatic: boolean;
}

export interface DetailSection {
  heading: string;
  chips?: string[];
  items?: Array<{ title?: string; text: string }>;
  text?: string;
}

export interface Detail {
  title: string;
  kind: string;
  detail?: string;
  sections: DetailSection[];
  banner?: string;
}

const plain = (value: string | { pt: string; en: string }, l: Localize) => (typeof value === 'string' ? value : l(value));

export function faceOf(node: PathNode, l: Localize, words: Words): Face {
  if (node.type === 'degree') {
    return {
      tier: 'path',
      featured: false,
      kind: education.degree.school.split(' · ')[0],
      name: l(node.short),
      chips: [],
      meta: l(education.degree.period),
      isStatic: false,
    };
  }
  if (node.type === 'job') {
    return {
      tier: 'path',
      featured: false,
      kind: node.stop.company.replace(' Gestão Pública', ''),
      name: l(node.short),
      chips: [],
      meta: l(node.stop.period),
      isStatic: false,
    };
  }
  if (node.type === 'now') {
    return { tier: 'now', featured: false, kind: '', name: l(node.short), chips: [], meta: '', isStatic: true };
  }
  const usage = usageOf(node.item);
  const total = usage.roles.length + usage.projects.length + usage.courses.length;
  return {
    tier: node.item.tier,
    featured: !!node.item.featured,
    kind: l(node.item.kind),
    name: plain(node.item.name, l),
    detail: node.item.detail ? plain(node.item.detail, l) : undefined,
    chips: usage.origins.map((id) => l(origins[id])),
    meta: total
      ? `${usage.roles.length} ${words.roles} · ${usage.projects.length} ${words.projectsLabel}`
      : words.empty,
    isStatic: false,
  };
}

export function detailOf(node: PathNode, l: Localize, words: Words): Detail {
  if (node.type === 'now') {
    return { title: l(node.short), kind: '', sections: [], banner: words.inDevelopment };
  }
  if (node.type === 'degree') {
    return {
      title: l(education.degree.title),
      kind: education.degree.school,
      detail: l(education.degree.period),
      sections: [{ heading: words.courses, items: education.certifications.map((course) => ({ text: l(course) })) }],
    };
  }
  if (node.type === 'job') {
    const { stop } = node;
    return {
      title: l(stop.role),
      kind: stop.company,
      detail: l(stop.period),
      sections: [
        { heading: words.summary, items: l(stop.summary).map((text) => ({ text })) },
        { heading: words.tech, chips: stop.tags },
      ],
    };
  }
  const usage = usageOf(node.item);
  const sections: DetailSection[] = [
    usage.origins.length
      ? { heading: words.sources, chips: usage.origins.map((id) => l(origins[id])) }
      : { heading: words.sources, text: words.empty },
  ];
  if (usage.roles.length) {
    sections.push({
      heading: words.roles,
      items: usage.roles.map((stop) => ({ title: l(stop.role), text: `${stop.company} · ${l(stop.period)}` })),
    });
  }
  if (usage.projects.length) {
    sections.push({
      heading: words.projectsLabel,
      items: usage.projects.map((project) => ({ title: project.name, text: l(project.tagline) })),
    });
  }
  if (usage.courses.length) {
    sections.push({ heading: words.courses, items: usage.courses.map((course) => ({ text: l(course) })) });
  }
  return {
    title: plain(node.item.name, l),
    kind: l(node.item.kind),
    detail: node.item.detail ? plain(node.item.detail, l) : undefined,
    sections,
  };
}
