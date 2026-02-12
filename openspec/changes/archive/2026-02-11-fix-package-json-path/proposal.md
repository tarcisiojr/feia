## Why

O CLI feia falha ao iniciar porque tenta ler `package.json` de um caminho incorreto. O código calcula o caminho como `join(__dirname, '..', 'package.json')` onde `__dirname` é `dist/bin/`, resultando em `dist/package.json` - que não existe. O arquivo real está em `packages/feia-cli/package.json`.

## What Changes

- Corrigir o cálculo do caminho para `package.json` no entry point do CLI (`dist/bin/cli.js`)
- O caminho correto deve subir dois níveis a partir de `dist/bin/` para chegar à raiz do pacote: `join(__dirname, '..', '..', 'package.json')`

## Capabilities

### New Capabilities

Nenhuma nova capability - esta é uma correção de bug.

### Modified Capabilities

- `cli-core`: O requisito "CLI entry point com Commander.js" não especifica como a versão deve ser obtida. A implementação atual tem um bug no cálculo do caminho.

## Impact

- **Código afetado**: `packages/feia-cli/src/bin/cli.ts` (source) e `packages/feia-cli/dist/bin/cli.js` (compilado)
- **Comportamento atual**: CLI falha com `ENOENT: no such file or directory` ao tentar ler `dist/package.json`
- **Comportamento esperado**: CLI inicia normalmente lendo `package.json` da raiz do pacote
