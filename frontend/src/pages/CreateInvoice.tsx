import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Project, Product, CreateInvoiceRequest, CreateInvoiceItemRequest } from '../types';
import { formatCurrency } from '../utils/format';
import './CreateInvoice.css';

interface InvoiceFormData {
  readonly number: string;
  readonly projectId: string;
  readonly issueDate: string;
  readonly notes?: string;
}

interface InvoiceItemFormData {
  readonly productId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState<boolean>(false);
  const [showNewProductModal, setShowNewProductModal] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    number: '',
    projectId: '',
    issueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItemFormData>>({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemFormData[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentItem.productId) {
      const product = products.find(p => p.id === currentItem.productId);
      if (product) {
        setCurrentItem(prev => ({
          ...prev,
          productName: product.name,
          unitPrice: product.costPrice,
          totalPrice: (prev?.quantity || 1) * product.costPrice
        }));
      }
    }
  }, [currentItem.productId, products]);

  useEffect(() => {
    if (currentItem.quantity && currentItem.unitPrice) {
      setCurrentItem(prev => ({
        ...prev,
        totalPrice: prev.quantity! * prev.unitPrice!
      }));
    }
  }, [currentItem.quantity, currentItem.unitPrice]);

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
        setFilteredProducts(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const createNewProduct = async (): Promise<void> => {
    if (!newProductName.trim()) {
      setError('Nome do produto é obrigatório');
      return;
    }

    setIsCreatingProduct(true);
    setError('');

    try {
      const productCode = `PROD-${Date.now()}`;
      const { data } = await api.post('/api/products', {
        code: productCode,
        name: newProductName.trim(),
        costPrice: 0,
        sellingPrice: 0
      });

      if (data.status) {
        // Atualizar lista de produtos
        await fetchProducts();
        
        // Selecionar o novo produto automaticamente
        const newProduct = data.data;
        setCurrentItem({
          productId: newProduct.id,
          productName: newProduct.name,
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        });

        // Fechar modal e limpar
        setShowNewProductModal(false);
        setNewProductName('');
        setShowProductDropdown(false);
      } else {
        setError(data.message || 'Erro ao criar produto');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar produto');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleProductSearch = (searchTerm: string): void => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      setShowProductDropdown(false);
      setCurrentItem({
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      });
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowProductDropdown(true);
    
    // Se não encontrou produto exato, permite digitação livre
    const exactMatch = products.find(product => 
      product.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (!exactMatch) {
      setCurrentItem({
        productId: '',
        productName: searchTerm,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      });
    }
  };

  const handleProductInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      setShowNewProductModal(true);
    }
  };

  const handleDeleteProduct = (product: Product): void => {
    setProductToDelete(product);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteProduct = async (): Promise<void> => {
    if (!productToDelete) return;

    setIsDeletingProduct(true);
    setError('');

    try {
      const { data } = await api.delete(`/api/products/${productToDelete.id}`);
      
      if (data.status) {
        // Atualizar lista de produtos
        await fetchProducts();
        
        // Limpar seleção se o produto deletado estava selecionado
        if (currentItem.productId === productToDelete.id) {
          setCurrentItem({
            productId: '',
            productName: '',
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0
          });
        }
      } else {
        setError(data.message || 'Erro ao deletar produto');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao deletar produto');
    } finally {
      setIsDeletingProduct(false);
      setShowDeleteConfirmModal(false);
      setProductToDelete(null);
    }
  };

  const selectProduct = (product: Product): void => {
    setCurrentItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.costPrice,
      totalPrice: product.costPrice
    });
    setShowProductDropdown(false);
  };

  const addItemToInvoice = (): void => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.unitPrice || currentItem.unitPrice <= 0) {
      setError('Preencha todos os campos do item com valores válidos');
      return;
    }

    const newItem: InvoiceItemFormData = {
      productId: currentItem.productId,
      productName: currentItem.productName!,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      totalPrice: currentItem.totalPrice!
    };

    setInvoiceItems(prev => [...prev, newItem]);
    setCurrentItem({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
    setError('');
  };

  const removeItemFromInvoice = (index: number): void => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalAmount = (): number => {
    return invoiceItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.number || !formData.projectId || invoiceItems.length === 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totalAmount = calculateTotalAmount();
      
      const invoiceRequest: CreateInvoiceRequest = {
        number: formData.number,
        projectId: formData.projectId,
        issueDate: formData.issueDate,
        totalAmount,
        status: 'pending',
        ...(formData.notes && formData.notes.trim() && { notes: formData.notes }),
        items: invoiceItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const { data } = await api.post('/api/invoices', invoiceRequest);
      
      if (data.status) {
        navigate('/invoices');
      } else {
        setError(data.message || 'Erro ao criar nota fiscal');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar nota fiscal');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleItemChange = (field: keyof InvoiceItemFormData, value: string | number): void => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="create-invoice-container">
      <div className="create-invoice-header">
        <h1>Cadastrar Nota Fiscal</h1>
        <button 
          type="button" 
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-invoice-form">
        <div className="invoice-form-sections">
          {/* Seção 1: Lançamento da Nota Fiscal */}
          <div className="invoice-section">
            <h2>Lançamento da Nota Fiscal</h2>
            
            <div className="form-group">
              <label htmlFor="invoiceNumber">Número da Nota Fiscal</label>
              <input
                type="text"
                id="invoiceNumber"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="Digite o número da nota fiscal"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project">Projeto (Obra)</label>
              <select
                id="project"
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                required
              >
                <option value="">Selecione um projeto</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="issueDate">Data da Nota Fiscal</label>
              <input
                type="date"
                id="issueDate"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productSearch">
                Selecione ou Crie um Produto
                <span className="shortcut-hint">(CTRL + ENTER para criar novo)</span>
              </label>
              <div className="product-search-container">
                <input
                  type="text"
                  id="productSearch"
                  value={currentItem.productName || ''}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  onFocus={() => setShowProductDropdown(true)}
                  onKeyDown={handleProductInputKeyDown}
                  placeholder="Pesquise ou digite para criar... (CTRL + ENTER para novo produto)"
                />
                {showProductDropdown && filteredProducts.length > 0 && (
                  <div className="product-dropdown">
                    {filteredProducts.map(product => (
                      <div
                        key={product.id}
                        className="product-option"
                      >
                        <span 
                          className="product-name"
                          onClick={() => selectProduct(product)}
                        >
                          {product.name}
                        </span>
                        <button
                          type="button"
                          className="delete-product-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product);
                          }}
                          title="Excluir produto"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="item-details">
              <div className="form-group">
                <label htmlFor="quantity">Quantidade</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  step="0.001"
                  value={currentItem.quantity || 1}
                  onChange={(e) => handleItemChange('quantity', parseFloat(e.target.value) || 1)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="unitPrice">Valor Unitário</label>
                <input
                  type="number"
                  id="unitPrice"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice || 0}
                  onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalPrice">Total</label>
                <input
                  type="text"
                  id="totalPrice"
                  value={formatCurrency(currentItem.totalPrice || 0)}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <button
                type="button"
                onClick={addItemToInvoice}
                className="add-item-button"
                disabled={!currentItem.productId}
              >
                Adicionar Item
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>

          {/* Seção 2: Itens da Nota */}
          <div className="invoice-section">
            <h2>Itens da Nota</h2>
            
            {invoiceItems.length > 0 ? (
              <div className="invoice-items-table">
                <div className="table-header">
                  <div className="col-product">PRODUTO</div>
                  <div className="col-quantity">QTD.</div>
                  <div className="col-unit">VLR. UNIT.</div>
                  <div className="col-total">TOTAL</div>
                  <div className="col-actions">AÇÕES</div>
                </div>
                
                {invoiceItems.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="col-product">{item.productName}</div>
                    <div className="col-quantity">{item.quantity}</div>
                    <div className="col-unit">{formatCurrency(item.unitPrice)}</div>
                    <div className="col-total">{formatCurrency(item.totalPrice)}</div>
                    <div className="col-actions">
                      <button
                        type="button"
                        onClick={() => removeItemFromInvoice(index)}
                        className="remove-item-button"
                        title="Remover item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="table-footer">
                  <div className="total-label">Total:</div>
                  <div className="total-value">{formatCurrency(calculateTotalAmount())}</div>
                </div>
              </div>
            ) : (
              <div className="no-items-message">
                <p>Nenhum item adicionado à nota fiscal</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || invoiceItems.length === 0}
            className="save-button"
          >
            {loading ? 'Salvando...' : 'Salvar Nota Fiscal'}
          </button>
        </div>
      </form>

      {/* Modal para criar novo produto */}
      {showNewProductModal && (
        <div className="modal-overlay" onClick={() => setShowNewProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Criar Novo Produto</h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowNewProductModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="newProductName">Nome do Produto</label>
                <input
                  type="text"
                  id="newProductName"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Digite o nome do produto"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createNewProduct();
                    }
                    if (e.key === 'Escape') {
                      setShowNewProductModal(false);
                    }
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowNewProductModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="save-button"
                onClick={createNewProduct}
                disabled={isCreatingProduct || !newProductName.trim()}
              >
                {isCreatingProduct ? 'Criando...' : 'Criar Produto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para deletar produto */}
      {showDeleteConfirmModal && productToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Tem certeza que deseja excluir o produto <strong>"{productToDelete.name}"</strong>?</p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={confirmDeleteProduct}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? 'Excluindo...' : 'Excluir Produto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CreateInvoice };
