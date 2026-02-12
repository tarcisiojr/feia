/**
 * Módulo de leitura de configuração do projeto
 */

import fs from 'fs-extra';
import path from 'node:path';
import YAML from 'yaml';
import type { ProjectConfig, Domain, FigmaConfig, ProjectPaths, Framework } from '../types/index.js';

/**
 * Interface para o formato do project.yaml
 */
interface ProjectYaml {
  name?: string;
  framework?: string;
  domains?: Array<{
    name: string;
    specPath: string;
    baseUrl: string;
    generatedDir?: string;
  }>;
  figma?: {
    enabled?: boolean;
    envVar?: string;
  };
  paths?: Partial<ProjectPaths>;
}

/**
 * Lê a configuração do projeto de frontendspec/project.yaml
 */
export async function readProjectConfig(cwd: string = process.cwd()): Promise<ProjectConfig | null> {
  const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');

  try {
    if (!await fs.pathExists(projectYamlPath)) {
      return null;
    }

    const content = await fs.readFile(projectYamlPath, 'utf-8');
    const yaml = YAML.parse(content) as ProjectYaml;

    // Converte para ProjectConfig com defaults
    const domains: Domain[] = (yaml.domains ?? []).map(d => ({
      name: d.name,
      specPath: d.specPath,
      baseUrl: d.baseUrl,
      generatedDir: d.generatedDir ?? `src/api/generated/${d.name}`,
    }));

    const figma: FigmaConfig = {
      enabled: yaml.figma?.enabled ?? false,
      envVar: yaml.figma?.envVar ?? 'FIGMA_ACCESS_TOKEN',
    };

    const paths: ProjectPaths = {
      components: yaml.paths?.components ?? 'src/components',
      pages: yaml.paths?.pages ?? 'src/pages',
      hooks: yaml.paths?.hooks ?? 'src/hooks',
      utils: yaml.paths?.utils ?? 'src/utils',
      types: yaml.paths?.types ?? 'src/types',
      api: yaml.paths?.api ?? 'src/api',
    };

    return {
      name: yaml.name ?? path.basename(cwd),
      framework: (yaml.framework ?? 'react') as Framework,
      domains,
      figma,
      paths,
    };
  } catch {
    return null;
  }
}

/**
 * Escreve a configuração do projeto em frontendspec/project.yaml
 */
export async function writeProjectConfig(
  config: ProjectConfig,
  cwd: string = process.cwd(),
): Promise<void> {
  const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');

  const yaml: ProjectYaml = {
    name: config.name,
    framework: config.framework,
    domains: config.domains.map(d => ({
      name: d.name,
      specPath: d.specPath,
      baseUrl: d.baseUrl,
      generatedDir: d.generatedDir,
    })),
    figma: {
      enabled: config.figma.enabled,
      envVar: config.figma.envVar,
    },
    paths: config.paths,
  };

  await fs.ensureDir(path.dirname(projectYamlPath));
  await fs.writeFile(projectYamlPath, YAML.stringify(yaml));
}
