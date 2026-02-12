/**
 * Módulo de scaffold - Geração de arquivos via templates e cópia de estáticos
 */
import fs from 'fs-extra';
import path from 'node:path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { mergeJson } from './merge.js';
import { logger } from './logger.js';
// Obtém diretório de templates
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
/**
 * Mapa de arquivos para categorias de idempotência
 */
const FILE_CATEGORIES = {
    // SOBRESCREVE: Skills, Agent, scripts
    '.github/skills/': 'overwrite',
    '.github/agents/': 'overwrite',
    '.github/instructions/': 'overwrite',
    // PRESERVA: configs do dev
    'frontendspec/conventions.yaml': 'preserve',
    'frontendspec/project.yaml': 'preserve',
    'orval.config.ts': 'preserve',
    'src/api/custom-instance.ts': 'preserve',
    // MERGE: settings do VSCode
    '.vscode/settings.json': 'merge',
};
/**
 * Determina a categoria de um arquivo para idempotência
 */
function getFileCategory(filePath) {
    for (const [pattern, category] of Object.entries(FILE_CATEGORIES)) {
        if (filePath.includes(pattern)) {
            return category;
        }
    }
    return 'overwrite'; // default: sobrescreve
}
/**
 * 6.4 Registra helpers Handlebars customizados
 */
function registerHandlebarsHelpers() {
    // Helper para verificar igualdade
    Handlebars.registerHelper('eq', (a, b) => a === b);
    // Helper para verificar se array tem itens
    Handlebars.registerHelper('hasItems', (arr) => arr && arr.length > 0);
    // Helper para converter para camelCase
    Handlebars.registerHelper('camelCase', (str) => {
        return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    });
    // Helper para converter para PascalCase
    Handlebars.registerHelper('pascalCase', (str) => {
        const camel = str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    });
    // Helper para gerar comentário de baixa confiança
    Handlebars.registerHelper('lowConfidenceComment', (confidence) => {
        return confidence === 'low' ? ' # \u26a0\ufe0f detectado com baixa confian\u00e7a \u2014 revise' : '';
    });
    // Helper para JSON stringify
    Handlebars.registerHelper('json', (obj) => JSON.stringify(obj, null, 2));
    // Helper para iteração com índice
    Handlebars.registerHelper('eachWithIndex', function (context, options) {
        let result = '';
        for (let i = 0; i < context.length; i++) {
            const item = context[i] ?? {};
            result += options.fn({ ...item, _index: i, _first: i === 0, _last: i === context.length - 1 });
        }
        return result;
    });
}
// Registra helpers na inicialização do módulo
registerHandlebarsHelpers();
/**
 * 6.1 Renderiza um template Handlebars
 */
export async function renderTemplate(templateName, data) {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(data);
}
/**
 * 6.2 Copia um arquivo estático do templates para o destino
 */
export async function copyStaticFile(sourcePath, destPath, executable = false) {
    const fullSourcePath = path.join(TEMPLATES_DIR, sourcePath);
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(fullSourcePath, destPath);
    if (executable) {
        await fs.chmod(destPath, 0o755);
    }
}
/**
 * 6.3 Escreve arquivo com lógica de idempotência
 */
export async function writeFileIdempotent(filePath, content, category) {
    const effectiveCategory = category ?? getFileCategory(filePath);
    const exists = await fs.pathExists(filePath);
    if (exists && effectiveCategory === 'preserve') {
        // Não sobrescreve arquivos preservados
        return false;
    }
    if (exists && effectiveCategory === 'merge' && filePath.endsWith('.json')) {
        // Faz merge de arquivos JSON
        const existingContent = await fs.readFile(filePath, 'utf-8');
        const existingJson = JSON.parse(existingContent);
        const newJson = JSON.parse(content);
        const merged = mergeJson(existingJson, newJson);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, JSON.stringify(merged, null, 2));
        return true;
    }
    // Sobrescreve ou cria novo arquivo
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    return true;
}
/**
 * Prepara dados para os templates
 */
function prepareTemplateData(config, detected) {
    return {
        // Configuração do projeto
        projectName: config.name,
        framework: config.framework,
        domains: config.domains,
        figma: config.figma,
        paths: config.paths,
        // Convenções detectadas
        stack: {
            framework: detected.framework.value,
            frameworkConfidence: detected.framework.confidence,
            css: detected.css.value,
            cssConfidence: detected.css.confidence,
            testRunner: detected.testRunner.value,
            testRunnerConfidence: detected.testRunner.confidence,
            linter: detected.linter.value,
            linterConfidence: detected.linter.confidence,
            formatter: detected.formatter.value,
            formatterConfidence: detected.formatter.confidence,
            forms: detected.forms.value,
            formsConfidence: detected.forms.confidence,
            validation: detected.validation.value,
            validationConfidence: detected.validation.confidence,
            globalState: detected.globalState.value,
            globalStateConfidence: detected.globalState.confidence,
        },
        naming: {
            files: detected.namingFiles.value,
            filesConfidence: detected.namingFiles.confidence,
            components: detected.namingComponents.value,
            componentsConfidence: detected.namingComponents.confidence,
        },
        imports: {
            alias: detected.pathAlias,
            barrelFiles: detected.barrelFiles,
        },
        components: {
            declaration: detected.componentDeclaration.value,
            declarationConfidence: detected.componentDeclaration.confidence,
            exportStyle: detected.exportStyle.value,
            exportStyleConfidence: detected.exportStyle.confidence,
        },
    };
}
/**
 * Copia skills estáticas para o projeto
 */
