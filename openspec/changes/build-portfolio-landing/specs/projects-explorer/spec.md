# Spec Delta

## Purpose

Apresentar os projetos separados por escopo, com navegação interativa e animada entre os grupos.

## ADDED Requirements

### Requirement: Escopos de projeto
A seção SHALL oferecer três escopos selecionáveis: Próprios, Consultoria Jr. e Profissional. Apenas os projetos do escopo ativo SHALL ser exibidos.

#### Scenario: Troca de escopo
- **WHEN** o visitante clica no escopo Consultoria Jr.
- **THEN** os cartões do escopo anterior saem com animação e os de Consultoria Jr. entram

#### Scenario: Escopo inicial
- **WHEN** a seção é exibida pela primeira vez
- **THEN** o escopo Próprios está ativo

### Requirement: Conteúdo dos escopos
O escopo Próprios SHALL conter Raposa, pgfathom e o vault do ecossistema de IA. O escopo Consultoria Jr. SHALL conter I COUNI (site do 1º Congresso de Odontologia da UniCesumar), WorkInTech (plataforma do evento de tecnologia da UniCesumar), e a organização de eventos e de equipes. O Hospital Veterinário MUST NOT aparecer. O cartão de organização de eventos MUST NOT ser apresentado como desenvolvimento fullstack. O escopo Profissional SHALL conter os sistemas da Tributech, sem nomear municípios clientes, sem expor dados tributários e sem tratar a gestão pública como foco.

#### Scenario: Cartão de projeto
- **WHEN** um cartão é exibido
- **THEN** mostra nome, descrição curta, tecnologias e, quando existir, link externo

### Requirement: Links externos válidos
Cada cartão SHALL linkar apenas destinos públicos e acessíveis. I COUNI SHALL linkar `https://www.counicesumar.com.br/` e WorkInTech `https://www.workintech.com.br/`. O cartão do vault MUST NOT linkar o repositório privado `Dynamic-IA-Ecosystem`; ele SHALL ficar sem link até existir o repositório genérico público.

#### Scenario: Repositório privado
- **WHEN** o cartão do vault é exibido sem link configurado
- **THEN** não há botão de link e o texto indica "repositório genérico em breve"

### Requirement: Crédito de co-autoria
Raposa e pgfathom SHALL indicar a co-autoria com `lvcas-dotcom` e linkar o repositório dele.

#### Scenario: Crédito visível
- **WHEN** o cartão do Raposa ou do pgfathom é exibido
- **THEN** o crédito de co-autoria aparece no cartão

### Requirement: Detalhe do projeto
Ao ativar um cartão, o site SHALL abrir um detalhe com descrição ampliada, destaques e links.

#### Scenario: Abrir detalhe do I COUNI
- **WHEN** o visitante ativa o cartão do I COUNI
- **THEN** vê o que foi entregue (site com programação, palestrantes e inscrições, plataforma com login, gestão de usuários, submissão de trabalhos, certificados automáticos, suporte por WhatsApp), a stack (Next.js, PostgreSQL), "do zero ao ar em 5 semanas" e o depoimento do coordenador

#### Scenario: Abrir detalhe do WorkInTech
- **WHEN** o visitante ativa o cartão do WorkInTech
- **THEN** vê o propósito de conectar alunos a profissionais, a participação em refatoração de front e back, e os recursos de certificados, gestão de usuários e banca avaliativa

### Requirement: Cartão em formato de ficha
Cada cartão de projeto SHALL ter o formato de uma ficha com moldura grossa e sombra dura: uma faixa superior com a categoria do projeto e, à direita, uma informação curta (ou o crédito de co-autoria) e um selo com a tecnologia principal; o nome em destaque; a descrição curta; até três tópicos; um bloco tracejado com um trecho ilustrativo (diff, terminal ou lista de entregas); e um rodapé com as tecnologias e a ação "Ver detalhes". O cartão MUST NOT exibir números inventados, como estrelas ou datas de push.

#### Scenario: Ficha completa
- **WHEN** o cartão do Raposa é exibido
- **THEN** mostra a categoria "Revisão de código", o selo "GO", o nome, três tópicos, o trecho de diff com a linha `InsecureSkipVerify: true` destacada e o rodapé com tecnologias e "Ver detalhes"

#### Scenario: Sem dados inventados
- **WHEN** qualquer cartão é exibido
- **THEN** não há "★" nem contagem de estrelas

### Requirement: Rolagem do fundo travada com o modal aberto
Enquanto o detalhe do projeto estiver aberto, a página atrás dele MUST NOT rolar (roda do mouse, toque ou teclado), sem deslocar o layout, e SHALL voltar a rolar ao fechar o detalhe, na mesma posição.

#### Scenario: Abrir o detalhe
- **WHEN** o visitante abre o detalhe de um projeto e tenta rolar a página
- **THEN** a página atrás não se move; só o conteúdo do modal rola, se for maior que a tela

#### Scenario: Fechar o detalhe
- **WHEN** o detalhe é fechado por botão, Esc ou clique no fundo
- **THEN** a rolagem da página volta ao normal, na posição em que estava

### Requirement: Acessibilidade e movimento
Os escopos SHALL ser operáveis por teclado com estado ativo indicado, e as animações SHALL ser desativadas com movimento reduzido.

#### Scenario: Teclado
- **WHEN** o visitante usa as setas e Enter nos escopos
- **THEN** o escopo muda e o estado ativo é anunciado a leitores de tela
