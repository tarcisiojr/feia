## ADDED Requirements

### Requirement: Comando add-domain

O sistema SHALL adicionar um novo domínio de API ao projeto existente via comando `add-domain <name> --spec <path> --base-url <url>`.

#### Scenario: Adicionar domínio com sucesso
- **WHEN** usuário executa `npx @org/feia add-domain inventory --spec specs/inventory.yaml --base-url /api/inventory`
- **THEN** sistema adiciona domínio em `orval.config.ts`, `frontendspec/project.yaml`, `src/api/custom-instance.ts`

#### Scenario: Domínio já existe
- **WHEN** usuário tenta adicionar domínio que já existe em `orval.config.ts`
- **THEN** sistema exibe erro "Domínio 'inventory' já existe. Use remove-domain primeiro."

#### Scenario: Flags obrigatórias ausentes
- **WHEN** usuário executa `npx @org/feia add-domain inventory` sem --spec ou --base-url
- **THEN** sistema exibe erro indicando flags obrigatórias

### Requirement: Atualização de orval.config.ts

O sistema SHALL adicionar bloco de configuração para novo domínio em `orval.config.ts`.

#### Scenario: Bloco adicionado corretamente
- **WHEN** domínio "inventory" adicionado
- **THEN** `orval.config.ts` contém novo bloco com `input: 'specs/inventory.yaml'`, `output.target: 'src/api/generated/inventory'`, `output.baseUrl: '/api/inventory'`

### Requirement: Atualização de project.yaml

O sistema SHALL adicionar entrada de domínio em `frontendspec/project.yaml`.

#### Scenario: Entrada adicionada
- **WHEN** domínio "inventory" adicionado
- **THEN** `project.yaml` contém nova entrada em `domains` com `name`, `specPath`, `baseUrl`, `generatedDir`

### Requirement: Atualização de custom-instance.ts

O sistema SHALL adicionar função de instância Axios para novo domínio em `src/api/custom-instance.ts`.

#### Scenario: Instância adicionada
- **WHEN** domínio "inventory" adicionado
- **THEN** `custom-instance.ts` contém nova função `inventoryInstance` com `baseURL: '/api/inventory'` e é exportada

### Requirement: Execução do Orval após add-domain

O sistema SHALL executar `npx orval` para gerar hooks do novo domínio.

#### Scenario: Hooks gerados
- **WHEN** domínio adicionado com sucesso
- **THEN** sistema executa `npx orval` e pasta `src/api/generated/inventory/` é criada

### Requirement: Comando remove-domain

O sistema SHALL remover um domínio de API existente via comando `remove-domain <name>`.

#### Scenario: Remover domínio com confirmação
- **WHEN** usuário executa `npx @org/feia remove-domain inventory`
- **THEN** sistema pergunta "Isso removerá a pasta src/api/generated/inventory/. Continuar? (s/N)"

#### Scenario: Remoção confirmada
- **WHEN** usuário confirma remoção
- **THEN** sistema remove entradas de `orval.config.ts`, `project.yaml`, `custom-instance.ts` e deleta pasta de hooks

#### Scenario: Remoção cancelada
- **WHEN** usuário responde "N" ou pressiona Enter
- **THEN** sistema exibe "Operação cancelada" e não modifica arquivos

#### Scenario: Domínio não existe
- **WHEN** usuário tenta remover domínio que não existe
- **THEN** sistema exibe erro "Domínio 'inventory' não encontrado"

### Requirement: Comando generate-hooks

O sistema SHALL regenerar hooks de todos os domínios via comando `generate-hooks`.

#### Scenario: Regeneração completa
- **WHEN** usuário executa `npx @org/feia generate-hooks`
- **THEN** sistema executa `npx orval` e exibe lista de domínios atualizados

#### Scenario: Nenhum domínio configurado
- **WHEN** `orval.config.ts` não existe ou está vazio
- **THEN** sistema exibe erro "Nenhum domínio configurado. Use 'init' ou 'add-domain' primeiro."
