import { Router } from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/ProductController';
import { authMiddleware, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export { router as productRoutes };

