/**
 * Módulo de prompts interativos para coleta de configurações
 */

import inquirer from 'inquirer';
import path from 'node:path';
import type { DetectedConventions, ProjectConfig, Domain, ProjectPaths, Framework } from '../types/index.js';

/**
 * Interface para configuração de domínio coletada nos prompts
 */
interface DomainPromptResult {
  name: string;
  specPath: string;
  baseUrl: string;
}

/**
 * 5.1 Prompt de nome do projeto (com default = nome da pasta)
 */
async function promptProjectName(): Promise<string> {
  const defaultName = path.basename(process.cwd());

  const { name } = await inquirer.prompt<{ name: string }>([
    {
      type: 'input',
      name: 'name',
      message: 'Nome do projeto:',
      default: defaultName,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'O nome do projeto não pode ser vazio';
        }
        return true;
      },
    },
  ]);

  return name.trim();
}

/**
 * 5.2 Prompt de domínios de API (lista separada por vírgula)
 */
async function promptDomainNames(): Promise<string[]> {
  const { domains } = await inquirer.prompt<{ domains: string }>([
    {
      type: 'input',
      name: 'domains',
      message: 'Domínios de API (separados por vírgula, ex: orders, inventory):',
      default: '',
    },
  ]);

  if (!domains.trim()) {
    return [];
  }

  return domains
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(d => d.length > 0);
}

/**
 * 5.3 Prompts por domínio: spec path e base URL
 */
async function promptDomainDetails(domainNames: string[]): Promise<DomainPromptResult[]> {
  const domains: DomainPromptResult[] = [];

  for (const name of domainNames) {
    console.log(`\nConfigurando domínio: ${name}`);

    const answers = await inquirer.prompt<{ specPath: string; baseUrl: string }>([
      {
        type: 'input',
        name: 'specPath',
        message: `Path do OpenAPI spec para "${name}":`,
        default: `specs/${name}.yaml`,
        validate: (input: string) => {
          if (!input.trim()) {
            return 'O path do spec não pode ser vazio';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'baseUrl',
        message: `Base URL para "${name}":`,
        default: `/api/${name}`,
        validate: (input: string) => {
          if (!input.trim()) {
            return 'A base URL não pode ser vazia';
          }
          if (!input.startsWith('/')) {
            return 'A base URL deve começar com /';
          }
          return true;
        },
      },
    ]);

    domains.push({
      name,
      specPath: answers.specPath.trim(),
      baseUrl: answers.baseUrl.trim(),
    });
  }

  return domains;
}

/**
 * 5.4 Prompt de integração Figma (S/N) e nome da env var
 */
async function promptFigmaConfig(): Promise<{ enabled: boolean; envVar: string }> {
  const { figmaEnabled } = await inquirer.prompt<{ figmaEnabled: boolean }>([
    {
      type: 'confirm',
      name: 'figmaEnabled',
      message: 'Usar integração com Figma?',
      default: false,
    },
  ]);

  if (!figmaEnabled) {
    return { enabled: false, envVar: 'FIGMA_ACCESS_TOKEN' };
  }

  const { envVar } = await inquirer.prompt<{ envVar: string }>([
    {
      type: 'input',
      name: 'envVar',
      message: 'Nome da env var do token Figma:',
      default: 'FIGMA_ACCESS_TOKEN',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'O nome da env var não pode ser vazio';
        }
        if (!/^[A-Z][A-Z0-9_]*$/.test(input)) {
          return 'Use UPPER_SNAKE_CASE para nomes de variáveis de ambiente';
        }
        return true;
      },
    },
  ]);

  return { enabled: true, envVar: envVar.trim() };
}

/**
 * 5.5 Prompts de paths com defaults detectados
 */
async function promptPaths(detected: DetectedConventions): Promise<ProjectPaths> {
  const defaults = {
    components: detected.paths.components ?? 'src/components',
    pages: detected.paths.pages ?? 'src/pages',
    hooks: detected.paths.hooks ?? 'src/hooks',
    utils: detected.paths.utils ?? 'src/utils',
    types: detected.paths.types ?? 'src/types',
    api: detected.paths.api ?? 'src/api',
  };

  console.log('\nConfiguração de paths (pressione Enter para aceitar os defaults detectados):');

  const answers = await inquirer.prompt<ProjectPaths>([
    {
      type: 'input',
      name: 'components',
      message: 'Path de componentes:',
      default: defaults.components,
    },
    {
      type: 'input',
      name: 'pages',
      message: 'Path de páginas:',
      default: defaults.pages,
    },
    {
      type: 'input',
      name: 'hooks',
      message: 'Path de hooks:',
      default: defaults.hooks,
    },
    {
      type: 'input',
      name: 'utils',
      message: 'Path de utils:',
      default: defaults.utils,
    },
    {
      type: 'input',
      name: 'types',
      message: 'Path de types:',
      default: defaults.types,
    },
    {
      type: 'input',
      name: 'api',
      message: 'Path de api/services:',
      default: defaults.api,
    },
  ]);

  return {
    components: answers.components.trim(),
    pages: answers.pages.trim(),
    hooks: answers.hooks.trim(),
    utils: answers.utils.trim(),
    types: answers.types.trim(),
    api: answers.api.trim(),
  };
}

/**
 * Função principal que executa todos os prompts e retorna a configuração do projeto
 */
export async function runPrompts(detected: DetectedConventions): Promise<ProjectConfig> {
  // Coleta nome do projeto
  const name = await promptProjectName();

  // Coleta domínios de API
  const domainNames = await promptDomainNames();
  const domainDetails = await promptDomainDetails(domainNames);

  // Converte para formato Domain com generatedDir
  const domains: Domain[] = domainDetails.map(d => ({
    name: d.name,
    specPath: d.specPath,
    baseUrl: d.baseUrl,
    generatedDir: `src/api/generated/${d.name}`,
  }));

  // Coleta configuração Figma
  const figma = await promptFigmaConfig();

  // Coleta paths (com defaults da detecção)
  const paths = await promptPaths(detected);

  // Obtém framework detectado
  const framework: Framework = detected.framework.value;

  return {
    name,
    framework,
    domains,
    figma,
    paths,
  };
}
