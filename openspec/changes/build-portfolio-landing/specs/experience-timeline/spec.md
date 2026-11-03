# Spec Delta

## Purpose

Mostrar a trajetória profissional de Gabriel como um mapa animado: ao rolar, quadradinhos ondulantes percorrem um caminho pontilhado de uma experiência à próxima, e cada experiência tem seu próprio caráter visual.

## ADDED Requirements

### Requirement: Quatro paradas em ordem
A seção SHALL listar quatro experiências numeradas, nesta ordem: Full Stack Engineer na Tributech (nov/2025 até hoje), Engenheiro de Dados e Desenvolvimento na Tributech (mai/2025 a nov/2025), Estágio em Suporte de Dados/TI na Tributech (fev/2025 a mai/2025) e Software Engineer Full Stack na Axion (fev/2026 até hoje). Cada uma SHALL ter empresa, cargo, período e resumo das atividades. O curso de inglês da Mister Wiz é formação, não experiência: fica na seção Sobre mim.

#### Scenario: Ordem e numeração
- **WHEN** a seção é exibida
- **THEN** as quatro paradas aparecem numeradas de 01 a 04 na ordem acima

### Requirement: Caminho pontilhado animado pela rolagem
Um caminho de pontos quadrados, ondulado, SHALL ligar cada parada ao "X" da seguinte. Conforme o visitante rola para baixo, quadrados SHALL percorrer o caminho com movimento ondulado até o X da próxima parada; ao rolar para cima, SHALL recuar. O caminho já percorrido SHALL ficar destacado.

#### Scenario: Rolando para baixo
- **WHEN** o visitante rola da primeira para a segunda parada
- **THEN** quadrados ondulantes avançam pelo caminho até o X da segunda parada

#### Scenario: Rolando para cima
- **WHEN** o visitante rola de volta
- **THEN** os quadrados recuam pelo mesmo caminho

#### Scenario: Movimento reduzido
- **WHEN** o sistema pede movimento reduzido
- **THEN** o caminho aparece completo e estático

### Requirement: Identidade visual por experiência
Cada parada SHALL ter uma ilustração própria. As três da Tributech SHALL remeter a gestão municipal, mapa e dados (cidade em mapa com marcadores; fluxo de dados e banco; relatórios e tabelas). A da Axion SHALL remeter a gestão, eventos e equipes (calendário, ingresso e pessoas).

#### Scenario: Ilustrações distintas
- **WHEN** a seção é exibida
- **THEN** as quatro paradas têm ilustrações diferentes entre si, as da Tributech com tema de mapa e dados e a da Axion com tema de eventos e equipes

### Requirement: Nome da Axion
A parada da Axion SHALL exibir "Axion" como nome e, abaixo, "Consultoria Júnior" como rodapé do cartão, sem o texto longo "Consultoria Júnior de Tecnologia (Unicesumar)" no título.

#### Scenario: Nome e rodapé
- **WHEN** a parada da Axion é exibida
- **THEN** o título é "Axion" e o rodapé diz "Consultoria Júnior"

### Requirement: Competências por cargo
Cada experiência SHALL exibir suas tecnologias principais como etiquetas. Tributech Full Stack SHALL mostrar Java, Spring Boot, Angular TS, REST e Git/GitLab. Engenheiro de Dados e Desenvolvimento SHALL mostrar Java, Spring, React, SQL e REST. O estágio SHALL mostrar SQL, Pentaho e testes de API.

#### Scenario: Etiquetas
- **WHEN** a experiência Tributech como Full Stack Engineer é exibida
- **THEN** mostra as etiquetas de Java, Spring Boot, Angular TS, REST e Git/GitLab

### Requirement: Acessibilidade e dados sensíveis
O caminho animado SHALL ser decorativo e escondido de leitores de tela, que leem apenas a lista numerada. O texto MUST NOT citar nomes de municípios clientes nem dados tributários.

#### Scenario: Leitor de tela
- **WHEN** um leitor de tela percorre a seção
- **THEN** lê a lista numerada de experiências sem o caminho decorativo
