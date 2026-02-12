/**
 * Tipos relacionados a convenções detectadas do projeto
 */
/**
 * Nível de confiança da detecção
 */
export type Confidence = 'high' | 'medium' | 'low';
/**
 * Resultado de uma detecção individual com confiança
 */
export interface DetectionResult<T> {
    value: T;
    confidence: Confidence;
}
/**
 * Frameworks suportados para detecção
 */
export type Framework = 'react' | 'nextjs' | 'vue' | 'unknown';
/**
 * Bibliotecas CSS suportadas
 */
export type CssLibrary = 'tailwind' | 'styled-components' | 'emotion' | 'css-modules' | 'sass' | 'unknown';
/**
 * Test runners suportados
 */
export type TestRunner = 'vitest' | 'jest' | 'unknown';
/**
 * Linters suportados
 */
export type Linter = 'eslint' | 'biome' | 'unknown';
/**
 * Formatters suportados
 */
export type Formatter = 'prettier' | 'biome' | 'unknown';
/**
 * Bibliotecas de formulário suportadas
 */
export type FormsLibrary = 'react-hook-form' | 'formik' | 'unknown';
/**
 * Bibliotecas de validação suportadas
 */
export type ValidationLibrary = 'zod' | 'yup' | 'joi' | 'unknown';
/**
 * Bibliotecas de state management suportadas
 */
export type StateManagement = 'zustand' | 'redux' | 'jotai' | 'mobx' | 'unknown';
/**
 * Estilo de declaração de componentes
 */
export type ComponentDeclaration = 'arrow' | 'function' | 'mixed';
/**
 * Estilo de exportação
 */
export type ExportStyle = 'named' | 'default' | 'mixed';
/**
 * Convenção de nomenclatura de arquivos
 */
export type NamingConvention = 'kebab-case' | 'camelCase' | 'PascalCase' | 'mixed';
/**
 * Paths detectados do projeto
 */
export interface DetectedPaths {
    components: string | null;
    pages: string | null;
    hooks: string | null;
    utils: string | null;
    types: string | null;
    api: string | null;
}
/**
 * Interface completa de convenções detectadas
 */
export interface DetectedConventions {
    /** Framework principal detectado */
    framework: DetectionResult<Framework>;
    /** Biblioteca CSS/styling */
    css: DetectionResult<CssLibrary>;
    /** Test runner configurado */
    testRunner: DetectionResult<TestRunner>;
    /** Linter configurado */
    linter: DetectionResult<Linter>;
    /** Formatter configurado */
    formatter: DetectionResult<Formatter>;
    /** Biblioteca de formulários */
    forms: DetectionResult<FormsLibrary>;
    /** Biblioteca de validação */
    validation: DetectionResult<ValidationLibrary>;
    /** State management global */
    globalState: DetectionResult<StateManagement>;
    /** Path alias configurado (ex: @/) */
    pathAlias: string | null;
    /** Estilo de declaração de componentes */
    componentDeclaration: DetectionResult<ComponentDeclaration>;
    /** Estilo de exportação */
    exportStyle: DetectionResult<ExportStyle>;
    /** Convenção de nomenclatura de arquivos */
    namingFiles: DetectionResult<NamingConvention>;
    /** Convenção de nomenclatura de componentes */
    namingComponents: DetectionResult<NamingConvention>;
    /** Paths detectados */
    paths: DetectedPaths;
    /** Uso de barrel files (index.ts com reexportações) */
    barrelFiles: boolean;
}
//# sourceMappingURL=conventions.d.ts.map