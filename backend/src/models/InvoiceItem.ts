import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface InvoiceItemAttributes {
  id?: string;
  invoiceId: string;
  productId?: string;
  productName: string;
  productCode?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class InvoiceItem extends Model<InvoiceItemAttributes> implements InvoiceItemAttributes {
  public id?: string;
  public invoiceId!: string;
  public productId?: string;
  public productName!: string;
  public productCode?: string;
  public description?: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'invoice_id',
      references: {
        model: 'invoices',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'product_name',
    },
    productCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'product_code',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'unit_price',
      validate: {
        min: 0,
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_price',
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'invoice_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        fields: ['invoice_id'],
      },
      {
        fields: ['product_id'],
      },
    ],
  }
);

export { InvoiceItem, type InvoiceItemAttributes };
