## ADDED Requirements

### Requirement: Detecção de framework

O sistema SHALL detectar o framework do projeto analisando `dependencies` e `devDependencies` no `package.json`.

#### Scenario: React detectado
- **WHEN** `package.json` contém `react` em dependencies
- **THEN** `framework` é definido como `'react'` com `confidence: 'high'`

#### Scenario: Next.js detectado
- **WHEN** `package.json` contém `next` em dependencies
- **THEN** `framework` é definido como `'nextjs'` com `confidence: 'high'`

#### Scenario: Vue detectado
- **WHEN** `package.json` contém `vue` em dependencies
- **THEN** `framework` é definido como `'vue'` com `confidence: 'high'`

#### Scenario: Framework não detectado
- **WHEN** nenhum framework reconhecido está em dependencies
- **THEN** `framework` é definido como `'unknown'` com `confidence: 'low'`

### Requirement: Detecção de biblioteca CSS

O sistema SHALL detectar a biblioteca CSS analisando `dependencies` no `package.json`.

#### Scenario: Tailwind detectado
- **WHEN** `package.json` contém `tailwindcss` em dependencies ou devDependencies
- **THEN** `css` é definido como `'tailwind'` com `confidence: 'high'`

#### Scenario: Styled Components detectado
- **WHEN** `package.json` contém `styled-components` em dependencies
- **THEN** `css` é definido como `'styled-components'` com `confidence: 'high'`

#### Scenario: Emotion detectado
- **WHEN** `package.json` contém `@emotion/react` ou `@emotion/styled` em dependencies
- **THEN** `css` é definido como `'emotion'` com `confidence: 'high'`

### Requirement: Detecção de test runner

O sistema SHALL detectar o test runner analisando `devDependencies` e arquivos de configuração.

#### Scenario: Vitest detectado por config
- **WHEN** arquivo `vitest.config.ts` ou `vitest.config.js` existe na raiz
- **THEN** `testRunner` é definido como `'vitest'` com `confidence: 'high'`

#### Scenario: Jest detectado por config
- **WHEN** arquivo `jest.config.js`, `jest.config.ts` ou campo `jest` em `package.json` existe
- **THEN** `testRunner` é definido como `'jest'` com `confidence: 'high'`

### Requirement: Detecção de linter e formatter

O sistema SHALL detectar linter e formatter analisando arquivos de configuração na raiz do projeto.

#### Scenario: ESLint detectado
- **WHEN** arquivo `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, ou `eslint.config.js` existe
- **THEN** `linter` é definido como `'eslint'` com `confidence: 'high'`

#### Scenario: Biome detectado
- **WHEN** arquivo `biome.json` existe
- **THEN** `linter` é definido como `'biome'` e `formatter` como `'biome'` com `confidence: 'high'`

#### Scenario: Prettier detectado
- **WHEN** arquivo `.prettierrc`, `.prettierrc.js`, `.prettierrc.json`, ou `prettier.config.js` existe
- **THEN** `formatter` é definido como `'prettier'` com `confidence: 'high'`

### Requirement: Detecção de bibliotecas de formulário e validação

O sistema SHALL detectar bibliotecas de formulário e validação analisando `dependencies`.

#### Scenario: React Hook Form detectado
- **WHEN** `package.json` contém `react-hook-form` em dependencies
- **THEN** `forms` é definido como `'react-hook-form'` com `confidence: 'high'`

#### Scenario: Zod detectado
- **WHEN** `package.json` contém `zod` em dependencies
- **THEN** `validation` é definido como `'zod'` com `confidence: 'high'`

### Requirement: Detecção de state management

O sistema SHALL detectar biblioteca de estado global analisando `dependencies`.

#### Scenario: Zustand detectado
- **WHEN** `package.json` contém `zustand` em dependencies
- **THEN** `globalState` é definido como `'zustand'` com `confidence: 'high'`

#### Scenario: Redux detectado
- **WHEN** `package.json` contém `redux` ou `@reduxjs/toolkit` em dependencies
- **THEN** `globalState` é definido como `'redux'` com `confidence: 'high'`

### Requirement: Detecção de path alias

O sistema SHALL detectar path alias analisando `compilerOptions.paths` em `tsconfig.json`.

#### Scenario: Alias @/ detectado
- **WHEN** `tsconfig.json` contém `"@/*": ["src/*"]` em paths
- **THEN** `pathAlias` é definido como `'@/'` com `confidence: 'high'`

#### Scenario: Sem alias configurado
- **WHEN** `tsconfig.json` não contém campo `paths` ou arquivo não existe
- **THEN** `pathAlias` é definido como `null`

### Requirement: Detecção de padrões de código por amostragem

O sistema SHALL analisar até 10 arquivos `.tsx` em `src/` para detectar padrões de declaração de componentes e estilo de export.

#### Scenario: Arrow functions predominam
- **WHEN** mais de 60% dos componentes analisados usam `const X = () =>`
- **THEN** `componentDeclaration` é definido como `'arrow'` com `confidence: 'high'`

#### Scenario: Padrões mistos
- **WHEN** nenhum padrão atinge 60% dos arquivos analisados
- **THEN** `componentDeclaration` é definido como `'mixed'` com `confidence: 'low'`

### Requirement: Detecção de naming conventions

O sistema SHALL analisar nomes de arquivos em `src/` para detectar convenção de nomenclatura.

#### Scenario: kebab-case detectado
- **WHEN** mais de 60% dos arquivos `.tsx` usam padrão `nome-composto.tsx`
- **THEN** `namingFiles` é definido como `'kebab-case'` com `confidence: 'high'`

#### Scenario: PascalCase detectado
- **WHEN** mais de 60% dos arquivos `.tsx` usam padrão `NomeComposto.tsx`
- **THEN** `namingFiles` é definido como `'PascalCase'` com `confidence: 'high'`

### Requirement: Detecção de paths de diretórios

O sistema SHALL detectar paths convencionais do projeto verificando existência de diretórios.

#### Scenario: Diretório components detectado
- **WHEN** diretório `src/components` existe
- **THEN** `paths.components` é definido como `'src/components'`

#### Scenario: Diretório pages detectado
- **WHEN** diretório `src/pages` existe
- **THEN** `paths.pages` é definido como `'src/pages'`

#### Scenario: Diretório views como fallback
- **WHEN** diretório `src/pages` não existe mas `src/views` existe
- **THEN** `paths.pages` é definido como `'src/views'`

### Requirement: Detecção de barrel files

O sistema SHALL verificar existência de arquivos `index.ts` que reexportam módulos.

#### Scenario: Barrel files presentes
- **WHEN** existem arquivos `index.ts` em `src/components/` ou subdiretórios que contêm `export * from` ou `export { X } from`
- **THEN** `barrelFiles` é definido como `true`

#### Scenario: Sem barrel files
- **WHEN** não existem arquivos `index.ts` com reexportações
- **THEN** `barrelFiles` é definido como `false`
