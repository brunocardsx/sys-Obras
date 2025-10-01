"""
Script para vincular notas fiscais aos projetos baseado no mapeamento do arquivo 3867.dat
"""
import psycopg2
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'data_analysis_tools'))
from config import DB_CONFIG, PROJECT_MAPPING, APARTAMENTO_INVOICES, YPE_INVOICES_SAMPLE

def link_invoices_to_projects():
    """Vincula notas fiscais aos projetos baseado no mapeamento"""
    try:
        # Conectar ao banco
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("=== VINCULACAO DE NOTAS FISCAIS AOS PROJETOS ===")
        
        # 1. Buscar IDs dos projetos
        cursor.execute("SELECT id, name FROM projects WHERE name IN ('YPE RUA 11 LOTE 09', 'APARTAMENTO')")
        projects = cursor.fetchall()
        project_ids = {}
        for project in projects:
            if 'YPE' in project[1]:
                project_ids['YPE'] = project[0]
            elif 'APARTAMENTO' in project[1]:
                project_ids['APARTAMENTO'] = project[0]
        
        print(f"Projetos encontrados:")
        for name, id in project_ids.items():
            print(f"  - {name}: {id}")
        
        # 2. Vincular notas do APARTAMENTO
        print(f"\nVinculando notas do APARTAMENTO...")
        apartamento_count = 0
        for invoice_number in APARTAMENTO_INVOICES:
            cursor.execute("""
                UPDATE invoices 
                SET project_id = %s 
                WHERE number = %s AND project_id IS NULL
            """, (project_ids['APARTAMENTO'], invoice_number))
            if cursor.rowcount > 0:
                apartamento_count += 1
                print(f"  - NF {invoice_number} -> APARTAMENTO")
        
        # 3. Vincular notas do YPE (todas as outras)
        print(f"\nVinculando notas do YPE...")
        cursor.execute("""
            UPDATE invoices 
            SET project_id = %s 
            WHERE project_id IS NULL
        """, (project_ids['YPE'],))
        ype_count = cursor.rowcount
        print(f"  - {ype_count} notas -> YPE")
        
        # 4. Confirmar as alterações
        conn.commit()
        
        # 5. Verificar resultado
        print(f"\n=== RESULTADO DA VINCULACAO ===")
        cursor.execute("""
            SELECT p.name, COUNT(i.id) as total_notas, SUM(i.total_amount) as valor_total
            FROM projects p
            LEFT JOIN invoices i ON p.id = i.project_id
            GROUP BY p.id, p.name
            ORDER BY valor_total DESC
        """)
        project_totals = cursor.fetchall()
        for pt in project_totals:
            total_notas = pt[1] if pt[1] else 0
            valor_total = pt[2] if pt[2] else 0
            print(f"  - {pt[0]}: {total_notas} notas, R$ {valor_total:,.2f}")
        
        # 6. Verificar notas sem projeto
        cursor.execute("SELECT COUNT(*) FROM invoices WHERE project_id IS NULL")
        remaining = cursor.fetchone()[0]
        print(f"\nNotas sem projeto: {remaining}")
        
        cursor.close()
        conn.close()
        
        print(f"\n=== VINCULACAO CONCLUIDA ===")
        print(f"APARTAMENTO: {apartamento_count} notas vinculadas")
        print(f"YPE: {ype_count} notas vinculadas")
        print(f"Total: {apartamento_count + ype_count} notas vinculadas")
        
    except Exception as e:
        print(f"Erro na vinculacao: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    link_invoices_to_projects()
