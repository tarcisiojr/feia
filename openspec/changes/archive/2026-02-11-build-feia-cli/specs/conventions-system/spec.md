## ADDED Requirements

### Requirement: Arquivo conventions.yaml como fonte de verdade

O sistema SHALL tratar `frontendspec/conventions.yaml` como fonte de verdade das convenções do projeto, nunca sobrescrevendo após criação inicial.

#### Scenario: Arquivo preservado em updates
- **WHEN** usuário executa `npx @org/feia update`
- **THEN** `frontendspec/conventions.yaml` NÃO é modificado

#### Scenario: Estrutura completa
- **WHEN** arquivo é gerado pelo `init`
- **THEN** contém todas as seções: stack, naming, paths, imports, components, errorHandling, loading, testing, custom

### Requirement: Comando conventions edit

O sistema SHALL abrir `frontendspec/conventions.yaml` no editor padrão via comando `conventions edit`.

#### Scenario: Editor VS Code
- **WHEN** comando `code` disponível e usuário executa `npx @org/feia conventions edit`
- **THEN** sistema executa `code frontendspec/conventions.yaml`

#### Scenario: Fallback para $EDITOR
- **WHEN** `code` não disponível mas `$EDITOR` definido
- **THEN** sistema executa `$EDITOR frontendspec/conventions.yaml`

#### Scenario: Arquivo não existe
- **WHEN** `frontendspec/conventions.yaml` não existe
- **THEN** sistema exibe erro "Arquivo conventions.yaml não encontrado. Execute 'init' primeiro."

### Requirement: Comando conventions apply

O sistema SHALL regenerar `.github/copilot-instructions.md` a partir de `frontendspec/conventions.yaml` via comando `conventions apply`.

#### Scenario: Regeneração com sucesso
- **WHEN** usuário executa `npx @org/feia conventions apply`
- **THEN** sistema lê `conventions.yaml`, renderiza template `copilot-instructions.md.hbs`, sobrescreve `.github/copilot-instructions.md`

#### Scenario: Mudança detectada
- **WHEN** usuário alterou `css: tailwind` para `css: styled-components` em conventions.yaml
- **THEN** arquivo regenerado reflete nova convenção CSS

### Requirement: Comando conventions show

O sistema SHALL exibir convenções atuais no terminal em formato resumido via comando `conventions show`.

#### Scenario: Exibição resumida
- **WHEN** usuário executa `npx @org/feia conventions show`
- **THEN** sistema exibe tabela com principais convenções: framework, css, testRunner, naming, paths

#### Scenario: Campos custom
- **WHEN** `conventions.yaml` contém itens em `custom`
- **THEN** seção "Convenções customizadas" é exibida com lista de itens

### Requirement: Template copilot-instructions.md

O sistema SHALL gerar `.github/copilot-instructions.md` com instruções baseadas nas convenções detectadas.

#### Scenario: Instruções de stack
- **WHEN** conventions.yaml contém `framework: react`, `css: tailwind`
- **THEN** copilot-instructions.md contém "Use React com Tailwind CSS"

#### Scenario: Instruções de naming
- **WHEN** conventions.yaml contém `naming.files: kebab-case`, `naming.components: PascalCase`
- **THEN** copilot-instructions.md contém regras de nomenclatura correspondentes

#### Scenario: Instruções de imports
- **WHEN** conventions.yaml contém `imports.alias: '@/'`
- **THEN** copilot-instructions.md contém "Use alias @/ para imports de src/"

#### Scenario: Instruções de error handling
- **WHEN** conventions.yaml contém `errorHandling.apiError: toast`
- **THEN** copilot-instructions.md contém "Mostre erros de API via toast"
