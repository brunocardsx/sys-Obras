import Joi from 'joi';
import { CreateProductRequest, CreateObraRequest, CreateNotaFiscalRequest, LoginRequest } from '../types';

// Product validation schemas
export const createProductSchema = Joi.object<CreateProductRequest>({
  name: Joi.string().trim().min(1).max(255).required(),
  brand: Joi.string().trim().max(255).optional(),
  cost: Joi.number().min(0).precision(2).optional(),
  resalePrice: Joi.number().min(0).precision(2).optional(),
});

export const updateProductSchema = Joi.object<Partial<CreateProductRequest>>({
  name: Joi.string().trim().min(1).max(255).optional(),
  brand: Joi.string().trim().max(255).optional(),
  cost: Joi.number().min(0).precision(2).optional(),
  resalePrice: Joi.number().min(0).precision(2).optional(),
});

// Obra validation schemas
export const createObraSchema = Joi.object<CreateObraRequest>({
  name: Joi.string().trim().min(1).max(255).required(),
  address: Joi.string().trim().max(500).optional(),
});

export const updateObraSchema = Joi.object<Partial<CreateObraRequest>>({
  name: Joi.string().trim().min(1).max(255).optional(),
  address: Joi.string().trim().max(500).optional(),
});

// Nota Fiscal validation schemas
export const createNotaFiscalSchema = Joi.object<CreateNotaFiscalRequest>({
  numero: Joi.string().trim().min(1).max(100).required(),
  dataEmissao: Joi.date().iso().required(),
  obraId: Joi.number().integer().positive().required(),
  itens: Joi.array().items(
    Joi.object({
      produtoId: Joi.number().integer().positive().required(),
      quantidade: Joi.number().positive().required(),
      valorUnitario: Joi.number().positive().precision(2).required(),
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

