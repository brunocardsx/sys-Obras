import { Product } from './Product';
import { Obra } from './Obra';
import { NotaFiscal } from './NotaFiscal';
import { ItemNotaFiscal } from './ItemNotaFiscal';

// Define associations
const setupAssociations = (): void => {
  // Obra has many NotaFiscal
  Obra.hasMany(NotaFiscal, {
    foreignKey: 'obraId',
    as: 'notasFiscais',
  });
  
  // NotaFiscal belongs to Obra
  NotaFiscal.belongsTo(Obra, {
    foreignKey: 'obraId',
    as: 'obra',
  });
  
  // NotaFiscal has many ItemNotaFiscal
  NotaFiscal.hasMany(ItemNotaFiscal, {
    foreignKey: 'notaFiscalId',
    as: 'itens',
  });
  
  // ItemNotaFiscal belongs to NotaFiscal
  ItemNotaFiscal.belongsTo(NotaFiscal, {
    foreignKey: 'notaFiscalId',
    as: 'notaFiscal',
  });
  
  // Product has many ItemNotaFiscal
  Product.hasMany(ItemNotaFiscal, {
    foreignKey: 'produtoId',
    as: 'itensNotaFiscal',
  });
  
  // ItemNotaFiscal belongs to Product
  ItemNotaFiscal.belongsTo(Product, {
    foreignKey: 'produtoId',
    as: 'produto',
  });
};

// Setup associations
setupAssociations();

export { Product, Obra, NotaFiscal, ItemNotaFiscal };

