import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/response';
import { logger } from '../utils/logger';

// Middleware para validar UUIDs
export const validateUuid = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const uuid = req.params[paramName];
    
    if (!uuid) {
      sendValidationError(res, `${paramName} é obrigatório`);
      return;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(uuid)) {
      logger.warn(`Invalid UUID format for ${paramName}:`, { uuid, ip: req.ip });
      sendValidationError(res, `${paramName} deve ser um UUID válido`);
      return;
    }
    
    next();
  };
};

// Middleware para sanitizar entrada
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Remove caracteres HTML básicos
      .trim()
      .substring(0, 1000); // Limita tamanho
  };
  
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
  next();
};

// Middleware para validar limites de paginação
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  if (page < 1 || page > 1000) {
    sendValidationError(res, 'Página deve estar entre 1 e 1000');
    return;
  }
  
  if (limit < 1 || limit > 100) {
    sendValidationError(res, 'Limite deve estar entre 1 e 100');
    return;
  }
  
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  
  next();
};
