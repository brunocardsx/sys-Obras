import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

interface InvoiceAttributes {
  id?: string;
  number: string;
  series?: string;
  supplierId?: string;
  projectId: string;
  issueDate: Date;
  dueDate?: Date;
  subtotal?: number;
  taxAmount?: number;
  totalAmount: number;
  status?: string;
  paymentDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
  public id?: string;
  public number!: string;
  public series?: string;
  public supplierId?: string;
  public projectId!: string;
  public issueDate!: Date;
  public dueDate?: Date;
  public subtotal?: number;
  public taxAmount?: number;
  public totalAmount!: number;
  public status?: string;
  public paymentDate?: Date;
  public notes?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    series: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20],
      },
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'supplier_id',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'issue_date',
      validate: {
        isDate: true,
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date',
      validate: {
        isDate: true,
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'tax_amount',
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_amount',
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'pending',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'payment_date',
      validate: {
        isDate: true,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['number'],
      },
      {
        fields: ['project_id'],
      },
      {
        fields: ['issue_date'],
      },
      {
        fields: ['supplier_id'],
      },
    ],
  }
);

export { Invoice, type InvoiceAttributes };

