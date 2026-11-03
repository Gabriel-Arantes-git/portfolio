# Tasks

## 1. Scaffold e tema

- [x] 1.1 Criar app Vite + React + TypeScript com Sass, Vitest e Testing Library; verificar que `npm run dev`, `npm run build` e `npm test` rodam sem erro
- [x] 1.2 Criar a árvore `components/ sections/ hooks/ i18n/ data/ utils/ styles/ assets/` e verificar que o build passa com um `App` vazio
- [x] 1.3 Implementar `styles/_tokens.scss` (seis cores, tipografia, espaçamentos, sombra dura, expostos também como custom properties), `_mixins.scss` e `global.scss`; verificar com busca que não há hex fora de `_tokens.scss`
- [x] 1.4 Implementar componentes base (`Button`, `Card`, `Tag`, `Section`) com estilo brutalista e foco visível; verificar renderização por teste e checagem visual sem `border-radius`
- [x] 1.5 Enviar ao dono a paleta final (hex e papel) e verificar a aprovação antes de seguir para as seções

## 2. Idioma

- [x] 2.1 Implementar `LanguageProvider`, `useT`, `utils/storage.ts` com `try/catch`, dicionários `pt.ts`/`en.ts` tipados e atributo `lang` do documento; verificar com testes de troca, fallback, retorno do visitante e storage bloqueado
- [x] 2.2 Implementar `LanguageToggle` fixo e visível em todas as seções; verificar que a troca altera o texto sem recarregar a página

## 3. Tela inicial e divisória

- [x] 3.1 Implementar a simulação pura do pipeline em `utils/pipeline` (etapas, registros, passo de tempo, influência do cursor, contador); verificar com testes unitários de movimento, desvio e contagem
- [x] 3.2 Implementar o componente Canvas do pipeline com `useAnimationLoop`, `useInView`, `useReducedMotion`, cursor e clique/toque; verificar no navegador pausa fora da tela e modo estático com movimento reduzido
- [x] 3.3 Implementar `Hero` com nome, cargo e fundo do pipeline; verificar que nome, cargo e botão de idioma aparecem sem rolagem em 1366x768 e 360x640
- [x] 3.4 Implementar `Marquee` e `StackDivider` diagonal no fim da primeira dobra; verificar que a faixa aparece completa em 360, 768, 1366 e 1920 px de largura e que o fundo muda abaixo dela

## 4. Sobre mim e trajetória

- [x] 4.1 Preparar a foto em `assets/` (sem PNG transparente) com filtro duotone e moldura poligonal; verificar que o rosto fica visível, o fundo fica achatado e a cor segue os tokens
- [x] 4.2 Implementar `About` com cartões flutuantes, título com destaque e texto lateral PT/EN; verificar a composição em desktop e em 360 px sem sobreposição de texto
- [x] 4.3 Adicionar bloco do intercâmbio FAU (Florida Atlantic University, previsto jul/2027, tema, 1 mês, objetivo, três módulos) em `data/` e na seção; verificar que o conteúdo está completo nos dois idiomas
- [x] 4.6 Adicionar formação (Engenharia de Software, Unicesumar), certificações, nível de inglês e curso da Mister Wiz ao Sobre mim; verificar que os itens aparecem de forma compacta nos dois idiomas
- [x] 4.4 Adicionar as duas recomendações em `data/recommendations.ts` com texto original e tradução; verificar que o texto PT é idêntico ao original
- [x] 4.5 Implementar `Timeline` numerada com Tributech (três cargos agrupados) e Axion, com etiquetas de competências; verificar a ordem, os períodos, a duração total de 1 ano e 10 meses e a ausência de nomes de municípios

## 5. Projetos, stack e contato

