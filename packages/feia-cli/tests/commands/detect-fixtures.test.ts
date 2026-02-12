/**
 * Testes de integração usando fixtures de repositórios
 */

import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectConventions } from '../../src/utils/detect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');

describe('Detecção em Fixtures', () => {
  describe('react-tailwind fixture', () => {
    const fixtureDir = path.join(FIXTURES_DIR, 'react-tailwind');

    it('deve detectar React como framework', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.framework.value).toBe('react');
      expect(result.framework.confidence).toBe('high');
    });

    it('deve detectar Tailwind como CSS', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.css.value).toBe('tailwind');
      expect(result.css.confidence).toBe('high');
    });

    it('deve detectar Vitest como test runner', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.testRunner.value).toBe('vitest');
    });

    it('deve detectar ESLint como linter', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.linter.value).toBe('eslint');
    });

    it('deve detectar Prettier como formatter', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.formatter.value).toBe('prettier');
    });

    it('deve detectar React Hook Form', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.forms.value).toBe('react-hook-form');
    });

    it('deve detectar Zod', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.validation.value).toBe('zod');
    });

    it('deve detectar Zustand', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.globalState.value).toBe('zustand');
    });

    it('deve detectar path alias @/', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.pathAlias).toBe('@/');
    });
  });

  describe('next-styled fixture', () => {
    const fixtureDir = path.join(FIXTURES_DIR, 'next-styled');

    it('deve detectar Next.js como framework', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.framework.value).toBe('nextjs');
      expect(result.framework.confidence).toBe('high');
    });

    it('deve detectar Styled Components como CSS', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.css.value).toBe('styled-components');
      expect(result.css.confidence).toBe('high');
    });

    it('deve detectar Jest como test runner', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.testRunner.value).toBe('jest');
    });

    it('deve detectar Biome como linter e formatter', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.linter.value).toBe('biome');
      expect(result.formatter.value).toBe('biome');
    });
  });

  describe('react-legacy-mixed fixture', () => {
    const fixtureDir = path.join(FIXTURES_DIR, 'react-legacy-mixed');

    it('deve detectar React como framework', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.framework.value).toBe('react');
    });

    it('deve detectar Jest via package.json config', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.testRunner.value).toBe('jest');
      expect(result.testRunner.confidence).toBe('high');
    });

    it('deve ter baixa confiança em detecções não encontradas', async () => {
      const result = await detectConventions(fixtureDir);
      expect(result.css.value).toBe('unknown');
      expect(result.css.confidence).toBe('low');
      expect(result.linter.value).toBe('unknown');
      expect(result.linter.confidence).toBe('low');
    });
  });
});
