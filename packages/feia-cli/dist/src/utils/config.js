/**
 * Módulo de leitura de configuração do projeto
 */
import fs from 'fs-extra';
import path from 'node:path';
import YAML from 'yaml';
/**
 * Lê a configuração do projeto de frontendspec/project.yaml
 */
export async function readProjectConfig(cwd = process.cwd()) {
    const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');
    try {
        if (!await fs.pathExists(projectYamlPath)) {
            return null;
        }
        const content = await fs.readFile(projectYamlPath, 'utf-8');
        const yaml = YAML.parse(content);
        // Converte para ProjectConfig com defaults
        const domains = (yaml.domains ?? []).map(d => ({
            name: d.name,
            specPath: d.specPath,
            baseUrl: d.baseUrl,
            generatedDir: d.generatedDir ?? `src/api/generated/${d.name}`,
        }));
        const figma = {
            enabled: yaml.figma?.enabled ?? false,
            envVar: yaml.figma?.envVar ?? 'FIGMA_ACCESS_TOKEN',
        };
        const paths = {
            components: yaml.paths?.components ?? 'src/components',
            pages: yaml.paths?.pages ?? 'src/pages',
            hooks: yaml.paths?.hooks ?? 'src/hooks',
            utils: yaml.paths?.utils ?? 'src/utils',
            types: yaml.paths?.types ?? 'src/types',
            api: yaml.paths?.api ?? 'src/api',
        };
        return {
            name: yaml.name ?? path.basename(cwd),
            framework: (yaml.framework ?? 'react'),
            domains,
            figma,
            paths,
        };
    }
    catch {
        return null;
    }
}
/**
 * Escreve a configuração do projeto em frontendspec/project.yaml
 */
export async function writeProjectConfig(config, cwd = process.cwd()) {
    const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');
    const yaml = {
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
//# sourceMappingURL=config.js.map