- [x] 5.1 Criar `data/projects.ts` com Raposa, pgfathom, vault (sem link), I COUNI, WorkInTech, Hospital Veterinário, gestão de eventos e Tributech, textos {pt,en}, links reais de COUNI e WorkInTech e crédito de co-autoria; verificar que o tipo exige os dois idiomas e que nenhum link aponta para o repositório privado
- [x] 5.2 Implementar `Projects` com seletor de escopos, animação de entrada/saída e navegação por teclado; verificar por teste a troca de escopo e o escopo inicial Próprios
- [x] 5.3 Implementar o detalhe do projeto em `dialog` com foco gerenciado; verificar abertura, fechamento por Esc e o conteúdo do I COUNI
- [x] 5.4 Implementar `Stack` em dois níveis (destaque e secundária com Docker, Kubernetes e Oracle do currículo); verificar a diferença de tamanho entre os níveis
- [x] 5.5 Implementar `Contact` com LinkedIn e GitHub diretos, e e-mail e WhatsApp revelados por clique (`data/contact.ts` codificado e `utils/contact.ts`); verificar por teste unitário a montagem e por teste de build que o build não contém `arantes.gabriel21`, nenhum padrão de e-mail nem os dígitos do telefone em forma legível (o nome "Arantes" e as URLs de LinkedIn e GitHub continuam públicos)

## 6. Fechamento

- [x] 6.1 Revisar acessibilidade (contraste 4,5:1, foco por teclado, `prefers-reduced-motion`, textos alternativos) e verificar com checagem manual e ferramenta de auditoria
- [x] 6.2 Verificar integração em 360, 768, 1366 e 1920 px, sem rolagem horizontal, nos dois idiomas, com `npm run build` e `npm test` verdes
- [x] 6.3 Escrever o README do projeto (como rodar, estrutura de pastas, como trocar a cor base e o conteúdo) e verificar que os comandos documentados funcionam como escritos

## 7. Refinamentos: barra de navegação e faixa

- [x] 7.1 Implementar `Navbar` com estado topo/flutuante animado, links com rolagem suave, seção ativa, menu em tela estreita e o alternador de idioma dentro; verificar por teste a troca de estado ao rolar e no navegador a animação
- [x] 7.2 Fazer o `Marquee` aceitar uma lista de palavras e a faixa passar as tecnologias de `data/stack.ts`; verificar por teste que "Angular" e "Kubernetes" aparecem e "Stack" sozinho não se repete

## 8. Refinamentos: tela inicial

- [x] 8.1 Remover a legenda "mouse trava a etapa" e ajustar a simulação (sem repulsão, com `findHovered` e desaceleração do registro sob o cursor); verificar com testes unitários atualizados
- [x] 8.2 Desenhar o balão de fala ligado ao cubo, com id, etapa e pacotes trafegando; verificar por teste de desenho e no navegador ao passar o mouse num cubo

## 9. Refinamentos: Sobre mim

- [x] 9.1 Foto em cores naturais, sem duotone, com `usePointerParallax` movendo foto, sombra e cartões; verificar que a imagem não tem filtro de cinza e que o hover move os três
- [x] 9.2 Reescrever texto e cartão de foco sem gestão pública e adicionar o cartão "O que estou aprimorando" ao lado do texto; verificar por teste de conteúdo (sem "gestão pública") e no navegador a composição
- [x] 9.3 Trocar o `<details>` do intercâmbio por expansão animada acessível, com módulos que caem como conquistas e a ilustração do avião; verificar por teste de `aria-expanded` e no navegador a animação
- [x] 9.4 Adicionar as fotos dos recomendantes às recomendações; verificar que cada uma tem imagem com alt e nome

## 10. Refinamentos: trajetória, projetos, stack e contato

- [x] 10.1 Reestruturar `data/experience.ts` em quatro paradas, com "Axion" e rodapé "Consultoria Júnior", sem Hospital Veterinário; verificar por teste de ordem e conteúdo
- [x] 10.2 Implementar o mapa pontilhado animado pela rolagem entre os X das paradas (com `ResizeObserver` e progresso por scroll) e as quatro ilustrações temáticas; verificar por teste do cálculo de progresso e no navegador rolando
- [x] 10.3 Atualizar projetos: remover Hospital Veterinário, trocar "Gestão de eventos" por organização de eventos e equipes e neutralizar o foco em gestão pública; verificar por teste de dados
- [x] 10.4 Dar o realce escuro ao Angular (e não ao React), preencher a grade e aumentar as tecnologias secundárias; verificar o tamanho de fonte no navegador
- [x] 10.5 Trocar os botões "Mostrar" por botões com ícone de e-mail e WhatsApp que abrem direto, sem `mailto:` nem `wa.me` no DOM; verificar por testes e pela varredura do build

## 11. Fechamento dos refinamentos

