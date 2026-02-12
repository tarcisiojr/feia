/**
 * Módulo de detecção automática de padrões do repositório
 * Detecta framework, CSS, test runner, linter, naming conventions, etc.
 */
import fs from 'fs-extra';
import path from 'node:path';
import { glob } from 'glob';
/**
 * Cria um resultado de detecção
 */
function createResult(value, confidence) {
    return { value, confidence };
}
/**
 * Lê o package.json do diretório
 */
async function readPackageJson(cwd) {
    const packageJsonPath = path.join(cwd, 'package.json');
    try {
        return await fs.readJson(packageJsonPath);
    }
    catch {
        return null;
    }
}
/**
 * Verifica se uma dependência existe no package.json
 */
function hasDependency(pkg, name) {
    if (!pkg)
        return false;
    return !!(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
}
/**
 * Verifica se alguma das dependências existe no package.json
 */
function hasAnyDependency(pkg, names) {
    return names.some(name => hasDependency(pkg, name));
}
/**
 * Verifica se um arquivo existe no diretório
 */
async function fileExists(cwd, ...paths) {
    for (const p of paths) {
        if (await fs.pathExists(path.join(cwd, p))) {
            return true;
        }
    }
    return false;
}
/**
 * 4.1 Detecta framework (React, Next.js, Vue)
 */
async function detectFramework(_cwd, pkg) {
    if (hasDependency(pkg, 'next')) {
        return createResult('nextjs', 'high');
    }
    if (hasDependency(pkg, 'react')) {
        return createResult('react', 'high');
    }
    if (hasDependency(pkg, 'vue')) {
        return createResult('vue', 'high');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.2 Detecta biblioteca CSS
 */
async function detectCss(cwd, pkg) {
    if (hasDependency(pkg, 'tailwindcss')) {
        return createResult('tailwind', 'high');
    }
    if (hasDependency(pkg, 'styled-components')) {
        return createResult('styled-components', 'high');
    }
    if (hasAnyDependency(pkg, ['@emotion/react', '@emotion/styled'])) {
        return createResult('emotion', 'high');
    }
    if (hasDependency(pkg, 'sass')) {
        return createResult('sass', 'high');
    }
    // Verifica se existem arquivos CSS modules
    const cssModules = await glob('src/**/*.module.css', { cwd });
    if (cssModules.length > 0) {
        return createResult('css-modules', 'medium');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.3 Detecta test runner
 */
async function detectTestRunner(cwd, pkg) {
    // Verifica por arquivos de configuração
    if (await fileExists(cwd, 'vitest.config.ts', 'vitest.config.js', 'vitest.config.mts')) {
        return createResult('vitest', 'high');
    }
    if (await fileExists(cwd, 'jest.config.js', 'jest.config.ts', 'jest.config.mjs')) {
        return createResult('jest', 'high');
    }
    // Verifica campo jest no package.json
    if (pkg?.jest) {
        return createResult('jest', 'high');
    }
    // Verifica por dependências
    if (hasDependency(pkg, 'vitest')) {
        return createResult('vitest', 'medium');
    }
    if (hasDependency(pkg, 'jest')) {
        return createResult('jest', 'medium');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.4 Detecta linter
 */
async function detectLinter(cwd, pkg) {
    // Biome tem prioridade se config existir
    if (await fileExists(cwd, 'biome.json', 'biome.jsonc')) {
        return createResult('biome', 'high');
    }
    // ESLint (múltiplos formatos de config)
    if (await fileExists(cwd, '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yaml', '.eslintrc.yml', 'eslint.config.js', 'eslint.config.mjs')) {
        return createResult('eslint', 'high');
    }
    // Fallback para dependências
    if (hasDependency(pkg, '@biomejs/biome')) {
        return createResult('biome', 'medium');
    }
    if (hasDependency(pkg, 'eslint')) {
        return createResult('eslint', 'medium');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.5 Detecta formatter
 */
async function detectFormatter(cwd, pkg) {
    // Biome como formatter
    if (await fileExists(cwd, 'biome.json', 'biome.jsonc')) {
        return createResult('biome', 'high');
    }
    // Prettier (múltiplos formatos de config)
    if (await fileExists(cwd, '.prettierrc', '.prettierrc.js', '.prettierrc.json', '.prettierrc.yaml', '.prettierrc.yml', 'prettier.config.js', 'prettier.config.mjs')) {
        return createResult('prettier', 'high');
    }
    // Fallback para dependências
    if (hasDependency(pkg, 'prettier')) {
        return createResult('prettier', 'medium');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.6 Detecta biblioteca de formulários
 */
function detectForms(pkg) {
    if (hasDependency(pkg, 'react-hook-form')) {
        return createResult('react-hook-form', 'high');
    }
    if (hasDependency(pkg, 'formik')) {
        return createResult('formik', 'high');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.7 Detecta biblioteca de validação
 */
function detectValidation(pkg) {
    if (hasDependency(pkg, 'zod')) {
        return createResult('zod', 'high');
    }
    if (hasDependency(pkg, 'yup')) {
        return createResult('yup', 'high');
    }
    if (hasDependency(pkg, 'joi')) {
        return createResult('joi', 'high');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.8 Detecta state management
 */
function detectStateManagement(pkg) {
    if (hasDependency(pkg, 'zustand')) {
        return createResult('zustand', 'high');
    }
    if (hasAnyDependency(pkg, ['redux', '@reduxjs/toolkit'])) {
        return createResult('redux', 'high');
    }
    if (hasDependency(pkg, 'jotai')) {
        return createResult('jotai', 'high');
    }
    if (hasDependency(pkg, 'mobx')) {
        return createResult('mobx', 'high');
    }
    return createResult('unknown', 'low');
}
/**
 * 4.9 Detecta path alias via tsconfig.json
 */
async function detectPathAlias(cwd) {
    const tsconfigPath = path.join(cwd, 'tsconfig.json');
    try {
        const tsconfig = await fs.readJson(tsconfigPath);
        const paths = tsconfig.compilerOptions?.paths;
        if (paths) {
            // Procura por alias comum como @/*
            for (const [alias, targets] of Object.entries(paths)) {
                if (alias.startsWith('@/') || alias.startsWith('~/')) {
                    // Retorna o prefixo sem o wildcard
                    return alias.replace('/*', '/');
                }
                // Verifica se algum target aponta para src
                if (targets.some(t => t.includes('src'))) {
                    return alias.replace('/*', '/');
                }
            }
        }
    }
    catch {
        // tsconfig não existe ou é inválido
    }
    return null;
}
/**
 * 4.10 Detecta estilo de declaração de componentes e export via amostragem
 */
async function detectComponentPatterns(cwd) {
    // Busca arquivos .tsx em src/
    const tsxFiles = await glob('src/**/*.tsx', { cwd, ignore: ['**/node_modules/**', '**/*.test.tsx', '**/*.spec.tsx'] });
    if (tsxFiles.length === 0) {
        return {
            componentDeclaration: createResult('mixed', 'low'),
            exportStyle: createResult('mixed', 'low'),
        };
    }
    // Amostra até 10 arquivos
    const sampleSize = Math.min(10, tsxFiles.length);
    const sample = tsxFiles.slice(0, sampleSize);
    let arrowCount = 0;
    let functionCount = 0;
    let namedExportCount = 0;
    let defaultExportCount = 0;
    for (const file of sample) {
        try {
            const content = await fs.readFile(path.join(cwd, file), 'utf-8');
            // Detecta declaração de componentes
            // Arrow function: const ComponentName = () => ou const ComponentName: React.FC = () =>
            if (/const\s+[A-Z]\w*\s*[=:][^;]*=>\s*[{(]/m.test(content)) {
                arrowCount++;
            }
            // Function declaration: function ComponentName() ou export function ComponentName()
            if (/(?:export\s+)?function\s+[A-Z]\w*\s*\(/m.test(content)) {
                functionCount++;
            }
            // Detecta estilo de export
            if (/export\s+default\s+/m.test(content)) {
                defaultExportCount++;
            }
            if (/export\s+(?:const|function|class)\s+/m.test(content)) {
                namedExportCount++;
            }
        }
        catch {
            // Ignora arquivos que não podem ser lidos
        }
    }
    // Calcula resultados com threshold de 60%
    const threshold = sampleSize * 0.6;
    let componentDeclaration;
    if (arrowCount >= threshold) {
        componentDeclaration = createResult('arrow', 'high');
    }
    else if (functionCount >= threshold) {
        componentDeclaration = createResult('function', 'high');
    }
    else {
        componentDeclaration = createResult('mixed', 'low');
    }
    let exportStyle;
    if (defaultExportCount >= threshold) {
        exportStyle = createResult('default', 'high');
    }
    else if (namedExportCount >= threshold) {
        exportStyle = createResult('named', 'high');
    }
    else {
        exportStyle = createResult('mixed', 'low');
    }
    return { componentDeclaration, exportStyle };
}
/**
 * 4.11 Detecta naming conventions para arquivos
 */
async function detectNamingConventions(cwd) {
    // Busca arquivos .tsx em src/
    const tsxFiles = await glob('src/**/*.tsx', { cwd, ignore: ['**/node_modules/**', '**/index.tsx'] });
    if (tsxFiles.length === 0) {
        return {
            namingFiles: createResult('mixed', 'low'),
            namingComponents: createResult('PascalCase', 'low'),
        };
    }
    let kebabCount = 0;
    let pascalCount = 0;
    let camelCount = 0;
    for (const file of tsxFiles) {
        const basename = path.basename(file, '.tsx');
        // kebab-case: palavras-separadas-por-hifen
        if (/^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)+$/.test(basename)) {
            kebabCount++;
        }
        // PascalCase: PalavrasComeçandoComMaiúscula
        else if (/^[A-Z][a-zA-Z0-9]*$/.test(basename)) {
            pascalCount++;
        }
        // camelCase: palavrasComeçandoComMinúscula
        else if (/^[a-z][a-zA-Z0-9]*$/.test(basename)) {
            camelCount++;
        }
    }
    const total = tsxFiles.length;
    const threshold = total * 0.6;
    let namingFiles;
    if (kebabCount >= threshold) {
        namingFiles = createResult('kebab-case', 'high');
    }
    else if (pascalCount >= threshold) {
        namingFiles = createResult('PascalCase', 'high');
    }
    else if (camelCount >= threshold) {
        namingFiles = createResult('camelCase', 'high');
    }
    else {
        namingFiles = createResult('mixed', 'low');
    }
    // Convenção de componentes é geralmente PascalCase (padrão React)
    const namingComponents = createResult('PascalCase', 'high');
    return { namingFiles, namingComponents };
}
/**
 * 4.12 Detecta paths convencionais do projeto
 */
async function detectPaths(cwd) {
    const paths = {
        components: null,
        pages: null,
        hooks: null,
        utils: null,
        types: null,
        api: null,
    };
    // Possíveis caminhos para cada tipo
    const pathOptions = {
        components: ['src/components', 'components', 'src/shared/components'],
        pages: ['src/pages', 'pages', 'src/views', 'app'],
        hooks: ['src/hooks', 'hooks', 'src/shared/hooks'],
        utils: ['src/utils', 'utils', 'src/lib', 'lib', 'src/shared/utils'],
        types: ['src/types', 'types', 'src/@types'],
        api: ['src/api', 'api', 'src/services'],
    };
    for (const [key, options] of Object.entries(pathOptions)) {
        for (const option of options) {
            if (await fs.pathExists(path.join(cwd, option))) {
                paths[key] = option;
                break;
            }
        }
    }
    return paths;
}
/**
 * 4.13 Detecta uso de barrel files (index.ts com reexportações)
 */
async function detectBarrelFiles(cwd) {
    // Procura por arquivos index.ts em src/
    const indexFiles = await glob('src/**/index.ts', { cwd, ignore: ['**/node_modules/**'] });
    for (const file of indexFiles.slice(0, 5)) {
        try {
            const content = await fs.readFile(path.join(cwd, file), 'utf-8');
            // Verifica se contém reexportações
            if (/export\s+\*\s+from|export\s+\{[^}]+\}\s+from/.test(content)) {
                return true;
            }
        }
        catch {
            // Ignora erros de leitura
        }
    }
    return false;
}
/**
 * Função principal de detecção de convenções
 */
export async function detectConventions(cwd = process.cwd()) {
    const pkg = await readPackageJson(cwd);
    // Executa detecções em paralelo para melhor performance
    const [framework, css, testRunner, linter, formatter, pathAlias, componentPatterns, namingConventions, paths, barrelFiles,] = await Promise.all([
        detectFramework(cwd, pkg),
        detectCss(cwd, pkg),
        detectTestRunner(cwd, pkg),
        detectLinter(cwd, pkg),
        detectFormatter(cwd, pkg),
        detectPathAlias(cwd),
        detectComponentPatterns(cwd),
        detectNamingConventions(cwd),
        detectPaths(cwd),
        detectBarrelFiles(cwd),
    ]);
    // Detecções síncronas
    const forms = detectForms(pkg);
    const validation = detectValidation(pkg);
    const globalState = detectStateManagement(pkg);
    return {
        framework,
        css,
        testRunner,
        linter,
        formatter,
        forms,
        validation,
        globalState,
        pathAlias,
        componentDeclaration: componentPatterns.componentDeclaration,
        exportStyle: componentPatterns.exportStyle,
        namingFiles: namingConventions.namingFiles,
        namingComponents: namingConventions.namingComponents,
        paths,
        barrelFiles,
    };
}
//# sourceMappingURL=detect.js.map