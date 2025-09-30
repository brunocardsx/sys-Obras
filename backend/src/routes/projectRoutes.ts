import { Router } from 'express';
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/ProjectController';
import { authMiddleware, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export { router as projectRoutes };
