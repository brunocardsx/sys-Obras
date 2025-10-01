# 🗄️ Migração do Banco de Dados para Railway

## 📋 **Opção 1: Export/Import SQL (Mais Simples)**

### **1. Exportar Banco Local**
```bash
# Conecte no seu PostgreSQL local e exporte
pg_dump -h localhost -U postgres -d sysobras > backup.sql
```

### **2. Importar no Railway**
```bash
# Após criar o PostgreSQL no Railway, pegue as credenciais
# e importe o backup:
psql -h <host-railway> -U <user-railway> -d <database-railway> < backup.sql
```

## 🔧 **Opção 2: Script de Migração Automática**

### **1. Criar Script de Backup**
```bash
# backup-database.js
const { Sequelize } = require('sequelize');

// Conectar no banco local
const localDb = new Sequelize({
  host: 'localhost',
  database: 'sysobras',
  username: 'postgres',
  password: 'admin',
  dialect: 'postgres'
});

// Conectar no Railway
const railwayDb = new Sequelize({
  host: process.env.RAILWAY_HOST,
  database: process.env.RAILWAY_DB,
  username: process.env.RAILWAY_USER,
  password: process.env.RAILWAY_PASS,
  dialect: 'postgres'
});

// Migrar dados
async function migrate() {
  // Copiar tabelas e dados
  // (implementar lógica de migração)
}
```

## 🚀 **Opção 3: Usar Ferramenta de Migração**

### **1. DBeaver/DataGrip**
- Conectar no banco local
- Conectar no Railway
- Copiar/colar dados entre conexões

### **2. pgAdmin**
- Exportar dados do banco local
- Importar no banco do Railway

## ⚡ **Opção 4: Backup Automático via Railway CLI**

### **1. Instalar Railway CLI**
```bash
npm install -g @railway/cli
railway login
```

### **2. Fazer Backup**
```bash
# Backup do banco local
pg_dump -h localhost -U postgres -d sysobras > backup.sql

# Conectar no projeto Railway
railway link

# Importar backup
railway run psql < backup.sql
```

## 🎯 **Recomendação:**

**Use a Opção 1 (Export/Import SQL)** - É mais simples e confiável:

1. **Exportar**: `pg_dump` do banco local
2. **Importar**: `psql` no Railway
3. **Verificar**: Dados migrados corretamente

## 📝 **Passo a Passo Detalhado:**

### **1. Preparar Backup**
```bash
# No terminal, vá para a pasta do projeto
cd C:\Users\Bruno\Documents\sisTest

# Exportar banco (ajuste as credenciais)
pg_dump -h localhost -U postgres -d sysobras -f backup.sql
```

### **2. Criar PostgreSQL no Railway**
- Acesse railway.app
- New Project → Database → PostgreSQL
- Aguarde criação (1-2 min)

### **3. Importar Backup**
```bash
# Pegue as credenciais do Railway e execute:
psql -h <host> -U <user> -d <database> -f backup.sql
```

### **4. Verificar Migração**
- Conecte no banco do Railway
- Verifique se todas as tabelas estão lá
- Confirme se os dados foram migrados

## ⚠️ **Importante:**
- Faça backup antes de migrar
- Teste em ambiente de desenvolvimento primeiro
- Verifique se todas as foreign keys estão corretas

## 🔧 **Script Automático:**
Posso criar um script que faça a migração automaticamente. Quer que eu crie?
