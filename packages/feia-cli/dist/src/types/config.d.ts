/**
 * Tipos relacionados à configuração do projeto FEIA
 */
import type { Framework } from './conventions.js';
/**
 * Configuração de um domínio de API
 */
export interface Domain {
    /** Nome do domínio (ex: orders, inventory) */
    name: string;
    /** Caminho do arquivo OpenAPI spec */
    specPath: string;
    /** Base URL do domínio (ex: /api/orders) */
    baseUrl: string;
    /** Diretório onde os hooks são gerados */
    generatedDir: string;
}
/**
 * Configuração de integração com Figma
 */
export interface FigmaConfig {
    /** Se integração com Figma está habilitada */
    enabled: boolean;
    /** Nome da variável de ambiente do token */
    envVar: string;
}
/**
 * Paths configurados do projeto
 */
export interface ProjectPaths {
    components: string;
    pages: string;
    hooks: string;
    utils: string;
    types: string;
    api: string;
}
/**
 * Configuração completa do projeto
 */
export interface ProjectConfig {
    /** Nome do projeto */
    name: string;
    /** Framework detectado/configurado */
    framework: Framework;
    /** Lista de domínios de API configurados */
    domains: Domain[];
    /** Configuração de integração Figma */
    figma: FigmaConfig;
    /** Paths do projeto */
    paths: ProjectPaths;
}
/**
 * Configuração coletada dos prompts (antes de merge com detecção)
 */
export interface PromptConfig {
    /** Nome do projeto */
    name: string;
    /** Lista de domínios informados */
    domains: Array<{
        name: string;
        specPath: string;
        baseUrl: string;
    }>;
    /** Se Figma está habilitado */
    figmaEnabled: boolean;
    /** Nome da env var do Figma (se habilitado) */
    figmaEnvVar: string;
    /** Paths customizados (ou defaults da detecção) */
    paths: Partial<ProjectPaths>;
}
//# sourceMappingURL=config.d.ts.map