- [x] 11.1 Passar uma rodada de hover leve (cartões, blocos de stack, etiquetas) respeitando movimento reduzido; verificar no navegador
- [x] 11.2 Rodar contraste, teclado, `npm run build` e `npm test` e atualizar o README; verificar tudo verde e a auditoria sem falhas

## 12. Refinamentos: textos, IA e pipeline

- [x] 12.1 Atualizar o objetivo do intercâmbio, o trecho final do texto do Sobre mim e trocar "O que estou aprimorando" pelo cartão "Objetivos"; verificar por teste de conteúdo (sem "Testes e qualidade de código", com os quatro objetivos, nos dois idiomas)
- [x] 12.2 Incluir IA como tecnologia de destaque da stack e na faixa; verificar por teste e que a grade de seis blocos não deixa buraco
- [x] 12.3 Trocar o rótulo "Portfólio 2026" por "Aberto a oportunidades" com indicador pulsante; verificar por teste e no navegador
- [x] 12.4 Implementar `placeBubble` (balão desvia do nome, cargo e rótulo e fica dentro da tela) e ligá-lo ao Hero por `data-avoid`; verificar por testes unitários e no navegador passando o mouse sobre o nome
- [x] 12.5 Dar apresentação própria ao balão em cada etapa (Extrair, Transformar, Carregar, API); verificar por teste de desenho por etapa e no navegador
- [x] 12.6 Implementar reprovar registro ao clicar (X, contador de reprovados, tremida e queda reta) na simulação e no desenho; verificar por testes unitários e no navegador
- [x] 12.7 Rodar contraste, build e testes e atualizar o README; verificar tudo verde

## 13. Refinamentos: responsividade, fichas de projeto e modal

- [x] 13.1 Corrigir a responsividade: cartões flutuantes do Sobre mim sem sair da tela entre 640 e 900 px, duas colunas na tablet (768 px) em Sobre mim e Projetos; verificar por varredura de 320 a 2560 px sem elemento fora da tela e por teste de regressão
- [x] 13.2 Redesenhar o cartão de projeto como ficha (faixa superior, selo, nome, tópicos, bloco tracejado e rodapé) com dados em `data/projects.ts`; verificar por teste de conteúdo (sem estrelas inventadas) e no navegador
- [x] 13.3 Travar a rolagem da página enquanto o modal do projeto estiver aberto, sem deslocar o layout; verificar por teste e no navegador


## 14. Ajustes de projetos e Stack em tabuleiro

- [x] 14.1 Acelerar a troca de escopo dos projetos (transição curta, só transform/opacity, sem espera dupla)
- [x] 14.2 Adicionar ao escopo Profissional os cartões "Integrador geral" e "Gestão de métricas" (sem nomes de clientes, URLs internas ou segredos)
- [x] 14.3 Stack como tabuleiro em caminho curvo sem chegada, em uma tela no desktop: ordem Faculdade → Estágio → PostgreSQL → MySQL → Dados → Node.js → React → Docker → Full Stack → Java → Angular → Go → Kubernetes → AWS → Oracle → MongoDB → RabbitMQ → IA → Axion → Atualmente (peão com a etiqueta, sem quadrado, ficha "EM DESENVOLVIMENTO"); sem fundo quadriculado, com imagens decorativas; ao abrir uma casa o caminho percorrido até ela é destacado; legenda uso no dia a dia / atua com projetos com / mais experiência / trajetória
- [x] 14.4 Animações leves ao rolar: cada seção aparece ao entrar na tela (subida suave, queda com leve quique em Projetos e Contato, só fade na Trajetória e Stack); a Stack monta o tabuleiro em cobrinha (trilha se desenha e as casas surgem em sequência até o peão); RabbitMQ e Oracle passam a "uso no dia a dia"; o trecho vermelho percorrido usa a mesma curva da trilha tracejada e a cobre
- [x] 14.5 Trajetória em ordem cronológica (do mais antigo ao atual) com o cargo como título e "empresa · cidade" abaixo; imagens do tabuleiro caem com a queda do intercâmbio, sem a faixa marrom e com referências a código; cartões da seção Sobre (exceto a foto) caem ao entrar; cartão de projeto inteiro clicável e botão Ver detalhes com hover; origens da stack ajustadas (curso = faculdade quando não é uma das certificações)
