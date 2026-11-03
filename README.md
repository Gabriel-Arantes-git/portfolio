# portf-lio

Portfólio de Gabriel Arantes: landing page bilíngue (PT-BR/EN) em estilo brutalismo russo, feita com React, TypeScript e Sass.

- **Tela inicial** com fundo interativo de pipeline de dados (Canvas): o mouse trava a etapa; passar o mouse num cubo abre um balão de fala, com apresentação própria de cada etapa (Extrair, Transformar, Carregar, API) e que desvia do nome e da barra; clicar num cubo o reprova (X, contador de reprovados, tremida e queda reta) e clicar no vazio injeta um registro. O rótulo acima do nome indica disponibilidade para oportunidades.
- **Barra de navegação** colada ao topo e larga; ao rolar encolhe e flutua, com animação. Menu em tela estreita.
- **Faixa diagonal** por onde passam as tecnologias da stack (inclui IA).
- **Sobre mim** (foto em cores com paralaxe, cartões flutuantes, cartão de objetivos, intercâmbio que abre com animação e módulos que "caem" como conquistas), **Trajetória** (mapa: quadrados ondulantes percorrem um caminho pontilhado de um X ao próximo conforme você rola), **Projetos** (por escopo, com troca animada), **Stack** e **Contato**.
- E-mail e WhatsApp são botões com ícone que abrem direto; o endereço e o telefone só são montados no clique e nunca existem em texto no HTML publicado.

O planejamento (proposta, specs, design e tarefas) está em `openspec/changes/build-portfolio-landing/`.

## Como rodar

Requer Node 22.12 ou mais novo (o Vitest exige; só o `dev` e o `build` rodariam no 20.19).

```sh
npm install
npm run dev        # servidor local em http://localhost:5173
npm test           # testes (Vitest); inclui varredura do build atrás de e-mail/telefone
npm run typecheck  # checagem de tipos
npm run build      # build de produção em dist/
npm run preview    # serve o dist/ para conferir
```

## Estrutura

```
src/
  components/   peças reutilizáveis e sem conteúdo: Button, Card, Tag, Section, Marquee, FramedPhoto,
                Icons, LanguageToggle, Navbar, PipelineCanvas
  sections/     uma pasta por seção: Hero, StackDivider, About, Timeline, Projects, Stack, Contact
  hooks/        useReducedMotion, useInView, useAnimationLoop, useSwitchTransition, useScrolled,
                useActiveSection, usePointerParallax
  i18n/         provedor de idioma, hooks e dicionários pt.ts / en.ts
  data/         conteúdo: experience, projects, recommendations, education, exchange, stack, contact, profile
  utils/        funções puras: pipeline/ (simulação), timelineMap (caminho ondulado), storage, contact,
                mergeDict, classNames
  styles/       _tokens.scss (paleta e medidas), _mixins.scss, _root.scss, global.scss
  assets/       foto principal e fotos de quem recomendou (people/)
```

Regra de dependência: `sections` importa `components`, `data`, `i18n` e `hooks`; `components` não importa `sections` nem `data`.

## Trocar a paleta

Toda cor mora em `src/styles/_tokens.scss`. Nenhum outro arquivo pode ter cor literal; o teste `src/styles/tokens.test.ts` falha se tiver. Mudar um valor ali muda o site inteiro, inclusive o Canvas (que lê as cores das custom properties).

| Variável | Hex | Uso |
|---|---|---|
| `$cranberry` | `#3F1116` | fundo escuro, texto corrido sobre claro |
| `$plum` | `#64343C` | bordas, sombras duras, texto secundário sobre claro |
| `$taupe` | `#9D7960` | apoio e gráficos (só texto grande: 3,5 a 4,1:1) |
| `$beige` | `#FEEFDC` | papel principal |
| `$ivory` | `#FFF1E9` | papel dos cartões |
| `$signal` | `#ED324E` | único destaque saturado (só texto grande e gráficos) |

Para ficar só com as cinco cores da paleta base, troque o uso de `$signal` por `$taupe` e remova o token.

## Trocar o conteúdo

- **Textos de interface**: `src/i18n/pt.ts` e `src/i18n/en.ts`. O inglês é tipado pelo português: chave faltando não compila, e em runtime cai para o PT.
- **Experiência, projetos, formação, recomendações, stack**: arquivos em `src/data/`. Cada texto é `{ pt, en }` (ou listas `{ pt: [], en: [] }`). A experiência vira as paradas do mapa da Trajetória, cada uma com uma ilustração (`art`) em `src/sections/Timeline/ExperienceArt.tsx`. As tecnologias da faixa vêm de `src/data/stack.ts`.
- **Projeto sem link público**: deixe `links: []`. É o caso do Dynamic IA Ecosystem enquanto o repositório genérico não existe; quando existir, adicione o link em `src/data/projects.ts`.
- **E-mail e telefone**: ficam em `src/data/contact.ts` como fragmentos codificados, nunca em texto. Para gerar novos fragmentos:

  ```sh
  node -e "const e=s=>Buffer.from(s).toString('base64').split('').reverse().join('');const sp=(s,n)=>s.match(new RegExp('.{1,'+n+'}','g'));console.log(JSON.stringify(sp(e(process.argv[1]),7)))" "novo@email.com"
  ```

  Para o telefone, passe só os dígitos com DDI (ex.: `5544...`). Cole o resultado em `contactFragments`.

## Limites conhecidos

- A proteção do contato barra raspadores comuns (que leem HTML ou usam regex). Um robô que execute JavaScript e clique nos botões ainda consegue o valor.
- As fotos de quem recomendou têm 100×100 px: servem como avatar pequeno, mas ficam suaves se ampliadas.
- A foto não tem fundo removido: o recorte vem de CSS (moldura de cantos cortados).
- O pipeline do Canvas pausa fora da tela e com a aba oculta, e fica parado com `prefers-reduced-motion` (com movimento reduzido o clique também não faz nada).
- Os valores nos balões do pipeline (fonte, linhas, lote, latência) são fictícios e derivados do id do cubo.
