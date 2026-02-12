/**
 * Módulo de execução de comandos externos
 * Orval, editor, e outros comandos
 */
/**
 * Executa o Orval para gerar hooks React Query
 */
export declare function runOrval(cwd?: string): Promise<boolean>;
/**
 * Abre um arquivo no editor configurado
 */
export declare function openInEditor(filePath: string): Promise<boolean>;
/**
 * Executa um comando npm script
 */
export declare function runNpmScript(script: string, cwd?: string): Promise<boolean>;
//# sourceMappingURL=exec.d.ts.map