import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice';
import { Project } from '../models/Project';
import { Product } from '../models/Product';
import { InvoiceItem } from '../models/InvoiceItem';
import { sendSuccess, sendInternalError } from '../utils/response';
import { logger } from '../utils/logger';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../services/database';

interface DashboardMetrics {
  totalProjects: number;
  totalInvoices: number;
  totalSpent: number;
  totalProducts: number;
  projects: Array<{
    id: string;
    name: string;
    address?: string;
  }>;
  projectBreakdown: Array<{
    projectId: string;
    projectName: string;
    amount: number;
    invoices: number;
    monthlyBreakdown: Array<{
      month: string;
      amount: number;
      invoices: number;
    }>;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
    invoices: number;
  }>;
  projectSpending: Array<{
    projectName: string;
    amount: number;
    invoices: number;
  }>;
  recentInvoices: Array<{
    id: string;
    number: string;
    totalAmount: number;
    issueDate: string;
    projectName: string;
  }>;
  topProducts: Array<{
    productName: string;
    totalQuantity: number;
    totalAmount: number;
  }>;
}

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.debug('Fetching dashboard metrics...');
    
    const { startDate, endDate } = req.query;
    
    // Buscar todas as notas fiscais com projeto usando consulta SQL direta
    const invoices = await sequelize.query(`
      SELECT 
        i.id,
        i.number,
        i.total_amount,
        i.issue_date,
        i.project_id,
        i.status,
        p.name as project_name
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.project_id IS NOT NULL
      ${startDate && endDate ? `AND i.issue_date BETWEEN '${startDate}' AND '${endDate}'` : ''}
      ORDER BY i.issue_date DESC
    `, {
      type: QueryTypes.SELECT
    }) as any[];

    logger.debug(`Found ${invoices.length} invoices`);

    // Buscar dados básicos
    const [totalProjects, totalInvoices, totalProducts, projectsResult] = await Promise.all([
      Project.count(),
      Invoice.count(),
      Product.count(),
      sequelize.query(`
        SELECT id, name, address
        FROM projects
        ORDER BY name ASC
      `, {
        type: QueryTypes.SELECT
      })
    ]);

    // Calcular total gasto
    const totalSpent = invoices.reduce((sum, invoice) => {
      return sum + parseFloat((invoice.total_amount || 0).toString());
    }, 0);

    // Calcular breakdown detalhado por projeto
    const projectBreakdownMap = new Map<string, {
      projectName: string;
      amount: number;
      invoices: number;
      monthlyData: Map<string, { amount: number; invoices: number }>;
    }>();

    invoices.forEach(invoice => {
      if (!invoice.project_id) return;
      
      const projectId = invoice.project_id;
      const projectName = invoice.project_name || 'Projeto não encontrado';
      
      if (!projectBreakdownMap.has(projectId)) {
        projectBreakdownMap.set(projectId, {
          projectName,
          amount: 0,
          invoices: 0,
          monthlyData: new Map()
        });
      }
      
      const projectData = projectBreakdownMap.get(projectId)!;
      projectData.amount += parseFloat((invoice.total_amount || 0).toString());
      projectData.invoices += 1;
      
      // Adicionar dados mensais
      if (invoice.issue_date) {
        const month = new Date(invoice.issue_date).toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        });
        
        if (!projectData.monthlyData.has(month)) {
          projectData.monthlyData.set(month, { amount: 0, invoices: 0 });
        }
        
        const monthData = projectData.monthlyData.get(month)!;
        monthData.amount += parseFloat((invoice.total_amount || 0).toString());
        monthData.invoices += 1;
      }
    });

    const projectBreakdown = Array.from(projectBreakdownMap.entries())
      .map(([projectId, data]) => ({
        projectId,
        projectName: data.projectName,
        amount: data.amount,
        invoices: data.invoices,
        monthlyBreakdown: Array.from(data.monthlyData.entries())
          .map(([month, monthData]) => ({
            month,
            amount: monthData.amount,
            invoices: monthData.invoices
          }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calcular gastos mensais
    const monthlySpendingMap = new Map<string, { amount: number; invoices: number }>();
    
    invoices.forEach(invoice => {
      if (!invoice.issue_date) return;
      
      const month = new Date(invoice.issue_date).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!monthlySpendingMap.has(month)) {
        monthlySpendingMap.set(month, { amount: 0, invoices: 0 });
      }
      
      const monthData = monthlySpendingMap.get(month)!;
      monthData.amount += parseFloat((invoice.total_amount || 0).toString());
      monthData.invoices += 1;
    });

    const monthlySpending = Array.from(monthlySpendingMap.entries())
      .map(([month, data]) => ({
        month,
        amount: data.amount,
        invoices: data.invoices
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Calcular gastos por projeto
    const projectSpending = Array.from(projectBreakdownMap.entries())
      .map(([_, data]) => ({
        projectName: data.projectName,
        amount: data.amount,
        invoices: data.invoices
      }))
      .sort((a, b) => b.amount - a.amount);

    // Últimas 10 notas fiscais
    const recentInvoices = invoices.slice(0, 10).map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      totalAmount: parseFloat((invoice.total_amount || 0).toString()),
      issueDate: invoice.issue_date,
      projectName: invoice.project_name || 'N/A',
      status: invoice.status || 'Pendente'
    }));

    // Buscar produtos com maior valor gasto
    const topProducts = await sequelize.query(`
      SELECT 
        ii.product_name,
        SUM(ii.quantity) as total_quantity,
        SUM(ii.total_price) as total_amount
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      WHERE i.project_id IS NOT NULL
      ${startDate && endDate ? `AND i.issue_date BETWEEN '${startDate}' AND '${endDate}'` : ''}
      GROUP BY ii.product_name
      ORDER BY total_amount DESC
      LIMIT 10
    `, {
      type: QueryTypes.SELECT
    }) as any[];

    const topProductsFormatted = topProducts.map(product => ({
      productName: product.product_name,
      totalQuantity: parseFloat((product.total_quantity || 0).toString()),
      totalAmount: parseFloat((product.total_amount || 0).toString())
    }));

    const metrics: DashboardMetrics = {
      totalProjects,
      totalInvoices,
      totalSpent,
      totalProducts,
      projects: (projectsResult as any[]).map((project: any) => ({
        id: project.id,
        name: project.name,
        address: project.address
      })),
      projectBreakdown,
      monthlySpending,
      projectSpending,
      recentInvoices,
      topProducts: topProductsFormatted
    };

    logger.debug('Dashboard metrics calculated successfully');
    sendSuccess(res, metrics, 'Dashboard metrics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching dashboard metrics:', error);
    sendInternalError(res);
  }
};

export const getProjectSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      res.status(400).json({ 
        status: false, 
        message: 'Project ID is required' 
      });
      return;
    }

    // Buscar dados do projeto
    const project = await Project.findByPk(projectId);
    if (!project) {
      res.status(404).json({ 
        status: false, 
        message: 'Project not found' 
      });
      return;
    }

    // Buscar notas fiscais do projeto
    const invoices = await sequelize.query(`
      SELECT 
        i.id,
        i.number,
        i.total_amount,
        i.issue_date
      FROM invoices i
      WHERE i.project_id = :projectId
      ORDER BY i.issue_date DESC
    `, {
      replacements: { projectId },
      type: QueryTypes.SELECT
    }) as any[];

    const totalAmount = invoices.reduce((sum, invoice) => {
      return sum + parseFloat((invoice.total_amount || 0).toString());
    }, 0);

    const summary = {
      project: {
        id: project.id,
        name: project.name,
        address: project.address
      },
      totalInvoices: invoices.length,
      totalAmount,
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        totalAmount: parseFloat((invoice.total_amount || 0).toString()),
        issueDate: invoice.issue_date
      }))
    };

    sendSuccess(res, summary, 'Project summary retrieved successfully');
  } catch (error) {
    logger.error('Error fetching project summary:', error);
    sendInternalError(res);
  }
};  