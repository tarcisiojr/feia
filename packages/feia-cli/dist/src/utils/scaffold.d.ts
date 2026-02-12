/**
 * Módulo de scaffold - Geração de arquivos via templates e cópia de estáticos
 */
import type { ProjectConfig, DetectedConventions } from '../types/index.js';
/**
 * Categorias de comportamento para idempotência
 */
type FileCategory = 'overwrite' | 'preserve' | 'merge';
/**
 * 6.1 Renderiza um template Handlebars
 */
export declare function renderTemplate(templateName: string, data: Record<string, unknown>): Promise<string>;
/**
 * 6.2 Copia um arquivo estático do templates para o destino
 */
export declare function copyStaticFile(sourcePath: string, destPath: string, executable?: boolean): Promise<void>;
/**
 * 6.3 Escreve arquivo com lógica de idempotência
 */
export declare function writeFileIdempotent(filePath: string, content: string, category?: FileCategory): Promise<boolean>;
/**
 * Copia skills estáticas para o projeto
 */
export declare function copyStaticSkills(cwd: string): Promise<void>;
/**
 * Copia script de validação
 */
export declare function copyValidateScript(cwd: string): Promise<void>;
/**
 * Copia e renderiza o agent
 */
export declare function copyAgent(cwd: string, config: ProjectConfig): Promise<void>;
/**
 * Regenera copilot-instructions.md a partir de conventions.yaml
 */
export declare function regenerateCopilotInstructions(cwd?: string): Promise<void>;
/**
 * Função principal de scaffold do projeto
 */
export declare function scaffoldProject(config: ProjectConfig, detected: DetectedConventions): Promise<void>;
export {};
//# sourceMappingURL=scaffold.d.ts.map