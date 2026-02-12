/**
 * Módulo de logging colorido usando Chalk
 * Padrões: verde=sucesso, amarelo=warning, vermelho=erro, azul=info
 */
import chalk from 'chalk';
export const logger = {
    /**
     * Exibe mensagem de sucesso em verde com prefixo
     */
    success(message) {
        console.log(chalk.green(`✅ ${message}`));
    },
    /**
     * Exibe mensagem de erro em vermelho com prefixo
     */
    error(message) {
        console.error(chalk.red(`❌ ${message}`));
    },
    /**
     * Exibe mensagem de warning em amarelo com prefixo
     */
    warn(message) {
        console.warn(chalk.yellow(`⚠️  ${message}`));
    },
    /**
     * Exibe mensagem informativa em azul com prefixo
     */
    info(message) {
        console.log(chalk.blue(`ℹ️  ${message}`));
    },
    /**
     * Exibe mensagem simples sem formatação
     */
    log(message) {
        console.log(message);
    },
    /**
     * Exibe título de seção em negrito
     */
    title(message) {
        console.log(chalk.bold(`\n${message}`));
    },
    /**
     * Exibe item de lista
     */
    listItem(message, status = 'ok') {
        const icon = status === 'ok' ? '✅' : status === 'error' ? '❌' : '⚠️';
        const colorFn = status === 'ok' ? chalk.green : status === 'error' ? chalk.red : chalk.yellow;
        console.log(colorFn(`  ${icon} ${message}`));
    },
    /**
     * Exibe progresso de etapa
     */
    step(step, total, message) {
        console.log(chalk.cyan(`\n[${step}/${total}] ${message}`));
    },
    /**
     * Linha em branco
     */
    newLine() {
        console.log('');
    },
};
//# sourceMappingURL=logger.js.map