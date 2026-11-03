# Spec Delta

## Purpose

Permitir que o visitante alterne todo o conteúdo do portfólio entre português (PT-BR) e inglês (EN) com um único botão.

## ADDED Requirements

### Requirement: Alternância PT-BR/EN
O site SHALL exibir um botão visível em todas as seções que alterna o idioma de todo texto da interface e do conteúdo entre PT-BR e EN, sem recarregar a página.

#### Scenario: Troca para inglês
- **WHEN** o visitante clica no botão estando em PT-BR
- **THEN** todos os textos visíveis passam para inglês e o botão indica o idioma ativo

#### Scenario: Texto sem tradução
- **WHEN** uma chave de texto não tem tradução em EN
- **THEN** o site exibe o texto em PT-BR em vez de vazio ou da chave crua

### Requirement: Idioma inicial e persistência
O idioma inicial SHALL ser PT-BR. A escolha do visitante SHALL ser lembrada entre visitas, e a ausência de armazenamento local MUST NOT quebrar o site.

#### Scenario: Retorno do visitante
- **WHEN** o visitante escolheu EN e reabre o site
- **THEN** o site abre em EN

#### Scenario: Armazenamento bloqueado
- **WHEN** o navegador bloqueia o armazenamento local
- **THEN** o site abre em PT-BR e a alternância continua funcionando na sessão

### Requirement: Atributo de idioma do documento
O documento SHALL refletir o idioma ativo em seu atributo de idioma.

#### Scenario: Idioma refletido
- **WHEN** o idioma muda para EN
- **THEN** o atributo de idioma do documento passa a `en`
