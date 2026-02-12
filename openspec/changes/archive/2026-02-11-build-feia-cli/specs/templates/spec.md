## ADDED Requirements

### Requirement: Templates Handlebars para arquivos dinâmicos

O sistema SHALL usar templates Handlebars (`.hbs`) para gerar arquivos que variam por projeto.

#### Scenario: Lista de templates dinâmicos
- **WHEN** pacote é construído
- **THEN** contém templates: `orval.config.ts.hbs`, `conventions.yaml.hbs`, `project.yaml.hbs`, `custom-instance.ts.hbs`, `copilot-instructions.md.hbs`, `feia.agent.md.hbs`, `react-page-generation/SKILL.md.hbs`, `new-features.instructions.md.hbs`, `settings.json.hbs`

### Requirement: Template orval.config.ts

O sistema SHALL gerar `orval.config.ts` com um bloco de configuração por domínio.

#### Scenario: Múltiplos domínios
- **WHEN** projeto tem domínios "orders" e "inventory"
- **THEN** arquivo gerado contém exportação default com objeto contendo keys `orders` e `inventory`, cada uma com `input`, `output.target`, `output.client`, `output.baseUrl`, `output.override.mutator`

#### Scenario: Mutator customizado
- **WHEN** domínio "orders" configurado
- **THEN** bloco contém `mutator: { path: './src/api/custom-instance.ts', name: 'ordersInstance' }`

### Requirement: Template conventions.yaml

O sistema SHALL gerar `frontendspec/conventions.yaml` com todas as convenções detectadas e espaço para customização.

#### Scenario: Seções obrigatórias
- **WHEN** template renderizado
- **THEN** arquivo contém seções: stack, naming, paths, imports, components, errorHandling, loading, testing, custom

#### Scenario: Comentários de ajuda
- **WHEN** template renderizado
- **THEN** cada seção contém comentário explicativo do propósito

#### Scenario: Seção custom vazia
- **WHEN** template renderizado
- **THEN** seção `custom` é array vazio com comentários de exemplo

### Requirement: Template project.yaml

O sistema SHALL gerar `frontendspec/project.yaml` com metadados do projeto.

#### Scenario: Campos obrigatórios
- **WHEN** template renderizado com nome "meu-app", framework "react"
- **THEN** arquivo contém `name: meu-app`, `framework: react`, `domains: [...]`, `figma: { enabled: true/false }`, `paths: { ... }`

### Requirement: Template custom-instance.ts

O sistema SHALL gerar `src/api/custom-instance.ts` com uma função de instância Axios por domínio.

#### Scenario: Função por domínio
- **WHEN** projeto tem domínio "orders"
- **THEN** arquivo contém função `export const ordersInstance = (config: AxiosRequestConfig)` com `baseURL: '/api/orders'`

#### Scenario: Múltiplas instâncias
- **WHEN** projeto tem domínios "orders" e "inventory"
- **THEN** arquivo exporta `ordersInstance` e `inventoryInstance`

### Requirement: Template copilot-instructions.md

O sistema SHALL gerar `.github/copilot-instructions.md` com aproximadamente 30 linhas de instruções baseadas em convenções.

#### Scenario: Conteúdo conciso
- **WHEN** template renderizado
- **THEN** arquivo contém seções: Stack, Naming, Imports, Error Handling, Loading States

### Requirement: Template feia.agent.md

O sistema SHALL gerar `.github/agents/feia.agent.md` com configuração do Custom Agent.

#### Scenario: Frontmatter YAML
- **WHEN** template renderizado
- **THEN** arquivo contém frontmatter com `name: FEIA`, `description`, `tools: [figma, terminal, file_editor]`, `skills: [...]`

#### Scenario: Workflow de 5 etapas
- **WHEN** template renderizado
- **THEN** corpo contém descrição do workflow: Figma → Frontend Spec → Orval → React → Validation

#### Scenario: Referência a domínios
- **WHEN** projeto tem domínios "orders" e "inventory"
- **THEN** arquivo menciona domínios disponíveis para hooks

### Requirement: Template react-page-generation SKILL.md

O sistema SHALL gerar `.github/skills/react-page-generation/SKILL.md` com instruções customizadas por paths do projeto.

#### Scenario: Paths do projeto
- **WHEN** projeto tem `paths.components: 'src/components'`, `paths.pages: 'src/pages'`
- **THEN** SKILL.md referencia esses paths nas instruções

### Requirement: Arquivos estáticos de skills

O sistema SHALL copiar arquivos de skills que não requerem customização.

#### Scenario: Skills estáticas
- **WHEN** init executa
- **THEN** arquivos copiados: `figma-extraction/SKILL.md`, `orval-hooks/SKILL.md`, `frontend-spec/SKILL.md`, `frontend-spec/examples/order-detail-spec.yaml`, `validation-loop/SKILL.md`, `validation-loop/scripts/validate.sh`

#### Scenario: Conteúdo do validate.sh
- **WHEN** script copiado
- **THEN** contém comandos: verificar tsc, executar eslint, executar test runner

### Requirement: Template settings.json para VSCode

O sistema SHALL gerar ou fazer merge em `.vscode/settings.json` para configurar MCP server do Figma.

#### Scenario: Arquivo novo
- **WHEN** `.vscode/settings.json` não existe e Figma habilitado
- **THEN** arquivo criado com `mcp.servers.figma` configurado

#### Scenario: Merge com existente
- **WHEN** `.vscode/settings.json` já existe
- **THEN** adiciona key `mcp.servers.figma` sem remover outras configurações

#### Scenario: Figma desabilitado
- **WHEN** usuário responde "N" para integração Figma
- **THEN** configuração MCP não é adicionada
