/**
 * Comando doctor - Verifica integridade da configuração FEIA
 */
import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { readProjectConfig } from '../utils/config.js';
export const doctorCommand = new Command('doctor')
    .description('Verifica integridade da configuração FEIA')
    .action(async () => {
    if (!validateWorkingDirectory()) {
        process.exit(1);
    }
    const cwd = process.cwd();
    const checks = [];
    logger.title('FEIA Doctor - Verificação de Integridade');
    logger.newLine();
    // 1. Verificação de Node.js
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0] ?? '0', 10);
    checks.push({
        name: 'Node.js >= 18',
        passed: majorVersion >= 18,
        message: majorVersion >= 18
            ? `Node.js ${nodeVersion}`
            : `Node.js ${nodeVersion} (requer >= 18.0.0)`,
    });
    // 2. Verificação de arquivos de configuração
    const configFiles = [
        { path: 'frontendspec/conventions.yaml', name: 'conventions.yaml' },
        { path: 'frontendspec/project.yaml', name: 'project.yaml' },
        { path: 'orval.config.ts', name: 'orval.config.ts' },
    ];
    for (const file of configFiles) {
        const filePath = path.join(cwd, file.path);
        const exists = fs.existsSync(filePath);
        checks.push({
            name: file.name,
            passed: exists,
            message: exists ? 'Encontrado' : 'Não encontrado',
        });
    }
    // 3. Verificação de OpenAPI specs
    const projectConfig = await readProjectConfig();
    if (projectConfig?.domains) {
        for (const domain of projectConfig.domains) {
            const specPath = path.join(cwd, domain.specPath);
            const exists = fs.existsSync(specPath);
            checks.push({
                name: `OpenAPI spec: ${domain.name}`,
                passed: exists,
                message: exists ? domain.specPath : `${domain.specPath} não encontrado`,
            });
            // Verificação de hooks gerados
            const hooksPath = path.join(cwd, 'src', 'api', 'generated', domain.name);
            const hooksExist = fs.existsSync(hooksPath);
            checks.push({
                name: `Hooks: ${domain.name}`,
                passed: hooksExist,
                message: hooksExist ? 'Gerados' : 'Não encontrados - execute generate-hooks',
            });
        }
    }
    // 4. Verificação de skills
    const skills = [
        'figma-extraction',
        'orval-hooks',
        'frontend-spec',
        'react-page-generation',
        'validation-loop',
    ];
    for (const skill of skills) {
        const skillPath = path.join(cwd, '.github', 'skills', skill, 'SKILL.md');
        const exists = fs.existsSync(skillPath);
        checks.push({
            name: `Skill: ${skill}`,
            passed: exists,
            message: exists ? 'Instalada' : 'Não encontrada',
        });
    }
    // 5. Verificação de agent
    const agentPath = path.join(cwd, '.github', 'agents', 'feia.agent.md');
    const agentExists = fs.existsSync(agentPath);
    checks.push({
        name: 'Agent FEIA',
        passed: agentExists,
        message: agentExists ? 'Encontrado' : 'Não encontrado',
    });
    // 6. Verificação de Figma (se habilitado)
    if (projectConfig?.figma?.enabled) {
        const vscodeSettingsPath = path.join(cwd, '.vscode', 'settings.json');
        let figmaMcpConfigured = false;
        if (fs.existsSync(vscodeSettingsPath)) {
            try {
                const settings = await fs.readJson(vscodeSettingsPath);
                const mcpServers = settings['mcp.servers'];
                figmaMcpConfigured = mcpServers?.['figma'] !== undefined;
            }
            catch {
                figmaMcpConfigured = false;
            }
        }
        checks.push({
            name: 'Figma MCP Server',
            passed: figmaMcpConfigured,
            message: figmaMcpConfigured ? 'Configurado em .vscode/settings.json' : 'Não configurado',
        });
        const envVarName = projectConfig.figma.envVar ?? 'FIGMA_ACCESS_TOKEN';
        const envVarSet = process.env[envVarName] !== undefined;
        checks.push({
            name: `Env var: ${envVarName}`,
            passed: envVarSet,
            message: envVarSet ? 'Definida' : 'Não definida',
        });
    }
    // Exibe resultados
    logger.title('Resultados:');
    let passedCount = 0;
    let failedCount = 0;
    for (const check of checks) {
        if (check.passed) {
            passedCount++;
            logger.listItem(`${check.name}: ${check.message}`, 'ok');
        }
        else {
            failedCount++;
            logger.listItem(`${check.name}: ${check.message}`, 'error');
        }
    }
    logger.newLine();
    if (failedCount === 0) {
        logger.success(`Todas as ${passedCount} verificações passaram!`);
    }
    else {
        logger.warn(`${passedCount} verificações OK, ${failedCount} problemas encontrados`);
        logger.info("Execute 'feia init' ou 'feia update' para corrigir problemas");
    }
});
//# sourceMappingURL=doctor.js.map