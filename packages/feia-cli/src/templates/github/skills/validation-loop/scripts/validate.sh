#!/bin/bash

# Validation Loop Script
# Verifica TypeScript, Lint, Testes e Build

set -e

echo "🔍 Iniciando validação..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. TypeScript Check
echo "📝 Verificando TypeScript..."
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✅ TypeScript: OK${NC}"
else
    echo -e "${RED}❌ TypeScript: Erros encontrados${NC}"
    npx tsc --noEmit
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. Lint Check
echo "🔎 Verificando Lint..."
if npm run lint --silent 2>/dev/null; then
    echo -e "${GREEN}✅ Lint: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Lint: Warnings/Errors encontrados${NC}"
    npm run lint
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Test Check
echo "🧪 Executando testes..."
if npm test --silent 2>/dev/null; then
    echo -e "${GREEN}✅ Tests: OK${NC}"
else
    echo -e "${RED}❌ Tests: Falhas encontradas${NC}"
    npm test
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Build Check (opcional, pode ser lento)
if [ "$1" == "--with-build" ]; then
    echo "🏗️  Verificando build..."
    if npm run build --silent 2>/dev/null; then
        echo -e "${GREEN}✅ Build: OK${NC}"
    else
        echo -e "${RED}❌ Build: Erros encontrados${NC}"
        npm run build
        ERRORS=$((ERRORS + 1))
    fi
    echo ""
fi

# Resultado final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Validação completa! Código pronto para PR.${NC}"
    exit 0
else
    echo -e "${RED}💥 Validação falhou com $ERRORS erro(s).${NC}"
    echo "   Corrija os problemas antes de prosseguir."
    exit 1
fi
