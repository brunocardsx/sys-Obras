import { Router } from 'express';
import { getDashboardMetrics, getProjectSummary } from '../controllers/DashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET /api/dashboard/metrics-public - Métricas sem autenticação para teste
router.get('/metrics-public', getDashboardMetrics);

// Aplicar autenticação nas demais rotas do dashboard
router.use(authMiddleware);

// GET /api/dashboard/metrics - Métricas gerais do dashboard
router.get('/metrics', getDashboardMetrics);

// GET /api/dashboard/projects/:projectId - Resumo de um projeto específico
router.get('/projects/:projectId', getProjectSummary);

export { router as dashboardRoutes };
