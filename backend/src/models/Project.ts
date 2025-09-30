import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface ProjectAttributes {
  id?: string;
  name: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Project extends Model<ProjectAttributes> implements ProjectAttributes {
  public id?: string;
  public name!: string;
  public address?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: 'projects',
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

export { Project, type ProjectAttributes };
