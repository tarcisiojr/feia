/**
 * Testes unitários para o módulo de scaffold
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { writeFileIdempotent } from '../../src/utils/scaffold.js';

describe('scaffold.ts', () => {
  let testDir: string;
  let testCounter = 0;

  beforeEach(async () => {
    testCounter++;
    testDir = path.join(os.tmpdir(), `feia-scaffold-test-${Date.now()}-${testCounter}-${Math.random().toString(36).slice(2)}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    try {
      await fs.remove(testDir);
    } catch {
      // Ignora erros de remoção
    }
  });

  describe('writeFileIdempotent', () => {
    it('deve criar novo arquivo', async () => {
      const filePath = path.join(testDir, 'new.txt');

      const written = await writeFileIdempotent(filePath, 'content');

      expect(written).toBe(true);
      expect(await fs.readFile(filePath, 'utf-8')).toBe('content');
    });

    it('deve sobrescrever arquivo com categoria overwrite', async () => {
      const filePath = path.join(testDir, 'overwrite.txt');
      await fs.writeFile(filePath, 'old');

      const written = await writeFileIdempotent(filePath, 'new', 'overwrite');

      expect(written).toBe(true);
      expect(await fs.readFile(filePath, 'utf-8')).toBe('new');
    });

    it('deve preservar arquivo com categoria preserve', async () => {
      const filePath = path.join(testDir, 'preserve.txt');
      await fs.writeFile(filePath, 'original');

      const written = await writeFileIdempotent(filePath, 'new', 'preserve');

      expect(written).toBe(false);
      expect(await fs.readFile(filePath, 'utf-8')).toBe('original');
    });

    it('deve mesclar arquivo JSON com categoria merge', async () => {
      const filePath = path.join(testDir, 'merge.json');
      await fs.writeJson(filePath, { existing: true });

      const newContent = JSON.stringify({ new: true });
      const written = await writeFileIdempotent(filePath, newContent, 'merge');

      expect(written).toBe(true);
      const content = await fs.readJson(filePath);
      expect(content).toEqual({ existing: true, new: true });
    });

    it('deve criar diretórios necessários', async () => {
      const filePath = path.join(testDir, 'deep', 'nested', 'file.txt');

      await writeFileIdempotent(filePath, 'content');

      expect(await fs.pathExists(filePath)).toBe(true);
    });

    it('deve detectar categoria automaticamente para skills', async () => {
      const filePath = path.join(testDir, '.github', 'skills', 'test', 'SKILL.md');
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, 'old');

      // Skills devem ser sobrescritas
      const written = await writeFileIdempotent(filePath, 'new');

      expect(written).toBe(true);
      expect(await fs.readFile(filePath, 'utf-8')).toBe('new');
    });

    it('deve detectar categoria automaticamente para conventions.yaml', async () => {
      const filePath = path.join(testDir, 'frontendspec', 'conventions.yaml');
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, 'original');

      // conventions.yaml deve ser preservado
      const written = await writeFileIdempotent(filePath, 'new');

      expect(written).toBe(false);
      expect(await fs.readFile(filePath, 'utf-8')).toBe('original');
    });
  });
});
