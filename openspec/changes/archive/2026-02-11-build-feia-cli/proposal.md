## Why

Desenvolvedores em projetos React brownfield precisam de uma forma rápida e padronizada de configurar o accelerator FEIA (GitHub Copilot Agent Skills + Custom Agent + Custom Instructions) para gerar telas via conversa. Atualmente não existe uma ferramenta automatizada que detecte padrões existentes do repo e configure toda a infraestrutura necessária (skills, agent, orval, conventions) de forma idempotente.

## What Changes

- **Novo pacote npm `@org/feia`**: CLI Node.js executável via `npx` que automatiza o setup do accelerator FEIA em qualquer repo React existente
- **Detecção automática de padrões**: Módulo que escaneia o repo para identificar framework, CSS, test runner, linter, naming conventions, paths, etc.
- **Geração de arquivos de configuração**: 15 arquivos gerados (9 dinâmicos via Handlebars, 6 estáticos) incluindo skills, agent, conventions, orval config
- **Gerenciamento de domínios de API**: Comandos para adicionar/remover domínios OpenAPI com geração automática de hooks via Orval
- **Sistema de convenções editável**: Arquivo `conventions.yaml` como fonte de verdade das convenções do projeto, com comando para regenerar instruções do Copilot
- **Diagnóstico e manutenção**: Comandos `doctor`, `status` e `update` para verificar integridade e atualizar o accelerator

## Capabilities

### New Capabilities

- `cli-core`: Estrutura base do CLI com commander, entry point, tipos compartilhados e configuração de comandos
- `repo-detection`: Módulo de detecção automática de padrões do repositório (framework, CSS, test runner, naming, paths, etc.)
- `init-command`: Comando principal de setup interativo que orquestra detecção, prompts, geração de arquivos e instalação de dependências
- `domain-management`: Comandos `add-domain`, `remove-domain` e `generate-hooks` para gerenciar domínios de API OpenAPI
- `conventions-system`: Sistema de convenções com arquivo YAML editável e comandos `edit`, `apply`, `show`
- `templates`: Todos os templates Handlebars e arquivos estáticos para geração (skills, agent, configs, instructions)
- `diagnostics`: Comandos `doctor`, `status` e `update` para diagnóstico, visibilidade e atualização do accelerator

### Modified Capabilities

_(Nenhuma capacidade existente será modificada - este é um novo projeto)_

## Impact

### Código

- Novo pacote npm em `@org/feia/` com estrutura: `bin/`, `src/commands/`, `src/templates/`, `src/utils/`, `src/types/`, `tests/`
- Dependências de produção: `commander`, `inquirer`, `handlebars`, `execa`, `fs-extra`, `chalk`, `yaml`, `glob`
- Dependências de desenvolvimento: `typescript`, `vitest`, `@types/*`

### Repositórios Alvo (onde o CLI será executado)

- Criação de diretórios: `.github/skills/`, `.github/agents/`, `.github/instructions/`, `frontendspec/`, `src/api/`
- Modificação de `.vscode/settings.json` (merge para adicionar MCP config)
- Instalação de dependências: `@tanstack/react-query`, `orval`, `zod`, `vitest`, `@testing-library/react`

### Integrações

- GitHub Copilot: Custom Agent e Skills geradas são consumidas pelo VS Code Copilot Chat
- Orval: CLI executa `npx orval` para gerar hooks React Query a partir de specs OpenAPI
- Figma (opcional): Configuração do MCP server `figma-mcp` para extração de designs
