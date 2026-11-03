# Spec Delta

## Purpose

Permitir navegar entre as seções por uma barra que ocupa o topo da página e, ao rolar, vira uma versão reduzida e flutuante, com animação.

## ADDED Requirements

### Requirement: Barra de navegação com dois estados
O site SHALL exibir uma barra de navegação com links para Sobre, Trajetória, Projetos, Stack e Contato e o alternador PT/EN. No topo da página a barra SHALL ocupar a largura toda, colada ao topo, em tamanho normal. Depois que o visitante rola para baixo, a barra SHALL passar, com animação, a uma versão reduzida e flutuante, afastada do topo e com sombra dura; ao voltar ao topo, SHALL retornar ao estado inicial.

#### Scenario: No topo
- **WHEN** a página está rolada até o topo
- **THEN** a barra está colada ao topo, em largura total e tamanho normal

#### Scenario: Ao rolar
- **WHEN** o visitante rola além de cerca de 80 px
- **THEN** a barra encolhe e flutua afastada do topo, com transição animada

#### Scenario: Movimento reduzido
- **WHEN** o sistema pede movimento reduzido
- **THEN** a barra troca de estado sem animar

### Requirement: Links e seção ativa
Cada link SHALL levar à seção correspondente com rolagem suave, e o link da seção visível SHALL ficar marcado como atual para leitores de tela e visualmente.

#### Scenario: Seção ativa
- **WHEN** a seção Projetos ocupa a área principal da tela
- **THEN** o link Projetos está marcado como página atual

### Requirement: Navegação em tela estreita
Abaixo de 960 px de largura a barra SHALL mostrar um botão de menu que abre e fecha a lista de links, com o estado expandido anunciado a leitores de tela, e SHALL fechar a lista ao escolher um link ou apertar Esc.

#### Scenario: Menu no celular
- **WHEN** a largura é 360 px e o visitante toca no botão de menu
- **THEN** a lista de links aparece e o botão indica que está expandido

### Requirement: Alternador de idioma na barra
O alternador PT/EN SHALL ficar dentro da barra e permanecer visível nos dois estados.

#### Scenario: Idioma sempre acessível
- **WHEN** a barra está no estado flutuante
- **THEN** o alternador de idioma continua visível e operável
