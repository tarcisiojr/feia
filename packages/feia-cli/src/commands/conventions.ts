/**
 * Comando conventions - Gerencia convenções do projeto
 * Subcomandos: edit, apply, show
 */

import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { openInEditor } from '../utils/exec.js';
import { regenerateCopilotInstructions } from '../utils/scaffold.js';

export const conventionsCommand = new Command('conventions')
  .description('Gerencia convenções do projeto');

// Subcomando: edit
conventionsCommand
  .command('edit')
  .description('Abre conventions.yaml no editor')
  .action(async () => {
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const conventionsPath = path.join(process.cwd(), 'frontendspec', 'conventions.yaml');

    if (!fs.existsSync(conventionsPath)) {
      logger.error("Arquivo conventions.yaml não encontrado. Execute 'init' primeiro.");
      process.exit(1);
    }

    logger.info('Abrindo conventions.yaml no editor...');
    await openInEditor(conventionsPath);
  });

// Subcomando: apply
conventionsCommand
  .command('apply')
  .description('Regenera copilot-instructions.md a partir de conventions.yaml')
  .action(async () => {
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const conventionsPath = path.join(process.cwd(), 'frontendspec', 'conventions.yaml');

    if (!fs.existsSync(conventionsPath)) {
      logger.error("Arquivo conventions.yaml não encontrado. Execute 'init' primeiro.");
      process.exit(1);
    }

    try {
      logger.info('Regenerando copilot-instructions.md...');
      await regenerateCopilotInstructions();
      logger.success('copilot-instructions.md atualizado!');
      logger.info('As novas instruções serão usadas pelo GitHub Copilot');
    } catch (error) {
      logger.error(`Erro ao regenerar: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

// Subcomando: show
conventionsCommand
  .command('show')
  .description('Exibe convenções atuais no terminal')
  .action(async () => {
    if (!validateWorkingDirectory()) {
      process.exit(1);
    }

    const conventionsPath = path.join(process.cwd(), 'frontendspec', 'conventions.yaml');

    if (!fs.existsSync(conventionsPath)) {
      logger.error("Arquivo conventions.yaml não encontrado. Execute 'init' primeiro.");
      process.exit(1);
    }

    try {
      const content = await fs.readFile(conventionsPath, 'utf-8');
      const conventions = YAML.parse(content) as Record<string, unknown>;

      logger.title('Convenções do Projeto');
      logger.newLine();

      // Stack
      const stack = conventions['stack'] as Record<string, string> | undefined;
      if (stack) {
        console.log(chalk.bold('Stack:'));
        console.log(`  Framework:    ${chalk.cyan(stack['framework'] ?? 'não definido')}`);
        console.log(`  CSS:          ${chalk.cyan(stack['css'] ?? 'não definido')}`);
        console.log(`  Test Runner:  ${chalk.cyan(stack['testRunner'] ?? 'não definido')}`);
        console.log(`  Linter:       ${chalk.cyan(stack['linter'] ?? 'não definido')}`);
        console.log(`  Formatter:    ${chalk.cyan(stack['formatter'] ?? 'não definido')}`);
        console.log(`  Forms:        ${chalk.cyan(stack['forms'] ?? 'não definido')}`);
        console.log(`  Validation:   ${chalk.cyan(stack['validation'] ?? 'não definido')}`);
        console.log(`  Global State: ${chalk.cyan(stack['globalState'] ?? 'não definido')}`);
      }

      // Naming
      const naming = conventions['naming'] as Record<string, string> | undefined;
      if (naming) {
        console.log(chalk.bold('\nNaming:'));
        console.log(`  Files:        ${chalk.cyan(naming['files'] ?? 'não definido')}`);
        console.log(`  Components:   ${chalk.cyan(naming['components'] ?? 'não definido')}`);
        console.log(`  Hooks:        ${chalk.cyan(naming['hooks'] ?? 'não definido')}`);
        console.log(`  Types:        ${chalk.cyan(naming['types'] ?? 'não definido')}`);
      }

      // Paths
      const paths = conventions['paths'] as Record<string, string> | undefined;
      if (paths) {
        console.log(chalk.bold('\nPaths:'));
        console.log(`  Components:   ${chalk.cyan(paths['components'] ?? 'não definido')}`);
        console.log(`  Pages:        ${chalk.cyan(paths['pages'] ?? 'não definido')}`);
        console.log(`  Hooks:        ${chalk.cyan(paths['hooks'] ?? 'não definido')}`);
        console.log(`  Utils:        ${chalk.cyan(paths['utils'] ?? 'não definido')}`);
        console.log(`  Types:        ${chalk.cyan(paths['types'] ?? 'não definido')}`);
      }

      // Imports
      const imports = conventions['imports'] as Record<string, unknown> | undefined;
      if (imports) {
        console.log(chalk.bold('\nImports:'));
        console.log(`  Alias:        ${chalk.cyan(String(imports['alias'] ?? 'não definido'))}`);
        console.log(`  Barrel Files: ${chalk.cyan(String(imports['barrelFiles'] ?? 'não definido'))}`);
      }

      // Components
      const components = conventions['components'] as Record<string, string> | undefined;
      if (components) {
        console.log(chalk.bold('\nComponents:'));
        console.log(`  Declaration:  ${chalk.cyan(components['declaration'] ?? 'não definido')}`);
        console.log(`  Export Style: ${chalk.cyan(components['exportStyle'] ?? 'não definido')}`);
      }

      // Custom
      const custom = conventions['custom'] as string[] | undefined;
      if (custom && custom.length > 0) {
        console.log(chalk.bold('\nConvenções customizadas:'));
        for (const item of custom) {
          console.log(`  - ${chalk.cyan(item)}`);
        }
      }

      logger.newLine();

    } catch (error) {
      logger.error(`Erro ao ler convenções: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
