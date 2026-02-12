/**
 * Módulo de gerenciamento de dependências
 * Detecção de package manager e instalação de dependências
 */
import fs from 'fs-extra';
import path from 'node:path';
import { execa } from 'execa';
import { logger } from './logger.js';
/**
 * Dependências de produção a serem instaladas pelo init
 */
const PROD_DEPENDENCIES = [
    '@tanstack/react-query',
];
/**
 * Dependências de desenvolvimento a serem instaladas pelo init
 */
const DEV_DEPENDENCIES = [
    'orval',
    'zod',
    'vitest',
    '@testing-library/react',
];
/**
 * 8.1 Detecta o package manager do projeto
 * Ordem de prioridade: pnpm-lock.yaml > yarn.lock > package-lock.json > default npm
 */
export async function detectPackageManager(cwd = process.cwd()) {
    // Verifica lockfiles na ordem de prioridade
    if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }
    // package-lock.json ou default
    return 'npm';
}
/**
 * Retorna o comando de instalação para o package manager
 */
function getInstallCommand(pm, isDev) {
    switch (pm) {
        case 'pnpm':
            return {
                command: 'pnpm',
                args: isDev ? ['add', '-D'] : ['add'],
            };
        case 'yarn':
            return {
                command: 'yarn',
                args: isDev ? ['add', '-D'] : ['add'],
            };
        case 'npm':
        default:
            return {
                command: 'npm',
                args: isDev ? ['install', '-D'] : ['install'],
            };
    }
}
/**
 * 8.2 Instala dependências de produção
 */
export async function installProdDependencies(cwd = process.cwd(), pm) {
    const packageManager = pm ?? await detectPackageManager(cwd);
    const { command, args } = getInstallCommand(packageManager, false);
    try {
        logger.info(`Instalando dependências de produção com ${packageManager}...`);
        await execa(command, [...args, ...PROD_DEPENDENCIES], {
            cwd,
            stdio: 'inherit',
        });
        return true;
    }
    catch (error) {
        logger.error(`Falha ao instalar dependências: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
/**
 * 8.3 Instala dependências de desenvolvimento
 */
export async function installDevDependencies(cwd = process.cwd(), pm) {
    const packageManager = pm ?? await detectPackageManager(cwd);
    const { command, args } = getInstallCommand(packageManager, true);
    try {
        logger.info(`Instalando dependências de desenvolvimento com ${packageManager}...`);
        await execa(command, [...args, ...DEV_DEPENDENCIES], {
            cwd,
            stdio: 'inherit',
        });
        return true;
    }
    catch (error) {
        logger.error(`Falha ao instalar dependências: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
/**
 * Instala todas as dependências (produção e desenvolvimento)
 */
export async function installDependencies(cwd = process.cwd()) {
    const pm = await detectPackageManager(cwd);
    const prodSuccess = await installProdDependencies(cwd, pm);
    if (!prodSuccess) {
        return false;
    }
    const devSuccess = await installDevDependencies(cwd, pm);
    return devSuccess;
}
/**
 * Instala uma dependência específica
 */
export async function installDependency(name, isDev = false, cwd = process.cwd()) {
    const pm = await detectPackageManager(cwd);
    const { command, args } = getInstallCommand(pm, isDev);
    try {
        await execa(command, [...args, name], {
            cwd,
            stdio: 'inherit',
        });
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=deps.js.map