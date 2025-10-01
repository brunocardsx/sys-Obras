import React from 'react';
import { TopProduct } from '../../types';
import { formatCurrency } from '../../utils/format';

interface TopProductsListProps {
  readonly products: TopProduct[];
  readonly loading?: boolean;
  readonly onProductClick?: (productName: string) => void;
}

export const TopProductsList: React.FC<TopProductsListProps> = ({
  products,
  loading = false,
  onProductClick
}) => {
  const handleProductClick = (productName: string): void => {
    onProductClick?.(productName);
  };

  if (loading) {
    return (
      <div className="top-products-list">
        <div className="top-products-list__loading">
          <i className="fas fa-spinner fa-spin" />
          <span>Carregando produtos...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="top-products-list">
        <div className="top-products-list__empty">
          <i className="fas fa-box" />
          <span>Nenhum produto encontrado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="top-products-list">
      <div className="top-products-list__header">
        <h4>Produtos Mais Utilizados</h4>
        <span className="top-products-list__count">
          {products.length} produtos
        </span>
      </div>
      
      <div className="top-products-list__content">
        {products.map((product, index) => (
          <div
            key={product.productName}
            className="top-products-list__item"
            onClick={() => handleProductClick(product.productName)}
          >
            <div className="top-products-list__item-rank">
              #{index + 1}
            </div>
            
            <div className="top-products-list__item-info">
              <span className="top-products-list__item-name">
                {product.productName}
              </span>
              <div className="top-products-list__item-metrics">
                <span className="top-products-list__item-quantity">
                  {product.totalQuantity.toFixed(2)} unidades
                </span>
                <span className="top-products-list__item-value">
                  {formatCurrency(product.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
