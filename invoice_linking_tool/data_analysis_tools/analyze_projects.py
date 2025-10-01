"""
Script para análise detalhada dos projetos
"""
from database_utils import get_project_summary, get_invoice_details, get_monthly_expenses
from config import PROJECT_MAPPING, APARTAMENTO_INVOICES
import pandas as pd

def analyze_projects():
    """Análise completa dos projetos"""
    print("="*60)
    print("ANÁLISE DETALHADA DOS PROJETOS")
    print("="*60)
    
    # Resumo geral
    print("\n📊 RESUMO GERAL POR PROJETO:")
    summary = get_project_summary()
    print(summary.to_string(index=False))
    
    # Detalhes do APARTAMENTO
    print("\n🏠 DETALHES DO APARTAMENTO:")
    apartamento_details = get_invoice_details("APARTAMENTO")
    if not apartamento_details.empty:
        print(f"Total de notas: {len(apartamento_details)}")
        print(f"Valor total: R$ {apartamento_details['valor'].sum():,.2f}")
        print(f"Valor médio: R$ {apartamento_details['valor'].mean():,.2f}")
        print(f"Maior nota: R$ {apartamento_details['valor'].max():,.2f}")
        print(f"Menor nota: R$ {apartamento_details['valor'].min():,.2f}")
    
    # Gastos mensais
    print("\n📅 GASTOS MENSALES:")
    monthly = get_monthly_expenses()
    if not monthly.empty:
        monthly['mes'] = pd.to_datetime(monthly['mes']).dt.strftime('%Y-%m')
        print(monthly.to_string(index=False))
    
    # Notas sem projeto
    print("\n❓ NOTAS SEM PROJETO VINCULADO:")
    unlinked = get_unlinked_invoices()
    print(f"Total: {len(unlinked)} notas")
    if not unlinked.empty:
        print(f"Valor total: R$ {unlinked['total_amount'].sum():,.2f}")
        print("\nPrimeiras 10 notas:")
        print(unlinked.head(10).to_string(index=False))

if __name__ == "__main__":
    analyze_projects()
