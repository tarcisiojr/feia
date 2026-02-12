## 1. Correção do Código

- [x] 1.1 Editar `packages/feia-cli/src/bin/cli.ts` alterando o caminho de `join(__dirname, '..', 'package.json')` para `join(__dirname, '..', '..', 'package.json')`

## 2. Build e Validação

- [x] 2.1 Compilar o projeto com `npm run build` no diretório `packages/feia-cli`
- [x] 2.2 Testar execução do CLI com `npx feia --version` para verificar que a versão é exibida corretamente
- [x] 2.3 Testar execução do CLI com `npx feia` para verificar que não há mais erro de ENOENT
