# 📊 DOCUMENTAÇÃO DO BANCO DE DADOS - SISTEMA DE GESTÃO

## 🎯 **VISÃO GERAL**

Este documento descreve a estrutura atual do banco de dados `sysobras` após a migração completa dos dados do backup.sql.

---

## 📋 **TABELAS PRINCIPAIS (ATIVAS)**

### 1. **`invoices`** - Notas Fiscais
**Descrição:** Tabela principal que armazena as notas fiscais do sistema
**Colunas:** 15
**Registros:** 170 notas fiscais migradas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `number` | VARCHAR | Número da nota fiscal |
| `series` | VARCHAR | Série da nota |
| `supplier_id` | UUID | ID do fornecedor |
| `project_id` | UUID | ID da obra/projeto |
| `issue_date` | DATE | Data de emissão |
| `due_date` | DATE | Data de vencimento |
| `subtotal` | NUMERIC | Subtotal (sem impostos) |
| `tax_amount` | NUMERIC | Valor dos impostos |
| `total_amount` | NUMERIC | Valor total |
| `status` | VARCHAR | Status da nota |
| `payment_date` | DATE | Data de pagamento |
| `notes` | TEXT | Observações |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### 2. **`invoice_items`** - Itens das Notas Fiscais
**Descrição:** Itens individuais de cada nota fiscal
**Colunas:** 10
**Registros:** 262 itens migrados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `invoice_id` | UUID | FK para invoices |
| `product_id` | UUID | FK para products |
| `product_name` | VARCHAR(255) | Nome do produto |
| `product_code` | VARCHAR(100) | Código do produto |
| `description` | TEXT | Descrição do item |
| `quantity` | NUMERIC(15,3) | Quantidade |
| `unit_price` | NUMERIC(15,2) | Preço unitário |
| `total_price` | NUMERIC(15,2) | Preço total |
| `created_at` | TIMESTAMP | Data de criação |

### 3. **`products`** - Produtos
**Descrição:** Catálogo de produtos do sistema
**Colunas:** 14
**Registros:** 180 produtos migrados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `code` | VARCHAR | Código único do produto |
| `name` | VARCHAR | Nome do produto |
| `description` | TEXT | Descrição |
| `category_id` | UUID | FK para categories |
| `unit` | VARCHAR | Unidade de medida |
| `cost_price` | NUMERIC | Preço de custo |
| `selling_price` | NUMERIC | Preço de venda |
| `stock_quantity` | NUMERIC | Quantidade em estoque |
| `min_stock` | NUMERIC | Estoque mínimo |
| `max_stock` | NUMERIC | Estoque máximo |
| `is_active` | BOOLEAN | Status ativo |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### 4. **`projects`** - Projetos/Obras
**Descrição:** Projetos e obras do sistema
**Colunas:** 18
**Registros:** Dados migrados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `code` | VARCHAR | Código do projeto |
| `name` | VARCHAR | Nome do projeto |
| `description` | TEXT | Descrição |
| `start_date` | DATE | Data de início |
| `end_date` | DATE | Data de fim |
| `status` | VARCHAR | Status do projeto |
| `budget` | NUMERIC | Orçamento |
| `client_id` | UUID | FK para clientes |
| `manager_id` | UUID | FK para usuários |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### 5. **`users`** - Usuários
**Descrição:** Usuários do sistema
**Colunas:** 10
**Registros:** Usuários do sistema

### 6. **`suppliers`** - Fornecedores
**Descrição:** Fornecedores das notas fiscais
**Colunas:** 13
**Registros:** Fornecedores cadastrados

### 7. **`categories`** - Categorias
**Descrição:** Categorias de produtos
**Colunas:** 6
**Registros:** Categorias cadastradas

### 8. **`stock_movements`** - Movimentações de Estoque
**Descrição:** Controle de movimentações de estoque
**Colunas:** 10
**Registros:** Movimentações registradas

### 9. **`audit_logs`** - Logs de Auditoria
**Descrição:** Logs de auditoria do sistema
**Colunas:** 8
**Registros:** Logs de atividades

---

## 🗑️ **TABELAS OBSOLETAS (PARA REMOÇÃO)**

### ❌ **Tabelas Duplicadas/Inativas:**

1. **`item_nota_fiscal`** (6 colunas)
   - **Motivo:** Duplicata de `invoice_items`
   - **Status:** Não utilizada pelo sistema atual

2. **`itens_nota_fiscal`** (6 colunas)
   - **Motivo:** Duplicata de `invoice_items`
   - **Status:** Não utilizada pelo sistema atual

3. **`nota_fiscal`** (4 colunas)
   - **Motivo:** Duplicata de `invoices`
   - **Status:** Não utilizada pelo sistema atual

4. **`notas_fiscais`** (4 colunas)
   - **Motivo:** Duplicata de `invoices`
   - **Status:** Não utilizada pelo sistema atual

5. **`produto`** (5 colunas)
   - **Motivo:** Duplicata de `products`
   - **Status:** Não utilizada pelo sistema atual

6. **`produtos`** (7 colunas)
   - **Motivo:** Duplicata de `products`
   - **Status:** Não utilizada pelo sistema atual

7. **`obras`** (5 colunas)
   - **Motivo:** Duplicata de `projects`
   - **Status:** Não utilizada pelo sistema atual

---

## 📊 **VIEWS DO SISTEMA**

### 1. **`v_invoices_complete`** (19 colunas)
**Descrição:** View completa de notas fiscais com relacionamentos

### 2. **`v_products_with_category`** (16 colunas)
**Descrição:** View de produtos com informações de categoria

### 3. **`v_stock_movements_detailed`** (13 colunas)
**Descrição:** View detalhada de movimentações de estoque

---

## 🔗 **RELACIONAMENTOS PRINCIPAIS**

```
projects (obras) 1:N invoices (notas fiscais)
invoices 1:N invoice_items (itens)
products 1:N invoice_items
categories 1:N products
suppliers 1:N invoices
users 1:N projects (gerentes)
```

---

## 📈 **ESTATÍSTICAS ATUAIS**

- **Total de Notas Fiscais:** 170
- **Total de Itens:** 262
- **Total de Produtos:** 180
- **Valor Total:** R$ 275.031,44
- **Notas com Valores:** 170 (100%)

---

## 🧹 **SCRIPT DE LIMPEZA**

```sql
-- Remover tabelas obsoletas
DROP TABLE IF EXISTS item_nota_fiscal CASCADE;
DROP TABLE IF EXISTS itens_nota_fiscal CASCADE;
DROP TABLE IF EXISTS nota_fiscal CASCADE;
DROP TABLE IF EXISTS notas_fiscais CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS obras CASCADE;
```

---

## ✅ **RECOMENDAÇÕES**

1. **Executar limpeza** das tabelas obsoletas
2. **Manter apenas** as tabelas principais listadas
3. **Documentar** qualquer nova tabela criada
4. **Backup** antes de qualquer alteração estrutural

---

*Documentação gerada em: 30/09/2025*
*Sistema: Sysobras - Gestão de Notas Fiscais*
