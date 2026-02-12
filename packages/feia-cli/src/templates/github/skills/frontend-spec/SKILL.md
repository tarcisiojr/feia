# Frontend Spec Skill

## Descrição
Cria especificações detalhadas de frontend para guiar a implementação de componentes React.

## Quando usar
- Antes de implementar uma nova feature
- Para documentar requisitos técnicos
- Para alinhar expectativas de implementação

## Input Esperado
- Requisitos de negócio ou user story
- Design do Figma (output da skill figma-extraction)
- Endpoints de API disponíveis

## Processo

### 1. Análise de Requisitos
- Identifico funcionalidades necessárias
- Mapeio fluxos de usuário
- Identifico edge cases

### 2. Definição de Componentes
- Estrutura hierárquica de componentes
- Props e estado de cada componente
- Responsabilidades

### 3. Integração com API
- Endpoints necessários
- Formato de dados
- Estados de loading/error

### 4. Casos de Teste
- Cenários principais
- Edge cases
- Acessibilidade

## Output

Arquivo YAML com especificação completa:

```yaml
spec:
  name: OrderDetailPage
  description: Página de detalhes do pedido

components:
  - name: OrderHeader
    props:
      - name: order
        type: Order
        required: true
    state: []

  - name: OrderItems
    props:
      - name: items
        type: OrderItem[]
        required: true
    state:
      - name: expandedItem
        type: string | null

hooks:
  - useGetOrderById
  - useUpdateOrderStatus

tests:
  - "deve exibir informações do pedido"
  - "deve permitir atualizar status"
  - "deve mostrar loading durante fetch"
  - "deve mostrar erro se pedido não existe"
```

## Exemplo Completo

Veja `examples/order-detail-spec.yaml` para um exemplo completo de especificação.

## Boas Práticas

1. **Componentes pequenos**: Cada componente deve ter uma responsabilidade única
2. **Props tipadas**: Defina tipos para todas as props
3. **Estados claros**: Documente todos os estados possíveis
4. **Testes relevantes**: Foque em comportamento, não implementação
