import React from 'react';
import { RecentInvoice } from '../../types';
import { formatCurrency } from '../../utils/format';

interface RecentInvoicesListProps {
  readonly invoices: RecentInvoice[];
  readonly loading?: boolean;
  readonly onInvoiceClick?: (invoiceId: string) => void;
}

export const RecentInvoicesList: React.FC<RecentInvoicesListProps> = ({
  invoices,
  loading = false,
  onInvoiceClick
}) => {
  const handleInvoiceClick = (invoiceId: string): void => {
    onInvoiceClick?.(invoiceId);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="recent-invoices-list">
        <div className="recent-invoices-list__loading">
          <i className="fas fa-spinner fa-spin" />
          <span>Carregando notas fiscais...</span>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="recent-invoices-list">
        <div className="recent-invoices-list__empty">
          <i className="fas fa-file-invoice" />
          <span>Nenhuma nota fiscal encontrada</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-invoices-list">
      <div className="recent-invoices-list__header">
        <h4>Notas Fiscais Recentes</h4>
        <span className="recent-invoices-list__count">
          {invoices.length} notas
        </span>
      </div>
      
      <div className="recent-invoices-list__content">
        {invoices.map(invoice => (
          <div
            key={invoice.id}
            className="recent-invoices-list__item"
            onClick={() => handleInvoiceClick(invoice.id)}
          >
            <div className="recent-invoices-list__item-header">
              <span className="recent-invoices-list__item-number">
                #{invoice.number}
              </span>
              <span className="recent-invoices-list__item-date">
                {formatDate(invoice.issueDate)}
              </span>
            </div>
            
            <div className="recent-invoices-list__item-details">
              <span className="recent-invoices-list__item-project">
                {invoice.projectName}
              </span>
              <span className="recent-invoices-list__item-amount">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
