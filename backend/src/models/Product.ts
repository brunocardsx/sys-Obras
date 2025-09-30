import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface ProductAttributes {
  id?: number;
  name: string;
  brand?: string;
  cost: number;
  resalePrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id?: number;
  public name!: string;
  public brand?: string;
  public cost!: number;
  public resalePrice!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255],
      },
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },
    resalePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'produtos',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

export { Product };

