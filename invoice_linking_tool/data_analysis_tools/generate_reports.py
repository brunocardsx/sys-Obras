"""
Script para gerar relatórios em Excel
"""
import pandas as pd
from datetime import datetime
from database_utils import get_project_summary, get_invoice_details, get_monthly_expenses, get_unlinked_invoices

def generate_excel_report():
    """Gera relatório completo em Excel"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"relatorio_projetos_{timestamp}.xlsx"
    
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        # Resumo por projeto
        summary = get_project_summary()
        summary.to_excel(writer, sheet_name='Resumo_Projetos', index=False)
        
        # Detalhes das notas fiscais
        invoices = get_invoice_details()
        invoices.to_excel(writer, sheet_name='Detalhes_Notas', index=False)
        
        # Gastos mensais
        monthly = get_monthly_expenses()
        monthly.to_excel(writer, sheet_name='Gastos_Mensais', index=False)
        
        # Notas sem projeto
        unlinked = get_unlinked_invoices()
        unlinked.to_excel(writer, sheet_name='Notas_Sem_Projeto', index=False)
    
    print(f"✅ Relatório gerado: {filename}")
    print(f"   - Resumo por projeto")
    print(f"   - Detalhes das notas fiscais")
    print(f"   - Gastos mensais")
    print(f"   - Notas sem projeto vinculado")

def generate_csv_reports():
    """Gera relatórios em CSV"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Resumo por projeto
    summary = get_project_summary()
    summary.to_csv(f"resumo_projetos_{timestamp}.csv", index=False)
    
    # Detalhes das notas fiscais
    invoices = get_invoice_details()
    invoices.to_csv(f"detalhes_notas_{timestamp}.csv", index=False)
    
    # Notas sem projeto
    unlinked = get_unlinked_invoices()
    unlinked.to_csv(f"notas_sem_projeto_{timestamp}.csv", index=False)
    
    print(f"✅ Relatórios CSV gerados:")
    print(f"   - resumo_projetos_{timestamp}.csv")
    print(f"   - detalhes_notas_{timestamp}.csv")
    print(f"   - notas_sem_projeto_{timestamp}.csv")

if __name__ == "__main__":
    print("Escolha o tipo de relatório:")
    print("1. Excel (completo)")
    print("2. CSV (separados)")
    
    choice = input("Digite sua escolha (1 ou 2): ").strip()
    
    if choice == "1":
        generate_excel_report()
    elif choice == "2":
        generate_csv_reports()
    else:
        print("Opção inválida!")
