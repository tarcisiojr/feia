/**
 * Utilitário para validação de diretório de trabalho
 */

import fs from 'fs-extra';
import path from 'node:path';
import { logger } from './logger.js';

/**
 * Verifica se o diretório atual é um projeto Node.js válido
 * Retorna true se package.json existe, false caso contrário
 */
export function isValidNodeProject(dir: string = process.cwd()): boolean {
  const packageJsonPath = path.join(dir, 'package.json');
  return fs.existsSync(packageJsonPath);
}

/**
 * Valida diretório de trabalho e exibe erro se inválido
 * Retorna true se válido, false se inválido (com mensagem de erro)
 */
export function validateWorkingDirectory(dir: string = process.cwd()): boolean {
  if (!isValidNodeProject(dir)) {
    logger.error('Este diretório não parece ser um projeto Node.js (package.json não encontrado)');
    logger.info('Execute este comando na raiz de um projeto React/Next.js existente');
    return false;
  }
  return true;
}

/**
 * Retorna o caminho do package.json do diretório atual
 */
export function getPackageJsonPath(dir: string = process.cwd()): string {
  return path.join(dir, 'package.json');
}

/**
 * Lê e retorna o package.json do diretório especificado
 */
export async function readPackageJson(dir: string = process.cwd()): Promise<Record<string, unknown> | null> {
  try {
    const packageJsonPath = getPackageJsonPath(dir);
    const content = await fs.readJson(packageJsonPath);
    return content as Record<string, unknown>;
  } catch {
    return null;
  }
}
