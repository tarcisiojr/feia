## Context

O CLI feia é um binário executável que utiliza Commander.js. O entry point está em `packages/feia-cli/src/bin/cli.ts`, que é compilado para `packages/feia-cli/dist/bin/cli.js`.

O código atual usa ES Modules e calcula o caminho do `package.json` assim:

```typescript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
```

O problema é que `__dirname` aponta para `dist/bin/`, então `join(__dirname, '..', 'package.json')` resulta em `dist/package.json`, que não existe. O `package.json` real está na raiz do pacote (`packages/feia-cli/package.json`).

## Goals / Non-Goals

**Goals:**
- Corrigir o caminho para `package.json` para que o CLI inicie corretamente
- Manter compatibilidade com a estrutura de build existente

**Non-Goals:**
- Refatorar a forma de obter a versão (ex: importar diretamente o JSON)
- Alterar a estrutura de diretórios do build

## Decisions

### Decisão 1: Ajustar o número de níveis no path

**Escolha**: Alterar de `join(__dirname, '..', 'package.json')` para `join(__dirname, '..', '..', 'package.json')`

**Alternativas consideradas**:
1. **Importar package.json diretamente**: Requer `resolveJsonModule` no tsconfig e pode ter problemas com bundlers
2. **Hardcode da versão**: Requer atualização manual a cada release
3. **Subir dois níveis no path**: Simples, mantém a estrutura atual, funciona com ES Modules

**Rationale**: A correção mais simples e direta é ajustar o caminho relativo. O entry point está em `dist/bin/cli.js`, então precisa subir para `dist/` e depois para a raiz do pacote onde está o `package.json`.

## Risks / Trade-offs

**[Risco: Mudança na estrutura de build]** → Se a estrutura de diretórios mudar no futuro, o caminho precisará ser atualizado novamente. Mitigação: documentar a dependência do caminho relativo.

**[Trade-off: Path relativo vs import]** → O import direto de JSON seria mais robusto, mas adiciona complexidade de configuração. O path relativo é suficiente para este caso.
