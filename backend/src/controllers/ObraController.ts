import { Request, Response } from 'express';
import { Obra } from '@/models/Obra';
import { sendSuccess, sendValidationError, sendNotFoundError, sendConflictError, sendInternalError } from '@/utils/response';
import { validateRequest } from '@/utils/validation';
import { createObraSchema, updateObraSchema } from '@/utils/validation';
import { CreateObraRequest } from '@/types';
import { logger } from '@/utils/logger';

export const createObra = async (req: Request, res: Response): Promise<void> => {
  const validation = validateRequest(createObraSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const obraData = validation.data as CreateObraRequest;
  
  try {
    const existingObra = await Obra.findOne({
      where: { name: obraData.name }
    });
    
    if (existingObra) {
      sendConflictError(res, 'Obra com este nome já existe');
      return;
    }
    
    const obra = await Obra.create(obraData);
    sendSuccess(res, obra, 'Obra criada com sucesso');
  } catch (error) {
    logger.error('Error creating obra:', error);
    sendInternalError(res);
  }
};

export const getObras = async (_req: Request, res: Response): Promise<void> => {
  try {
    const obras = await Obra.findAll({
      order: [['name', 'ASC']]
    });
    
    sendSuccess(res, obras);
  } catch (error) {
    logger.error('Error fetching obras:', error);
    sendInternalError(res);
  }
};

export const getObraById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const obraId = parseInt(id);
  
  if (isNaN(obraId)) {
    sendValidationError(res, 'ID da obra inválido');
    return;
  }
  
  try {
    const obra = await Obra.findByPk(obraId);
    
    if (!obra) {
      sendNotFoundError(res, 'Obra não encontrada');
      return;
    }
    
    sendSuccess(res, obra);
  } catch (error) {
    logger.error('Error fetching obra:', error);
    sendInternalError(res);
  }
};

export const updateObra = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const obraId = parseInt(id);
  
  if (isNaN(obraId)) {
    sendValidationError(res, 'ID da obra inválido');
    return;
  }
  
  const validation = validateRequest(updateObraSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const updateData = validation.data as Partial<CreateObraRequest>;
  
  try {
    const obra = await Obra.findByPk(obraId);
    
    if (!obra) {
      sendNotFoundError(res, 'Obra não encontrada');
      return;
    }
    
    if (updateData.name && updateData.name !== obra.name) {
      const existingObra = await Obra.findOne({
        where: { name: updateData.name }
      });
      
      if (existingObra) {
        sendConflictError(res, 'Obra com este nome já existe');
        return;
      }
    }
    
    await obra.update(updateData);
    await obra.reload();
    
    sendSuccess(res, obra, 'Obra atualizada com sucesso');
  } catch (error) {
    logger.error('Error updating obra:', error);
    sendInternalError(res);
  }
};

export const deleteObra = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const obraId = parseInt(id);
  
  if (isNaN(obraId)) {
    sendValidationError(res, 'ID da obra inválido');
    return;
  }
  
  try {
    const obra = await Obra.findByPk(obraId);
    
    if (!obra) {
      sendNotFoundError(res, 'Obra não encontrada');
      return;
    }
    
    await obra.destroy();
    sendSuccess(res, null, `Obra "${obra.name}" excluída com sucesso`);
  } catch (error) {
    logger.error('Error deleting obra:', error);
    
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      sendConflictError(res, 'Esta obra não pode ser excluída, pois está associada a uma ou mais notas fiscais');
      return;
    }
    
    sendInternalError(res);
  }
};
