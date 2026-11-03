# Spec Delta

## Purpose

Apresentar nome e cargo na tela inicial sobre um fundo interativo de pipeline de dados que reflete o perfil de engenharia de dados do dono.

## ADDED Requirements

### Requirement: Identificação na tela inicial
A tela inicial SHALL exibir o nome `GABRIEL ARANTES` e o cargo `ENGENHEIRO DE SOFTWARE • DESENVOLVEDOR FULLSTACK` (em EN, `SOFTWARE ENGINEER • FULLSTACK DEVELOPER`) em tipografia de destaque.

#### Scenario: Primeira dobra
- **WHEN** o visitante abre o site em 1366x768
- **THEN** nome, cargo e botão de idioma estão visíveis sem rolagem

### Requirement: Pipeline de dados animado
O fundo SHALL desenhar registros quadrados percorrendo etapas rotuladas (Extrair, Transformar, Carregar, API) e um contador de registros processados.

#### Scenario: Animação contínua
- **WHEN** a tela inicial está visível
- **THEN** novos registros entram, avançam pelas etapas e saem, e o contador aumenta

### Requirement: Interação com o cursor
O cursor SHALL influenciar o pipeline: ao passar sobre uma etapa, os registros dessa etapa MUST desacelerar, e um clique SHALL injetar um registro na posição. A tela inicial MUST NOT exibir texto explicando essas interações.

#### Scenario: Mouse sobre etapa
- **WHEN** o cursor fica sobre uma etapa
- **THEN** a etapa é destacada e os registros dela desaceleram

#### Scenario: Sem texto de instrução
- **WHEN** a tela inicial é exibida
- **THEN** não há legenda do tipo "mouse trava a etapa" nem "clique injeta um registro"

#### Scenario: Dispositivo sem mouse
- **WHEN** o dispositivo é de toque
- **THEN** o pipeline anima sozinho e o toque injeta um registro

### Requirement: Balão de fala no registro
Ao passar o cursor sobre um registro, o pipeline SHALL abrir um balão de fala ligado ao cubo por uma ponta, com o identificador do registro, a etapa em que está e uma animação de pacotes de dados trafegando. O registro sob o cursor SHALL quase parar enquanto o balão está aberto, e o balão SHALL fechar quando o cursor sai.

#### Scenario: Passar sobre um cubo
- **WHEN** o cursor fica sobre um registro
- **THEN** abre um balão ligado a ele, com id, etapa e pacotes animados

#### Scenario: Sair do cubo
- **WHEN** o cursor se afasta do registro
- **THEN** o balão fecha e o registro volta à velocidade normal

#### Scenario: Movimento reduzido
- **WHEN** o sistema pede movimento reduzido
- **THEN** o balão aparece sem pacotes em movimento

### Requirement: Balão que desvia do nome
O balão SHALL ser posicionado de modo a não cobrir o nome, o cargo nem o rótulo de status da tela inicial: se a posição preferida sobrepõe esses elementos, SHALL escolher outro lado do cubo, afastando-se mais quando o próprio cubo estiver sobre o texto. O balão MUST permanecer inteiro dentro da área do pipeline e MUST NOT cobrir o cubo a que está ligado.

#### Scenario: Cubo perto do nome
- **WHEN** o cursor fica sobre um cubo cujo balão, na posição padrão, cobriria o nome
- **THEN** o balão aparece em outro lado, sem sobrepor o nome nem o cargo

#### Scenario: Cubo sobre o nome
- **WHEN** o cursor fica sobre um cubo que está atrás das letras do nome
- **THEN** o balão abre numa área livre, ligado ao cubo por uma ponta mais longa

### Requirement: Balão diferente por etapa
O balão SHALL ter apresentação própria conforme a etapa do registro: em Extrair, a fonte e a contagem de linhas com quadrados vazados saindo de uma origem; em Transformar, uma barra de progresso de normalização e quadrados que atravessam um filtro e saem preenchidos; em Carregar, a instrução de inserção no banco e quadrados caindo numa pilha de banco de dados; em API, a requisição, o status e a latência, com quadrados indo a um cliente. Os valores exibidos MUST ser fictícios e derivados do id do registro.

#### Scenario: Etapas distintas
- **WHEN** o cursor passa por registros de etapas diferentes
- **THEN** cada balão mostra título, texto e animação específicos daquela etapa

### Requirement: Reprovar um registro com o clique
Clicar em um registro SHALL reprová-lo: o quadrado exibe um X, o contador "Reprovados" aumenta, o registro treme por um instante e então cai em linha reta até sair da área, sem contar como processado. Clicar numa área vazia SHALL continuar injetando um registro novo. Um registro já reprovado MUST NOT poder ser reprovado de novo nem abrir balão.

#### Scenario: Clique num cubo
- **WHEN** o visitante clica num registro
- **THEN** o quadrado mostra um X, o contador de reprovados sobe em um, o cubo treme por cerca de 0,35 s e cai reto

#### Scenario: Clique no vazio
- **WHEN** o visitante clica numa área sem registro
- **THEN** um registro novo é injetado e nenhum reprovado é contado

#### Scenario: Contadores separados
- **WHEN** um registro é reprovado
- **THEN** o contador de processados não muda e o de reprovados sobe

### Requirement: Rótulo de status
O rótulo acima do nome SHALL indicar a disponibilidade para oportunidades ("Aberto a oportunidades") com um indicador quadrado pulsante, e MUST NOT exibir "Portfólio 2026".

#### Scenario: Rótulo
- **WHEN** a tela inicial é exibida
- **THEN** o rótulo mostra "Aberto a oportunidades" (EN: "Open to opportunities") e o indicador pulsa, parado com movimento reduzido

### Requirement: Movimento reduzido e desempenho
Com a preferência de movimento reduzido ativa, o fundo SHALL ficar estático. A animação MUST pausar quando a tela inicial sai da viewport ou a aba fica oculta.

#### Scenario: Preferência de movimento reduzido
- **WHEN** o sistema do visitante pede movimento reduzido
- **THEN** o pipeline é desenhado parado, sem animação

#### Scenario: Seção fora da tela
- **WHEN** o visitante rola para além da tela inicial
- **THEN** o laço de animação é pausado
