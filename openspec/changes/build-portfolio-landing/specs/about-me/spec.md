# Spec Delta

## Purpose

Apresentar quem é Gabriel em formato visual e enxuto: foto recortada com cartões flutuantes, foco atual, intercâmbio na FAU e recomendações recebidas.

## ADDED Requirements

### Requirement: Foto com tratamento gráfico e cartões flutuantes
A seção SHALL exibir a foto do dono em cores naturais (MUST NOT ser preto e branco nem duotone), em moldura recortada de forma brutalista (sem exigir PNG transparente), com sombra dura deslocada e cartões sobrepostos à foto. Os cartões SHALL ser, no mínimo, Intercâmbio FAU, Foco atual e Stack principal. O título SHALL ter uma palavra-chave em destaque.

#### Scenario: Composição
- **WHEN** a seção Sobre mim é exibida em desktop
- **THEN** os cartões aparecem sobrepostos às bordas da foto sem cobrir o rosto

#### Scenario: Celular
- **WHEN** a largura é 360 px
- **THEN** os cartões se reorganizam abaixo ou ao lado da foto sem sobrepor texto

### Requirement: Texto lateral reduzido
A seção SHALL ter um texto curto ao lado da foto com os dados essenciais e o foco do dono (engenharia de software e dados, Java/Spring e Angular/React, evolução técnica, formação e consultoria júnior). O texto MUST NOT ter a gestão pública como foco e SHALL terminar com a frase sobre concluir a graduação em Engenharia de Software e buscar oportunidades de aprimorar hard e soft skills, sem repetir o intercâmbio.

#### Scenario: Leitura rápida
- **WHEN** o visitante lê a seção
- **THEN** o texto lateral cabe em até cerca de 65 palavras por idioma

### Requirement: Foco em evolução técnica
O cartão "Foco atual" e o texto lateral SHALL apresentar como foco melhorar tecnicamente (arquitetura, desempenho, qualidade e uso crítico de IA) e MUST NOT apresentar a gestão pública como foco.

#### Scenario: Cartão de foco
- **WHEN** o cartão Foco atual é exibido
- **THEN** o texto fala de evolução técnica, e não de gestão pública

### Requirement: Cartão extra ao lado do texto
Ao lado do texto curto, a seção SHALL exibir um cartão adicional ("Objetivos") com pontos de senioridade: identificação de requisitos e valor de negócio; arquitetura de soluções de alta performance, escalabilidade e confiabilidade; equipe pautada em assertividade e eficiência; e arquitetura de IA aplicada ao fluxo de trabalho. O cartão MUST NOT listar aprendizados básicos (como "testes e qualidade de código").

#### Scenario: Composição equilibrada
- **WHEN** a seção é exibida em desktop
- **THEN** o texto e o cartão extra ocupam a coluna ao lado da foto

### Requirement: Interação ao passar o mouse
Ao passar o cursor sobre a foto, a foto, a sombra deslocada e os cartões flutuantes SHALL se mover de forma suave e em sentidos diferentes (paralaxe), voltando à posição ao sair. Com movimento reduzido, MUST NOT haver movimento.

#### Scenario: Hover na foto
- **WHEN** o cursor se move sobre a foto
- **THEN** foto, sombra e cartões se deslocam suavemente

### Requirement: Intercâmbio com expansão animada
O bloco do intercâmbio SHALL abrir e fechar com transição suave de altura (sem salto seco) e exibir uma ilustração de avião cruzando de Maringá à Flórida. Ao abrir, os cartões dos módulos SHALL "cair" na tela em sequência, com leve quique, como conquistas desbloqueadas de um jogo. O botão SHALL indicar o estado expandido a leitores de tela.

#### Scenario: Abrir
- **WHEN** o visitante abre o bloco
- **THEN** a altura cresce com transição e os três módulos caem um após o outro com quique

#### Scenario: Fechar
- **WHEN** o visitante fecha o bloco
- **THEN** a altura diminui com transição e o conteúdo some dos leitores de tela

#### Scenario: Movimento reduzido
- **WHEN** o sistema pede movimento reduzido
- **THEN** o bloco abre e fecha sem animação e os módulos aparecem direto

### Requirement: Fotos dos recomendantes
Cada recomendação SHALL exibir a foto de quem recomendou (Alexandre José Messiano e Alexandre Moreno) ao lado do nome, com texto alternativo.

#### Scenario: Foto na recomendação
- **WHEN** as recomendações são exibidas
- **THEN** cada uma mostra o retrato do autor junto ao nome e ao cargo

### Requirement: Formação e certificações
A seção SHALL listar a formação (Bacharelado em Engenharia de Software na Unicesumar, jan/2024 a dez/2027), as certificações (Java + Programação Orientada a Objetos; Banco de Dados e SQL com PostgreSQL; Pentaho Data Integration: Básico ao Avançado), o nível de inglês (intermediário) e o curso Ensino de Inglês como Segundo Idioma na Mister Wiz (mai/2025 a jun/2026).

#### Scenario: Formação visível
- **WHEN** a seção é exibida
- **THEN** curso, instituição, período, certificações e nível de inglês aparecem de forma compacta

### Requirement: Bloco do intercâmbio FAU
A seção SHALL descrever o intercâmbio na Florida Atlantic University (FAU, EUA, previsto para jul/2027): programa *Innovation Management in the Digital Economy*, extensão profissional de curta duração de 1 mês, objetivo e os três módulos (Managing Innovation Ecosystems, Rethinking organizational models, Agile techniques).

#### Scenario: Detalhe dos módulos
- **WHEN** o visitante abre o bloco do intercâmbio
- **THEN** vê tema, duração de 1 mês, objetivo e os três módulos com sua descrição curta

### Requirement: Recomendações do LinkedIn
A seção SHALL exibir as duas recomendações recebidas (Alexandre José Messiano e Alexandre Moreno) com autor, cargo e data, no texto original.

#### Scenario: Texto fiel
- **WHEN** as recomendações são exibidas em PT-BR
- **THEN** o texto é idêntico ao original do LinkedIn

#### Scenario: Versão em inglês
- **WHEN** o idioma é EN
- **THEN** o texto é traduzido, mantendo o tom e o sentido de cada recomendação
