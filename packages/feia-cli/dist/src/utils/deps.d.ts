/**
 * Módulo de gerenciamento de dependências
 * Detecção de package manager e instalação de dependências
 */
/**
 * Package managers suportados
 */
type PackageManager = 'npm' | 'pnpm' | 'yarn';
/**
 * 8.1 Detecta o package manager do projeto
 * Ordem de prioridade: pnpm-lock.yaml > yarn.lock > package-lock.json > default npm
 */
export declare function detectPackageManager(cwd?: string): Promise<PackageManager>;
/**
 * 8.2 Instala dependências de produção
 */
export declare function installProdDependencies(cwd?: string, pm?: PackageManager): Promise<boolean>;
/**
 * 8.3 Instala dependências de desenvolvimento
 */
export declare function installDevDependencies(cwd?: string, pm?: PackageManager): Promise<boolean>;
/**
 * Instala todas as dependências (produção e desenvolvimento)
 */
export declare function installDependencies(cwd?: string): Promise<boolean>;
/**
 * Instala uma dependência específica
 */
export declare function installDependency(name: string, isDev?: boolean, cwd?: string): Promise<boolean>;
export {};
//# sourceMappingURL=deps.d.ts.map