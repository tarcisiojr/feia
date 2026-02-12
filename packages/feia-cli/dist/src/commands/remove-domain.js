/**
 * Comando remove-domain - Remove um domínio de API do projeto
 */
import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { removeFromOrvalConfig, removeFromProjectYaml, removeFromCustomInstance } from '../utils/domain.js';
export const removeDomainCommand = new Command('remove-domain')
    .description('Remove um domínio de API do projeto')
    .argument('<name>', 'Nome do domínio a remover')
    .option('-y, --yes', 'Confirma automaticamente sem perguntar')
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
            logger.error('Arquivo orval.config.ts não encontrado. Nenhum domínio configurado.');
            process.exit(1);
        }
        // Verifica se domínio existe
        const orvalContent = await fs.readFile(orvalConfigPath, 'utf-8');
        if (!orvalContent.includes(`${name}:`)) {
            logger.error(`Domínio '${name}' não encontrado`);
            process.exit(1);
        }
        // Confirmação
        const hooksDir = path.join(cwd, 'src', 'api', 'generated', name);
        const hooksDirExists = fs.existsSync(hooksDir);
        if (!options.yes) {
            const message = hooksDirExists
                ? `Isso removerá a pasta src/api/generated/${name}/. Continuar?`
                : `Remover configuração do domínio '${name}'?`;
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message,
                    default: false,
                },
            ]);
            if (!confirm) {
                logger.info('Operação cancelada');
                return;
            }
        }
        logger.info(`Removendo domínio: ${name}`);
        // Remove de orval.config.ts
        logger.step(1, 4, 'Removendo de orval.config.ts...');
        await removeFromOrvalConfig(name);
        logger.success('orval.config.ts atualizado');
        // Remove de project.yaml
        logger.step(2, 4, 'Removendo de project.yaml...');
        await removeFromProjectYaml(name);
        logger.success('project.yaml atualizado');
        // Remove de custom-instance.ts
        logger.step(3, 4, 'Removendo de custom-instance.ts...');
        await removeFromCustomInstance(name);
        logger.success('custom-instance.ts atualizado');
        // Remove pasta de hooks gerados
        logger.step(4, 4, 'Removendo hooks gerados...');
        if (hooksDirExists) {
            await fs.remove(hooksDir);
            logger.success(`Pasta ${hooksDir} removida`);
        }
        else {
            logger.info('Nenhuma pasta de hooks encontrada');
        }
        logger.newLine();
        logger.success(`Domínio '${name}' removido com sucesso!`);
    }
    catch (error) {
        logger.error(`Erro ao remover domínio: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
//# sourceMappingURL=remove-domain.js.map