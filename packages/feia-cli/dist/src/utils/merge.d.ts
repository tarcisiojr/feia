/**
 * Módulo de merge - Deep merge para JSON e YAML com backup
 */
/**
 * 7.1 Deep merge para objetos JSON
 * O objeto source é mesclado no target, preservando keys existentes do target
 */
export declare function mergeJson(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown>;
/**
 * 7.2 Deep merge para objetos YAML (usa mesma lógica do JSON)
 * Retorna string YAML com o resultado do merge
 */
export declare function mergeYaml(targetYaml: string, sourceYaml: string): string;
/**
 * 7.3 Cria backup de um arquivo antes de modificá-lo
 * O backup é criado com sufixo .backup e timestamp
 */
export declare function createBackup(filePath: string): Promise<string | null>;
/**
 * Lê um arquivo JSON, faz merge com novos dados, e escreve de volta
 * Cria backup antes de modificar se o arquivo existir
 */
export declare function mergeJsonFile(filePath: string, newData: Record<string, unknown>, createBackupFirst?: boolean): Promise<void>;
/**
 * Lê um arquivo YAML, faz merge com novos dados, e escreve de volta
 * Cria backup antes de modificar se o arquivo existir
 */
export declare function mergeYamlFile(filePath: string, newData: Record<string, unknown>, createBackupFirst?: boolean): Promise<void>;
//# sourceMappingURL=merge.d.ts.map