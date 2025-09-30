import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendValidationError, sendUnauthorizedError } from './utils/response';
import { validateRequest } from './utils/validation';
import { loginSchema } from './utils/validation';
import { LoginRequest, LoginResponse } from './types';
import { JWT_CONFIG, HTTP_STATUS } from './types/constants';
import { logger } from './utils/logger';

export const login = async (req: Request, res: Response): Promise<void> => {
  const validation = validateRequest(loginSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const { username, password } = validation.data as LoginRequest;
  
  try {
    const adminUser = process.env['ADMIN_USER'];
    const adminPass = process.env['ADMIN_PASS'];
    const jwtSecret = process.env['JWT_SECRET'];
    
    if (!adminUser || !adminPass || !jwtSecret) {
      logger.error('Missing environment variables for authentication');
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Configuração de autenticação inválida'
      });
      return;
    }
    
    if (username !== adminUser || password !== adminPass) {
      sendUnauthorizedError(res, 'Credenciais inválidas');
      return;
    }
    
    const payload = { 
      user: username, 
      role: 'admin' as const 
    };
    
    const token = jwt.sign(payload, jwtSecret, { 
      expiresIn: JWT_CONFIG.EXPIRES_IN 
    });
    
    const response: LoginResponse = {
      message: 'Login realizado com sucesso',
      token
    };
    
    sendSuccess(res, response);
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Erro interno do servidor'
    });
  }
};

