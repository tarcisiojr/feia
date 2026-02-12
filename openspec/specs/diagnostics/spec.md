## ADDED Requirements

### Requirement: Comando doctor para diagnóstico

O sistema SHALL verificar integridade da configuração FEIA via comando `doctor` e exibir checklist com ✅ / ❌.

#### Scenario: Verificação de Node.js
- **WHEN** doctor executa
- **THEN** verifica se Node.js está instalado e versão é >= 18.0.0

#### Scenario: Verificação de arquivos de configuração
- **WHEN** doctor executa
- **THEN** verifica existência de: `frontendspec/conventions.yaml`, `frontendspec/project.yaml`, `orval.config.ts`

#### Scenario: Verificação de OpenAPI specs
- **WHEN** doctor executa e `project.yaml` contém domínios
- **THEN** verifica se cada `specPath` referenciado existe

#### Scenario: Verificação de hooks gerados
- **WHEN** doctor executa e domínios configurados
- **THEN** verifica se `src/api/generated/{domínio}/` existe para cada domínio

#### Scenario: Verificação de skills
- **WHEN** doctor executa
- **THEN** verifica existência de todas as 5 skills em `.github/skills/`

#### Scenario: Verificação de agent
- **WHEN** doctor executa
- **THEN** verifica existência de `.github/agents/feia.agent.md`

#### Scenario: Verificação de Figma (se habilitado)
- **WHEN** doctor executa e `project.yaml` tem `figma.enabled: true`
- **THEN** verifica se `.vscode/settings.json` tem `mcp.servers.figma` e se env var existe

#### Scenario: Output do doctor
- **WHEN** doctor completa
- **THEN** exibe checklist formatada com ✅ para itens OK e ❌ para itens com problema

### Requirement: Comando status para visibilidade

O sistema SHALL exibir status do projeto via comando `status`.

#### Scenario: Domínios configurados
- **WHEN** status executa
- **THEN** lista todos os domínios com status: "✅ hooks gerados", "⚠️ hooks desatualizados", "❌ hooks ausentes"

#### Scenario: Detecção de hooks desatualizados
- **WHEN** timestamp do OpenAPI spec é mais recente que timestamp dos hooks
- **THEN** domínio é marcado como "⚠️ hooks desatualizados"

#### Scenario: Skills instaladas
- **WHEN** status executa
- **THEN** lista skills encontradas em `.github/skills/`

#### Scenario: Problemas resumidos
- **WHEN** status executa
- **THEN** seção "Problemas" mostra até 3 itens críticos do doctor

### Requirement: Comando update para atualização

O sistema SHALL atualizar skills e agent para versão mais recente via comando `update`.

#### Scenario: Skills atualizadas
- **WHEN** update executa
- **THEN** todos os arquivos em `.github/skills/**/SKILL.md` são sobrescritos com versão do pacote

#### Scenario: Agent atualizado
- **WHEN** update executa
- **THEN** arquivo `.github/agents/feia.agent.md` é sobrescrito com versão do pacote

#### Scenario: Scripts atualizados
- **WHEN** update executa
- **THEN** arquivo `validate.sh` é sobrescrito com versão do pacote

#### Scenario: Configs preservadas
- **WHEN** update executa
- **THEN** arquivos `conventions.yaml`, `project.yaml`, `orval.config.ts`, `custom-instance.ts` NÃO são modificados

#### Scenario: copilot-instructions.md regenerado
- **WHEN** update executa
- **THEN** `.github/copilot-instructions.md` é regenerado a partir do `conventions.yaml` preservado

#### Scenario: Feedback de versões
- **WHEN** update completa
- **THEN** exibe "Atualizado de v1.0.0 para v1.1.0" com lista de arquivos modificados

### Requirement: Verificação de versão do pacote

O sistema SHALL comparar versão instalada com versão atual do pacote para detectar atualizações disponíveis.

#### Scenario: Update disponível
- **WHEN** status ou doctor executa e nova versão disponível
- **THEN** exibe "Nova versão disponível: v1.1.0. Execute 'feia update' para atualizar."

#### Scenario: Versão atual
- **WHEN** status executa e pacote está na última versão
- **THEN** não exibe mensagem de atualização
