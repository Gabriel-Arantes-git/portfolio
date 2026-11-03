# Design

## Context

Repositório `portf-lio` vazio (só README). Greenfield: React + TypeScript pedido pelo dono, com separação por responsabilidade e componentização. Referências estéticas: `lucas.switchhub.dev` (seções com título estilo comentário, etiquetas de stack, cartões de projeto) e `karachh/estudos-app` (Vite + React + TS, `DESIGN.md` e `src/`). Referência de composição para o Sobre mim: print com figura recortada, cartões flutuantes e palavra em destaque no título. Motivação e escopo em `proposal.md`; requisitos nos specs.

## Goals / Non-Goals

**Goals:**
- Site estático, rápido, sem backend, com conteúdo tipado e separado da apresentação.
- Camadas claras: tokens SCSS, componentes puros, seções que só compõem, dados e traduções fora do JSX.
- Pipeline de dados em Canvas com lógica de simulação testável, separada do desenho.

**Non-Goals:**
- CMS, blog, formulário de contato com backend, analytics.
- Biblioteca de animação ou de i18n externa.
- Roteamento por páginas: é uma landing de página única com âncoras.

## Decisions

**1. Vite + React 18 + TypeScript + Sass.** Build simples e estático (referência `estudos-app` usa a mesma base). Alternativa Next.js descartada: sem SSR nem rotas, só custo.

**2. Estrutura de pastas por responsabilidade**
```
src/
  components/   Button, Card, Tag, Marquee, LanguageToggle (sem conteúdo, só props)
  sections/     Hero, StackDivider, About, Timeline, Projects, Stack, Contact
  hooks/        useReducedMotion, useInView, useAnimationLoop
  i18n/         LanguageProvider, useT, dicionários pt.ts / en.ts
  data/         experience.ts, projects.ts, recommendations.ts, stack.ts (textos {pt,en})
  utils/        pipeline/ (simulação pura), storage.ts (try/catch), classNames.ts
  styles/       _tokens.scss, _mixins.scss, global.scss
  assets/       foto, logos
```
Regra: `sections` importa `components`, `data`, `i18n`; `components` não importa `sections` nem `data`.

**3. Tokens SCSS e paleta.** `_tokens.scss` é a única fonte de cor, em variáveis SCSS (`$color-base` etc.) expostas também como custom properties CSS no `:root`, para uso no Canvas via `getComputedStyle`. Paleta definida pelo dono (imagem de referência), mais um destaque: Cranberry `#3F1116` (fundo escuro, pipeline, texto corrido sobre claro), Plum `#64343C` (bordas, sombras duras, cartões escuros), Taupe `#9D7960` (etiquetas, linhas, apoio), Beige `#FEEFDC` (papel principal) e Ivory `#FFF1E9` (papel dos cartões), e o vermelho `#ED324E` como único destaque saturado (título, faixa STACK, palavra em destaque, números). A paleta do dono não tem vermelho vivo e o brutalismo russo depende de um; se o dono preferir só as cinco, basta remover o token de destaque. Contraste: texto corrido em Cranberry sobre Beige/Ivory (acima de 12:1) ou Beige sobre Cranberry; Plum sobre Beige serve a texto; Taupe sobre Beige (cerca de 3,4:1) e vermelho sobre Beige ou Cranberry (cerca de 3,4 a 4,2:1) só em títulos grandes e elementos gráficos. Alternativa de gerar só por HSL descartada: valores fixos dão controle de contraste.

**4. i18n próprio e mínimo.** Contexto React com `lang`, hook `useT()` e dicionários tipados; dados de conteúdo guardam `{ pt, en }`. O tipo de `en` é derivado do `pt`, então chave faltando quebra a compilação. Fallback para PT em runtime. Persistência em `localStorage` dentro de `try/catch`. Alternativa `react-i18next` descartada: dependência a mais para ~150 textos.

**5. Pipeline em Canvas 2D.** Simulação pura em `utils/pipeline` (estado de registros, etapas, passo de tempo, influência do cursor, contador) e componente que só desenha e liga eventos. Uma `requestAnimationFrame` loop pausada por `IntersectionObserver` e `visibilitychange`; estático com `prefers-reduced-motion`; `devicePixelRatio` limitado a 2. Alternativas: DOM/CSS (custo com muitos registros) e WebGL (excesso).

**6. Faixa diagonal.** Elemento `rotate(-3deg)` com `Marquee` de CSS puro (`translateX` em loop de duas cópias), posicionado no fim da `100svh` do Hero com margem para não cortar nas bordas. Usa `svh` para o cabimento na primeira dobra em celular.

**7. Sobre mim: foto.** Não há PNG transparente, então a foto usa moldura com `clip-path` poligonal brutalista e duotone via filtro SVG (`feColorMatrix` mapeando para escuro e base). O duotone achata o fundo desfocado da foto e o recorte isola a figura. Remover o fundo de verdade fica fora do escopo.

**8. Projetos por escopo.** Estado `activeScope`; trocas animadas com CSS (`transform`/`opacity`) usando `key` por escopo e classes de entrada/saída. Detalhe em painel (`dialog` nativo) com foco gerenciado. Alternativa de biblioteca de animação descartada.

**9. Testes.** Vitest + Testing Library: simulação do pipeline, `useT`/fallback, persistência com storage bloqueado, troca de escopo. Verificação visual manual por viewport (360, 768, 1366, 1920).

