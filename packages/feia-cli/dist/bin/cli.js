#!/usr/bin/env node
/**
 * CLI FEIA - Accelerator para projetos React com GitHub Copilot
 * Entry point principal do CLI
 */
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Importa comandos
import { initCommand } from '../src/commands/init.js';
import { addDomainCommand } from '../src/commands/add-domain.js';
import { removeDomainCommand } from '../src/commands/remove-domain.js';
import { generateHooksCommand } from '../src/commands/generate-hooks.js';
import { conventionsCommand } from '../src/commands/conventions.js';
import { doctorCommand } from '../src/commands/doctor.js';
import { statusCommand } from '../src/commands/status.js';
import { updateCommand } from '../src/commands/update.js';
// Obtém versão do package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
// Configuração do programa
const program = new Command();
program
    .name('feia')
    .version(packageJson.version)
    .description('CLI para configurar o accelerator FEIA em projetos React');
// Registra todos os comandos
program.addCommand(initCommand);
program.addCommand(addDomainCommand);
program.addCommand(removeDomainCommand);
program.addCommand(generateHooksCommand);
program.addCommand(conventionsCommand);
program.addCommand(doctorCommand);
program.addCommand(statusCommand);
program.addCommand(updateCommand);
// Trata comandos inválidos
program.on('command:*', () => {
    console.error(`Comando inválido: ${program.args.join(' ')}`);
    console.log('');
    console.log('Comandos disponíveis:');
    console.log('  init           Configura o accelerator FEIA no projeto');
    console.log('  add-domain     Adiciona um novo domínio de API');
    console.log('  remove-domain  Remove um domínio de API');
    console.log('  generate-hooks Regenera hooks de todos os domínios');
    console.log('  conventions    Gerencia convenções do projeto');
    console.log('  doctor         Verifica integridade da configuração');
    console.log('  status         Exibe status do projeto');
    console.log('  update         Atualiza skills e agent');
    console.log('');
    console.log('Execute "feia <comando> --help" para mais informações');
    process.exit(1);
});
// Parse argumentos
program.parse(process.argv);
//# sourceMappingURL=cli.js.map