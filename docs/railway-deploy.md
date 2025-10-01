# 🚀 Deploy no Railway (RECOMENDADO)

## 🏆 **Por que Railway?**
- ✅ PostgreSQL gratuito (1GB) SEM limite de tempo
- ✅ Backend não "dorme" como Render
- ✅ Deploy automático via GitHub
- ✅ Interface moderna e intuitiva
- ✅ Logs em tempo real
- ✅ Custom domains gratuitos

## 📋 **Passo a Passo:**

### **1. Criar Conta no Railway**
1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. Conecte seu repositório

### **2. Criar Banco PostgreSQL**
1. No dashboard, clique "New Project"
2. Escolha "Provision PostgreSQL"
3. Aguarde a criação (1-2 minutos)
4. Copie as variáveis de ambiente

### **3. Deploy do Backend**
1. Clique "New Service" → "GitHub Repo"
2. Selecione seu repositório
3. Railway detecta automaticamente que é Node.js
4. Configure as variáveis de ambiente:

```env
NODE_ENV=production
PORT=10000
DB_HOST=<host-do-railway-postgres>
DB_PORT=5432
DB_NAME=<nome-do-banco>
DB_USER=<usuario-do-banco>
DB_PASS=<senha-do-banco>
JWT_SECRET=<sua-chave-jwt-secreta>
ADMIN_USER=admin
ADMIN_PASS=<sua-senha-admin>
FRONTEND_URL=https://seu-frontend.vercel.app
```

### **4. Deploy do Frontend (Vercel)**
1. Configure no Vercel:
```env
REACT_APP_API_URL=https://seu-backend.railway.app
```

## 🎯 **Vantagens sobre Render:**

| Recurso | Railway | Render |
|---------|---------|--------|
| PostgreSQL | 1GB gratuito | 1GB gratuito |
| Limite de tempo | ❌ Sem limite | ⚠️ 750h/mês |
| App "dorme" | ❌ Não dorme | ⚠️ Dorme após 15min |
| Deploy | ✅ Automático | ✅ Automático |
| Interface | 🏆 Muito melhor | ⚠️ Básica |
| Logs | ✅ Tempo real | ⚠️ Limitados |
| Custom domains | ✅ Gratuito | ⚠️ Pago |

## 🆓 **Plano Gratuito Railway:**
- **$5 crédito/mês** (suficiente para uso básico)
- **PostgreSQL**: 1GB
- **Backend**: Sem limite de horas
- **Bandwidth**: 100GB/mês

## 🔧 **Configuração Automática:**
O arquivo `railway.toml` já está configurado para deploy automático!

## ✅ **Resultado:**
- Backend: `https://seu-projeto.railway.app`
- Frontend: `https://seu-projeto.vercel.app`
- Banco: PostgreSQL no Railway
- **Custo: R$ 0,00**
