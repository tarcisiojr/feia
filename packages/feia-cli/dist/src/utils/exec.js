/**
 * Módulo de execução de comandos externos
 * Orval, editor, e outros comandos
 */
import { execa } from 'execa';
import { logger } from './logger.js';
/**
 * Executa o Orval para gerar hooks React Query
 */
export async function runOrval(cwd = process.cwd()) {
    try {
        await execa('npx', ['orval'], {
            cwd,
            stdio: 'inherit',
        });
        return true;
    }
    catch (error) {
        const execaError = error;
        if (execaError.exitCode !== undefined) {
            logger.warn(`Orval falhou com código ${execaError.exitCode}`);
        }
        return false;
    }
}
/**
 * Detecta o editor disponível no sistema
 */
async function detectEditor() {
    // Tenta VS Code primeiro
    try {
        await execa('which', ['code']);
        return 'code';
    }
    catch {
        // code não encontrado
    }
    // Tenta Cursor
    try {
        await execa('which', ['cursor']);
        return 'cursor';
    }
    catch {
        // cursor não encontrado
    }
    // Fallback para $EDITOR
    const editor = process.env['EDITOR'];
    if (editor) {
        return editor;
    }
    return null;
}
/**
 * Abre um arquivo no editor configurado
 */
export async function openInEditor(filePath) {
    const editor = await detectEditor();
    if (!editor) {
        logger.info(`Revise as convenções em ${filePath}`);
        return false;
    }
    try {
        // Usa spawn para não bloquear
        await execa(editor, [filePath], {
            detached: true,
            stdio: 'ignore',
        });
        return true;
    }
    catch {
        logger.info(`Revise as convenções em ${filePath}`);
        return false;
    }
}
/**
 * Executa um comando npm script
 */
export async function runNpmScript(script, cwd = process.cwd()) {
    try {
        await execa('npm', ['run', script], {
            cwd,
            stdio: 'inherit',
        });
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=exec.js.map