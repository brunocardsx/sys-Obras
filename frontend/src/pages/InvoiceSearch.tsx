import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Invoice as InvoiceType, Project, Product } from '../types';
import { formatCurrency } from '../utils/format';
import '../dashboard/dashboard.css';
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
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedInvoices, setExpandedInvoices] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
    fetchProducts();
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

  const fetchProjects = async (): Promise<void> => {
    try {
      const { data } = await api.get('/api/projects');
      if (data.status) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      const { data } = await api.get('/api/products');
      if (data.status) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleViewDetails = (invoice: InvoiceType): void => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDeleteInvoice = (invoice: InvoiceType): void => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const confirmDeleteInvoice = async (): Promise<void> => {
    if (!invoiceToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      const { data } = await api.delete(`/api/invoices/${invoiceToDelete.id}`);
      
      if (data.status) {
        await fetchInvoices(filters);
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
        return;
      }
      
      setError(data.message || 'Erro ao excluir nota fiscal');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Erro ao excluir nota fiscal';
      setError(errorMessage || 'Erro ao excluir nota fiscal');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateInvoice = async (updatedInvoice: Partial<InvoiceType>): Promise<void> => {
    if (!selectedInvoice) return;

    try {
      setLoading(true);
      const { data } = await api.put(`/api/invoices/${selectedInvoice.id}`, updatedInvoice);
      
      if (data.status) {
        await fetchInvoices(filters);
        setShowDetailsModal(false);
        setSelectedInvoice(null);
        return;
      }
      
      setError(data.message || 'Erro ao atualizar nota fiscal');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Erro ao atualizar nota fiscal';
      setError(errorMessage || 'Erro ao atualizar nota fiscal');
    } finally {
      setLoading(false);
    }
  };

  const toggleInvoiceExpansion = (invoiceId: string): void => {
    const newExpanded = new Set(expandedInvoices);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedInvoices(newExpanded);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };


  return (
    <div className="invoice-search-wrapper">
      <div className="invoice-search-header">
        <h1 className="invoice-search-title">Consultar Notas Fiscais</h1>
        <div className="header-actions">
          <Link to="/invoices/create" className="action-button primary">
            <i className="fas fa-plus"></i>
            Nova Nota Fiscal
          </Link>
          <Link to="/invoices" className="action-button secondary">
            <i className="fas fa-arrow-left"></i>
            Voltar
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-card">
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
              className="dashboard-input"
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
              className="dashboard-input"
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
              className="dashboard-input"
            />
          </div>
        </div>

        <div className="filters-actions">
          <button
            type="button"
            onClick={handleSearch}
            className="action-button primary"
            disabled={loading}
          >
            <i className="fas fa-search"></i>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          
          <button
            type="button"
            onClick={handleClearFilters}
            className="action-button secondary"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="results-card">
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
          <div className="invoices-list">
            {invoices.map((invoice) => {
              const isExpanded = expandedInvoices.has(invoice.id);
              return (
                <div key={invoice.id} className="invoice-list-item">
                  <div className="invoice-list-header" onClick={() => toggleInvoiceExpansion(invoice.id)}>
                    <div className="invoice-basic-info">
                      <div className="invoice-number">
                        <i className="fas fa-file-invoice"></i>
                        #{invoice.number}
                      </div>
                      <div className="invoice-summary">
                        <span className="invoice-date">{formatDate(invoice.issueDate)}</span>
                        <span className="invoice-project">{invoice.project?.name || 'N/A'}</span>
                        <span className="invoice-amount">{formatCurrency(invoice.totalAmount)}</span>
                      </div>
                    </div>
                    <div className="invoice-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(invoice);
                        }}
                        className="action-button secondary small"
                        title="Ver detalhes"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInvoice(invoice);
                        }}
                        className="action-button danger small"
                        title="Excluir"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button 
                        className="expand-button"
                        title={isExpanded ? 'Recolher' : 'Expandir'}
                      >
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="invoice-expanded-content">
                      <div className="expanded-details">
                        <div className="detail-row">
                          <span className="detail-label">Série:</span>
                          <span className="detail-value">{invoice.series || 'N/A'}</span>
                        </div>
                        {invoice.dueDate && (
                          <div className="detail-row">
                            <span className="detail-label">Data de Vencimento:</span>
                            <span className="detail-value">{formatDate(invoice.dueDate)}</span>
                          </div>
                        )}
                        {invoice.paymentDate && (
                          <div className="detail-row">
                            <span className="detail-label">Data de Pagamento:</span>
                            <span className="detail-value">{formatDate(invoice.paymentDate)}</span>
                          </div>
                        )}
                        {invoice.notes && (
                          <div className="detail-row">
                            <span className="detail-label">Observações:</span>
                            <span className="detail-value">{invoice.notes}</span>
                          </div>
                        )}
                      </div>

                      {invoice.items && invoice.items.length > 0 && (
                        <div className="expanded-products">
                          <h4>Produtos ({invoice.items.length})</h4>
                          <div className="products-table">
                            {invoice.items.map((item, index) => (
                              <div key={index} className="product-row">
                                <span className="product-name">{item.productName}</span>
                                <span className="product-quantity">{item.quantity}</span>
                                <span className="product-unit-price">{formatCurrency(item.unitPrice)}</span>
                                <span className="product-total-price">{formatCurrency(item.totalPrice)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes da Nota Fiscal #{selectedInvoice.number}</h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-details-section">
                <h4>Informações da Nota</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Número:</label>
                    <span>{selectedInvoice.number}</span>
                  </div>
                  <div className="detail-item">
                    <label>Série:</label>
                    <span>{selectedInvoice.series || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Data de Emissão:</label>
                    <span>{formatDate(selectedInvoice.issueDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Projeto:</label>
                    <span>{selectedInvoice.project?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Valor Total:</label>
                    <span className="total-amount">{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="invoice-items-section">
                  <h4>Itens da Nota ({selectedInvoice.items.length})</h4>
                  <div className="items-table">
                    <div className="items-header">
                      <div>Produto</div>
                      <div>Quantidade</div>
                      <div>Valor Unit.</div>
                      <div>Total</div>
                    </div>
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-name">{item.productName}</div>
                        <div className="item-quantity">{item.quantity}</div>
                        <div className="item-unit-price">{formatCurrency(item.unitPrice)}</div>
                        <div className="item-total-price">{formatCurrency(item.totalPrice)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="action-button secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && invoiceToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Tem certeza que deseja excluir a nota fiscal <strong>#{invoiceToDelete.number}</strong>?</p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="action-button secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
              <button
                type="button"
                className="action-button danger"
                onClick={confirmDeleteInvoice}
                disabled={isDeleting}
              >
                <i className="fas fa-trash"></i>
                {isDeleting ? 'Excluindo...' : 'Excluir Nota Fiscal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { InvoiceSearch };
