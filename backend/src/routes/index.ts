import { Application } from 'express';
import { authRoutes } from './authRoutes';
import { productRoutes } from './productRoutes';
import { projectRoutes } from './projectRoutes';
import { invoiceRoutes } from './invoiceRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { API_ROUTES } from '../types/constants';

export const setupRoutes = (app: Application): void => {
  app.use(API_ROUTES.AUTH, authRoutes);
  app.use(API_ROUTES.PRODUCTS, productRoutes);
  app.use(API_ROUTES.PROJECTS, projectRoutes);
  app.use(API_ROUTES.INVOICES, invoiceRoutes);
  app.use(API_ROUTES.DASHBOARD, dashboardRoutes);
};

