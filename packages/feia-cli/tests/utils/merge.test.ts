/**
 * Testes unitários para o módulo de merge
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { mergeJson, mergeYaml, createBackup, mergeJsonFile } from '../../src/utils/merge.js';

describe('merge.ts', () => {
  let testDir: string;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter++;
    testDir = path.join(os.tmpdir(), `feia-merge-test-${Date.now()}-${testCounter}-${Math.random().toString(36).slice(2)}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    try {
      await fs.remove(testDir);
    } catch {
      // Ignora erros de remoção
    }
  });

  describe('mergeJson', () => {
    it('deve mesclar objetos simples', () => {
      const target = { a: 1, b: 2 };
      const source = { c: 3 };

      const result = mergeJson(target, source);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('deve preservar valores existentes do target', () => {
      const target = { a: 1, b: 2 };
      const source = { a: 10, c: 3 };

      const result = mergeJson(target, source);

      expect(result.a).toBe(1); // Preservado do target
      expect(result.b).toBe(2);
      expect(result.c).toBe(3); // Adicionado do source
    });

    it('deve mesclar objetos aninhados recursivamente', () => {
      const target = {
        config: {
          theme: 'dark',
          lang: 'pt',
        },
      };
      const source = {
        config: {
          debug: true,
        },
      };

      const result = mergeJson(target, source);

      expect(result).toEqual({
        config: {
          theme: 'dark',
          lang: 'pt',
          debug: true,
        },
      });
    });

    it('deve preservar valores aninhados existentes', () => {
      const target = {
        mcp: {
          servers: {
            figma: { command: 'npx' },
          },
        },
      };
      const source = {
        mcp: {
          servers: {
            figma: { command: 'docker' },
            other: { command: 'node' },
          },
        },
      };

      const result = mergeJson(target, source);

      expect((result['mcp'] as Record<string, unknown>)['servers']).toEqual({
        figma: { command: 'npx' }, // Preservado
        other: { command: 'node' }, // Adicionado
      });
    });

    it('deve lidar com objetos vazios', () => {
      expect(mergeJson({}, { a: 1 })).toEqual({ a: 1 });
      expect(mergeJson({ a: 1 }, {})).toEqual({ a: 1 });
      expect(mergeJson({}, {})).toEqual({});
    });
  });

  describe('mergeYaml', () => {
    it('deve mesclar conteúdo YAML', () => {
      const targetYaml = 'name: test\nversion: 1.0.0';
      const sourceYaml = 'description: A test project';

      const result = mergeYaml(targetYaml, sourceYaml);

      expect(result).toContain('name: test');
      expect(result).toContain('version: 1.0.0');
      expect(result).toContain('description: A test project');
    });
  });

  describe('createBackup', () => {
    it('deve criar backup de arquivo existente', async () => {
      const filePath = path.join(testDir, 'test.json');
      await fs.writeJson(filePath, { test: true });

      const backupPath = await createBackup(filePath);

      expect(backupPath).not.toBeNull();
      expect(backupPath).toContain('test.backup-');
      expect(await fs.pathExists(backupPath!)).toBe(true);
    });

    it('deve retornar null para arquivo inexistente', async () => {
      const filePath = path.join(testDir, 'nonexistent.json');

      const backupPath = await createBackup(filePath);

      expect(backupPath).toBeNull();
    });
  });

  describe('mergeJsonFile', () => {
    it('deve criar novo arquivo se não existir', async () => {
      const filePath = path.join(testDir, 'new.json');

      await mergeJsonFile(filePath, { test: true });

      expect(await fs.pathExists(filePath)).toBe(true);
      const content = await fs.readJson(filePath);
      expect(content).toEqual({ test: true });
    });

    it('deve mesclar com arquivo existente', async () => {
      const filePath = path.join(testDir, 'existing.json');
      await fs.writeJson(filePath, { existing: true });

      await mergeJsonFile(filePath, { new: true });

      const content = await fs.readJson(filePath);
      expect(content).toEqual({ existing: true, new: true });
    });

    it('deve criar backup se solicitado', async () => {
      const filePath = path.join(testDir, 'backup-test.json');
      await fs.writeJson(filePath, { original: true });

      await mergeJsonFile(filePath, { new: true }, true);

      // Verifica que backup foi criado
      const files = await fs.readdir(testDir);
      const backupFile = files.find(f => f.includes('backup-'));
      expect(backupFile).toBeDefined();
    });
  });
});
