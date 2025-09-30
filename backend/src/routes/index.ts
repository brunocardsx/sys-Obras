import { Application } from 'express';
import { authRoutes } from './authRoutes';
import { productRoutes } from './productRoutes';
import { obraRoutes } from './obraRoutes';
import { API_ROUTES } from '../types/constants';

export const setupRoutes = (app: Application): void => {
  // Public routes
  app.use(API_ROUTES.AUTH, authRoutes);
  
  // Protected routes
  app.use(API_ROUTES.PRODUCTS, productRoutes);
  app.use(API_ROUTES.OBRAS, obraRoutes);
  
  // TODO: Add other routes as they are refactored
  // app.use(API_ROUTES.NOTAS_FISCAIS, notaFiscalRoutes);
  // app.use(API_ROUTES.SALES, saleRoutes);
};

