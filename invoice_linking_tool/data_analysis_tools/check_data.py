"""
Script simples para verificar dados do banco
"""
import psycopg2
from config import DB_CONFIG

def check_database_data():
    """Verifica dados básicos do banco"""
    try:
        # Conectar ao banco
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("=== VERIFICACAO DOS DADOS DO BANCO ===")
        
        # 1. Verificar projetos
        print("\n1. PROJETOS:")
        cursor.execute("SELECT id, name FROM projects ORDER BY name")
        projects = cursor.fetchall()
        for project in projects:
            print(f"  - ID: {project[0]}, Nome: {project[1]}")
        
        # 2. Verificar notas fiscais com projeto
        print(f"\n2. NOTAS FISCAIS COM PROJETO:")
        cursor.execute("SELECT COUNT(*) FROM invoices WHERE project_id IS NOT NULL")
        with_project = cursor.fetchone()[0]
        print(f"  - Total: {with_project}")
        
        # 3. Verificar notas fiscais sem projeto
        print(f"\n3. NOTAS FISCAIS SEM PROJETO:")
        cursor.execute("SELECT COUNT(*) FROM invoices WHERE project_id IS NULL")
        without_project = cursor.fetchone()[0]
        print(f"  - Total: {without_project}")
        
        # 4. Verificar algumas notas fiscais
        print(f"\n4. AMOSTRA DE NOTAS FISCAIS:")
        cursor.execute("""
            SELECT i.id, i.number, i.total_amount, i.issue_date, p.name as project_name
            FROM invoices i
            LEFT JOIN projects p ON i.project_id = p.id
            ORDER BY i.issue_date DESC
            LIMIT 10
        """)
        invoices = cursor.fetchall()
        for inv in invoices:
            project_name = inv[4] if inv[4] else "SEM PROJETO"
            print(f"  - NF: {inv[1]}, Valor: R$ {inv[2]}, Data: {inv[3]}, Projeto: {project_name}")
        
        # 5. Verificar total de gastos
        print(f"\n5. TOTAL DE GASTOS:")
        cursor.execute("SELECT SUM(total_amount) FROM invoices")
        total = cursor.fetchone()[0]
        print(f"  - Total: R$ {total:,.2f}")
        
        # 6. Verificar gastos por projeto
        print(f"\n6. GASTOS POR PROJETO:")
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
        
        cursor.close()
        conn.close()
        
        print("\n=== VERIFICACAO CONCLUIDA ===")
        
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")

if __name__ == "__main__":
    check_database_data()