**10. Contato sem raspagem.** E-mail e telefone ficam em `data/contact.ts` como fragmentos codificados (Base64 invertido, divididos em partes) e só são montados em `utils/contact.ts` após o clique do visitante; só então se criam `mailto:` e `https://wa.me/55...`. Nada disso entra em `<meta>`, JSON-LD, `href` ou texto do HTML estático. Um teste de build varre o resultado por `arantes.gabriel21`, por padrões de e-mail e pelos dígitos do telefone (o nome "Arantes" é público e não entra na busca). Limite honesto: robôs que executam JavaScript e clicam em botões ainda conseguiriam; a medida barra os raspadores comuns (que leem HTML ou fazem regex). Alternativa de formulário com backend descartada: exige servidor. LinkedIn e GitHub são URLs públicas e ficam como links diretos, com `rel="noopener noreferrer"`.

**11. Barra de navegação (spec site-navigation).** Componente `Navbar` fixo no topo, com estado `floating` derivado de `scrollY > 80` (ouvinte passivo, atualizado em `requestAnimationFrame`). O mesmo elemento anima entre os dois estados por `transition` de largura máxima, margem, padding e sombra, sem remontar. Seção ativa por `IntersectionObserver` nas seções. Em menos de 960 px, botão de menu com `aria-expanded`. O alternador de idioma passa a viver dentro da barra.

**12. Balão de fala no pipeline.** A detecção de registro sob o cursor é lógica pura (`findHovered`), testada. O desenho fica no Canvas: balão com ponta apontando ao cubo e pacotes quadrados correndo numa trilha dentro do balão, animados pelo relógio do quadro. O registro sob o cursor desacelera quase a zero. A repulsão vertical do cursor foi removida: ela afastava os cubos justamente quando se tentava passar o mouse neles.

**13. Faixa de stack.** `Marquee` passa a receber uma lista de palavras; a faixa mostra as tecnologias de `data/stack.ts` (uma só fonte para faixa, seção Stack e etiquetas).

**14. Intercâmbio animado.** O `<details>` nativo salta a altura seca, então vira um botão com `aria-expanded` + região colapsável com `grid-template-rows: 0fr → 1fr` e `visibility` para esconder do foco e de leitores quando fechada. Os módulos usam `@keyframes` com queda e quique (cubic-bezier com overshoot), atraso escalonado e selo "desbloqueado" no estilo de conquista. A ilustração (avião sobre rota pontilhada Maringá → Flórida) é SVG inline, animado só por CSS.

**15. Trajetória como mapa.** Quatro paradas (uma por cargo), cada uma com um "X". Um SVG decorativo posicionado atrás da lista desenha um caminho pontilhado de quadrados (`stroke-dasharray` com `linecap` quadrado) em curvas S entre os X, calculado a partir das posições medidas (`ResizeObserver`). O progresso é o scroll do contêiner (0..1); quadrados correm pelo caminho com `getPointAtLength` e um deslocamento perpendicular senoidal (ondulação), e o trecho percorrido fica em destaque. Com movimento reduzido o caminho aparece completo e parado. Ilustrações por parada são componentes SVG que usam só tokens de cor.

**16. Contato.** Os botões de e-mail e WhatsApp são `<button>` com ícone SVG inline: o destino (`mailto:` / `wa.me`) só é montado no clique e aberto por `window.location.assign` / `window.open(..., 'noopener,noreferrer')`. O DOM nunca contém o endereço, nem o `href`.

**17. Interação por paralaxe.** Hook `usePointerParallax` grava `--px` e `--py` (-1 a 1) num elemento; foto, sombra e cartões usam multiplicadores diferentes em CSS. Desligado com movimento reduzido e em dispositivos de toque.

**18. Balões que desviam e variam por etapa.** O posicionamento é uma função pura (`placeBubble`): testa candidatos em volta do cubo (acima, abaixo, lados, diagonais e versões mais afastadas) contra retângulos "proibidos" (nome, cargo e rótulo, medidos no DOM por `data-avoid`) e contra as bordas, e escolhe o primeiro livre; se nenhum couber, o de menor sobreposição. A apresentação por etapa é um desenho dedicado no Canvas, com valores fictícios derivados do id.

**19. Reprovar registro.** O registro ganha um destino (`ok`, `shake`, `fall`) e um cronômetro. O clique num cubo chama `reject`; o passo da simulação tremula por ~0,35 s e depois aplica gravidade só na vertical, removendo o registro ao sair pela base sem contá-lo como processado. A simulação continua pura e testada.

## Risks / Trade-offs

- [Contato raspado por bots] → revelação por clique e fragmentos codificados, com teste que varre o build; visitante sem JavaScript não vê o contato direto e usa LinkedIn.
- [Repositório do vault é privado e tem dados internos] → cartão sem link e sem detalhes do conteúdo interno; só descrição conceitual até existir o repositório genérico.
- [Canvas pesado em celular fraco] → limite de registros e de DPR, pausa fora da tela, estático com movimento reduzido.
- [Tradução EN escrita por mim] → o tipo garante que nada fica sem chave; o inglês do dono é intermediário, então o texto usa frases simples e diretas.
- [Texto das recomendações ser tratado como brincadeira por quem lê só o início ("Não recomendo...")] → manter fiel ao original, que fecha com "recomendo sem qualquer ressalva"; exibir o texto inteiro.
- [Crédito de Raposa e pgfathom] → co-autoria declarada com link ao `lvcas-dotcom`; ajustar se a relação mudar.
- [Datas futuras no currículo (FAU em jul/2027, formatura em dez/2027)] → exibidas como "previsto".

## Open Questions

- Link do repositório genérico do vault: entra quando existir; o cartão sem link renderiza sem o botão.
- Hospedagem (GitHub Pages, Vercel ou outra) e domínio: não afeta o código.
