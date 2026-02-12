/**
 * Módulo de logging colorido usando Chalk
 * Padrões: verde=sucesso, amarelo=warning, vermelho=erro, azul=info
 */

import chalk from 'chalk';

export const logger = {
  /**
   * Exibe mensagem de sucesso em verde com prefixo
   */
  success(message: string): void {
    console.log(chalk.green(`✅ ${message}`));
  },

  /**
   * Exibe mensagem de erro em vermelho com prefixo
   */
  error(message: string): void {
    console.error(chalk.red(`❌ ${message}`));
  },

  /**
   * Exibe mensagem de warning em amarelo com prefixo
   */
  warn(message: string): void {
    console.warn(chalk.yellow(`⚠️  ${message}`));
  },

  /**
   * Exibe mensagem informativa em azul com prefixo
   */
  info(message: string): void {
    console.log(chalk.blue(`ℹ️  ${message}`));
  },

  /**
   * Exibe mensagem simples sem formatação
   */
  log(message: string): void {
    console.log(message);
  },

  /**
   * Exibe título de seção em negrito
   */
  title(message: string): void {
    console.log(chalk.bold(`\n${message}`));
  },

  /**
   * Exibe item de lista
   */
  listItem(message: string, status: 'ok' | 'error' | 'warn' = 'ok'): void {
    const icon = status === 'ok' ? '✅' : status === 'error' ? '❌' : '⚠️';
    const colorFn = status === 'ok' ? chalk.green : status === 'error' ? chalk.red : chalk.yellow;
    console.log(colorFn(`  ${icon} ${message}`));
  },

  /**
   * Exibe progresso de etapa
   */
  step(step: number, total: number, message: string): void {
    console.log(chalk.cyan(`\n[${step}/${total}] ${message}`));
  },

  /**
   * Linha em branco
   */
  newLine(): void {
    console.log('');
  },
};
