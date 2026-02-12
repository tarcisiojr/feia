# Figma Extraction Skill

## Descrição
Extrai informações de design do Figma para uso na geração de componentes React.

## Quando usar
- Iniciar implementação de uma nova tela
- Atualizar componente existente com novo design
- Entender especificações visuais

## Pré-requisitos
- Token de acesso Figma configurado
- Link do arquivo/frame Figma

## Processo

### 1. Obter Link do Figma
O usuário deve fornecer um link no formato:
- `https://www.figma.com/file/FILE_KEY/FILE_NAME?node-id=NODE_ID`
- `https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=NODE_ID`

### 2. Extrair Informações
Usando o MCP Figma, extraio:

#### Layout
- Estrutura de containers (frames, groups)
- Hierarquia de componentes
- Auto-layout e constraints
- Responsividade

#### Estilo
- Cores (fills, strokes)
- Tipografia (font-family, size, weight, line-height)
- Espaçamentos (padding, margin, gap)
- Bordas e sombras

#### Componentes
- Componentes reutilizáveis
- Variantes e estados
- Props customizáveis

#### Assets
- Ícones e imagens
- Ilustrações
- Logos

### 3. Gerar Output
Produzo um resumo estruturado com:
- Árvore de componentes identificados
- Tokens de design (cores, tipografia, espaçamento)
- Recomendações de implementação

## Output
Documento markdown com especificações extraídas do Figma, pronto para ser usado pela skill Frontend Spec.

## Exemplo de Output

```markdown
## Componentes Identificados
- Header (sticky)
- SearchBar
- ProductCard (grid de 3 colunas)
- Pagination

## Tokens
- Primary: #3B82F6
- Text: #1F2937
- Background: #F9FAFB
- Spacing: 16px base

## Notas
- Usar grid responsivo
- Cards com aspect-ratio 4:3
- Hover state nos cards
```
