import type { Localized } from '@/i18n/types';

export interface ExchangeModule {
  title: string;
  badge: Localized;
  description: Localized;
}

export const exchange = {
  program: 'Innovation Management in the Digital Economy',
  university: 'Florida Atlantic University (FAU)',
  planned: { pt: 'Previsto: jul/2027', en: 'Planned: Jul 2027' } satisfies Localized,
  format: {
    pt: 'Programa de Extensão Profissional de curta duração no exterior',
    en: 'Short-term professional extension program abroad',
  } satisfies Localized,
  duration: { pt: '1 mês', en: '1 month' } satisfies Localized,
  theme: {
    pt: 'Estratégias e melhores práticas de inovação nas empresas de base digital.',
    en: 'Innovation strategies and best practices in digital-based companies.',
  } satisfies Localized,
  objective: {
    pt: 'Desenvolver conhecimentos teóricos e habilidades práticas de Gestão da Inovação e de uma cultura organizacional que estimule a criatividade na Economia Digital, estudando casos e modelos para aprimorar a entrega de resultados eficiente e que agregue valor.',
    en: 'Build theoretical knowledge and practical skills in innovation management and in an organizational culture that fosters creativity in the Digital Economy, studying cases and models to improve efficient delivery of results that adds value.',
  } satisfies Localized,
  modules: [
    {
      title: 'Managing Innovation Ecosystems',
      badge: { pt: 'Gestão', en: 'Management' },
      description: {
        pt: 'Formação de equipes para organizações disruptivas; alianças, parcerias e modelos de cooperação para o mundo digital; visitas a empresas e casos de negócio.',
        en: 'Team building for disruptive organizations; alliances, partnerships, and cooperation models for the digital world; company visits and business cases.',
      },
    },
    {
      title: 'Rethinking organizational models',
      badge: { pt: 'Negócio', en: 'Business' },
      description: {
        pt: 'Transformação digital, startups e a nova economia; comunicação e distribuição na era das redes sociais; visitas a empresas e casos de negócio.',
        en: 'Digital transformation, startups, and the new economy; communication and distribution in the social media era; company visits and business cases.',
      },
    },
    {
      title: 'Agile techniques',
      badge: { pt: 'Resultado', en: 'Result' },
      description: {
        pt: 'Criação de valor para o novo consumidor; exploração de opções e desenvolvimento de soluções em movimento; casos de negócio.',
        en: 'Creating value for the new consumer; exploring options and developing solutions on the go; business cases.',
      },
    },
  ] satisfies ExchangeModule[],
};
