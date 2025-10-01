"""
Configurações para análise de dados
"""

# Configurações do banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'database': 'sysobras',
    'user': 'postgres',
    'password': 'admin'
}

# Mapeamento de projetos (do arquivo 3867.dat)
PROJECT_MAPPING = {
    '4': 'YPE RUA 11 LOTE 09',
    '5': 'APARTAMENTO'
}

# Notas fiscais do APARTAMENTO (ID 5)
APARTAMENTO_INVOICES = [
    '0104157', '010600', '308381', '104344', '010247', '103337', '7024', 
    '308377', '238652', '037935', '037927', '037953', '308376', '55671', 
    '8280', '009360', '7182'
]

# Notas fiscais do YPE (ID 4) - primeiras 20 para exemplo
YPE_INVOICES_SAMPLE = [
    '2443', '37827', '309305', '43422', '20690', '00286', '37231', '37232', 
    '37226', '37230', '37229', '51418', '000731', '000724', '304216', '37509', 
    '37610', '007472', '007441', '005862'
]
