import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { sendSuccess, sendValidationError, sendNotFoundError, sendConflictError, sendInternalError } from '../utils/response';
import { validateRequest } from '../utils/validation';
import { createProductSchema, updateProductSchema } from '../utils/validation';
import { CreateProductRequest } from '../types';
import { logger } from '../utils/logger';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const validation = validateRequest(createProductSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const productData = validation.data as CreateProductRequest;
  
  try {
    // Check if product already exists
    const existingProduct = await Product.findOne({
      where: { name: productData.name }
    });
    
    if (existingProduct) {
      sendConflictError(res, 'Produto com este nome já existe');
      return;
    }
    
    const product = await Product.create(productData);
    sendSuccess(res, product, 'Produto criado com sucesso');
  } catch (error) {
    logger.error('Error creating product:', error);
    sendInternalError(res);
  }
};

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll({
      order: [['name', 'ASC']]
    });
    
    sendSuccess(res, products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    sendInternalError(res);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    sendValidationError(res, 'ID do produto inválido');
    return;
  }
  
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      sendNotFoundError(res, 'Produto não encontrado');
      return;
    }
    
    sendSuccess(res, product);
  } catch (error) {
    logger.error('Error fetching product:', error);
    sendInternalError(res);
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    sendValidationError(res, 'ID do produto inválido');
    return;
  }
  
  const validation = validateRequest(updateProductSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const updateData = validation.data as Partial<CreateProductRequest>;
  
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      sendNotFoundError(res, 'Produto não encontrado');
      return;
    }
    
    // Check if name is being updated and if it already exists
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await Product.findOne({
        where: { name: updateData.name }
      });
      
      if (existingProduct) {
        sendConflictError(res, 'Produto com este nome já existe');
        return;
      }
    }
    
    await product.update(updateData);
    await product.reload();
    
    sendSuccess(res, product, 'Produto atualizado com sucesso');
  } catch (error) {
    logger.error('Error updating product:', error);
    sendInternalError(res);
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    sendValidationError(res, 'ID do produto inválido');
    return;
  }
  
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      sendNotFoundError(res, 'Produto não encontrado');
      return;
    }
    
    await product.destroy();
    sendSuccess(res, null, `Produto "${product.name}" excluído com sucesso`);
  } catch (error) {
    logger.error('Error deleting product:', error);
    
    // Check if it's a foreign key constraint error
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      sendConflictError(res, 'Este produto não pode ser excluído, pois está associado a uma ou mais notas fiscais');
      return;
    }
    
    sendInternalError(res);
  }
};

