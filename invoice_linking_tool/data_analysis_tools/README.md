# Ferramentas de Análise de Dados

Este diretório contém scripts Python para análise e consulta dos dados do sistema Sysobras.

## 📁 Estrutura

```
data_analysis_tools/
├── requirements.txt          # Dependências Python
├── config.py                 # Configurações e constantes
├── database_utils.py         # Utilitários de banco de dados
├── analyze_projects.py       # Análise completa dos projetos
├── check_invoice.py          # Verificar nota fiscal específica
├── generate_reports.py       # Gerar relatórios Excel/CSV
└── README.md                # Este arquivo
```

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
pip install -r requirements.txt
```

### 2. Configurar Banco de Dados
Crie um arquivo `.env` na raiz do projeto com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sysobras
DB_USER=postgres
DB_PASS=admin
```

### 3. Executar Scripts

#### Análise Completa dos Projetos
```bash
python analyze_projects.py
```

#### Verificar Nota Fiscal Específica
```bash
python check_invoice.py 55671
```

#### Gerar Relatórios
```bash
python generate_reports.py
```

## 📊 Scripts Disponíveis

### `analyze_projects.py`
- Resumo geral por projeto
- Detalhes do APARTAMENTO
- Gastos mensais
- Notas sem projeto vinculado

### `check_invoice.py`
- Verifica uma nota fiscal específica
- Mostra valor, data, projeto e status
- Confirma se está no mapeamento do APARTAMENTO

### `generate_reports.py`
- Gera relatórios em Excel (completo)
- Gera relatórios em CSV (separados)
- Inclui todos os dados principais

### `database_utils.py`
- Funções utilitárias para consultas
- Conexão com banco de dados
- Consultas pré-definidas

### `config.py`
- Configurações do banco
- Mapeamento de projetos
- Lista de notas do APARTAMENTO

## 📈 Exemplos de Uso

### Verificar Total de Gastos do APARTAMENTO
```python
from database_utils import get_invoice_details
apartamento = get_invoice_details("APARTAMENTO")
total = apartamento['valor'].sum()
print(f"Total APARTAMENTO: R$ {total:,.2f}")
```

### Listar Notas Sem Projeto
```python
from database_utils import get_unlinked_invoices
unlinked = get_unlinked_invoices()
print(f"Notas sem projeto: {len(unlinked)}")
```

## 🔧 Personalização

Para adicionar novas consultas, edite `database_utils.py` e adicione novas funções seguindo o padrão existente.

Para modificar configurações, edite `config.py`.
