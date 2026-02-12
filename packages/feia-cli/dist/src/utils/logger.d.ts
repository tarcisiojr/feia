/**
 * Módulo de logging colorido usando Chalk
 * Padrões: verde=sucesso, amarelo=warning, vermelho=erro, azul=info
 */
export declare const logger: {
    /**
     * Exibe mensagem de sucesso em verde com prefixo
     */
    success(message: string): void;
    /**
     * Exibe mensagem de erro em vermelho com prefixo
     */
    error(message: string): void;
    /**
     * Exibe mensagem de warning em amarelo com prefixo
     */
    warn(message: string): void;
    /**
     * Exibe mensagem informativa em azul com prefixo
     */
    info(message: string): void;
    /**
     * Exibe mensagem simples sem formatação
     */
    log(message: string): void;
    /**
     * Exibe título de seção em negrito
     */
    title(message: string): void;
    /**
     * Exibe item de lista
     */
    listItem(message: string, status?: "ok" | "error" | "warn"): void;
    /**
     * Exibe progresso de etapa
     */
    step(step: number, total: number, message: string): void;
    /**
     * Linha em branco
     */
    newLine(): void;
};
//# sourceMappingURL=logger.d.ts.map