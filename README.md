# 🏗️ Sistema de Gestão de Obras

Sistema completo de gestão de obras com frontend React e backend Node.js.

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript, CSS3
- **Backend**: Node.js, Express, TypeScript, Sequelize
- **Banco**: PostgreSQL
- **Autenticação**: JWT

## ⚡ Como Executar

### Desenvolvimento
```bash
npm install
npm run dev
```

### Produção
```bash
npm install
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
├── frontend/          # Aplicação React
├── backend/           # API Node.js
├── docs/              # Documentação
├── scripts/           # Scripts utilitários
├── assets/            # Imagens e recursos
└── archive/           # Arquivos antigos
```

## 🌐 Deploy em Produção

- [Guia Railway](docs/railway-deploy.md)
- [Guia Vercel](docs/deploy.md)
- [Migração Banco](docs/database-migration.md)

## 📋 Scripts Disponíveis

- `npm run dev` - Executa frontend e backend em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Executa o projeto em modo produção
- `npm run backend:dev` - Executa apenas o backend
- `npm run frontend:dev` - Executa apenas o frontend

## 🔧 Configuração

### Backend
Copie `backend/env.example` para `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sysobras
DB_USER=postgres
DB_PASS=admin
JWT_SECRET=sua-chave-secreta
ADMIN_USER=admin
ADMIN_PASS=admin123
```

### Frontend
Configure `REACT_APP_API_URL` no arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:8081
```

## 📊 Funcionalidades

- ✅ **Dashboard** com estatísticas e gráficos
- ✅ **Gestão de Projetos** (CRUD completo)
- ✅ **Gestão de Produtos** (CRUD completo)
- ✅ **Gestão de Notas Fiscais** (CRUD completo)
- ✅ **Busca e Filtros** avançados
- ✅ **Autenticação JWT** segura
- ✅ **Interface Responsiva** para mobile

## 🛠️ Desenvolvimento

### Estrutura do Backend
```
backend/
├── src/
│   ├── controllers/    # Controladores da API
│   ├── models/         # Modelos do banco de dados
│   ├── routes/         # Rotas da API
│   ├── middleware/     # Middlewares
│   ├── services/       # Serviços
│   ├── utils/          # Utilitários
│   └── types/          # Tipos TypeScript
├── dist/               # Código compilado
└── logs/               # Logs da aplicação
```

### Estrutura do Frontend
```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Utilitários
│   └── hooks/          # Hooks customizados
└── public/             # Arquivos públicos
```

## 📝 Licença

Este projeto está sob a licença MIT.