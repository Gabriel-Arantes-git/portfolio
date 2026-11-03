# Proposal

## Why

Gabriel Arantes não tem um portfólio público que reúna trajetória, projetos e stack num só lugar. LinkedIn e GitHub contam partes da história, mas não mostram o foco atual (engenharia de software e dados, intercâmbio na FAU) nem têm identidade própria. Esta change cria a landing page pessoal, bilíngue (PT-BR/EN), em estilo brutalismo russo (construtivismo soviético: tipografia pesada, diagonais, vermelho, creme e preto), como vitrine para recrutadores e clientes.

## What Changes

- Nova SPA em React + TypeScript (Vite), organizada por responsabilidade: `components/`, `sections/`, `utils/`, `i18n/`, `data/`, `styles/`.
- Paleta e tokens em variáveis globais SCSS, derivados de `#ed324e` no mesmo padrão da paleta laranja de referência (Cranberry, Plum, Taupe, Beige e Ivory, escolhidas pelo dono) mais `#ed324e` como único destaque saturado, sem tons rosados.
- Botão PT-BR/EN que alterna todo o texto do site. O conteúdo é escrito em português e traduzido para inglês.
- **Tela inicial**: nome `GABRIEL ARANTES` e cargo `ENGENHEIRO DE SOFTWARE • DESENVOLVEDOR FULLSTACK`, sobre um fundo interativo de **pipeline de dados vivo**: registros quadrados correm por etapas (Extrair, Transformar, Carregar, API) e o mouse trava ou desvia registros, com contador de processados.
- **Divisória**: faixa diagonal com a palavra `STACK` repetida, inteira visível no primeiro viewport (rodapé da tela inicial). Abaixo dela o fundo muda de interativo para estático.
- **Sobre mim**: foto em moldura recortada com tratamento duotone na paleta, cartões flutuantes sobrepostos (intercâmbio FAU, foco atual, stack) e título com palavra em destaque, inspirado no print de referência. Inclui o resumo do intercâmbio *Innovation Management in the Digital Economy* (1 mês, 3 módulos) e as duas recomendações do LinkedIn.
- **Trajetória**: lista numerada com Tributech Gestão Pública (3 cargos), Axion Consultoria Jr. e Liga Acadêmica.
- **Projetos**: navegação por escopo, com transição animada entre os grupos: *Próprios* (Raposa, pgfathom, vault do ecossistema), *Consultoria Jr.* (I COUNI, WorkInTech, Hospital Veterinário, gestão de eventos) e *Profissional* (Tributech). Links reais: `counicesumar.com.br` e `workintech.com.br`.
- **Stack** com destaque para Java/Spring, PostgreSQL, Node, Angular e React, e grupo secundário (Go, AWS, RabbitMQ, Docker, Kubernetes, MySQL, Oracle, MongoDB).
- **Contato**: LinkedIn e GitHub como links diretos; e-mail e WhatsApp só aparecem após clique, para não serem raspados por robôs.
- Entrega da paleta final (valores hex e papéis) ao dono, conforme pedido.

## Capabilities

### New Capabilities
- `site-theme`: tokens SCSS globais, paleta derivada de `#ed324e`, tipografia e linguagem brutalista compartilhada.
- `language-toggle`: alternância PT-BR/EN, dicionários e persistência da escolha.
- `hero-pipeline`: tela inicial com nome, cargo e fundo interativo de pipeline de dados.
- `stack-divider`: faixa diagonal com as tecnologias da stack passando, entre a tela inicial e o Sobre mim.
- `site-navigation`: barra de navegação que vira uma versão reduzida e flutuante ao rolar.
- `about-me`: foto recortada, cartões flutuantes, intercâmbio FAU e recomendações.
- `experience-timeline`: trajetória profissional numerada.
- `projects-explorer`: projetos agrupados por escopo, com navegação animada.
- `stack-contact`: seção de stack priorizada e seção de contato.

### Modified Capabilities
<!-- Nenhuma: projeto novo, sem specs existentes. -->

## Impact

- Código novo no repositório `portf-lio` (hoje só README): app Vite/React/TS, SCSS, assets (foto, logos).
- Dependências previstas: `react`, `react-dom`, `typescript`, `vite`, `sass`. Animação do pipeline em Canvas 2D nativo, sem biblioteca de animação.
- Conteúdo de terceiros: Raposa e pgfathom pertencem ao GitHub `lvcas-dotcom`; serão listados com crédito de co-autoria.
- Privacidade: e-mail e telefone são revelados só por ação do visitante e não existem em texto legível no HTML publicado.
- O repositório `Dynamic-IA-Ecosystem` é privado: o cartão do vault não linka nada até existir o repositório genérico público. Contém também dados internos (ex.: servidor GitLab da Tributech), que não entram no site.
- Pendências de conteúdo: link do repositório genérico do vault. O conteúdo vem do currículo em texto enviado pelo dono.
