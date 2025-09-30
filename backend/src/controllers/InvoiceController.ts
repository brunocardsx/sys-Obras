import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';
import { Product } from '../models/Product';
import { Project } from '../models/Project';
import { sendSuccess, sendValidationError, sendNotFoundError, sendConflictError, sendInternalError } from '../utils/response';
import { validateRequest } from '../utils/validation';
import { createInvoiceSchema } from '../utils/validation';
import { CreateInvoiceRequest } from '../types';
import { logger } from '../utils/logger';

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  const validation = validateRequest(createInvoiceSchema, req.body);

  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }

  const invoiceData = validation.data as CreateInvoiceRequest;

  try {
    const existingInvoice = await Invoice.findOne({
      where: { number: invoiceData.number }
    });

    if (existingInvoice) {
      sendConflictError(res, 'Invoice with this number already exists');
      return;
    }

    const invoiceDataWithDates = {
      ...invoiceData,
      issueDate: new Date(invoiceData.issueDate),
      ...(invoiceData.dueDate && { dueDate: new Date(invoiceData.dueDate) }),
      ...(invoiceData.paymentDate && { paymentDate: new Date(invoiceData.paymentDate) })
    };

    const invoice = await Invoice.create(invoiceDataWithDates);
    sendSuccess(res, invoice, 'Invoice created successfully');
  } catch (error) {
    logger.error('Error creating invoice:', error);
    sendInternalError(res);
  }
};

export const getInvoices = async (_req: Request, res: Response): Promise<void> => {
  try {
    logger.debug('Starting getInvoices function');
    
    logger.debug('Attempting to find all invoices');
    const invoices = await Invoice.findAll({
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: Project,
          as: 'project'
        }
      ],
      order: [['issueDate', 'DESC']]
    });
    
    logger.debug(`Found ${invoices.length} invoices`);
    logger.debug('Invoices data:', { invoices: invoices.map(n => ({ id: n.id, number: n.number })) });
    
    sendSuccess(res, invoices);
  } catch (error) {
    logger.error('Error fetching invoices:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name
    });
    sendInternalError(res);
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'ID is required');
    return;
  }

  try {
    logger.debug(`Attempting to find invoice with ID: ${id}`);
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!invoice) {
      sendNotFoundError(res, 'Invoice not found');
      return;
    }

    logger.debug('Invoice found:', { id: invoice.id, number: invoice.number });
    sendSuccess(res, invoice);
  } catch (error) {
    logger.error('Error fetching invoice:', error);
    sendInternalError(res);
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'ID is required');
    return;
  }

  const validation = validateRequest(createInvoiceSchema, req.body);

  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }

  const updateData = validation.data as Partial<CreateInvoiceRequest>;

  try {
    logger.debug(`Attempting to update invoice with ID: ${id}`);
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      sendNotFoundError(res, 'Invoice not found');
      return;
    }

    if (updateData.number && updateData.number !== invoice.number) {
      const existingInvoice = await Invoice.findOne({
        where: { number: updateData.number }
      });

      if (existingInvoice) {
        sendConflictError(res, 'Invoice with this number already exists');
        return;
      }
    }

    const updateDataWithDates = {
      ...updateData,
      ...(updateData.issueDate && { issueDate: new Date(updateData.issueDate) }),
      ...(updateData.dueDate && { dueDate: new Date(updateData.dueDate) }),
      ...(updateData.paymentDate && { paymentDate: new Date(updateData.paymentDate) })
    };

    await invoice.update(updateDataWithDates);
    await invoice.reload();

    logger.debug('Invoice updated successfully:', { id: invoice.id, number: invoice.number });
    sendSuccess(res, invoice, 'Invoice updated successfully');
  } catch (error) {
    logger.error('Error updating invoice:', error);
    sendInternalError(res);
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'ID is required');
    return;
  }

  try {
    logger.debug(`Attempting to delete invoice with ID: ${id}`);
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      sendNotFoundError(res, 'Invoice not found');
      return;
    }

    await invoice.destroy();
    logger.debug('Invoice deleted successfully:', { id: invoice.id, number: invoice.number });
    sendSuccess(res, null, `Invoice "${invoice.number}" deleted successfully`);
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    sendInternalError(res);
  }
};
