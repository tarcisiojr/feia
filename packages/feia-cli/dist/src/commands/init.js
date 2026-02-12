/**
 * Comando init - Configura o accelerator FEIA no projeto
 * Fluxo: detect → prompts → scaffold → deps → orval → editor
 */
import { Command } from 'commander';
import { validateWorkingDirectory } from '../utils/workdir.js';
import { logger } from '../utils/logger.js';
import { detectConventions } from '../utils/detect.js';
import { runPrompts } from '../utils/prompts.js';
import { scaffoldProject } from '../utils/scaffold.js';
import { installDependencies } from '../utils/deps.js';
import { runOrval, openInEditor } from '../utils/exec.js';
export const initCommand = new Command('init')
    .description('Configura o accelerator FEIA no projeto React')
    .option('--skip-deps', 'Pular instalação de dependências')
    .option('--skip-orval', 'Pular execução do Orval')
    .option('--skip-editor', 'Não abrir conventions.yaml no editor')
    .action(async (options) => {
    // Valida diretório de trabalho
    if (!validateWorkingDirectory()) {
        process.exit(1);
    }
    const totalSteps = 6;
    let currentStep = 0;
    try {
        // Etapa 1: Detecção de padrões
        currentStep++;
        logger.step(currentStep, totalSteps, 'Detectando padrões do projeto...');
        const detected = await detectConventions();
        logger.success('Padrões detectados com sucesso');
        // Etapa 2: Prompts interativos
        currentStep++;
        logger.step(currentStep, totalSteps, 'Coletando informações do projeto...');
        const config = await runPrompts(detected);
        logger.success('Configurações coletadas');
        // Etapa 3: Geração de arquivos
        currentStep++;
        logger.step(currentStep, totalSteps, 'Gerando arquivos de configuração...');
        await scaffoldProject(config, detected);
        logger.success('Arquivos gerados com sucesso');
        // Etapa 4: Instalação de dependências
        if (!options.skipDeps) {
            currentStep++;
            logger.step(currentStep, totalSteps, 'Instalando dependências...');
            await installDependencies();
            logger.success('Dependências instaladas');
        }
        else {
            currentStep++;
            logger.step(currentStep, totalSteps, 'Pulando instalação de dependências (--skip-deps)');
        }
        // Etapa 5: Execução do Orval
        if (!options.skipOrval && config.domains.length > 0) {
            currentStep++;
            logger.step(currentStep, totalSteps, 'Gerando hooks com Orval...');
            const orvalSuccess = await runOrval();
            if (orvalSuccess) {
                logger.success('Hooks gerados com sucesso');
            }
            else {
                logger.warn('Orval falhou - verifique seus specs OpenAPI');
            }
        }
        else {
            currentStep++;
            if (options.skipOrval) {
                logger.step(currentStep, totalSteps, 'Pulando execução do Orval (--skip-orval)');
            }
            else {
                logger.step(currentStep, totalSteps, 'Nenhum domínio configurado, pulando Orval');
            }
        }
        // Etapa 6: Abrir editor
        if (!options.skipEditor) {
            currentStep++;
            logger.step(currentStep, totalSteps, 'Abrindo conventions.yaml no editor...');
            await openInEditor('frontendspec/conventions.yaml');
        }
        else {
            currentStep++;
            logger.step(currentStep, totalSteps, 'Pulando abertura do editor (--skip-editor)');
        }
        logger.newLine();
        logger.success('FEIA configurado com sucesso!');
        logger.info('Revise as convenções em frontendspec/conventions.yaml');
        logger.info('Após editar, execute "feia conventions apply" para atualizar as instruções do Copilot');
    }
    catch (error) {
        logger.error(`Erro durante inicialização: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
//# sourceMappingURL=init.js.map