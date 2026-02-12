/**
 * Comando update - Atualiza skills e agent para versão mais recente
 */

import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { copyStaticSkills, regenerateCopilotInstructions, copyAgent, copyValidateScript } from '../utils/scaffold.js';
import { readProjectConfig } from '../utils/config.js';

export const updateCommand = new Command('update')
  .description('Atualiza skills e agent para versão mais recente')
  .action(async () => {
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const cwd = process.cwd();

    // Verifica se FEIA está configurado
    const conventionsPath = path.join(cwd, 'frontendspec', 'conventions.yaml');
    if (!fs.existsSync(conventionsPath)) {
      logger.error("FEIA não está configurado neste projeto. Execute 'init' primeiro.");
      process.exit(1);
    }

    const projectConfig = await readProjectConfig();
    if (!projectConfig) {
      logger.error('Não foi possível ler project.yaml');
      process.exit(1);
    }

    logger.title('Atualizando FEIA');
    logger.newLine();

    const updatedFiles: string[] = [];

    try {
      // 1. Atualiza skills estáticas
      logger.step(1, 5, 'Atualizando skills...');
      await copyStaticSkills(cwd);
      updatedFiles.push(
        '.github/skills/figma-extraction/SKILL.md',
        '.github/skills/orval-hooks/SKILL.md',
        '.github/skills/frontend-spec/SKILL.md',
        '.github/skills/validation-loop/SKILL.md',
      );
      logger.success('Skills atualizadas');

      // 2. Atualiza agent
      logger.step(2, 5, 'Atualizando agent...');
      await copyAgent(cwd, projectConfig);
      updatedFiles.push('.github/agents/feia.agent.md');
      logger.success('Agent atualizado');

      // 3. Atualiza scripts
      logger.step(3, 5, 'Atualizando scripts...');
      await copyValidateScript(cwd);
      updatedFiles.push('.github/skills/validation-loop/scripts/validate.sh');
      logger.success('Scripts atualizados');

      // 4. Regenera copilot-instructions.md
      logger.step(4, 5, 'Regenerando copilot-instructions.md...');
      await regenerateCopilotInstructions();
      updatedFiles.push('.github/copilot-instructions.md');
      logger.success('copilot-instructions.md regenerado');

      // 5. Preserva configs do dev
      logger.step(5, 5, 'Verificando configs preservadas...');
      const preservedFiles = [
        'frontendspec/conventions.yaml',
        'frontendspec/project.yaml',
        'orval.config.ts',
        'src/api/custom-instance.ts',
      ];

      for (const file of preservedFiles) {
        const filePath = path.join(cwd, file);
        if (fs.existsSync(filePath)) {
          logger.listItem(`${file} (preservado)`, 'ok');
        }
      }

      logger.newLine();
      logger.success('FEIA atualizado com sucesso!');

      logger.title('Arquivos atualizados:');
      for (const file of updatedFiles) {
        console.log(`  - ${file}`);
      }

      logger.newLine();
      logger.info('Suas configurações em conventions.yaml e project.yaml foram preservadas');

    } catch (error) {
      logger.error(`Erro durante atualização: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
