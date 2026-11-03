import type { Localized } from '@/i18n/types';

export const education = {
  degree: {
    title: { pt: 'Bacharelado em Engenharia de Software', en: "Bachelor's in Software Engineering" } satisfies Localized,
    school: 'Unicesumar · Maringá, PR',
    period: { pt: 'jan/2024 – dez/2027 (previsto)', en: 'Jan 2024 – Dec 2027 (expected)' } satisfies Localized,
  },
  certifications: [
    { pt: 'Java + Programação Orientada a Objetos', en: 'Java + Object-Oriented Programming' },
    { pt: 'Banco de Dados e SQL com PostgreSQL', en: 'Databases and SQL with PostgreSQL' },
    { pt: 'Pentaho Data Integration: Básico ao Avançado', en: 'Pentaho Data Integration: Basic to Advanced' },
  ] satisfies Localized[],
  english: {
    level: { pt: 'Intermediário', en: 'Intermediate' } satisfies Localized,
    course: {
      pt: 'Ensino de Inglês como Segundo Idioma · Mister Wiz · mai/2025 – jun/2026',
      en: 'Teaching English as a Second Language · Mister Wiz · May 2025 – Jun 2026',
    } satisfies Localized,
  },
};
