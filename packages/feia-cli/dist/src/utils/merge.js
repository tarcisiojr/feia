/**
 * Módulo de merge - Deep merge para JSON e YAML com backup
 */
import fs from 'fs-extra';
import path from 'node:path';
import YAML from 'yaml';
/**
 * Verifica se um valor é um objeto simples (não array, não null)
 */
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * 7.1 Deep merge para objetos JSON
 * O objeto source é mesclado no target, preservando keys existentes do target
 */
export function mergeJson(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
            // Recursivamente mergeia objetos aninhados
            result[key] = mergeJson(targetValue, sourceValue);
        }
        else if (targetValue === undefined) {
            // Adiciona nova key se não existir no target
            result[key] = sourceValue;
        }
        // Se a key já existe no target com valor, preserva o valor do target
    }
    return result;
}
/**
 * 7.2 Deep merge para objetos YAML (usa mesma lógica do JSON)
 * Retorna string YAML com o resultado do merge
 */
export function mergeYaml(targetYaml, sourceYaml) {
    const target = YAML.parse(targetYaml);
    const source = YAML.parse(sourceYaml);
    const merged = mergeJson(target, source);
    return YAML.stringify(merged);
}
/**
 * 7.3 Cria backup de um arquivo antes de modificá-lo
 * O backup é criado com sufixo .backup e timestamp
 */
export async function createBackup(filePath) {
    try {
        if (!await fs.pathExists(filePath)) {
            return null;
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const ext = path.extname(filePath);
        const base = path.basename(filePath, ext);
        const dir = path.dirname(filePath);
        const backupName = `${base}.backup-${timestamp}${ext}`;
        const backupPath = path.join(dir, backupName);
        await fs.copy(filePath, backupPath);
        return backupPath;
    }
    catch {
        return null;
    }
}
/**
 * Lê um arquivo JSON, faz merge com novos dados, e escreve de volta
 * Cria backup antes de modificar se o arquivo existir
 */
export async function mergeJsonFile(filePath, newData, createBackupFirst = false) {
    let existingData = {};
    if (await fs.pathExists(filePath)) {
        if (createBackupFirst) {
            await createBackup(filePath);
        }
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            existingData = JSON.parse(content);
        }
        catch {
            // Se falhar ao parsear, começa com objeto vazio
            existingData = {};
        }
    }
    const merged = mergeJson(existingData, newData);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(merged, null, 2));
}
/**
 * Lê um arquivo YAML, faz merge com novos dados, e escreve de volta
 * Cria backup antes de modificar se o arquivo existir
 */
export async function mergeYamlFile(filePath, newData, createBackupFirst = false) {
    let existingData = {};
    if (await fs.pathExists(filePath)) {
        if (createBackupFirst) {
            await createBackup(filePath);
        }
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            existingData = YAML.parse(content);
        }
        catch {
            // Se falhar ao parsear, começa com objeto vazio
            existingData = {};
        }
    }
    const merged = mergeJson(existingData, newData);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, YAML.stringify(merged));
}
//# sourceMappingURL=merge.js.map