#!/bin/bash

echo "🚀 Configurando Railway para sisTest..."

# Verificar se está logado no Railway
if ! railway whoami > /dev/null 2>&1; then
    echo "❌ Você precisa estar logado no Railway. Execute: railway login"
    exit 1
fi

# Verificar se o projeto está linkado
if ! railway status > /dev/null 2>&1; then
    echo "❌ Projeto não está linkado. Execute: railway link"
    exit 1
fi

echo "📦 Criando PostgreSQL..."
railway add postgresql

echo "🔧 Configurando variáveis de ambiente..."
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set ADMIN_USER=admin
railway variables set ADMIN_PASS=admin123

echo "🔗 Conectando PostgreSQL ao backend..."
railway connect postgresql

echo "✅ Configuração concluída!"
echo "🌐 Faça o redeploy: railway up"