export async function copyStaticSkills(cwd) {
    const staticSkills = [
        { src: 'github/skills/figma-extraction/SKILL.md', dest: '.github/skills/figma-extraction/SKILL.md' },
        { src: 'github/skills/orval-hooks/SKILL.md', dest: '.github/skills/orval-hooks/SKILL.md' },
        { src: 'github/skills/frontend-spec/SKILL.md', dest: '.github/skills/frontend-spec/SKILL.md' },
        { src: 'github/skills/frontend-spec/examples/order-detail-spec.yaml', dest: '.github/skills/frontend-spec/examples/order-detail-spec.yaml' },
        { src: 'github/skills/validation-loop/SKILL.md', dest: '.github/skills/validation-loop/SKILL.md' },
    ];
    for (const skill of staticSkills) {
        const destPath = path.join(cwd, skill.dest);
        await copyStaticFile(skill.src, destPath);
    }
}
/**
 * Copia script de validação
 */
export async function copyValidateScript(cwd) {
    const destPath = path.join(cwd, '.github/skills/validation-loop/scripts/validate.sh');
    await copyStaticFile('github/skills/validation-loop/scripts/validate.sh', destPath, true);
}
/**
 * Copia e renderiza o agent
 */
export async function copyAgent(cwd, config) {
    const templateData = {
        domains: config.domains,
        projectName: config.name,
        paths: config.paths,
    };
    const content = await renderTemplate('github/agents/feia.agent.md.hbs', templateData);
    const destPath = path.join(cwd, '.github/agents/feia.agent.md');
    await writeFileIdempotent(destPath, content, 'overwrite');
}
/**
 * Regenera copilot-instructions.md a partir de conventions.yaml
 */
export async function regenerateCopilotInstructions(cwd = process.cwd()) {
    const conventionsPath = path.join(cwd, 'frontendspec', 'conventions.yaml');
    const conventionsContent = await fs.readFile(conventionsPath, 'utf-8');
    const conventions = YAML.parse(conventionsContent);
    const content = await renderTemplate('github/copilot-instructions.md.hbs', conventions);
    const destPath = path.join(cwd, '.github/copilot-instructions.md');
    await fs.ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, content);
}
/**
 * Função principal de scaffold do projeto
 */
export async function scaffoldProject(config, detected) {
    const cwd = process.cwd();
    const data = prepareTemplateData(config, detected);
    // 1. Arquivos dinâmicos (templates .hbs)
    const dynamicFiles = [
        { template: 'orval.config.ts.hbs', dest: 'orval.config.ts' },
        { template: 'frontendspec/conventions.yaml.hbs', dest: 'frontendspec/conventions.yaml' },
        { template: 'frontendspec/project.yaml.hbs', dest: 'frontendspec/project.yaml' },
        { template: 'api/custom-instance.ts.hbs', dest: 'src/api/custom-instance.ts' },
        { template: 'github/copilot-instructions.md.hbs', dest: '.github/copilot-instructions.md' },
        { template: 'github/agents/feia.agent.md.hbs', dest: '.github/agents/feia.agent.md' },
        { template: 'github/skills/react-page-generation/SKILL.md.hbs', dest: '.github/skills/react-page-generation/SKILL.md' },
        { template: 'github/instructions/new-features.instructions.md.hbs', dest: '.github/instructions/new-features.instructions.md' },
    ];
    for (const file of dynamicFiles) {
        try {
            const content = await renderTemplate(file.template, data);
            const destPath = path.join(cwd, file.dest);
            const written = await writeFileIdempotent(destPath, content);
            if (!written) {
                logger.info(`Preservado: ${file.dest}`);
            }
        }
        catch (error) {
            logger.warn(`Falha ao gerar ${file.dest}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    // 2. Skills estáticas
    await copyStaticSkills(cwd);
    await copyValidateScript(cwd);
    // 3. VSCode settings (com Figma MCP se habilitado)
    if (config.figma.enabled) {
        const vscodeSettings = {
            'mcp.servers': {
                figma: {
                    command: 'npx',
                    args: ['-y', 'figma-mcp'],
                    env: {
                        FIGMA_ACCESS_TOKEN: `\${env:${config.figma.envVar}}`,
                    },
                },
            },
        };
        const destPath = path.join(cwd, '.vscode/settings.json');
        await writeFileIdempotent(destPath, JSON.stringify(vscodeSettings, null, 2));
    }
}
//# sourceMappingURL=scaffold.js.map