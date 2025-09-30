// src/pages/Product.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product as ProductType } from '../types';

const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.get('/api/produto');
      
      if (data.status && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Produtos</h1>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Produtos</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchProducts}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Produtos ({products.length})</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchProducts}>Atualizar</button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {products.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{product.name}</h3>
            <p><strong>Código:</strong> {product.code}</p>
            <p><strong>Preço de Custo:</strong> {formatCurrency(product.costPrice)}</p>
            <p><strong>Preço de Venda:</strong> {formatCurrency(product.sellingPrice)}</p>
            <p><strong>Estoque:</strong> {product.stockQuantity || 0} {product.unit || 'un'}</p>
            <p><strong>Status:</strong> {product.isActive ? 'Ativo' : 'Inativo'}</p>
            {product.description && (
              <p><strong>Descrição:</strong> {product.description}</p>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nenhum produto encontrado
        </p>
      )}
    </div>
  );
};

export { Product };