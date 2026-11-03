import type { Localized, LocalizedList } from '@/i18n/types';

export type ArtKind = 'city-map' | 'data-flow' | 'reports' | 'events';

export interface Stop {
  id: string;

  company: string;
  location: string;

  footer?: Localized;
  role: Localized;
  period: Localized;
  current?: boolean;

  totalDuration?: Localized;
  summary: LocalizedList;
  tags: string[];
  art: ArtKind;
}

export const stops: Stop[] = [
  {
    id: 'tributech-fullstack',
    company: 'Tributech Gestão Pública',
    location: 'Maringá, PR',
    role: { pt: 'Full Stack Engineer', en: 'Full Stack Engineer' },
    period: { pt: 'nov/2025 – o momento', en: 'Nov 2025 – present' },
    current: true,
    totalDuration: { pt: '1 ano e 10 meses', en: '1 year 10 months' },
    summary: {
      pt: [
        'Aplicação principal em Java (Spring Boot) e Angular/TypeScript, seguindo padrões REST e boas práticas de arquitetura.',
        'Proposição e implementação de soluções e APIs que melhoram o fluxo de trabalho.',
        'Integrações para consumir outros sistemas, locais e nacionais.',
        'Soluções replicáveis, escaláveis e manuteníveis, de ponta a ponta, com uso crítico de IA como ferramenta.',
      ],
      en: [
        'Main application in Java (Spring Boot) and Angular/TypeScript, following REST standards and sound architecture practices.',
        'Proposing and building solutions and APIs that improve the workflow.',
        'Integrations that consume other systems, local and national.',
        'Replicable, scalable and maintainable solutions end to end, using AI critically as a tool.',
      ],
    },
    tags: ['Java', 'Spring Boot', 'Angular TS', 'REST', 'Git/GitLab'],
    art: 'city-map',
  },
  {
    id: 'tributech-data',
    company: 'Tributech Gestão Pública',
    location: 'Maringá, PR',
    role: { pt: 'Engenheiro de Dados e Desenvolvimento', en: 'Data and Development Engineer' },
    period: { pt: 'mai/2025 – nov/2025', en: 'May 2025 – Nov 2025' },
    summary: {
      pt: [
        'Java, Spring e React em aplicações e módulos da plataforma.',
        'Criação e teste de APIs REST para integrar e disponibilizar dados entre sistemas.',
        'Aplicações que automatizam processos manuais e reduzem retrabalho.',
        'Bancos de dados e integração entre dialetos SQL, funções robustas de relatório e treinamento de estagiários.',
      ],
      en: [
        'Java, Spring and React in platform applications and modules.',
        'Building and testing REST APIs to integrate and expose data between systems.',
        'Applications that automate manual processes and cut rework.',
        'Databases and integration across SQL dialects, robust report functions and intern training.',
      ],
    },
    tags: ['Java', 'Spring', 'React', 'SQL', 'REST'],
    art: 'data-flow',
  },
  {
    id: 'tributech-intern',
    company: 'Tributech Gestão Pública',
    location: 'Maringá, PR',
    role: { pt: 'Estágio, Suporte de Dados / TI', en: 'Intern, Data Support / IT' },
    period: { pt: 'fev/2025 – mai/2025', en: 'Feb 2025 – May 2025' },
    summary: {
      pt: [
        'Relatórios automatizados e integração de dados para análise tributária e informacional.',
        'Testes de API, documentação de processos e manutenção de funções SQL.',
      ],
      en: [
        'Automated reports and data integration for tax and information analysis.',
        'API testing, process documentation and SQL function maintenance.',
      ],
    },
    tags: ['SQL', 'Pentaho', 'API tests'],
    art: 'reports',
  },
  {
    id: 'axion',
    company: 'Axion',
    location: 'Maringá, PR',
    footer: { pt: 'Consultoria Júnior', en: 'Junior Consultancy' },
    role: { pt: 'Software Engineer, Full Stack', en: 'Software Engineer, Full Stack' },
    period: { pt: 'fev/2026 – o momento', en: 'Feb 2026 – present' },
    current: true,
    summary: {
      pt: [
        'Entrega de projetos reais para clientes, com levantamento de requisitos e trabalho em equipe.',
        'Plataformas e sites de eventos, como o I COUNI e o WorkInTech.',
        'Apoio à organização de eventos e de oportunidades para estudantes, somando gestão à atuação técnica.',
      ],
      en: [
        'Delivery of real projects for clients, with requirements gathering and teamwork.',
        'Event platforms and websites, such as I COUNI and WorkInTech.',
        'Help organizing events and opportunities for students, adding management to technical work.',
      ],
    },
    tags: ['Fullstack', 'Next.js', 'PostgreSQL'],
    art: 'events',
  },
];
