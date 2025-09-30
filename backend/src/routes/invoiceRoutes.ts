import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
  createInvoice, 
  getInvoices, 
  getInvoiceById, 
  updateInvoice, 
  deleteInvoice 
} from '../controllers/InvoiceController';

const router = Router();

router.use(authMiddleware);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export { router as invoiceRoutes };
