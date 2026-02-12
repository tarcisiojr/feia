/**
 * Módulo de leitura de configuração do projeto
 */
import type { ProjectConfig } from '../types/index.js';
/**
 * Lê a configuração do projeto de frontendspec/project.yaml
 */
export declare function readProjectConfig(cwd?: string): Promise<ProjectConfig | null>;
/**
 * Escreve a configuração do projeto em frontendspec/project.yaml
 */
export declare function writeProjectConfig(config: ProjectConfig, cwd?: string): Promise<void>;
//# sourceMappingURL=config.d.ts.map