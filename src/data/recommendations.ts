import messianoPhoto from '@/assets/people/messiano.png';
import morenoPhoto from '@/assets/people/moreno.png';
import type { Localized, LocalizedList } from '@/i18n/types';

export interface Recommendation {
  id: string;
  author: string;

  photo: string;
  role: Localized;
  relation: Localized;
  date: Localized;

  text: LocalizedList;
}

export const recommendations: Recommendation[] = [
  {
    id: 'messiano',
    author: 'Alexandre José Messiano',
    photo: messianoPhoto,
    role: {
      pt: 'Product Owner | Descoberta e Gerenciamento de Produtos | Metodologias Ágeis (Scrum/Kanban)',
      en: 'Product Owner | Product Discovery and Management | Agile Methodologies (Scrum/Kanban)',
    },
    relation: { pt: 'supervisionava Gabriel diretamente', en: 'directly supervised Gabriel' },
    date: { pt: '24 de julho de 2026', en: 'July 24, 2026' },
    text: {
      pt: [
        'Não recomendo trabalhar com ele..',
        '.. Afinal, profissionais com tanta competência técnica, facilidade para compreender regras de negócio e capacidade de resolver problemas de forma criativa e eficaz deveriam continuar no nosso time, e não despertar o interesse de outras empresas.',
        'Tivemos a oportunidade de trabalhar juntos em projetos grandes e desafiadores, nos quais ele sempre demonstrou muita responsabilidade, comprometimento e senso de urgência. É um desenvolvedor que não se limita apenas a executar demandas: busca entender o problema, avaliar os impactos e encontrar a melhor solução.',
        'Além da excelente capacidade técnica, destaca-se pela criatividade, agilidade e segurança na resolução de situações complexas. É o tipo de profissional em quem podemos confiar quando surge um desafio importante.',
        'Brincadeiras à parte, recomendo seu trabalho sem qualquer ressalva. Foi um prazer compartilhar projetos e desafios com um profissional tão competente e confiável.',
      ],
      en: [
        "I don't recommend working with him..",
        '.. After all, professionals with this much technical skill, an easy grasp of business rules and the ability to solve problems creatively and effectively should stay on our team, not attract the interest of other companies.',
        'We had the chance to work together on large, challenging projects, where he always showed great responsibility, commitment and a sense of urgency. He is a developer who does not stop at executing tasks: he seeks to understand the problem, assess the impact and find the best solution.',
        'Besides his excellent technical ability, he stands out for creativity, speed and confidence in handling complex situations. He is the kind of professional we can trust when an important challenge comes up.',
        'Jokes aside, I recommend his work without any reservation. It was a pleasure to share projects and challenges with such a competent and reliable professional.',
      ],
    },
  },
  {
    id: 'moreno',
    author: 'Alexandre Moreno',
    photo: morenoPhoto,
    role: { pt: 'Professor Moreno', en: 'Professor Moreno' },
    relation: { pt: 'foi professor de Gabriel', en: 'was Gabriel’s professor' },
    date: { pt: '29 de maio de 2025', en: 'May 29, 2025' },
    text: {
      pt: [
        'Tive o privilégio de acompanhar de perto o desempenho do Gabriel durante as disciplinas que ministrei a ele (Algoritmos e Estrutura de Dados). Sempre destacou-se não apenas pelo domínio técnico, mas também pela postura ética, curiosidade intelectual e comprometimento com a aprendizagem.',
        'Demonstrou equilíbrio entre teoria e prática e sempre disposto a colaborar com os colegas, além de ir além do que era proposto.',
        'Sem dúvida, um talento promissor que merece todas as oportunidades que o mercado ou a academia possam oferecer.',
      ],
      en: [
        'I had the privilege of closely following Gabriel’s performance in the courses I taught him (Algorithms and Data Structures). He always stood out not only for his technical command, but also for his ethical stance, intellectual curiosity and commitment to learning.',
        'He showed a balance between theory and practice, was always willing to collaborate with classmates, and went beyond what was asked.',
        'Without a doubt, a promising talent who deserves every opportunity that the market or academia can offer.',
      ],
    },
  },
];
