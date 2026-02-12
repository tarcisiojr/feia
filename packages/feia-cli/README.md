# @anthropic/feia

CLI para configurar o accelerator FEIA (Frontend Engineering AI Assistant) em projetos React.

## Instalação

```bash
# Via npx (recomendado)
npx @anthropic/feia init

# Ou instale globalmente
npm install -g @anthropic/feia
```

## Requisitos

- Node.js >= 18.0.0
- Projeto React existente com `package.json`

## Comandos

### `feia init`

Configura o accelerator FEIA no projeto. Executa:

1. **Detecção automática** de padrões (framework, CSS, linter, etc.)
2. **Prompts interativos** para coletar informações adicionais
3. **Geração de arquivos** (skills, agent, conventions, configs)
4. **Instalação de dependências** (React Query, Orval, etc.)
5. **Execução do Orval** para gerar hooks
6. **Abertura do editor** com `conventions.yaml` para revisão

```bash
npx @anthropic/feia init

# Opções
npx @anthropic/feia init --skip-deps      # Pular instalação de dependências
npx @anthropic/feia init --skip-orval     # Pular execução do Orval
npx @anthropic/feia init --skip-editor    # Não abrir editor
```

### `feia add-domain`

Adiciona um novo domínio de API ao projeto.

```bash
npx @anthropic/feia add-domain inventory --spec specs/inventory.yaml --base-url /api/inventory
```

### `feia remove-domain`

Remove um domínio de API existente.

```bash
npx @anthropic/feia remove-domain inventory
npx @anthropic/feia remove-domain inventory -y  # Sem confirmação
```

### `feia generate-hooks`

Regenera hooks React Query de todos os domínios.

```bash
npx @anthropic/feia generate-hooks
```

### `feia conventions`

Gerencia convenções do projeto.

```bash
npx @anthropic/feia conventions edit   # Abre conventions.yaml no editor
npx @anthropic/feia conventions apply  # Regenera copilot-instructions.md
npx @anthropic/feia conventions show   # Exibe convenções no terminal
```

### `feia doctor`

Verifica integridade da configuração FEIA.

```bash
npx @anthropic/feia doctor
```

### `feia status`

Exibe status do projeto.

```bash
npx @anthropic/feia status
```

### `feia update`

Atualiza skills e agent para a versão mais recente.

```bash
npx @anthropic/feia update
```

## Arquivos Gerados

### Configuração

| Arquivo | Descrição | Comportamento |
|---------|-----------|---------------|
| `frontendspec/conventions.yaml` | Convenções do projeto | Preservado |
| `frontendspec/project.yaml` | Metadados do projeto | Preservado |
| `orval.config.ts` | Configuração do Orval | Preservado |
| `src/api/custom-instance.ts` | Instâncias Axios | Preservado |

### GitHub Copilot

| Arquivo | Descrição | Comportamento |
|---------|-----------|---------------|
| `.github/copilot-instructions.md` | Instruções para o Copilot | Sobrescrito |
| `.github/agents/feia.agent.md` | Custom Agent FEIA | Sobrescrito |
| `.github/skills/*` | Skills do accelerator | Sobrescrito |
| `.github/instructions/*` | Instruções adicionais | Sobrescrito |

### VSCode

| Arquivo | Descrição | Comportamento |
|---------|-----------|---------------|
| `.vscode/settings.json` | MCP Figma config | Merge |

## Detecção Automática

O CLI detecta automaticamente:

- **Framework**: React, Next.js, Vue
- **CSS**: Tailwind, Styled Components, Emotion, CSS Modules, Sass
- **Test Runner**: Vitest, Jest
- **Linter**: ESLint, Biome
- **Formatter**: Prettier, Biome
- **Forms**: React Hook Form, Formik
- **Validation**: Zod, Yup, Joi
- **State Management**: Zustand, Redux, Jotai, MobX
- **Path Alias**: via `tsconfig.json`
- **Component Patterns**: Arrow functions, Function declarations
- **Naming Conventions**: kebab-case, PascalCase, camelCase
- **Barrel Files**: Presença de `index.ts` com reexportações

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Testes
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## Licença

MIT
