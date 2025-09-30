import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface NotaFiscalAttributes {
  id?: number;
  numero: string;
  dataEmissao: Date;
  obraId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class NotaFiscal extends Model<NotaFiscalAttributes> implements NotaFiscalAttributes {
  public id?: number;
  public numero!: string;
  public dataEmissao!: Date;
  public obraId!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

NotaFiscal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    dataEmissao: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    obraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'obras',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'notas_fiscais',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['numero'],
      },
      {
        fields: ['obra_id'],
      },
      {
        fields: ['data_emissao'],
      },
    ],
  }
);

export { NotaFiscal };
