import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Invoice as InvoiceType } from '../types';
import './InvoiceSearch.css';

interface InvoiceFilters {
  readonly startDate: string;
  readonly endDate: string;
  readonly number: string;
}

const InvoiceSearch: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<InvoiceFilters>({
    startDate: '',
    endDate: '',
    number: ''
  });
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Carregar todas as notas fiscais inicialmente
    fetchInvoices();
  }, []);

  const fetchInvoices = async (searchFilters?: InvoiceFilters): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      
      if (searchFilters) {
        if (searchFilters.startDate) {
          params.append('startDate', searchFilters.startDate);
        }
        if (searchFilters.endDate) {
          params.append('endDate', searchFilters.endDate);
        }
        if (searchFilters.number) {
          params.append('number', searchFilters.number);
        }
      }
      
      const queryString = params.toString();
      const url = queryString ? `/api/invoices?${queryString}` : '/api/invoices';
      
      const { data } = await api.get(url);
      
      if (data.status && Array.isArray(data.data)) {
        setInvoices(data.data);
        setHasSearched(true);
        return;
      }
      
      setError('Erro ao carregar notas fiscais');
    } catch (err) {
      console.error('Erro ao buscar notas fiscais:', err);
      setError('Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof InvoiceFilters, value: string): void => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (): void => {
    fetchInvoices(filters);
  };

  const handleClearFilters = (): void => {
    setFilters({
      startDate: '',
      endDate: '',
      number: ''
    });
    fetchInvoices();
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

  const getStatusBadge = (status?: string): JSX.Element => {
    const statusConfig = {
      paid: { class: 'status-paid', text: 'Pago' },
      pending: { class: 'status-pending', text: 'Pendente' },
      default: { class: 'status-default', text: status || 'N/A' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="invoice-search-container">
      <div className="invoice-search-header">
        <h1>Consultar Notas Fiscais</h1>
        <div className="header-actions">
          <Link to="/invoices/create" className="create-button">
            <i className="fas fa-plus"></i>
            Nova Nota Fiscal
          </Link>
          <Link to="/invoices" className="back-button">
            <i className="fas fa-arrow-left"></i>
            Voltar
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h2>
            <i className="fas fa-filter"></i>
            Filtros de Busca
          </h2>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="startDate">
              <i className="fas fa-calendar-alt"></i>
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              placeholder="Selecione a data inicial"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">
              <i className="fas fa-calendar-alt"></i>
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              placeholder="Selecione a data final"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="number">
              <i className="fas fa-file-invoice"></i>
              Número da Nota
            </label>
            <input
              type="text"
              id="number"
              value={filters.number}
              onChange={(e) => handleFilterChange('number', e.target.value)}
              placeholder="Digite o número da nota"
            />
          </div>
        </div>

        <div className="filters-actions">
          <button
            type="button"
            onClick={handleSearch}
            className="search-button"
            disabled={loading}
          >
            <i className="fas fa-search"></i>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          
          <button
            type="button"
            onClick={handleClearFilters}
            className="clear-button"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="results-section">
        <div className="results-header">
          <h2>
            <i className="fas fa-list"></i>
            Resultados da Busca
            {hasSearched && (
              <span className="results-count">
                ({invoices.length} nota{invoices.length !== 1 ? 's' : ''} encontrada{invoices.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Carregando notas fiscais...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>
              {hasSearched 
                ? 'Nenhuma nota fiscal encontrada com os filtros aplicados'
                : 'Digite os filtros e clique em "Buscar" para consultar as notas fiscais'
              }
            </p>
          </div>
        ) : (
          <div className="invoices-grid">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="invoice-card">
                <div className="invoice-card-header">
                  <div className="invoice-number">
                    <i className="fas fa-file-invoice"></i>
                    #{invoice.number}
                    {invoice.series && <span className="invoice-series">Série: {invoice.series}</span>}
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>

                <div className="invoice-card-body">
                  <div className="invoice-info">
                    <div className="info-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span className="info-label">Data de Emissão:</span>
                      <span className="info-value">{formatDate(invoice.issueDate)}</span>
                    </div>

                    {invoice.dueDate && (
                      <div className="info-item">
                        <i className="fas fa-calendar-check"></i>
                        <span className="info-label">Data de Vencimento:</span>
                        <span className="info-value">{formatDate(invoice.dueDate)}</span>
                      </div>
                    )}

                    <div className="info-item">
                      <i className="fas fa-building-columns"></i>
                      <span className="info-label">Projeto:</span>
                      <span className="info-value">{invoice.project?.name || 'N/A'}</span>
                    </div>

                    {invoice.paymentDate && (
                      <div className="info-item">
                        <i className="fas fa-money-bill-wave"></i>
                        <span className="info-label">Data de Pagamento:</span>
                        <span className="info-value">{formatDate(invoice.paymentDate)}</span>
                      </div>
                    )}

                    {invoice.notes && (
                      <div className="info-item notes-item">
                        <i className="fas fa-comment"></i>
                        <span className="info-label">Observações:</span>
                        <span className="info-value">{invoice.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="invoice-amounts">
                    <div className="amount-item">
                      <span className="amount-label">Valor Total:</span>
                      <span className="amount-value total">{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                    
                    {invoice.subtotal && (
                      <div className="amount-item">
                        <span className="amount-label">Subtotal:</span>
                        <span className="amount-value">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                    )}
                    
                    {invoice.taxAmount && (
                      <div className="amount-item">
                        <span className="amount-label">Impostos:</span>
                        <span className="amount-value">{formatCurrency(invoice.taxAmount)}</span>
                      </div>
                    )}
                  </div>

                  {invoice.items && invoice.items.length > 0 && (
                    <div className="invoice-items">
                      <div className="items-header">
                        <i className="fas fa-box"></i>
                        <span>Itens ({invoice.items.length})</span>
                      </div>
                      <div className="items-list">
                        {invoice.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="item-row">
                            <span className="item-name">{item.productName}</span>
                            <span className="item-details">
                              {item.quantity}x {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                        {invoice.items.length > 3 && (
                          <div className="more-items">
                            +{invoice.items.length - 3} item(s) adicional(is)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="invoice-card-footer">
                  <Link 
                    to={`/invoices/${invoice.id}`} 
                    className="view-details-button"
                  >
                    <i className="fas fa-eye"></i>
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { InvoiceSearch };
