import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/services/database';

interface ItemNotaFiscalAttributes {
  id?: number;
  notaFiscalId: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class ItemNotaFiscal extends Model<ItemNotaFiscalAttributes> implements ItemNotaFiscalAttributes {
  public id?: number;
  public notaFiscalId!: number;
  public produtoId!: number;
  public quantidade!: number;
  public valorUnitario!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

ItemNotaFiscal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notaFiscalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notas_fiscais',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    valorUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'itens_nota_fiscal',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['nota_fiscal_id'],
      },
      {
        fields: ['produto_id'],
      },
    ],
  }
);

export { ItemNotaFiscal };