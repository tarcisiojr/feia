/**
 * Comando add-domain - Adiciona um novo domínio de API ao projeto
 */
import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { updateOrvalConfig, updateProjectYaml, updateCustomInstance } from '../utils/domain.js';
import { runOrval } from '../utils/exec.js';
export const addDomainCommand = new Command('add-domain')
    .description('Adiciona um novo domínio de API ao projeto')
    .argument('<name>', 'Nome do domínio (ex: orders, inventory)')
    .requiredOption('--spec <path>', 'Caminho do arquivo OpenAPI spec')
    .requiredOption('--base-url <url>', 'Base URL do domínio (ex: /api/orders)')
    .action(async (name, options) => {
    // Valida diretório de trabalho
    if (!validateWorkingDirectory()) {
        process.exit(1);
    }
    const cwd = process.cwd();
    try {
        // Verifica se orval.config.ts existe
        const orvalConfigPath = path.join(cwd, 'orval.config.ts');
        if (!fs.existsSync(orvalConfigPath)) {
            logger.error('Arquivo orval.config.ts não encontrado. Execute "feia init" primeiro.');
            process.exit(1);
        }
        // Verifica se domínio já existe
        const orvalContent = await fs.readFile(orvalConfigPath, 'utf-8');
        if (orvalContent.includes(`${name}:`)) {
            logger.error(`Domínio '${name}' já existe. Use remove-domain primeiro.`);
            process.exit(1);
        }
        // Verifica se spec existe
        const specPath = path.join(cwd, options.spec);
        if (!fs.existsSync(specPath)) {
            logger.warn(`Arquivo spec não encontrado: ${options.spec}`);
            logger.info('O Orval irá falhar se o spec não existir no momento da geração');
        }
        logger.info(`Adicionando domínio: ${name}`);
        // Atualiza orval.config.ts
        logger.step(1, 4, 'Atualizando orval.config.ts...');
        await updateOrvalConfig(name, options.spec, options.baseUrl);
        logger.success('orval.config.ts atualizado');
        // Atualiza project.yaml
        logger.step(2, 4, 'Atualizando project.yaml...');
        await updateProjectYaml(name, options.spec, options.baseUrl);
        logger.success('project.yaml atualizado');
        // Atualiza custom-instance.ts
        logger.step(3, 4, 'Atualizando custom-instance.ts...');
        await updateCustomInstance(name, options.baseUrl);
        logger.success('custom-instance.ts atualizado');
        // Executa Orval para o novo domínio
        logger.step(4, 4, 'Gerando hooks com Orval...');
        const success = await runOrval();
        if (success) {
            logger.success('Hooks gerados com sucesso');
        }
        else {
            logger.warn('Orval falhou - verifique seu spec OpenAPI');
        }
        logger.newLine();
        logger.success(`Domínio '${name}' adicionado com sucesso!`);
    }
    catch (error) {
        logger.error(`Erro ao adicionar domínio: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
//# sourceMappingURL=add-domain.js.map