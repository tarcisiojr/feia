## ADDED Requirements

### Requirement: Fluxo de setup interativo

O sistema SHALL executar o comando `init` em sequência: detectar padrões → perguntar ao dev → gerar arquivos → instalar deps → rodar Orval → abrir conventions.yaml.

#### Scenario: Execução completa em repo novo
- **WHEN** usuário executa `npx @org/feia init` em repo React sem FEIA configurado
- **THEN** sistema executa todas as 6 etapas na ordem e exibe progresso de cada uma

#### Scenario: Repo já configurado
- **WHEN** usuário executa `npx @org/feia init` em repo que já tem `frontendspec/conventions.yaml`
- **THEN** sistema aplica regras de idempotência (preserva configs existentes, sobrescreve skills)

### Requirement: Prompts interativos com Inquirer

O sistema SHALL usar Inquirer para coletar informações não detectáveis automaticamente.

#### Scenario: Prompt de nome do projeto
- **WHEN** etapa de prompts inicia
- **THEN** sistema pergunta "Nome do projeto:" com default sendo o nome da pasta

#### Scenario: Prompt de domínios de API
- **WHEN** etapa de prompts inicia
- **THEN** sistema pergunta "Domínios de API (separados por vírgula):" sem default

#### Scenario: Prompt de spec path por domínio
- **WHEN** usuário informa domínios (ex: "orders, inventory")
- **THEN** sistema pergunta para cada domínio: "Path do OpenAPI spec para {domínio}:" e "Base URL para {domínio}:"

#### Scenario: Prompt de Figma
- **WHEN** etapa de prompts inicia
- **THEN** sistema pergunta "Usar integração com Figma? (S/n):" e se sim, "Nome da env var do token Figma:" com default `FIGMA_ACCESS_TOKEN`

#### Scenario: Prompt de paths com defaults detectados
- **WHEN** detecção encontra `src/components`
- **THEN** prompt "Path de componentes:" mostra `src/components` como default

### Requirement: Geração de arquivos dinâmicos com Handlebars

O sistema SHALL renderizar templates `.hbs` com variáveis coletadas dos prompts e detecção.

#### Scenario: Geração de orval.config.ts
- **WHEN** usuário configura domínios "orders" e "inventory"
- **THEN** arquivo `orval.config.ts` contém um bloco de configuração para cada domínio

#### Scenario: Geração de conventions.yaml
- **WHEN** detecção encontra `framework: 'react'`, `css: 'tailwind'`, `testRunner: 'vitest'`
- **THEN** arquivo `frontendspec/conventions.yaml` contém esses valores nos campos correspondentes

#### Scenario: Campos com baixa confiança
- **WHEN** detecção retorna `componentDeclaration: 'mixed'` com `confidence: 'low'`
- **THEN** arquivo `conventions.yaml` contém comentário `# ⚠️ detectado com baixa confiança — revise`

### Requirement: Cópia de arquivos estáticos

O sistema SHALL copiar arquivos de skills e scripts que não requerem customização.

#### Scenario: Skills estáticas copiadas
- **WHEN** geração de arquivos executa
- **THEN** arquivos `.github/skills/figma-extraction/SKILL.md`, `orval-hooks/SKILL.md`, `frontend-spec/SKILL.md`, `validation-loop/SKILL.md` são copiados idênticos

#### Scenario: Script validate.sh copiado
- **WHEN** geração de arquivos executa
- **THEN** arquivo `.github/skills/validation-loop/scripts/validate.sh` é copiado com permissão de execução

### Requirement: Instalação de dependências

O sistema SHALL instalar dependências npm necessárias usando o package manager detectado.

#### Scenario: Instalação com npm
- **WHEN** `package-lock.json` existe ou nenhum lockfile detectado
- **THEN** sistema executa `npm install @tanstack/react-query && npm install -D orval zod vitest @testing-library/react`

#### Scenario: Instalação com pnpm
- **WHEN** `pnpm-lock.yaml` existe
- **THEN** sistema executa `pnpm add @tanstack/react-query && pnpm add -D orval zod vitest @testing-library/react`

#### Scenario: Instalação com yarn
- **WHEN** `yarn.lock` existe
- **THEN** sistema executa `yarn add @tanstack/react-query && yarn add -D orval zod vitest @testing-library/react`

### Requirement: Execução inicial do Orval

O sistema SHALL executar `npx orval` após gerar `orval.config.ts` para criar hooks iniciais.

#### Scenario: Orval sucesso
- **WHEN** `orval.config.ts` válido e specs existem
- **THEN** sistema executa `npx orval` e exibe mensagem de sucesso

#### Scenario: Orval falha
- **WHEN** spec OpenAPI inválido ou não encontrado
- **THEN** sistema exibe erro do Orval mas não reverte outras operações

### Requirement: Abertura do conventions.yaml no editor

O sistema SHALL abrir `frontendspec/conventions.yaml` no editor padrão ao final do init.

#### Scenario: Editor VS Code
- **WHEN** comando `code` disponível no PATH
- **THEN** sistema executa `code frontendspec/conventions.yaml`

#### Scenario: Editor padrão via $EDITOR
- **WHEN** `code` não disponível mas `$EDITOR` definido
- **THEN** sistema executa `$EDITOR frontendspec/conventions.yaml`

#### Scenario: Nenhum editor disponível
- **WHEN** nem `code` nem `$EDITOR` disponíveis
- **THEN** sistema exibe mensagem "Revise as convenções em frontendspec/conventions.yaml"

### Requirement: Idempotência do init

O sistema SHALL preservar arquivos de configuração do desenvolvedor ao rodar init novamente.

#### Scenario: conventions.yaml preservado
- **WHEN** `frontendspec/conventions.yaml` já existe
- **THEN** sistema NÃO sobrescreve o arquivo

#### Scenario: Skills sobrescritas
- **WHEN** `.github/skills/figma-extraction/SKILL.md` já existe
- **THEN** sistema SOBRESCREVE com versão do pacote

#### Scenario: VSCode settings merged
- **WHEN** `.vscode/settings.json` já existe com outras configs
- **THEN** sistema adiciona `mcp.servers.figma` sem remover configs existentes
