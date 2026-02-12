/**
 * Comando generate-hooks - Regenera hooks de todos os domínios
 */

import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { runOrval } from '../utils/exec.js';
import { readProjectConfig } from '../utils/config.js';

export const generateHooksCommand = new Command('generate-hooks')
  .description('Regenera hooks de todos os domínios via Orval')
  .action(async () => {
    // Valida diretório de trabalho
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const cwd = process.cwd();

    try {
      // Verifica se orval.config.ts existe
      const orvalConfigPath = path.join(cwd, 'orval.config.ts');
      if (!fs.existsSync(orvalConfigPath)) {
        logger.error("Nenhum domínio configurado. Use 'init' ou 'add-domain' primeiro.");
        process.exit(1);
      }

      // Lê project.yaml para listar domínios
      const projectConfig = await readProjectConfig();
      const domains = projectConfig?.domains ?? [];

      if (domains.length === 0) {
        logger.warn('Nenhum domínio encontrado em project.yaml');
      } else {
        logger.info(`Domínios configurados: ${domains.map(d => d.name).join(', ')}`);
      }

      logger.newLine();
      logger.step(1, 1, 'Executando Orval...');

      const success = await runOrval();

      if (success) {
        logger.newLine();
        logger.success('Hooks regenerados com sucesso!');

        if (domains.length > 0) {
          logger.title('Domínios atualizados:');
          for (const domain of domains) {
            logger.listItem(`${domain.name} → src/api/generated/${domain.name}/`);
          }
        }
      } else {
        logger.error('Orval falhou - verifique seus specs OpenAPI');
        process.exit(1);
      }

    } catch (error) {
      logger.error(`Erro ao gerar hooks: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
