# Vinculador de Notas Fiscais aos Projetos

## 🎯 Objetivo
Vincular automaticamente 170 notas fiscais às suas respectivas obras baseado no mapeamento exato do backup antigo.

## 📊 Dados Mapeados
- **YPE**: 153 notas fiscais → projeto "YPE RUA 11 LOTE 09"
- **APARTAMENTO**: 17 notas fiscais → projeto "APARTAMENTO"
- **Total**: 170 notas fiscais

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
cd data_analysis_tools
pip install -r requirements.txt
```

### 2. Configurar Banco de Dados
O arquivo `.env` já está configurado na pasta `data_analysis_tools/` com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sysobras
DB_USER=postgres
DB_PASS=admin
```

### 3. Executar Análises
```bash
cd data_analysis_tools

# Análise completa dos projetos
python analyze_projects.py

# Verificar nota fiscal específica
python check_invoice.py 55671

# Gerar relatórios
python generate_reports.py
```

## ⚠️ Segurança
- Executa em modo simulação primeiro
- Requer confirmação antes da execução real
- Gera logs detalhados
- Rollback automático em caso de erro

## 🎉 Resultado Esperado
- ✅ 170 notas fiscais vinculadas
- ✅ YPE: 153 notas fiscais
- ✅ APARTAMENTO: 17 notas fiscais (R$ 5.757,24)
- ✅ 0 notas sem projeto vinculado

## 📁 Estrutura do Projeto

```
invoice_linking_tool/
├── README.md                    # Este arquivo
├── backup_data/                 # Dados do backup antigo
│   └── sysobras/
│       ├── 3867.dat            # Mapeamento das notas fiscais
│       └── backup.sql          # Backup completo do banco
└── data_analysis_tools/        # Ferramentas de análise
    ├── .env                   # Configurações do banco
    ├── requirements.txt        # Dependências Python
    ├── config.py              # Configurações
    ├── database_utils.py      # Utilitários de banco
    ├── analyze_projects.py    # Análise completa
    ├── check_invoice.py       # Verificar nota específica
    ├── generate_reports.py    # Gerar relatórios
    └── README.md             # Documentação das ferramentas
```

## 🔧 Ferramentas de Análise

A pasta `data_analysis_tools/` contém scripts para:
- Análise detalhada dos projetos
- Verificação de notas fiscais específicas
- Geração de relatórios Excel/CSV
- Consultas personalizadas no banco

Consulte `data_analysis_tools/README.md` para mais detalhes.

## 📈 Dados Importantes

### APARTAMENTO
- **17 notas fiscais**
- **Total de gastos: R$ 5.757,24**
- **Período**: 2024-12-16 a 2025-05-25
- **Maior nota**: R$ 1.482,00 (0104157)
- **Menor nota**: R$ 32,90 (55671)

### YPE
- **153 notas fiscais**
- **Período**: 2024-07-02 a 2025-05-05
- **Maior nota**: R$ 33.080,00 (34143223)
- **Menor nota**: R$ 10,00 (233254)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs em `invoice_linking.log`
2. Confirme as configurações do banco no arquivo `.env`
3. Execute sempre em modo simulação primeiro
4. Use as ferramentas de análise para investigar dados
