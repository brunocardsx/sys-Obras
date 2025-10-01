// src/pages/Invoices.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Invoice as InvoiceType } from '../types';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.get('/api/invoices');
      
      if (data.status && Array.isArray(data.data)) {
        setInvoices(data.data);
      } else {
        setError('Erro ao carregar notas fiscais');
      }
    } catch (err) {
      console.error('Erro ao buscar notas fiscais:', err);
      setError('Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Notas Fiscais</h1>
        <p>Carregando notas fiscais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Notas Fiscais</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchInvoices}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Notas Fiscais ({invoices.length})</h1>
        <Link to="/invoices/create" style={{ 
          background: '#00D4AA', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}>
          + Nova Nota Fiscal
        </Link>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchInvoices}>Atualizar</button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {invoices.map((invoice) => (
          <div 
            key={invoice.id} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>Nota Fiscal #{invoice.number}</h3>
            <p><strong>Série:</strong> {invoice.series || 'N/A'}</p>
            <p><strong>Data de Emissão:</strong> {formatDate(invoice.issueDate)}</p>
            {invoice.dueDate && (
              <p><strong>Data de Vencimento:</strong> {formatDate(invoice.dueDate)}</p>
            )}
            <p><strong>Valor Total:</strong> {formatCurrency(invoice.totalAmount)}</p>
            {invoice.subtotal && (
              <p><strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}</p>
            )}
            {invoice.taxAmount && (
              <p><strong>Impostos:</strong> {formatCurrency(invoice.taxAmount)}</p>
            )}
            <p><strong>Status:</strong> {invoice.status || 'N/A'}</p>
            {invoice.paymentDate && (
              <p><strong>Data de Pagamento:</strong> {formatDate(invoice.paymentDate)}</p>
            )}
            {invoice.notes && (
              <p><strong>Observações:</strong> {invoice.notes}</p>
            )}
            <p><strong>Projeto:</strong> {invoice.project?.name || 'N/A'}</p>
            <p><strong>Itens:</strong> {invoice.items?.length || 0} produtos</p>
          </div>
        ))}
      </div>

      {invoices.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nenhuma nota fiscal encontrada
        </p>
      )}
    </div>
  );
};

export { Invoices };