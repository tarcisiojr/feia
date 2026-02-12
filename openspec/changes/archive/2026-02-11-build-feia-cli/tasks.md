## 1. Setup do Projeto

- [x] 1.1 Criar estrutura de diretórios do pacote (@org/feia): bin/, src/commands/, src/templates/, src/utils/, src/types/, tests/
- [x] 1.2 Configurar package.json com name, version, bin, main, scripts, dependencies
- [x] 1.3 Configurar tsconfig.json para compilação TypeScript
- [x] 1.4 Instalar dependências de produção: commander, inquirer, handlebars, execa, fs-extra, chalk, yaml, glob
- [x] 1.5 Instalar dependências de desenvolvimento: typescript, vitest, @types/*

## 2. CLI Core (bin/cli.ts)

- [x] 2.1 Criar entry point com shebang e importação do Commander
- [x] 2.2 Configurar programa com name, version, description
- [x] 2.3 Registrar todos os comandos: init, add-domain, remove-domain, generate-hooks, conventions, doctor, update, status
- [x] 2.4 Implementar validação de diretório de trabalho (verificar package.json)
- [x] 2.5 Configurar output colorido com Chalk (sucesso=verde, erro=vermelho, info=azul)

## 3. Tipos TypeScript (src/types/)

- [x] 3.1 Criar interface DetectedConventions em src/types/conventions.ts
- [x] 3.2 Criar interface ProjectConfig em src/types/config.ts
- [x] 3.3 Criar interface Domain em src/types/config.ts
- [x] 3.4 Exportar tipos via barrel file src/types/index.ts

## 4. Módulo de Detecção (src/utils/detect.ts)

- [x] 4.1 Implementar detecção de framework (React, Next.js, Vue) via package.json
- [x] 4.2 Implementar detecção de CSS library (Tailwind, Styled Components, Emotion, etc.)
- [x] 4.3 Implementar detecção de test runner (Vitest, Jest) via config files
- [x] 4.4 Implementar detecção de linter (ESLint, Biome) via config files
- [x] 4.5 Implementar detecção de formatter (Prettier, Biome) via config files
- [x] 4.6 Implementar detecção de forms library (React Hook Form, Formik)
- [x] 4.7 Implementar detecção de validation library (Zod, Yup, Joi)
- [x] 4.8 Implementar detecção de state management (Zustand, Redux, Jotai, MobX)
- [x] 4.9 Implementar detecção de path alias via tsconfig.json
- [x] 4.10 Implementar amostragem de arquivos .tsx para detectar componentDeclaration e exportStyle
- [x] 4.11 Implementar detecção de naming conventions (kebab-case, camelCase, PascalCase)
- [x] 4.12 Implementar detecção de paths (components, pages, routes, hooks, utils)
- [x] 4.13 Implementar detecção de barrel files
- [x] 4.14 Implementar cálculo de confidence para cada detecção

## 5. Módulo de Prompts (src/utils/prompts.ts)

- [x] 5.1 Implementar prompt de nome do projeto (com default = nome da pasta)
- [x] 5.2 Implementar prompt de domínios de API (lista separada por vírgula)
- [x] 5.3 Implementar prompts por domínio: spec path e base URL
- [x] 5.4 Implementar prompt de integração Figma (S/N) e nome da env var
- [x] 5.5 Implementar prompts de paths com defaults detectados

## 6. Módulo de Scaffold (src/utils/scaffold.ts)

- [x] 6.1 Implementar função para renderizar templates Handlebars
- [x] 6.2 Implementar função para copiar arquivos estáticos
- [x] 6.3 Implementar lógica de idempotência (verificar existência antes de sobrescrever)
- [x] 6.4 Implementar registro de helpers Handlebars customizados

## 7. Módulo de Merge (src/utils/merge.ts)

- [x] 7.1 Implementar deep merge para JSON
- [x] 7.2 Implementar deep merge para YAML
- [x] 7.3 Implementar backup de arquivo antes de merge

## 8. Módulo de Dependências (src/utils/deps.ts)

- [x] 8.1 Implementar detecção de package manager (npm, pnpm, yarn)
- [x] 8.2 Implementar função para instalar dependências de produção
- [x] 8.3 Implementar função para instalar dependências de desenvolvimento

## 9. Templates Handlebars (src/templates/)

- [x] 9.1 Criar template orval.config.ts.hbs
- [x] 9.2 Criar template frontendspec/conventions.yaml.hbs
- [x] 9.3 Criar template frontendspec/project.yaml.hbs
- [x] 9.4 Criar template src/api/custom-instance.ts.hbs
- [x] 9.5 Criar template .github/copilot-instructions.md.hbs
- [x] 9.6 Criar template .github/agents/feia.agent.md.hbs
- [x] 9.7 Criar template .github/skills/react-page-generation/SKILL.md.hbs
- [x] 9.8 Criar template .github/instructions/new-features.instructions.md.hbs
- [x] 9.9 Criar template .vscode/settings.json.hbs

## 10. Arquivos Estáticos de Skills (src/templates/github/skills/)

- [x] 10.1 Criar figma-extraction/SKILL.md
- [x] 10.2 Criar orval-hooks/SKILL.md
- [x] 10.3 Criar frontend-spec/SKILL.md
- [x] 10.4 Criar frontend-spec/examples/order-detail-spec.yaml
- [x] 10.5 Criar validation-loop/SKILL.md
- [x] 10.6 Criar validation-loop/scripts/validate.sh

## 11. Comando init (src/commands/init.ts)

- [x] 11.1 Implementar orquestração do fluxo: detect → prompts → scaffold → deps → orval → editor
- [x] 11.2 Integrar módulo de detecção
- [x] 11.3 Integrar módulo de prompts
- [x] 11.4 Implementar geração de arquivos dinâmicos via templates
- [x] 11.5 Implementar cópia de arquivos estáticos
- [x] 11.6 Implementar instalação de dependências
- [x] 11.7 Implementar execução do Orval (npx orval)
- [x] 11.8 Implementar abertura do conventions.yaml no editor
- [x] 11.9 Implementar lógica de idempotência para re-execução

## 12. Comando add-domain (src/commands/add-domain.ts)

- [x] 12.1 Implementar parsing de argumentos (name, --spec, --base-url)
- [x] 12.2 Implementar validação de domínio existente
- [x] 12.3 Implementar atualização de orval.config.ts
- [x] 12.4 Implementar atualização de project.yaml
- [x] 12.5 Implementar atualização de custom-instance.ts
- [x] 12.6 Implementar execução do Orval para novo domínio

## 13. Comando remove-domain (src/commands/remove-domain.ts)

- [x] 13.1 Implementar parsing de argumento (name)
- [x] 13.2 Implementar validação de domínio existente
- [x] 13.3 Implementar prompt de confirmação
- [x] 13.4 Implementar remoção de entradas em orval.config.ts
- [x] 13.5 Implementar remoção de entradas em project.yaml
- [x] 13.6 Implementar remoção de função em custom-instance.ts
- [x] 13.7 Implementar deleção da pasta de hooks gerados

## 14. Comando generate-hooks (src/commands/generate-hooks.ts)

- [x] 14.1 Implementar verificação de orval.config.ts
- [x] 14.2 Implementar execução de npx orval
- [x] 14.3 Implementar exibição de domínios atualizados

## 15. Comando conventions (src/commands/conventions.ts)

- [x] 15.1 Implementar subcomando edit (abrir no editor)
- [x] 15.2 Implementar subcomando apply (regenerar copilot-instructions.md)
- [x] 15.3 Implementar subcomando show (exibir convenções no terminal)
- [x] 15.4 Implementar detecção de editor (code, $EDITOR)

## 16. Comando doctor (src/commands/doctor.ts)

- [x] 16.1 Implementar verificação de Node.js (versão >= 18)
- [x] 16.2 Implementar verificação de arquivos de configuração
- [x] 16.3 Implementar verificação de OpenAPI specs
- [x] 16.4 Implementar verificação de hooks gerados
- [x] 16.5 Implementar verificação de skills
- [x] 16.6 Implementar verificação de agent
- [x] 16.7 Implementar verificação de Figma (se habilitado)
- [x] 16.8 Implementar formatação de output com checklist

## 17. Comando status (src/commands/status.ts)

- [x] 17.1 Implementar listagem de domínios com status de hooks
- [x] 17.2 Implementar detecção de hooks desatualizados (comparar timestamps)
- [x] 17.3 Implementar listagem de skills instaladas
- [x] 17.4 Implementar resumo de problemas do doctor

## 18. Comando update (src/commands/update.ts)

- [x] 18.1 Implementar sobrescrita de skills
- [x] 18.2 Implementar sobrescrita de agent
- [x] 18.3 Implementar sobrescrita de scripts
- [x] 18.4 Implementar regeneração de copilot-instructions.md
- [x] 18.5 Implementar preservação de configs do dev
- [x] 18.6 Implementar exibição de diff de versões

## 19. Testes Unitários (tests/utils/)

- [x] 19.1 Criar testes para detect.ts (detecção de padrões)
- [x] 19.2 Criar testes para merge.ts (merge de JSON/YAML)
- [x] 19.3 Criar testes para scaffold.ts (renderização de templates)
- [x] 19.4 Criar testes para deps.ts (detecção de package manager)

## 20. Testes de Integração (tests/commands/)

- [x] 20.1 Criar fixture react-tailwind (repo React + Tailwind)
- [x] 20.2 Criar fixture next-styled (repo Next.js + Styled Components)
- [x] 20.3 Criar fixture react-legacy-mixed (repo React legado com padrões mistos)
- [x] 20.4 Criar testes para comando init
- [x] 20.5 Criar testes para comando add-domain
- [x] 20.6 Criar testes para comando doctor
- [x] 20.7 Criar testes para idempotência (rodar init duas vezes)

## 21. Documentação e Build

- [x] 21.1 Criar README.md com instruções de uso
- [x] 21.2 Configurar scripts de build (tsc)
- [x] 21.3 Configurar scripts de teste (vitest)
- [x] 21.4 Testar execução via npx em repo de exemplo
