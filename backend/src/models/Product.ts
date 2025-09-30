import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface ProductAttributes {
  id?: string;
  code: string;
  name: string;
  description?: string;
  categoryId?: string;
  unit?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity?: number;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id?: string;
  public code!: string;
  public name!: string;
  public description?: string;
  public categoryId?: string;
  public unit?: string;
  public costPrice!: number;
  public sellingPrice!: number;
  public stockQuantity?: number;
  public minStock?: number;
  public maxStock?: number;
  public isActive?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'category_id',
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'un',
    },
    costPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'cost_price',
      validate: {
        min: 0,
      },
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'selling_price',
      validate: {
        min: 0,
      },
    },
    stockQuantity: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: true,
      defaultValue: 0,
      field: 'stock_quantity',
    },
    minStock: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: true,
      defaultValue: 0,
      field: 'min_stock',
    },
    maxStock: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: true,
      field: 'max_stock',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

export { Product, type ProductAttributes };

