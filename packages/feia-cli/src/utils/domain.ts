/**
 * Módulo de gerenciamento de domínios de API
 * Atualização de orval.config.ts, project.yaml, custom-instance.ts
 */

import fs from 'fs-extra';
import path from 'node:path';
import YAML from 'yaml';

/**
 * Adiciona um novo domínio ao orval.config.ts
 */
export async function updateOrvalConfig(
  name: string,
  specPath: string,
  baseUrl: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const orvalConfigPath = path.join(cwd, 'orval.config.ts');
  let content = await fs.readFile(orvalConfigPath, 'utf-8');

  // Encontra o final do objeto de configuração
  // Procura pelo último } antes do "export default" ou fim do arquivo
  const newDomainConfig = `
  ${name}: {
    input: '${specPath}',
    output: {
      target: 'src/api/generated/${name}',
      client: 'react-query',
      baseUrl: '${baseUrl}',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: '${name}Instance',
        },
      },
    },
  },`;

  // Insere antes do último }
  const lastBraceIndex = content.lastIndexOf('}');
  if (lastBraceIndex > -1) {
    content = content.slice(0, lastBraceIndex) + newDomainConfig + '\n' + content.slice(lastBraceIndex);
  }

  await fs.writeFile(orvalConfigPath, content);
}

/**
 * Adiciona um novo domínio ao project.yaml
 */
export async function updateProjectYaml(
  name: string,
  specPath: string,
  baseUrl: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');
  const content = await fs.readFile(projectYamlPath, 'utf-8');
  const project = YAML.parse(content) as Record<string, unknown>;

  // Adiciona o novo domínio ao array de domains
  const domains = (project['domains'] as Array<Record<string, string>>) ?? [];
  domains.push({
    name,
    specPath,
    baseUrl,
    generatedDir: `src/api/generated/${name}`,
  });
  project['domains'] = domains;

  await fs.writeFile(projectYamlPath, YAML.stringify(project));
}

/**
 * Adiciona uma nova instância ao custom-instance.ts
 */
export async function updateCustomInstance(
  name: string,
  baseUrl: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const customInstancePath = path.join(cwd, 'src', 'api', 'custom-instance.ts');
  let content = await fs.readFile(customInstancePath, 'utf-8');

  // Adiciona a nova função de instância no final do arquivo
  const instanceName = `${name}Instance`;
  const newInstance = `
/**
 * Instância customizada para o domínio ${name}
 */
export const ${instanceName} = <T>(config: AxiosRequestConfig<T>): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    ...config,
    baseURL: '${baseUrl}',
  });
};
`;

  content += newInstance;
  await fs.writeFile(customInstancePath, content);
}

/**
 * Remove um domínio do orval.config.ts
 */
export async function removeFromOrvalConfig(
  name: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const orvalConfigPath = path.join(cwd, 'orval.config.ts');
  let content = await fs.readFile(orvalConfigPath, 'utf-8');

  // Remove o bloco do domínio usando regex
  // Padrão: "name: {" até o próximo "}," ou "}" no mesmo nível
  const pattern = new RegExp(`\\s*${name}:\\s*\\{[^}]*\\{[^}]*\\}[^}]*\\},?`, 's');
  content = content.replace(pattern, '');

  await fs.writeFile(orvalConfigPath, content);
}

/**
 * Remove um domínio do project.yaml
 */
export async function removeFromProjectYaml(
  name: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const projectYamlPath = path.join(cwd, 'frontendspec', 'project.yaml');
  const content = await fs.readFile(projectYamlPath, 'utf-8');
  const project = YAML.parse(content) as Record<string, unknown>;

  // Remove o domínio do array
  const domains = (project['domains'] as Array<{ name: string }>) ?? [];
  project['domains'] = domains.filter(d => d.name !== name);

  await fs.writeFile(projectYamlPath, YAML.stringify(project));
}

/**
 * Remove uma instância do custom-instance.ts
 */
export async function removeFromCustomInstance(
  name: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const customInstancePath = path.join(cwd, 'src', 'api', 'custom-instance.ts');
  let content = await fs.readFile(customInstancePath, 'utf-8');

  // Remove a função de instância
  const instanceName = `${name}Instance`;
  const pattern = new RegExp(
    `\\/\\*\\*[^*]*\\*\\/\\s*export const ${instanceName}[^;]*;\\s*\\};?`,
    's'
  );
  content = content.replace(pattern, '');

  // Também tenta remover formato mais simples
  const simplePattern = new RegExp(
    `export const ${instanceName}[^}]+\\};?\\s*`,
    's'
  );
  content = content.replace(simplePattern, '');

  await fs.writeFile(customInstancePath, content);
}
