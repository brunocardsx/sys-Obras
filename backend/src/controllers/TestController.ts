import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice';
import { Project } from '../models/Project';
import { Product } from '../models/Product';
import { sendSuccess, sendInternalError } from '../utils/response';
import { logger } from '../utils/logger';
import { Op } from 'sequelize';

export const testDashboardData = async (_req: Request, res: Response): Promise<void> => {
  try {
    logger.debug('Testing dashboard data...');
    
    // Buscar dados básicos
    const [
      totalProjects,
      totalInvoices,
      totalProducts,
      sampleInvoices,
      sampleProjects,
      invoicesWithProject,
      invoicesWithoutProject
    ] = await Promise.all([
      Project.count(),
      Invoice.count(),
      Product.count(),
      Invoice.findAll({ 
        limit: 5,
        include: [
          { 
            model: Project, 
            as: 'project',
            required: false
          }
        ]
      }),
      Project.findAll({ limit: 5 }),
      Invoice.count({ where: { projectId: { [Op.ne]: null } } }),
      Invoice.count({ where: { projectId: null } })
    ]);

    const testData = {
      counts: {
        totalProjects,
        totalInvoices,
        totalProducts,
        invoicesWithProject,
        invoicesWithoutProject
      },
      sampleData: {
        invoices: sampleInvoices.map(invoice => ({
          id: invoice.id,
          number: invoice.number,
          totalAmount: invoice.totalAmount,
          issueDate: invoice.issueDate,
          projectId: invoice.projectId,
          projectName: (invoice as any).project?.name || 'N/A'
        })),
        projects: sampleProjects.map(project => ({
          id: project.id,
          name: project.name,
          address: project.address
        }))
      }
    };

    logger.debug('Test data retrieved:', testData);
    sendSuccess(res, testData, 'Test data retrieved successfully');
  } catch (error) {
    logger.error('Error in test endpoint:', error);
    sendInternalError(res);
  }
};
