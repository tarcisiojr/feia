/**
 * Utilitário para validação de diretório de trabalho
 */
/**
 * Verifica se o diretório atual é um projeto Node.js válido
 * Retorna true se package.json existe, false caso contrário
 */
export declare function isValidNodeProject(dir?: string): boolean;
/**
 * Valida diretório de trabalho e exibe erro se inválido
 * Retorna true se válido, false se inválido (com mensagem de erro)
 */
export declare function validateWorkingDirectory(dir?: string): boolean;
/**
 * Retorna o caminho do package.json do diretório atual
 */
export declare function getPackageJsonPath(dir?: string): string;
/**
 * Lê e retorna o package.json do diretório especificado
 */
export declare function readPackageJson(dir?: string): Promise<Record<string, unknown> | null>;
//# sourceMappingURL=workdir.d.ts.map