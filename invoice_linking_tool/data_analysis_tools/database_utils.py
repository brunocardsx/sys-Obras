"""
Utilitários para conexão e consultas no banco de dados
"""
import psycopg2
import pandas as pd
from config import DB_CONFIG

def get_connection():
    """Estabelece conexão com o banco de dados"""
    return psycopg2.connect(**DB_CONFIG)

def execute_query(query, params=None):
    """Executa uma consulta SQL e retorna os resultados"""
    with get_connection() as conn:
        return pd.read_sql_query(query, conn, params=params)

def get_project_summary():
    """Retorna resumo por projeto"""
    query = """
        SELECT 
            p.name as projeto,
            COUNT(i.id) as total_notas,
            SUM(i.total_amount) as total_gastos,
            AVG(i.total_amount) as media_gastos,
            MIN(i.issue_date) as primeira_nota,
            MAX(i.issue_date) as ultima_nota
        FROM projects p
        LEFT JOIN invoices i ON p.id = i.project_id
        GROUP BY p.id, p.name
        ORDER BY total_gastos DESC
    """
    return execute_query(query)

def get_invoice_details(project_name=None):
    """Retorna detalhes das notas fiscais"""
    query = """
        SELECT 
            i.number as numero,
            i.total_amount as valor,
            i.issue_date as data_emissao,
            p.name as projeto,
            i.status as status
        FROM invoices i
        LEFT JOIN projects p ON i.project_id = p.id
    """
    
    if project_name:
        query += " WHERE p.name ILIKE %s"
        return execute_query(query, (f'%{project_name}%',))
    
    return execute_query(query)

def get_monthly_expenses():
    """Retorna gastos mensais por projeto"""
    query = """
        SELECT 
            DATE_TRUNC('month', i.issue_date) as mes,
            p.name as projeto,
            SUM(i.total_amount) as total_gastos,
            COUNT(i.id) as total_notas
        FROM invoices i
        LEFT JOIN projects p ON i.project_id = p.id
        WHERE i.issue_date IS NOT NULL
        GROUP BY DATE_TRUNC('month', i.issue_date), p.name
        ORDER BY mes DESC, total_gastos DESC
    """
    return execute_query(query)

def get_unlinked_invoices():
    """Retorna notas fiscais sem projeto vinculado"""
    query = """
        SELECT 
            number,
            total_amount,
            issue_date,
            status
        FROM invoices 
        WHERE project_id IS NULL
        ORDER BY issue_date DESC
    """
    return execute_query(query)
