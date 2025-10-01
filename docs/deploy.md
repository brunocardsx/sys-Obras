# 🚀 Guia de Deploy para Produção

## 📋 Pré-requisitos
- Conta no [Render.com](https://render.com) (gratuita)
- Conta no [Vercel.com](https://vercel.com) (gratuita)
- Repositório no GitHub

## 🗄️ **Passo 1: Configurar Banco de Dados (Render)**

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `sistest-db`
   - **Database**: `sistest`
   - **User**: `sistest_user`
   - **Plan**: Free
4. Aguarde a criação e copie as credenciais

## 🔧 **Passo 2: Deploy do Backend (Render)**

1. No Render Dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `sistest-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Port**: `10000`

### Variáveis de Ambiente:
```env
NODE_ENV=production
PORT=10000
DB_HOST=<host-do-render-db>
DB_PORT=5432
DB_NAME=sistest
DB_USER=<user-do-render-db>
DB_PASS=<password-do-render-db>
JWT_SECRET=<sua-chave-jwt-secreta>
ADMIN_USER=admin
ADMIN_PASS=<sua-senha-admin>
FRONTEND_URL=https://seu-frontend.vercel.app
```

## 🎨 **Passo 3: Deploy do Frontend (Vercel)**

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Variáveis de Ambiente:
```env
REACT_APP_API_URL=https://sistest-backend.onrender.com
```

## 🔄 **Passo 4: Atualizar URLs**

1. **Backend**: Atualize `FRONTEND_URL` com a URL do Vercel
2. **Frontend**: A variável `REACT_APP_API_URL` já estará configurada

## ✅ **Passo 5: Testar**

1. Acesse a URL do Vercel
2. Faça login com as credenciais configuradas
3. Teste todas as funcionalidades

## 🆓 **Limitações do Plano Gratuito**

### Render (Backend):
- ✅ 750 horas/mês gratuitas
- ✅ Banco PostgreSQL gratuito
- ⚠️ App "dorme" após 15min de inatividade (wake up em ~30s)

### Vercel (Frontend):
- ✅ Deploy ilimitado
- ✅ Bandwidth gratuito
- ✅ CDN global
- ✅ Deploy automático a cada push

## 🔧 **Comandos Úteis**

```bash
# Testar localmente com variáveis de produção
cd backend
NODE_ENV=production npm start

cd frontend
REACT_APP_API_URL=https://sistest-backend.onrender.com npm start
```

## 🐛 **Troubleshooting**

### Backend não inicia:
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o banco está acessível

### Frontend não conecta:
- Verifique se `REACT_APP_API_URL` está correto
- Confirme se o backend está rodando

### Banco de dados:
- Render PostgreSQL pode demorar alguns minutos para ficar disponível
- Verifique se as credenciais estão corretas
