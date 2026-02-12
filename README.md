# FEIA - Frontend Engineering AI Assistant

CLI para configurar o accelerator FEIA em projetos React, automatizando convenções e integração com GitHub Copilot.

## Visão Geral

FEIA detecta automaticamente padrões do seu projeto React e configura:

- **Convenções de código** documentadas em YAML
- **Instruções para IA** (GitHub Copilot/Claude) personalizadas
- **Hooks React Query** gerados via Orval a partir de specs OpenAPI
- **Skills** reutilizáveis para assistentes de IA

## Instalação

### Via npm (quando publicado)

```bash
npm install -g feia-cli
```

### Desenvolvimento local

```bash
# Clonar e instalar
git clone https://github.com/seu-usuario/feia.git
cd feia/packages/feia-cli
npm install
npm run build

# Criar link global
npm link
```

Após o `npm link`, o comando `feia` estará disponível globalmente.

**Requisitos:** Node.js >= 18.0.0

## Início Rápido

```bash
# Na raiz do seu projeto React
feia init
```

O comando `init` executa um setup interativo:

1. Detecta framework, CSS, testes e outras ferramentas
2. Coleta informações sobre domínios de API
3. Gera arquivos de configuração
4. Instala dependências necessárias
5. Executa Orval para gerar hooks iniciais

## Comandos

| Comando | Descrição |
|---------|-----------|
| `feia init` | Setup interativo do projeto |
| `feia add-domain <nome>` | Adiciona novo domínio de API |
| `feia remove-domain <nome>` | Remove domínio existente |
| `feia generate-hooks` | Regenera hooks de todos os domínios |
| `feia conventions edit` | Abre conventions.yaml no editor |
| `feia conventions apply` | Regenera instruções do Copilot |
| `feia conventions show` | Exibe convenções no terminal |
| `feia doctor` | Diagnóstico da configuração |
| `feia status` | Status do projeto |
| `feia update` | Atualiza skills para versão mais recente |

## Detecção Automática

FEIA detecta automaticamente:

- **Framework:** React, Next.js, Vue
- **CSS:** Tailwind, Styled Components, Emotion, CSS Modules, Sass
- **Testes:** Vitest, Jest
- **Linter/Formatter:** ESLint, Prettier, Biome
- **Formulários:** React Hook Form, Formik
- **Validação:** Zod, Yup, Joi
- **Estado:** Zustand, Redux, Jotai, MobX
- **Padrões de código:** arrow functions, exports, nomenclatura

## Arquivos Gerados

```
projeto/
├── frontendspec/
│   ├── conventions.yaml     # Convenções do projeto
│   └── project.yaml         # Metadados
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   └── feia.agent.md
│   └── skills/
│       ├── figma-extraction/
│       ├── orval-hooks/
│       ├── frontend-spec/
│       ├── react-page-generation/
│       └── validation-loop/
├── src/api/
│   └── custom-instance.ts   # Instância Axios
└── orval.config.ts          # Configuração Orval
```

## Domínios de API

Gerencie múltiplos domínios de API com specs OpenAPI:

```bash
# Adicionar domínio
feia add-domain payments --spec ./specs/payments.yaml --base-url /api/payments

# Remover domínio
feia remove-domain payments

# Regenerar hooks após alterações nas specs
feia generate-hooks
```

## Convenções

O arquivo `frontendspec/conventions.yaml` documenta as convenções do projeto:

```yaml
code_style:
  component_declaration: arrow_function
  export_style: named
  naming:
    files: kebab-case
    components: PascalCase

patterns:
  forms: react-hook-form
  validation: zod
  state: zustand
```

Após editar, aplique as mudanças:

```bash
feia conventions apply
```

## Estrutura do Projeto

```
feia/
├── packages/
│   └── feia-cli/            # Pacote principal
│       ├── src/
│       │   ├── commands/    # Comandos CLI
│       │   ├── templates/   # Templates Handlebars
│       │   ├── types/       # Tipos TypeScript
│       │   └── utils/       # Utilitários
│       └── package.json
└── openspec/                # Especificações do projeto
    └── specs/
```

## Desenvolvimento

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/feia.git
cd feia/packages/feia-cli

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Build
npm run build
```

## Tecnologias

- **TypeScript** - Linguagem principal
- **Commander** - Parser de comandos
- **Inquirer** - Prompts interativos
- **Handlebars** - Templates dinâmicos
- **Chalk** - Output colorido
- **Vitest** - Testes

## Licença

MIT
