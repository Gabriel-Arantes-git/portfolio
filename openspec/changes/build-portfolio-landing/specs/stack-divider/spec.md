# Spec Delta

## Purpose

Separar a tela inicial do Sobre mim com uma faixa diagonal que passa as tecnologias da stack e marca a mudança de fundo, visível desde a primeira dobra.

## ADDED Requirements

### Requirement: Faixa diagonal visível na abertura
Uma faixa levemente inclinada SHALL ocupar toda a largura e estar integralmente visível na primeira dobra, ao pé da tela inicial, em viewports de 360 a 1920 px de largura.

#### Scenario: Faixa na abertura
- **WHEN** o visitante abre o site sem rolar
- **THEN** a faixa aparece completa, de borda a borda, sem ser cortada pela dobra

### Requirement: Tecnologias passando na faixa
A faixa SHALL exibir, em loop contínuo, os nomes das tecnologias da stack (Java, Spring Boot, Angular, React, Node.js, PostgreSQL, IA, Go, AWS, RabbitMQ, Docker, Kubernetes, MySQL, Oracle e MongoDB) e MUST NOT repetir apenas a palavra "Stack".

#### Scenario: Conteúdo da faixa
- **WHEN** a faixa está visível
- **THEN** os nomes das tecnologias passam em sequência, separados por um marcador quadrado

#### Scenario: Loop contínuo
- **WHEN** o texto chega ao fim do ciclo
- **THEN** reinicia sem salto perceptível

### Requirement: Separação de fundos
A faixa SHALL marcar a fronteira entre o fundo interativo (pipeline) acima e o fundo estático abaixo.

#### Scenario: Rolagem além da faixa
- **WHEN** o visitante rola abaixo da faixa
- **THEN** o fundo é estático e com visual distinto do pipeline

### Requirement: Movimento reduzido
Com a preferência de movimento reduzido ativa, o texto da faixa SHALL ficar estático.

#### Scenario: Preferência de movimento reduzido
- **WHEN** o sistema pede movimento reduzido
- **THEN** a faixa não anima
