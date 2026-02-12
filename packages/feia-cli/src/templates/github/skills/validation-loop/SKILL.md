# Validation Loop Skill

## Descrição
Valida a implementação de componentes React, verificando TypeScript, lint, testes e acessibilidade.

## Quando usar
- Após implementar nova feature
- Antes de criar PR
- Para verificar qualidade do código

## Processo

### 1. TypeScript Check
```bash
npx tsc --noEmit
```
Verifica:
- Tipos corretos
- Imports válidos
- Sem erros de compilação

### 2. Lint Check
```bash
npm run lint
```
Verifica:
- Regras de estilo
- Boas práticas
- Imports não utilizados

### 3. Test Check
```bash
npm test
```
Verifica:
- Testes passando
- Cobertura mínima
- Sem testes pulados

### 4. Build Check
```bash
npm run build
```
Verifica:
- Build sem erros
- Bundle size aceitável

## Script de Validação

Execute o script completo:
```bash
./.github/skills/validation-loop/scripts/validate.sh
```

## Output

### Sucesso
```
✅ TypeScript: OK
✅ Lint: OK
✅ Tests: OK (45/45 passing)
✅ Build: OK

🎉 Validação completa! Código pronto para PR.
```

### Falha
```
❌ TypeScript: 3 errors
  - src/components/Button.tsx:15 - Type error
  - src/hooks/useAuth.ts:42 - Missing type

⚠️ Lint: 2 warnings
  - Unused import in Header.tsx

✅ Tests: OK

Corrija os erros antes de prosseguir.
```

## Correções Comuns

### TypeScript Errors
- Adicione tipos faltantes
- Corrija imports
- Verifique generics

### Lint Warnings
- Remova imports não utilizados
- Siga convenções de nomenclatura
- Adicione deps em useEffect

### Test Failures
- Atualize snapshots se necessário
- Corrija mocks desatualizados
- Verifique assertions

## Integração com CI

Este script pode ser usado em pipelines CI/CD:

```yaml
# .github/workflows/validate.yml
name: Validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: ./.github/skills/validation-loop/scripts/validate.sh
```
