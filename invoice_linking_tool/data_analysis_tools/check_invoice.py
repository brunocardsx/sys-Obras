"""
Script para verificar uma nota fiscal específica
"""
import sys
from database_utils import execute_query
from config import PROJECT_MAPPING, APARTAMENTO_INVOICES

def check_invoice(invoice_number):
    """Verifica uma nota fiscal específica"""
    query = """
        SELECT 
            i.number,
            i.total_amount,
            i.issue_date,
            p.name as projeto,
            i.status
        FROM invoices i
        LEFT JOIN projects p ON i.project_id = p.id
        WHERE i.number = %s
    """
    
    result = execute_query(query, (invoice_number,))
    
    if result.empty:
        print(f"❌ Nota fiscal {invoice_number} NÃO ENCONTRADA no banco")
        return
    
    invoice = result.iloc[0]
    
    print(f"✅ Nota fiscal {invoice_number} ENCONTRADA:")
    print(f"   Valor: R$ {invoice['total_amount']:,.2f}")
    print(f"   Data: {invoice['issue_date']}")
    print(f"   Projeto: {invoice['projeto'] or 'SEM PROJETO'}")
    print(f"   Status: {invoice['status']}")
    
    # Verificar se está no mapeamento do APARTAMENTO
    if invoice_number in APARTAMENTO_INVOICES:
        print(f"   📋 Esta nota está mapeada para o APARTAMENTO no arquivo 3867.dat")
    else:
        print(f"   📋 Esta nota NÃO está no mapeamento do APARTAMENTO")

def main():
    if len(sys.argv) != 2:
        print("Uso: python check_invoice.py <numero_da_nota>")
        print("Exemplo: python check_invoice.py 55671")
        return
    
    invoice_number = sys.argv[1]
    check_invoice(invoice_number)

if __name__ == "__main__":
    main()
