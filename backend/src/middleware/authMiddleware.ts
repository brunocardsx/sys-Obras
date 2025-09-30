import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendUnauthorizedError, sendForbiddenError } from '@/utils/response';
import { AuthPayload } from '@/types';
// import { JWT_CONFIG } from '@/types/constants';
import { logger } from '@/utils/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorizedError(res, 'Token de acesso não fornecido');
    return;
  }
  
  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env['JWT_SECRET'];
  
  if (!jwtSecret) {
    logger.error('JWT_SECRET not configured');
    res.status(500).json({
      status: false,
      message: 'Configuração de autenticação inválida'
    });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      sendUnauthorizedError(res, 'Token expirado');
      return;
    }
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt:', { error: error instanceof Error ? error.message : 'Unknown error' });
    sendUnauthorizedError(res, 'Token inválido');
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    sendUnauthorizedError(res, 'Usuário não autenticado');
    return;
  }
  
  if (req.user.role !== 'admin') {
    sendForbiddenError(res, 'Acesso negado. Apenas administradores podem acessar este recurso');
    return;
  }
  
  next();
};

