import type { Localized, LocalizedList } from '@/i18n/types';

export type ScopeId = 'own' | 'consulting' | 'professional';

export const SCOPES: readonly ScopeId[] = ['own', 'consulting', 'professional'];

export type SnippetKind = 'cmd' | 'out' | 'add' | 'del' | 'note' | 'ctx';

export interface SnippetLine {
  kind: SnippetKind;
  text: string | Localized;
}

export interface ProjectLink {
  label: Localized;
  href: string;
}

export interface Project {
  id: string;
  scope: ScopeId;

  name: string;
  tagline: Localized;
  /** Categoria na faixa superior da ficha. */
  kicker: Localized;
  /** Informação curta na faixa superior (o crédito de co-autoria, quando existe, tem prioridade). */
  meta: Localized;
  /** Selo com a tecnologia ou o tipo principal. */
  badge: string | Localized;
  /** Trecho ilustrativo do bloco tracejado: diff, terminal ou lista de entregas. */
  snippet: SnippetLine[];
  description: LocalizedList;
  highlights: LocalizedList;
  tech: Array<string | Localized>;

  links: ProjectLink[];

  credit?: { text: Localized; href: string };

  status?: Localized;
  team?: string[];
  quote?: { text: Localized; author: string };
}

const SITE: Localized = { pt: 'Visitar site', en: 'Visit site' };
const REPO: Localized = { pt: 'Ver repositório', en: 'View repository' };

