## ADDED Requirements

### Requirement: CLI entry point com Commander.js

O sistema SHALL expor um binário `feia` executável via `npx @org/feia` que utiliza Commander.js para parsing de comandos e subcomandos.

#### Scenario: Execução via npx
- **WHEN** usuário executa `npx @org/feia --version`
- **THEN** sistema exibe a versão do pacote instalado

#### Scenario: Comando inválido
- **WHEN** usuário executa `npx @org/feia comando-inexistente`
- **THEN** sistema exibe mensagem de erro e lista de comandos disponíveis

### Requirement: Estrutura de comandos hierárquica

O sistema SHALL suportar comandos de primeiro nível (`init`, `doctor`, `status`, `update`, `generate-hooks`) e subcomandos (`conventions edit`, `conventions apply`, `conventions show`, `add-domain`, `remove-domain`).

#### Scenario: Comando com subcomando
- **WHEN** usuário executa `npx @org/feia conventions edit`
- **THEN** sistema executa o subcomando `edit` do comando `conventions`

#### Scenario: Comando com argumentos
- **WHEN** usuário executa `npx @org/feia add-domain inventory --spec specs/inventory.yaml --base-url /api/inventory`
- **THEN** sistema recebe `name=inventory`, `spec=specs/inventory.yaml`, `baseUrl=/api/inventory`

### Requirement: Arquivo de tipos compartilhados

O sistema SHALL definir interfaces TypeScript para configuração do projeto (`ProjectConfig`), domínios (`Domain`), e convenções detectadas (`DetectedConventions`) em `src/types/`.

#### Scenario: Interface ProjectConfig
- **WHEN** código importa `ProjectConfig` de `src/types/config.ts`
- **THEN** interface contém campos: `name`, `framework`, `domains[]`, `figma`, `paths`

#### Scenario: Interface DetectedConventions
- **WHEN** código importa `DetectedConventions` de `src/types/conventions.ts`
- **THEN** interface contém todos os campos de detecção com campo `confidence` por detecção

### Requirement: Output colorido com Chalk

O sistema SHALL usar Chalk para output colorido no terminal, seguindo convenções: verde para sucesso, amarelo para warnings, vermelho para erros, azul para informações.

#### Scenario: Mensagem de sucesso
- **WHEN** operação completa com sucesso
- **THEN** mensagem é exibida em verde com prefixo ✅

#### Scenario: Mensagem de erro
- **WHEN** operação falha
- **THEN** mensagem é exibida em vermelho com prefixo ❌

### Requirement: Detecção de diretório de trabalho

O sistema SHALL verificar se está sendo executado dentro de um repositório válido (contém `package.json`) antes de executar comandos que modificam o projeto.

#### Scenario: Diretório válido
- **WHEN** usuário executa `npx @org/feia init` em diretório com `package.json`
- **THEN** comando executa normalmente

#### Scenario: Diretório inválido
- **WHEN** usuário executa `npx @org/feia init` em diretório sem `package.json`
- **THEN** sistema exibe erro "Este diretório não parece ser um projeto Node.js (package.json não encontrado)"
