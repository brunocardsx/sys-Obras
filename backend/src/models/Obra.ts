import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface ObraAttributes {
  id?: number;
  name: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Obra extends Model<ObraAttributes> implements ObraAttributes {
  public id?: number;
  public name!: string;
  public address?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Obra.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
  },
  {
    sequelize,
    tableName: 'obras',
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

export { Obra };