export const projects: Project[] = [

  {
    id: 'raposa',
    scope: 'own',
    name: 'Raposa',
    kicker: { pt: 'Revisão de código', en: 'Code review' },
    meta: { pt: 'Open source', en: 'Open source' },
    badge: 'GO',
    snippet: [
      { kind: 'ctx', text: '@@ -12,6 +12,7 @@ func newClient()' },
      { kind: 'del', text: '-  InsecureSkipVerify: false,' },
      { kind: 'add', text: '+  InsecureSkipVerify: true,' },
      { kind: 'note', text: { pt: '   ^~~~ raposa: TLS sem verificação', en: '   ^~~~ raposa: TLS without verification' } },
    ],
    tagline: {
      pt: 'Revisor de código local com evidência verificável. 100% open source.',
      en: 'Local code reviewer backed by verifiable evidence. 100% open source.',
    },
    description: {
      pt: [
        'Revisor de código local e laboratório de avaliação para pull requests, inspirado nas capacidades públicas do CodeRabbit. O objetivo é aproximar a qualidade da revisão de evidência e medição.',
        'Recebe dois commits de um repositório existente, sem fazer checkout e sem executar builds, testes ou hooks do alvo.',
      ],
      en: [
        'A local code reviewer and evaluation lab for pull requests, inspired by the public capabilities of CodeRabbit. The goal is to bring review quality closer to evidence and measurement.',
        'It takes two commits from an existing repository, with no checkout and without running the target’s builds, tests or hooks.',
      ],
    },
    highlights: {
      pt: [
        'CLI com prepare, review e evaluate, saída em JSON e Markdown.',
        'Revisão com o modelo que o operador escolher, inclusive local via Ollama, em duas passagens: candidatos e tentativa de refutação.',
        'Evidência literal e linha do diff verificadas; candidatos descartados ficam rastreáveis.',
        'Avaliação por rótulos humanos: precisão, recall, duplicação e falsos negativos.',
      ],
      en: [
        'CLI with prepare, review and evaluate, with JSON and Markdown output.',
        'Review with whichever model the operator picks, including local via Ollama, in two passes: candidates, then an attempt to refute them.',
        'Literal evidence and diff line are verified; discarded candidates stay traceable.',
        'Evaluation against human labels: precision, recall, duplication and false negatives.',
      ],
    },
    tech: ['Go', 'Git', 'Ollama', 'CLI'],
    links: [{ label: REPO, href: 'https://github.com/lvcas-dotcom/raposa' }],
    credit: {
      text: { pt: 'Em parceria com lvcas-dotcom', en: 'Built together with lvcas-dotcom' },
      href: 'https://github.com/lvcas-dotcom',
    },
  },
  {
    id: 'pgfathom',
    scope: 'own',
    name: 'pgfathom',
    kicker: { pt: 'Arqueologia de schema', en: 'Schema archaeology' },
    meta: { pt: 'Open source', en: 'Open source' },
    badge: 'GO',
    snippet: [
      { kind: 'cmd', text: '$ pgfathom discover --full' },
      { kind: 'out', text: 'CONFIRMED  item_pedido.pedido_id → pedido.id' },
      { kind: 'note', text: 'BROKEN     os_servico.resp_tecnico → funcionario.id' },
    ],
    tagline: {
      pt: 'Descobre e prova, contra os dados, as relações que um banco PostgreSQL legado nunca declarou.',
      en: 'Finds and proves, against the data, the relationships a legacy PostgreSQL database never declared.',
    },
    description: {
      pt: [
        'Bancos PostgreSQL antigos carregam mais estrutura do que declaram. O pgfathom encontra as chaves estrangeiras que faltam e as valida contra os dados, em vez de adivinhar por nome de coluna.',
        'Classifica cada relação como confirmada, quebrada (com linhas órfãs), fraca ou não validada, e gera SQL para revisão, nunca para execução às cegas.',
      ],
      en: [
        'Old PostgreSQL databases carry more structure than they declare. pgfathom finds the foreign keys that are missing and validates them against the data, instead of guessing from column names.',
        'It classifies each relationship as confirmed, broken (with orphan rows), weak or unvalidated, and writes SQL for review, never for blind execution.',
      ],
    },
    highlights: {
      pt: [
        'Somente leitura, por construção: nenhum modo de escrita no banco analisado.',
        'Nenhum valor das suas tabelas sai da memória: só contagens, razões e nomes de objetos.',
        'Mede o próprio acerto: no esquema do GitLab recupera 62,6% das chaves removidas.',
        'Perfis de nomenclatura pt-br, en e es, em TOML.',
      ],
      en: [
        'Read-only by construction: there is no write mode on the analysed database.',
        'No value from your tables leaves memory: only counts, ratios and object names.',
        'Measures its own accuracy: on the GitLab schema it recovers 62.6% of the removed keys.',
        'Naming profiles for pt-br, en and es, in TOML.',
      ],
    },
    tech: ['Go', 'PostgreSQL', 'CLI'],
    links: [{ label: REPO, href: 'https://github.com/lvcas-dotcom/pgfathom' }],
    credit: {
      text: { pt: 'Em parceria com lvcas-dotcom', en: 'Built together with lvcas-dotcom' },
      href: 'https://github.com/lvcas-dotcom',
    },
  },
  {
    id: 'vault',
    scope: 'own',
    name: 'Dynamic IA Ecosystem',
    kicker: { pt: 'Ambiente de IA', en: 'AI environment' },
    meta: { pt: 'Versão pública em preparação', en: 'Public version in the works' },
    badge: 'IA',
    snippet: [
      { kind: 'cmd', text: '$ bash scripts/doctor.sh --resumo' },
      { kind: 'out', text: 'plugin core .......... ok' },
      { kind: 'out', text: 'hooks e guardas ...... ok' },
      { kind: 'note', text: 'vault e perfis ....... ok' },
    ],
    tagline: {
      pt: 'Meu ecossistema de IA versionado: o mesmo ambiente de trabalho em qualquer máquina.',
      en: 'My versioned AI ecosystem: the same working environment on any machine.',
    },
    description: {
      pt: [
        'Configuração do Claude Code versionada: um plugin com skills e guardas, um vault de conhecimento em Markdown, perfis que decidem o que cada projeto enxerga e sync automático com o GitHub.',
        'Estou preparando uma versão genérica e pública, para que qualquer pessoa possa clonar e configurar o seu próprio.',
      ],
      en: [
        'A versioned Claude Code setup: a plugin with skills and guardrails, a Markdown knowledge vault, profiles that decide what each project can see, and automatic sync with GitHub.',
        'I am preparing a generic, public version so anyone can clone it and set up their own.',
      ],
    },
    highlights: {
      pt: [
        'Plugin com skills e hooks que impedem ações sem confirmação do dono.',
        'Vault de notas em Markdown que abre no Obsidian.',
        'Perfis por projeto: o isolamento é de contexto.',
        'Instalação reproduzível, com backup e diagnóstico.',
      ],
      en: [
        'Plugin with skills and hooks that block actions without the owner’s confirmation.',
        'Markdown note vault that opens in Obsidian.',
        'Per-project profiles: the isolation is of context.',
        'Reproducible install, with backup and diagnostics.',
      ],
    },
    tech: ['Claude Code', 'Obsidian', 'Shell', 'Python'],
    links: [],
    status: { pt: 'Repositório genérico em breve', en: 'Generic repository coming soon' },
  },

  {
    id: 'icouni',
    scope: 'consulting',
    name: 'I COUNI',
    kicker: { pt: 'Congresso de Odontologia', en: 'Dentistry congress' },
    meta: { pt: 'Out/2026 · Maringá', en: 'Oct 2026 · Maringá' },
    badge: 'WEB',
    snippet: [
      { kind: 'ctx', text: { pt: '[x] programação, palestrantes e inscrições', en: '[x] schedule, speakers and registration' } },
      { kind: 'ctx', text: { pt: '[x] login e gestão de usuários', en: '[x] login and user management' } },
      { kind: 'ctx', text: { pt: '[x] submissão de trabalhos e certificados', en: '[x] paper submission and certificates' } },
      { kind: 'note', text: { pt: '5 semanas · do zero ao ar', en: '5 weeks · from zero to live' } },
    ],
    tagline: {
      pt: 'Plataforma do 1º Congresso de Odontologia da UniCesumar: do zero ao ar em 5 semanas.',
      en: 'Platform for the 1st Dentistry Congress at UniCesumar: from zero to live in 5 weeks.',
    },
    description: {
      pt: [
        'O congresso aconteceu de 26 a 28 de outubro, em Maringá. Por ser a 1ª edição, o evento não tinha nenhuma estrutura digital: a Diretoria do Curso de Odontologia trouxe a demanda e a equipe da Axion construiu tudo do zero.',
      ],
      en: [
        'The congress took place on October 26 to 28, in Maringá. As the first edition, the event had no digital infrastructure: the Dentistry Program Board brought the request and the Axion team built everything from scratch.',
      ],
    },
    highlights: {
      pt: [
        'Site com programação, palestrantes e inscrições.',
        'Plataforma com login que centraliza a operação do evento e a gestão de usuários.',
        'Submissão e gestão dos trabalhos científicos.',
        'Emissão automática de certificados.',
        'Integração com WhatsApp para suporte ao participante.',
      ],
      en: [
        'Website with schedule, speakers and registration.',
        'Platform with login that centralizes event operations and user management.',
        'Submission and management of scientific papers.',
        'Automatic certificate issuing.',
        'WhatsApp integration for attendee support.',
      ],
    },
    tech: ['Next.js', 'PostgreSQL'],
    links: [{ label: SITE, href: 'https://www.counicesumar.com.br/' }],
    team: ['Filipe Ruiz Boligon', 'Leonardo Bezerra da Silva', 'Thiago Fernando Zulli'],
    quote: {
      text: {
        pt: 'o comprometimento com o projeto e a qualidade do material',
        en: 'the commitment to the project and the quality of the material',
      },
      author: 'Prof. Dr. Fábio Vieira de Miranda',
    },
  },
  {
    id: 'workintech',
    scope: 'consulting',
    name: 'WorkInTech',
    kicker: { pt: 'Evento de tecnologia', en: 'Tech event' },
    meta: { pt: 'Out/2026 · UniCesumar', en: 'Oct 2026 · UniCesumar' },
    badge: 'WEB',
    snippet: [
      { kind: 'ctx', text: { pt: '[x] workshops · 26 e 27/10', en: '[x] workshops · Oct 26 and 27' } },
      { kind: 'ctx', text: { pt: '[x] hackathon · 28 a 30/10', en: '[x] hackathon · Oct 28 to 30' } },
      { kind: 'note', text: { pt: 'banca avaliativa e certificados', en: 'evaluation panel and certificates' } },
    ],
    tagline: {
      pt: 'Plataforma do evento de tecnologia que conecta estudantes a profissionais do mercado.',
      en: 'Platform for the tech event that connects students with industry professionals.',
    },
    description: {
      pt: [
        'Entrei num momento de refatoração e participei ativamente dele: deixar o código mais eficiente, mais rápido e mais apresentável, sem perder de vista a experiência de quem usa. Trabalhei no front e no back para as melhorias chegarem de ponta a ponta.',
        'O projeto amplia o network de quem está começando e abre espaço para experiências reais: tecnologia aproximando pessoas e criando oportunidade.',
      ],
      en: [
        'I joined during a refactoring phase and took an active part in it: making the code more efficient, faster and cleaner, without losing sight of the experience of the people who use it. I worked on both front end and back end so the improvements reached end to end.',
        'The project widens the network of people who are starting out and opens room for real experience: technology bringing people together and creating opportunity.',
      ],
    },
    highlights: {
      pt: [
        'Refatoração de front-end e back-end.',
        'Emissão de certificados e gestão de usuários.',
        'Banca avaliativa e workshops, com hackathon.',
      ],
      en: [
        'Front-end and back-end refactoring.',
        'Certificate issuing and user management.',
        'Evaluation panel and workshops, with a hackathon.',
      ],
    },
    tech: ['Fullstack'],
    links: [{ label: SITE, href: 'https://www.workintech.com.br/' }],
    team: ['Filipe Ruiz Boligon', 'Thiago Fernando Zulli', 'Leonardo Bezerra da Silva', 'Carlos Eduardo Carfi'],
  },
  {
    id: 'events-organization',
    scope: 'consulting',
    name: 'Organização de eventos',
    kicker: { pt: 'Gestão de eventos', en: 'Event management' },
    meta: { pt: 'Axion · estudantes', en: 'Axion · students' },
    badge: { pt: 'EQUIPE', en: 'TEAM' },
    snippet: [
      { kind: 'ctx', text: { pt: '[x] planejamento do evento', en: '[x] event planning' } },
      { kind: 'ctx', text: { pt: '[x] coordenação de equipes', en: '[x] team coordination' } },
      { kind: 'note', text: { pt: 'gestão somada à atuação técnica', en: 'management added to technical work' } },
    ],
    tagline: {
      pt: 'Organização de eventos estudantis e coordenação de equipes.',
      en: 'Student event organization and team coordination.',
    },
    description: {
      pt: [
        'Participação e apoio na organização de eventos e de oportunidades para estudantes, somando experiência de gestão e de trabalho com equipes à atuação técnica.',
      ],
      en: [
        'Taking part in and supporting the organization of events and opportunities for students, adding management and team experience to technical work.',
      ],
    },
    highlights: {
      pt: [
        'Planejamento e apoio à operação de eventos estudantis.',
        'Trabalho em equipe e contato direto com quem organiza.',
        'Gestão somada à atuação técnica.',
      ],
      en: [
        'Planning and operational support for student events.',
        'Teamwork and direct contact with the organizers.',
        'Management added to technical work.',
      ],
    },
    tech: [
      { pt: 'Eventos', en: 'Events' },
      { pt: 'Equipes', en: 'Teams' },
      { pt: 'Gestão', en: 'Management' },
    ],
    links: [],
  },

  {
    id: 'tributech-platform',
    scope: 'professional',
    name: 'Plataforma principal',
    kicker: { pt: 'Aplicação principal', en: 'Main application' },
    meta: { pt: 'Tributech · desde 2025', en: 'Tributech · since 2025' },
    badge: 'JAVA',
    snippet: [
      { kind: 'cmd', text: '$ ./mvnw verify' },
      { kind: 'out', text: 'Spring Boot · Angular · REST' },
      { kind: 'note', text: 'BUILD SUCCESS' },
    ],
    tagline: {
      pt: 'Aplicação principal da Tributech, em Java e Angular.',
      en: 'Tributech’s main application, in Java and Angular.',
    },
    description: {
      pt: [
        'Desenvolvimento e manutenção da aplicação principal em Java (Spring Boot) e Angular/TypeScript, seguindo padrões REST e boas práticas de arquitetura. Os sistemas lidam com dados sensíveis, o que exige atenção e alinhamento.',
      ],
      en: [
        'Development and maintenance of the main application in Java (Spring Boot) and Angular/TypeScript, following REST standards and sound architecture practices. The systems handle sensitive data, which demands care and alignment.',
      ],
    },
    highlights: {
      pt: [
        'Soluções replicáveis, escaláveis e manuteníveis, de ponta a ponta.',
        'Propostas de melhoria e de novos projetos que aumentam a utilidade do sistema.',
        'Refatoração visual e de eficiência da aplicação.',
      ],
      en: [
        'Replicable, scalable and maintainable solutions, end to end.',
        'Proposals for improvements and new projects that make the system more useful.',
        'Visual and efficiency refactoring of the application.',
      ],
    },
    tech: ['Java', 'Spring Boot', 'Angular', 'RabbitMQ', 'Go', 'Docker'],
    links: [],
  },
  {
    id: 'tributech-data',
    scope: 'professional',
    name: 'APIs e integração de dados',
    kicker: { pt: 'Integração de dados', en: 'Data integration' },
    meta: { pt: 'Tributech · 2025', en: 'Tributech · 2025' },
    badge: 'REST',
    snippet: [
      { kind: 'cmd', text: 'POST /integracao/dados' },
      { kind: 'out', text: { pt: 'dialetos SQL → relatórios', en: 'SQL dialects → reports' } },
      { kind: 'note', text: '202 Accepted' },
    ],
    tagline: {
      pt: 'APIs REST e rotinas que integram sistemas e disponibilizam dados.',
      en: 'REST APIs and routines that integrate systems and expose data.',
    },
    description: {
      pt: [
        'Criação e teste de APIs para integrar e disponibilizar dados entre sistemas, funções robustas de relatório e aplicações que automatizam processos manuais, reduzindo retrabalho.',
      ],
      en: [
        'Building and testing APIs to integrate and expose data between systems, robust report functions and applications that automate manual processes, cutting rework.',
      ],
    },
    highlights: {
      pt: [
        'Integração de dados entre diferentes dialetos SQL.',
        'Relatórios automatizados.',
        'Treinamento de estagiários.',
      ],
      en: [
        'Data integration across different SQL dialects.',
        'Automated reports.',
        'Intern training.',
      ],
    },
    tech: ['Java', 'Spring', 'SQL', 'Pentaho'],
    links: [],
  },
  {
    id: 'tributech-integrator',
    scope: 'professional',
    name: 'Integrador geral',
    kicker: { pt: 'Integração de dados', en: 'Data integration' },
    meta: { pt: 'Tributech · 2026', en: 'Tributech · 2026' },
    badge: 'GO',
    snippet: [
      { kind: 'cmd', text: '$ integrador executar --dry-run' },
      { kind: 'out', text: { pt: 'extrator → carga → validação', en: 'extractor → load → validation' } },
      { kind: 'note', text: { pt: '64 verificações · relatório .xlsx', en: '64 checks · .xlsx report' } },
    ],
    tagline: {
      pt: 'Pipeline que extrai dados de sistemas de origem e os carrega de forma idempotente.',
      en: 'Pipeline that extracts data from source systems and loads it idempotently.',
    },
    description: {
      pt: [
        'Integrador em duas partes: um extrator em Java (Spring Boot) que ingere os dados de origem e um núcleo em Go que aplica migrations, carrega o destino em etapas com dependências e valida o resultado.',
        'A execução aceita simulação (dry-run), roda uma etapa isolada, atende vários ambientes pelo mesmo serviço e gera relatório em planilha com resumo, inserções, atualizações e verificações de duplicidade e cardinalidade.',
      ],
      en: [
        'Two-part integrator: a Java (Spring Boot) extractor that ingests source data and a Go core that applies migrations, loads the target in dependent steps and validates the result.',
        'Runs support a dry-run, a single isolated step and several environments behind the same service, and produce a spreadsheet report with summary, inserts, updates and duplicate and cardinality checks.',
      ],
    },
    highlights: {
      pt: [
        'Reingestão idempotente: repetir a carga não duplica dados.',
        'Dry-run que executa tudo e desfaz no final.',
        'Relatório com verificações de duplicidade, cardinalidade e estado.',
      ],
      en: [
        'Idempotent re-ingestion: repeating the load does not duplicate data.',
        'Dry-run that executes everything and rolls back at the end.',
        'Report with duplicate, cardinality and state checks.',
      ],
    },
    tech: ['Go', 'Java', 'Spring Boot', 'PostgreSQL', 'Flyway'],
    links: [],
  },
  {
    id: 'tributech-metrics',
    scope: 'professional',
    name: 'Gestão de métricas',
    kicker: { pt: 'Painel de métricas', en: 'Metrics dashboard' },
    meta: { pt: 'Tributech · 2026', en: 'Tributech · 2026' },
    badge: 'API',
    snippet: [
      { kind: 'cmd', text: '$ docker compose up -d' },
      { kind: 'out', text: 'FastAPI · Angular · Caddy' },
      { kind: 'note', text: { pt: 'healthcheck: api e web saudáveis', en: 'healthcheck: api and web healthy' } },
    ],
    tagline: {
      pt: 'Painel que reúne métricas de entrega, horas, SLA e produtividade do time.',
      en: 'Dashboard gathering delivery, hours, SLA and team productivity metrics.',
    },
    description: {
      pt: [
        'Aplicação completa para gestão de métricas: API em Python (FastAPI) com autenticação JWT, permissões por perfil e notificações em tempo real, e interface em Angular com gráficos.',
        'Reúne visões executiva, comercial, de licitações e de SLA, além de calendário, horas e roadmap, e sobe em contêineres com verificações de saúde e proxy reverso com HTTPS.',
      ],
      en: [
        'Full application for metrics management: a Python (FastAPI) API with JWT authentication, role-based permissions and real-time notifications, and an Angular interface with charts.',
        'Brings together executive, commercial, bidding and SLA views, plus calendar, hours and roadmap, and runs in containers with health checks and an HTTPS reverse proxy.',
      ],
    },
    highlights: {
      pt: [
        'Autenticação JWT e permissões por perfil de usuário.',
        'Visões executiva, de SLA, de horas e de produtividade com gráficos.',
        'Deploy em contêineres com healthcheck e proxy reverso.',
      ],
      en: [
        'JWT authentication and role-based permissions.',
        'Executive, SLA, hours and productivity views with charts.',
        'Containerized deploy with health checks and a reverse proxy.',
      ],
    },
    tech: ['Python', 'FastAPI', 'Angular', 'PostgreSQL', 'Docker'],
    links: [],
  },
];

export function projectsByScope(scope: ScopeId): Project[] {
  return projects.filter((p) => p.scope === scope);
}
