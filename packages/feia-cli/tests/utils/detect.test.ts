/**
 * Testes unitários para o módulo de detecção
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { detectConventions } from '../../src/utils/detect.js';

describe('detect.ts', () => {
  let testDir: string;

  beforeEach(async () => {
    // Cria diretório temporário para cada teste
    testDir = path.join(os.tmpdir(), `feia-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    // Remove diretório temporário
    await fs.remove(testDir);
  });

  describe('detectFramework', () => {
    it('deve detectar React com alta confiança', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: { react: '^18.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.framework.value).toBe('react');
      expect(result.framework.confidence).toBe('high');
    });

    it('deve detectar Next.js com alta confiança', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: { next: '^14.0.0', react: '^18.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.framework.value).toBe('nextjs');
      expect(result.framework.confidence).toBe('high');
    });

    it('deve detectar Vue com alta confiança', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: { vue: '^3.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.framework.value).toBe('vue');
      expect(result.framework.confidence).toBe('high');
    });

    it('deve retornar unknown se nenhum framework detectado', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: {},
      });

      const result = await detectConventions(testDir);
      expect(result.framework.value).toBe('unknown');
      expect(result.framework.confidence).toBe('low');
    });
  });

  describe('detectCss', () => {
    it('deve detectar Tailwind', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        devDependencies: { tailwindcss: '^3.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.css.value).toBe('tailwind');
      expect(result.css.confidence).toBe('high');
    });

    it('deve detectar Styled Components', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: { 'styled-components': '^6.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.css.value).toBe('styled-components');
      expect(result.css.confidence).toBe('high');
    });

    it('deve detectar Emotion', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        dependencies: { '@emotion/react': '^11.0.0' },
      });

      const result = await detectConventions(testDir);
      expect(result.css.value).toBe('emotion');
      expect(result.css.confidence).toBe('high');
    });
  });

  describe('detectTestRunner', () => {
    it('deve detectar Vitest por arquivo de config', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.writeFile(path.join(testDir, 'vitest.config.ts'), 'export default {}');

      const result = await detectConventions(testDir);
      expect(result.testRunner.value).toBe('vitest');
      expect(result.testRunner.confidence).toBe('high');
    });

    it('deve detectar Jest por arquivo de config', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.writeFile(path.join(testDir, 'jest.config.js'), 'module.exports = {}');

      const result = await detectConventions(testDir);
      expect(result.testRunner.value).toBe('jest');
      expect(result.testRunner.confidence).toBe('high');
    });
  });

  describe('detectLinter', () => {
    it('deve detectar ESLint por dependência', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {
        devDependencies: { eslint: '^8.0.0' }
      });

      const result = await detectConventions(testDir);
      expect(result.linter.value).toBe('eslint');
      expect(result.linter.confidence).toBe('medium');
    });

    it('deve detectar Biome por arquivo de config', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), { dependencies: {} });
      await fs.writeJson(path.join(testDir, 'biome.json'), { linter: { enabled: true } });

      const result = await detectConventions(testDir);
      expect(result.linter.value).toBe('biome');
      expect(result.linter.confidence).toBe('high');
    });
  });

  describe('detectPathAlias', () => {
    it('deve detectar alias @/ no tsconfig.json', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.writeJson(path.join(testDir, 'tsconfig.json'), {
        compilerOptions: {
          paths: {
            '@/*': ['src/*'],
          },
        },
      });

      const result = await detectConventions(testDir);
      expect(result.pathAlias).toBe('@/');
    });

    it('deve retornar null se não houver alias', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.writeJson(path.join(testDir, 'tsconfig.json'), {
        compilerOptions: {},
      });

      const result = await detectConventions(testDir);
      expect(result.pathAlias).toBeNull();
    });
  });

  describe('detectPaths', () => {
    it('deve detectar diretório de componentes', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.ensureDir(path.join(testDir, 'src', 'components'));

      const result = await detectConventions(testDir);
      expect(result.paths.components).toBe('src/components');
    });

    it('deve detectar diretório de páginas', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.ensureDir(path.join(testDir, 'src', 'pages'));

      const result = await detectConventions(testDir);
      expect(result.paths.pages).toBe('src/pages');
    });

    it('deve retornar null se diretório de páginas não existir', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});

      const result = await detectConventions(testDir);
      expect(result.paths.pages).toBeNull();
    });
  });

  describe('detectBarrelFiles', () => {
    it('deve retornar false se não houver barrel files', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});
      await fs.ensureDir(path.join(testDir, 'src'));

      const result = await detectConventions(testDir);
      expect(result.barrelFiles).toBe(false);
    });

    it('deve retornar false se não houver src com index.ts', async () => {
      await fs.writeJson(path.join(testDir, 'package.json'), {});

      const result = await detectConventions(testDir);
      expect(result.barrelFiles).toBe(false);
    });
  });
});
