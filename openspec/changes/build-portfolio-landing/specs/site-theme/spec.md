# Spec Delta

## Purpose

Define a identidade visual brutalista russa do portfólio: paleta derivada de `#ed324e` em tokens globais SCSS, tipografia pesada e geometria dura, aplicada de forma consistente a todas as seções.

## ADDED Requirements

### Requirement: Paleta em variáveis globais SCSS
O site SHALL definir todas as cores em variáveis SCSS globais únicas e MUST NOT usar valores de cor literais fora desse arquivo de tokens. A paleta SHALL ter seis papéis: Cranberry `#3F1116`, Plum `#64343C`, Taupe `#9D7960`, Beige `#FEEFDC`, Ivory `#FFF1E9` e o destaque `#ED324E`. A paleta MUST NOT conter tons rosados ou magenta claros, e o destaque `#ED324E` SHALL ser a única cor saturada.

#### Scenario: Cor vem de token
- **WHEN** um estilo de componente precisa de cor
- **THEN** ele usa uma variável da paleta global, e uma busca por `#` hex fora do arquivo de tokens não encontra cores

#### Scenario: Troca de cor base
- **WHEN** o valor da cor base é alterado no arquivo de tokens
- **THEN** a identidade do site muda inteira sem editar nenhum outro arquivo de estilo

### Requirement: Paleta entregue ao dono
A entrega SHALL incluir a lista final das seis cores (hex e papel) para aprovação do dono.

#### Scenario: Cores informadas
- **WHEN** a implementação da paleta termina
- **THEN** o relato final lista cada cor com hex e papel

### Requirement: Linguagem brutalista consistente
Todas as seções SHALL usar tipografia grotesca pesada em caixa alta nos títulos, bordas sólidas grossas, sombras duras sem desfoque, ângulos retos e diagonais, sem cantos arredondados nem gradientes suaves.

#### Scenario: Componente sem suavização
- **WHEN** qualquer cartão, botão ou faixa é renderizado
- **THEN** não há `border-radius` nem sombra com desfoque

### Requirement: Contraste legível
Texto corrido SHALL ter contraste mínimo de 4,5:1 contra o fundo, e elementos interativos SHALL ter estado de foco visível por teclado.

#### Scenario: Navegação por teclado
- **WHEN** o usuário navega com Tab
- **THEN** o elemento focado exibe contorno visível na paleta

### Requirement: Responsividade
O layout SHALL funcionar de 360 px a 1920 px de largura sem rolagem horizontal.

#### Scenario: Celular
- **WHEN** a largura da janela é 360 px
- **THEN** todas as seções cabem na largura e permanecem legíveis
