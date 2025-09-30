import { Router } from 'express';
import { 
  createObra, 
  getObras, 
  getObraById, 
  updateObra, 
  deleteObra 
} from '@/controllers/ObraController';
import { authMiddleware, requireAdmin } from '@/middleware/authMiddleware';

const router = Router();

// All obra routes require authentication
router.use(authMiddleware);

// All obra routes require admin role
router.use(requireAdmin);

router.post('/', createObra);
router.get('/', getObras);
router.get('/:id', getObraById);
router.put('/:id', updateObra);
router.delete('/:id', deleteObra);

export { router as obraRoutes };
