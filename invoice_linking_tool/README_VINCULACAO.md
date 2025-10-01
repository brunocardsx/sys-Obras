# Script de Vinculação de Notas Fiscais aos Projetos

Este script foi criado para vincular as notas fiscais que estão sem projeto associado no banco de dados atual às suas respectivas obras/projetos, baseado nos dados do backup do sistema antigo (sysobras).

## 📋 Problema Identificado

- As notas fiscais no banco atual não têm `project_id` vinculado
- No backup antigo, temos projetos como:
  - **OBRA-4**: YPE RUA 11 LOTE 09
  - **OBRA-5**: APARTAMENTO
- Precisamos vincular cada nota fiscal à sua obra correspondente

## 🚀 Como Executar

### Opção 1: Execução Automática (Windows)
```bash
# Execute o arquivo batch que faz tudo automaticamente
run_linking_script.bat
```

### Opção 2: Execução Manual

1. **Instalar dependências Python:**
```bash
pip install -r requirements.txt
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistest
DB_USER=postgres
DB_PASS=sua_senha_aqui
```

3. **Executar o script:**
```bash
python link_invoices_to_projects.py
```

## 🔧 Como o Script Funciona

### 1. Análise dos Dados
- Busca todos os projetos atuais no banco
- Identifica notas fiscais sem `project_id`
- Cria regras de mapeamento baseadas no backup antigo

### 2. Regras de Vinculação
O script usa múltiplas estratégias para determinar qual projeto cada nota fiscal pertence:

#### Regra 1: Análise das Notas
- Verifica se há indicação do projeto nas notas/observações da nota fiscal

#### Regra 2: Números das Notas Fiscais
- Baseado nos dados do backup, números específicos são associados a projetos:
  - **00286-00300**: Apartamento
  - **37226-37232**: YPE

#### Regra 3: Distribuição por Data
- Primeiro semestre: Apartamento
- Segundo semestre: YPE

### 3. Modo Simulação
- O script sempre executa primeiro em modo simulação
- Mostra exatamente o que será feito sem alterar o banco
- Permite revisar antes de executar a vinculação real

### 4. Execução Real
- Após confirmação, executa as atualizações no banco
- Mostra resumo antes e depois da vinculação

## 📊 Exemplo de Saída

```
==================================================
PROCESSANDO NOTAS FISCAIS (SIMULAÇÃO)
==================================================
✓ NF 00286 -> apartamento (ID: 39aa93cc-43fc-44bc-a583-1350dc17040b) - Valor: R$ 150.00
✓ NF 37231 -> ype (ID: 81302d2c-2d8a-4a30-a4de-9effe8cb743c) - Valor: R$ 1550.52
✓ NF 37232 -> ype (ID: 81302d2c-2d8a-4a30-a4de-9effe8cb743c) - Valor: R$ 1550.52
...

SIMULAÇÃO: 15 notas fiscais seriam vinculadas.

============================================================
RESUMO DAS NOTAS FISCAIS POR PROJETO
============================================================
APARTAMENTO                    |  8 NF | R$    12,450.00
YPE RUA 11 LOTE 09            |  7 NF | R$    15,230.50
============================================================
TOTAL                          | 15 NF | R$    27,680.50
============================================================
```

## ⚠️ Importante

1. **Backup**: Sempre faça backup do banco antes de executar
2. **Simulação**: O script sempre roda em simulação primeiro
3. **Confirmação**: Você precisa confirmar antes da execução real
4. **Logs**: Todos os logs são salvos em `invoice_linking.log`

## 🔍 Personalização

Para ajustar as regras de vinculação, edite a função `create_project_mapping_rules()` no script:

```python
def create_project_mapping_rules(self) -> Dict[str, str]:
    mapping_rules = {
        'apartamento': 'apartamento',
        'ype': 'ype rua 11 lote 09',
        # Adicione suas regras aqui
    }
    return mapping_rules
```

## 🐛 Solução de Problemas

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o PostgreSQL está rodando
- Teste a conexão manualmente

### Notas Não Vinculadas
- Revise as regras de mapeamento
- Verifique se os nomes dos projetos estão corretos
- Adicione regras específicas para casos especiais

### Permissões
- Certifique-se de que o usuário do banco tem permissão de UPDATE na tabela `invoices`

## 📝 Logs

O script gera logs detalhados em:
- **Console**: Saída em tempo real
- **Arquivo**: `invoice_linking.log` (salvo no diretório atual)

## ✅ Verificação Pós-Execução

Após executar o script, verifique:

1. **No banco de dados:**
```sql
SELECT p.name, COUNT(i.id) as total_notas, SUM(i.total_amount) as valor_total
FROM projects p
LEFT JOIN invoices i ON p.id = i.project_id
GROUP BY p.id, p.name
ORDER BY p.name;
```

2. **Notas sem projeto (deve retornar 0):**
```sql
SELECT COUNT(*) FROM invoices WHERE project_id IS NULL;
```

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs em `invoice_linking.log`
2. Execute em modo simulação primeiro
3. Verifique as configurações do banco de dados
4. Confirme se os projetos existem no banco atual
