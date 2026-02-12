/**
 * Módulo de gerenciamento de domínios de API
 * Atualização de orval.config.ts, project.yaml, custom-instance.ts
 */
/**
 * Adiciona um novo domínio ao orval.config.ts
 */
export declare function updateOrvalConfig(name: string, specPath: string, baseUrl: string, cwd?: string): Promise<void>;
/**
 * Adiciona um novo domínio ao project.yaml
 */
export declare function updateProjectYaml(name: string, specPath: string, baseUrl: string, cwd?: string): Promise<void>;
/**
 * Adiciona uma nova instância ao custom-instance.ts
 */
export declare function updateCustomInstance(name: string, baseUrl: string, cwd?: string): Promise<void>;
/**
 * Remove um domínio do orval.config.ts
 */
export declare function removeFromOrvalConfig(name: string, cwd?: string): Promise<void>;
/**
 * Remove um domínio do project.yaml
 */
export declare function removeFromProjectYaml(name: string, cwd?: string): Promise<void>;
/**
 * Remove uma instância do custom-instance.ts
 */
export declare function removeFromCustomInstance(name: string, cwd?: string): Promise<void>;
//# sourceMappingURL=domain.d.ts.map