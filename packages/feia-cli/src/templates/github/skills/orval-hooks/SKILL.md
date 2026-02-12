# Orval Hooks Skill

## Descrição
Gera e gerencia hooks React Query a partir de especificações OpenAPI usando Orval.

## Quando usar
- Adicionar novo domínio de API
- Regenerar hooks após atualização de spec
- Configurar mutator customizado

## Pré-requisitos
- Arquivo OpenAPI spec válido (yaml ou json)
- Orval instalado (`npx orval`)
- orval.config.ts configurado

## Processo

### 1. Verificar Spec
Valido que o OpenAPI spec existe e está válido:
```bash
npx @apidevtools/swagger-cli validate path/to/spec.yaml
```

### 2. Gerar Hooks
Executo Orval para gerar os hooks:
```bash
npx orval
```

### 3. Verificar Output
Confirmo que os hooks foram gerados em:
```
src/api/generated/
  {dominio}/
    index.ts        # Exports
    {dominio}.ts    # Hooks gerados
    {dominio}.msw.ts # Mocks para MSW (se configurado)
```

## Hooks Gerados

### Queries (GET)
```tsx
import { useGetUsers } from '@/api/generated/users';

const { data, isLoading, error } = useGetUsers();
```

### Mutations (POST, PUT, DELETE)
```tsx
import { useCreateUser } from '@/api/generated/users';

const { mutate, isPending } = useCreateUser();
mutate({ name: 'John' });
```

### Com Parâmetros
```tsx
import { useGetUserById } from '@/api/generated/users';

const { data } = useGetUserById(userId);
```

## Comandos Úteis

```bash
# Regenerar todos os hooks
feia generate-hooks

# Adicionar novo domínio
feia add-domain inventory --spec specs/inventory.yaml --base-url /api/inventory

# Ver domínios configurados
feia status
```

## Troubleshooting

### Spec inválido
- Verifique a sintaxe YAML/JSON
- Valide contra OpenAPI 3.0/3.1

### Hooks não atualizados
- Execute `feia generate-hooks`
- Verifique timestamps com `feia status`

### Erro de importação
- Verifique o path alias em tsconfig.json
- Confirme que barrel files estão corretos
