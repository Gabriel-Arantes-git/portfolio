# Spec Delta

## Purpose

Mostrar as tecnologias de Gabriel com hierarquia clara e oferecer canais diretos de contato sem expor e-mail e telefone a robôs de raspagem.

## ADDED Requirements

### Requirement: Stack priorizada
A seção SHALL exibir a stack em dois níveis: destaque (Java com Spring, PostgreSQL, Node.js, Angular, React e IA) e secundária (Go, AWS, RabbitMQ, Kafka, Docker, Kubernetes, MySQL, Oracle, MongoDB). O Angular, e não o React, SHALL ter o realce escuro de destaque, junto do Java. As tecnologias secundárias SHALL ter tamanho confortável de leitura (não apenas etiquetas minúsculas), claramente menores que as de destaque.

#### Scenario: Hierarquia
- **WHEN** a seção é exibida
- **THEN** as cinco tecnologias de destaque aparecem maiores que as secundárias, e Java e Angular têm o realce escuro

#### Scenario: Secundárias legíveis
- **WHEN** a seção é exibida
- **THEN** as secundárias têm fonte de pelo menos 15 px e são menores que as de destaque

### Requirement: Contato sem raspagem
O e-mail e o telefone MUST NOT aparecer como texto, atributo `href`, metadado ou dado estruturado no HTML entregue nem no JavaScript em forma legível. O contato SHALL ser oferecido por botões com ícone (e-mail e WhatsApp) que, ao serem acionados, montam o destino no navegador e abrem o aplicativo de e-mail ou a conversa do WhatsApp diretamente, sem etapa intermediária de "mostrar".

#### Scenario: HTML entregue
- **WHEN** o HTML e os arquivos estáticos publicados são pesquisados por `arantes.gabriel21`, por qualquer padrão de endereço de e-mail ou pelos dígitos do telefone
- **THEN** nenhuma ocorrência legível do e-mail ou do telefone é encontrada

#### Scenario: Botões com ícone
- **WHEN** a seção Contato é exibida
- **THEN** há um botão com ícone de envelope e um com ícone do WhatsApp, cada um com nome acessível, e o DOM não contém `mailto:` nem `wa.me`

#### Scenario: Abrir e-mail
- **WHEN** o visitante aciona o botão de e-mail
- **THEN** o navegador abre uma mensagem nova para `arantes.gabriel21@gmail.com`

#### Scenario: Abrir WhatsApp
- **WHEN** o visitante aciona o botão de WhatsApp
- **THEN** abre, em nova aba, uma conversa com o número +55 44 99122-7490

### Requirement: Canais públicos
A seção SHALL exibir links para o LinkedIn (`in/gabriel-arantes21`) e o GitHub (`Gabriel-Arantes-git`), que abrem em nova aba sem expor a página de origem.

#### Scenario: Links externos
- **WHEN** o visitante clica no LinkedIn ou no GitHub
- **THEN** o destino abre em nova aba com `noopener noreferrer`
