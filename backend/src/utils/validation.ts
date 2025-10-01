import Joi from 'joi';
import { CreateProductRequest, CreateProjectRequest, CreateInvoiceRequest, LoginRequest } from '../types';

// Product validation schemas
export const createProductSchema = Joi.object<CreateProductRequest>({
  code: Joi.string().trim().min(1).max(100).required(),
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().optional(),
  categoryId: Joi.string().uuid().optional(),
  unit: Joi.string().trim().max(20).optional(),
  costPrice: Joi.number().min(0).precision(2).optional(),
  sellingPrice: Joi.number().min(0).precision(2).optional(),
  stockQuantity: Joi.number().min(0).precision(3).optional(),
  minStock: Joi.number().min(0).precision(3).optional(),
  maxStock: Joi.number().min(0).precision(3).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object<Partial<CreateProductRequest>>({
  code: Joi.string().trim().min(1).max(100).optional(),
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().trim().optional(),
  categoryId: Joi.string().uuid().optional(),
  unit: Joi.string().trim().max(20).optional(),
  costPrice: Joi.number().min(0).precision(2).optional(),
  sellingPrice: Joi.number().min(0).precision(2).optional(),
  stockQuantity: Joi.number().min(0).precision(3).optional(),
  minStock: Joi.number().min(0).precision(3).optional(),
  maxStock: Joi.number().min(0).precision(3).optional(),
  isActive: Joi.boolean().optional(),
});

// Project validation schemas
export const createProjectSchema = Joi.object<CreateProjectRequest>({
  name: Joi.string().trim().min(1).max(255).required(),
  address: Joi.string().trim().max(500).optional(),
});

export const updateProjectSchema = Joi.object<Partial<CreateProjectRequest>>({
  name: Joi.string().trim().min(1).max(255).optional(),
  address: Joi.string().trim().max(500).optional(),
});

// Invoice validation schemas
export const createInvoiceSchema = Joi.object<CreateInvoiceRequest>({
  number: Joi.string().trim().min(1).max(100).required(),
  series: Joi.string().trim().max(20).optional(),
  supplierId: Joi.string().uuid().optional(),
  projectId: Joi.string().uuid().required(),
  issueDate: Joi.date().iso().required(),
  dueDate: Joi.date().iso().optional(),
  subtotal: Joi.number().min(0).precision(2).optional(),
  taxAmount: Joi.number().min(0).precision(2).optional(),
  totalAmount: Joi.number().min(0).precision(2).required(),
  status: Joi.string().trim().max(50).optional(),
  paymentDate: Joi.date().iso().optional(),
  notes: Joi.string().trim().allow('').optional(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required(),
      quantity: Joi.number().positive().required(),
      unitPrice: Joi.number().positive().precision(2).required(),
    })
  ).min(1).required(),
});

// Auth validation schemas
export const loginSchema = Joi.object<LoginRequest>({
  username: Joi.string().trim().min(1).max(255).required(),
  password: Joi.string().min(1).max(255).required(),
});

// Generic validation function
export const validateRequest = <T>(
  schema: Joi.ObjectSchema<T>,
  data: unknown
): { isValid: boolean; data?: T; error?: string } => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join(', ');
    return { isValid: false, error: errorMessage };
  }
  
  return { isValid: true, data: value };
};

