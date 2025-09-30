import { Product } from './Product';
import { Project } from './Project';
import { Invoice } from './Invoice';
import { InvoiceItem } from './InvoiceItem';

export const initializeAssociations = (): void => {
  Project.hasMany(Invoice, {
    foreignKey: 'projectId',
    as: 'invoices',
  });

  Invoice.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project',
  });

  Invoice.hasMany(InvoiceItem, {
    foreignKey: 'invoiceId',
    as: 'items',
  });

  InvoiceItem.belongsTo(Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice',
  });

  Product.hasMany(InvoiceItem, {
    foreignKey: 'productId',
    as: 'invoiceItems',
  });

  InvoiceItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });
};

