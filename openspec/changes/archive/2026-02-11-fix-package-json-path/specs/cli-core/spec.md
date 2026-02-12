## MODIFIED Requirements

### Requirement: CLI entry point com Commander.js

O sistema SHALL expor um binário `feia` executável via `npx @org/feia` que utiliza Commander.js para parsing de comandos e subcomandos. O sistema SHALL obter a versão do `package.json` localizado na raiz do pacote, calculando o caminho relativo corretamente a partir do entry point compilado.

#### Scenario: Execução via npx
- **WHEN** usuário executa `npx @org/feia --version`
- **THEN** sistema exibe a versão do pacote instalado

#### Scenario: Comando inválido
- **WHEN** usuário executa `npx @org/feia comando-inexistente`
- **THEN** sistema exibe mensagem de erro e lista de comandos disponíveis

#### Scenario: Leitura do package.json
- **WHEN** CLI é iniciado a partir de `dist/bin/cli.js`
- **THEN** sistema lê `package.json` da raiz do pacote (dois níveis acima de `dist/bin/`)
