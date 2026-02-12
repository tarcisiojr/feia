/**
 * Testes unitários para o módulo de dependências
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { detectPackageManager } from '../../src/utils/deps.js';

describe('deps.ts', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `feia-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('detectPackageManager', () => {
    it('deve detectar pnpm por pnpm-lock.yaml', async () => {
      await fs.writeFile(path.join(testDir, 'pnpm-lock.yaml'), '');

      const result = await detectPackageManager(testDir);

      expect(result).toBe('pnpm');
    });

    it('deve detectar yarn por yarn.lock', async () => {
      await fs.writeFile(path.join(testDir, 'yarn.lock'), '');

      const result = await detectPackageManager(testDir);

      expect(result).toBe('yarn');
    });

    it('deve detectar npm por package-lock.json', async () => {
      await fs.writeJson(path.join(testDir, 'package-lock.json'), {});

      const result = await detectPackageManager(testDir);

      expect(result).toBe('npm');
    });

    it('deve retornar npm como default', async () => {
      const result = await detectPackageManager(testDir);

      expect(result).toBe('npm');
    });

    it('deve priorizar pnpm sobre outros lockfiles', async () => {
      await fs.writeFile(path.join(testDir, 'pnpm-lock.yaml'), '');
      await fs.writeFile(path.join(testDir, 'yarn.lock'), '');
      await fs.writeJson(path.join(testDir, 'package-lock.json'), {});

      const result = await detectPackageManager(testDir);

      expect(result).toBe('pnpm');
    });

    it('deve priorizar yarn sobre npm', async () => {
      await fs.writeFile(path.join(testDir, 'yarn.lock'), '');
      await fs.writeJson(path.join(testDir, 'package-lock.json'), {});

      const result = await detectPackageManager(testDir);

      expect(result).toBe('yarn');
    });
  });
});
