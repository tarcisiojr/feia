/**
 * Comando status - Exibe status do projeto FEIA
 */

import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { readProjectConfig } from '../utils/config.js';

export const statusCommand = new Command('status')
  .description('Exibe status do projeto FEIA')
  .action(async () => {
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const cwd = process.cwd();

    // Verifica se FEIA está configurado
    const conventionsPath = path.join(cwd, 'frontendspec', 'conventions.yaml');
    if (!fs.existsSync(conventionsPath)) {
      logger.warn('FEIA não está configurado neste projeto');
      logger.info("Execute 'feia init' para configurar");
      return;
    }

    logger.title('Status do Projeto FEIA');
    logger.newLine();

    // Lê configuração do projeto
    const projectConfig = await readProjectConfig();

    if (!projectConfig) {
      logger.error('Não foi possível ler project.yaml');
      return;
    }

    // Informações básicas
    console.log(chalk.bold('Projeto:'), chalk.cyan(projectConfig.name));
    console.log(chalk.bold('Framework:'), chalk.cyan(projectConfig.framework));

    // Status dos domínios
    if (projectConfig.domains && projectConfig.domains.length > 0) {
      console.log(chalk.bold('\nDomínios de API:'));

      for (const domain of projectConfig.domains) {
        const hooksPath = path.join(cwd, 'src', 'api', 'generated', domain.name);
        const specPath = path.join(cwd, domain.specPath);
        const hooksExist = fs.existsSync(hooksPath);
        const specExists = fs.existsSync(specPath);

        let status: string;
        let statusIcon: string;

        if (!specExists) {
          status = 'spec não encontrado';
          statusIcon = '❌';
        } else if (!hooksExist) {
          status = 'hooks ausentes';
          statusIcon = '❌';
        } else {
          // Verifica se hooks estão desatualizados
          const specStat = await fs.stat(specPath);
          const hooksStat = await fs.stat(hooksPath);

          if (specStat.mtime > hooksStat.mtime) {
            status = 'hooks desatualizados';
            statusIcon = '⚠️';
          } else {
            status = 'hooks gerados';
            statusIcon = '✅';
          }
        }

        console.log(`  ${statusIcon} ${chalk.cyan(domain.name)}: ${status}`);
      }
    } else {
      console.log(chalk.bold('\nDomínios de API:'), chalk.yellow('Nenhum configurado'));
    }

    // Status do Figma
    console.log(chalk.bold('\nFigma:'), projectConfig.figma?.enabled ? chalk.green('Habilitado') : chalk.gray('Desabilitado'));

    // Skills instaladas
    const skillsDir = path.join(cwd, '.github', 'skills');
    if (fs.existsSync(skillsDir)) {
      const skillFolders = await fs.readdir(skillsDir);
      const installedSkills = skillFolders.filter(folder => {
        const skillPath = path.join(skillsDir, folder, 'SKILL.md');
        return fs.existsSync(skillPath);
      });

      console.log(chalk.bold('\nSkills instaladas:'));
      for (const skill of installedSkills) {
        console.log(`  ✅ ${skill}`);
      }
    }

    // Agent
    const agentPath = path.join(cwd, '.github', 'agents', 'feia.agent.md');
    console.log(chalk.bold('\nAgent:'), fs.existsSync(agentPath) ? chalk.green('Instalado') : chalk.red('Não encontrado'));

    // Problemas resumidos
    const problems: string[] = [];

    if (projectConfig.domains) {
      for (const domain of projectConfig.domains) {
        const hooksPath = path.join(cwd, 'src', 'api', 'generated', domain.name);
        const specPath = path.join(cwd, domain.specPath);

        if (!fs.existsSync(specPath)) {
          problems.push(`Spec não encontrado: ${domain.specPath}`);
        } else if (!fs.existsSync(hooksPath)) {
          problems.push(`Hooks ausentes para: ${domain.name}`);
        }
      }
    }

    if (!fs.existsSync(agentPath)) {
      problems.push('Agent FEIA não instalado');
    }

    if (problems.length > 0) {
      console.log(chalk.bold.red('\nProblemas:'));
      for (const problem of problems.slice(0, 3)) {
        console.log(`  ❌ ${problem}`);
      }
      if (problems.length > 3) {
        console.log(`  ... e mais ${problems.length - 3} problemas`);
      }
      logger.newLine();
      logger.info("Execute 'feia doctor' para diagnóstico completo");
    }

    logger.newLine();
  });
