## Context

O CLI `@org/feia` será executado em repositórios React existentes (brownfield) para configurar o accelerator FEIA. O contexto de execução é:

- **Ambiente**: Terminal do desenvolvedor, dentro de um repo React com `package.json`
- **Execução**: Via `npx @org/feia <comando>` (sem instalação global)
- **Estado inicial**: Repo pode ter zero ou parcial configuração do FEIA
- **Requisito chave**: Idempotência — executar `init` múltiplas vezes não deve quebrar ou duplicar configs

O CLI precisa funcionar tanto em repos novos quanto em projetos legados com padrões inconsistentes.

## Goals / Non-Goals

**Goals:**

- Setup completo do accelerator FEIA com um único comando (`init`)
- Detecção automática de padrões do repo com alta precisão
- Geração de arquivos que respeitam convenções existentes do projeto
- Operações idempotentes que preservam customizações do desenvolvedor
- Experiência interativa clara com prompts bem estruturados
- Diagnóstico de problemas via `doctor`
- Atualização segura via `update` que não sobrescreve configs do dev

**Non-Goals:**

- Não será um framework de geração de código (isso é feito pelo Copilot)
- Não gerencia runtime da aplicação (build, deploy, serve)
- Não modifica código fonte do projeto (apenas gera configs e scaffolds)
- Não implementa lógica de negócio — apenas configura ferramentas
- Não suporta frameworks além de React/Next.js (Vue é detecção apenas, sem geração)

## Decisions

### 1. Estrutura de Comandos (Commander.js)

**Decisão**: Usar Commander.js com subcomandos hierárquicos.

**Alternativas consideradas**:
- `yargs`: Mais complexo, menos idiomático para CLIs simples
- `oclif`: Overengineered para este caso, curva de aprendizado alta
- `cac`: Menos popular, documentação limitada

**Rationale**: Commander é o padrão de facto para CLIs Node.js, documentação excelente, suporte nativo a subcomandos (`conventions edit`, `conventions apply`).

**Estrutura**:
```
feia init
feia add-domain <name> --spec <path> --base-url <url>
feia remove-domain <name>
feia generate-hooks
feia conventions edit|apply|show
feia doctor
feia update
feia status
```

### 2. Sistema de Templates (Handlebars)

**Decisão**: Usar Handlebars para templates dinâmicos, arquivos estáticos copiados diretamente.

**Alternativas consideradas**:
- `ejs`: Sintaxe mais verbosa, menos legível em templates markdown
- `mustache`: Muito limitado (sem helpers)
- Template literals JS: Difícil manutenção para arquivos grandes

**Rationale**: Handlebars oferece sintaxe limpa (`{{variavel}}`), suporte a helpers customizados, e funciona bem com markdown/yaml.

**Convenção de arquivos**:
- `*.hbs` → Template dinâmico (renderizado com variáveis)
- Sem extensão `.hbs` → Arquivo estático (copiado direto)

### 3. Detecção de Padrões (Módulo detect.ts)

**Decisão**: Detecção em camadas com fontes de confiança decrescente.

**Ordem de prioridade**:
1. `package.json` dependencies/devDependencies (alta confiança)
2. Arquivos de configuração (`.eslintrc`, `tsconfig.json`, etc.)
3. Amostragem de arquivos `.tsx` (média confiança)
4. Estrutura de diretórios (baixa confiança)

**Estratégia de amostragem**: Para padrões que requerem análise de código (componentDeclaration, exportStyle), usar amostra de até 10 arquivos `.tsx` encontrados em `src/`. Resultado "mixed" se não houver consenso (>60%).

**Output**: Objeto `DetectedConventions` com campo `confidence` por detecção.

### 4. Idempotência e Merge

**Decisão**: Classificar arquivos em 3 categorias de comportamento.

| Categoria | Arquivos | Comportamento |
|-----------|----------|---------------|
| **SOBRESCREVE** | Skills, Agent, validate.sh | Sempre atualiza para versão do pacote |
| **PRESERVA** | conventions.yaml, project.yaml, orval.config.ts, custom-instance.ts | Nunca sobrescreve se existe |
| **MERGE** | .vscode/settings.json | Adiciona keys sem remover existentes |

**Implementação**:
- `scaffold.ts`: Verifica existência antes de escrever
- `merge.ts`: Deep merge para JSON/YAML preservando keys do usuário

### 5. Instalação de Dependências

**Decisão**: Usar `execa` para executar `npm install` com dependências específicas.

**Dependências instaladas pelo `init`**:
- Produção: `@tanstack/react-query`
- Dev: `orval`, `zod`, `vitest`, `@testing-library/react`

**Detecção de package manager**: Verificar lockfiles na ordem:
1. `pnpm-lock.yaml` → `pnpm add`
2. `yarn.lock` → `yarn add`
3. `package-lock.json` ou default → `npm install`

### 6. Armazenamento de Convenções

**Decisão**: YAML como formato para `conventions.yaml` e `project.yaml`.

**Alternativas consideradas**:
- JSON: Menos legível, não suporta comentários
- TOML: Menos familiar para devs JS/TS

**Rationale**: YAML permite comentários explicativos, é mais legível, e é padrão em configs de ferramentas modernas.

### 7. Execução de Orval

**Decisão**: CLI executa `npx orval` após gerar `orval.config.ts`.

**Comportamento**:
- `init`: Roda Orval após instalar dependências
- `add-domain`: Roda Orval apenas para o novo domínio
- `generate-hooks`: Roda Orval para todos os domínios

**Tratamento de erros**: Se Orval falhar (spec inválido, etc.), mostrar erro mas não reverter outras operações.

### 8. Estrutura de Diretórios do Pacote

```
@org/feia/
├── bin/cli.ts                    # Entry point (shebang + commander)
├── src/
│   ├── commands/                 # Um arquivo por comando
│   ├── templates/                # Templates .hbs e arquivos estáticos
│   ├── utils/                    # Módulos utilitários
│   └── types/                    # Interfaces TypeScript
├── tests/
│   ├── commands/                 # Testes de integração por comando
│   ├── utils/                    # Testes unitários
│   └── fixtures/                 # Repos fake para testes
└── package.json
```

## Risks / Trade-offs

### Detecção de padrões imprecisa

**Risco**: Repos legados com padrões inconsistentes podem gerar `conventions.yaml` incorreto.

**Mitigação**:
- Campo `confidence` indica confiança da detecção
- Comentário `# ⚠️ detectado com baixa confiança` em campos duvidosos
- Comando `conventions edit` abre arquivo para revisão manual
- `init` abre `conventions.yaml` no editor ao final

### Conflitos com configs existentes

**Risco**: `.vscode/settings.json` pode ter estrutura inesperada.

**Mitigação**: Deep merge com `lodash.merge`, preservando todas as keys existentes. Se parse falhar, criar backup e mostrar warning.

### Orval falha por spec inválido

**Risco**: OpenAPI spec do usuário pode estar malformado.

**Mitigação**: `doctor` verifica se specs existem e são parseáveis. Erro em `init` não reverte outras operações, apenas mostra mensagem clara.

### Atualizações quebram customizações

**Risco**: `update` pode sobrescrever arquivos que o dev modificou.

**Mitigação**:
- Skills e Agent são sempre sobrescritos (esperado)
- conventions.yaml, project.yaml, configs nunca são tocados
- `copilot-instructions.md` é regenerado a partir do conventions.yaml preservado

### Package manager não detectado

**Risco**: Repo sem lockfile pode usar package manager errado.

**Mitigação**: Default para `npm`, que funciona em qualquer projeto Node.js.
