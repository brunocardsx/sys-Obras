import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logError } from '@/utils/logger';
import { HTTP_STATUS } from '@/types/constants';
import { sendSuccess, sendInternalError } from '@/utils/response';
import { initializeDatabase } from '@/services/database';
import { setupRoutes } from '@/routes';

const createApp = (): express.Application => {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
  
  // CORS configuration
  const frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:3000';
  app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  
  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Health check
  app.get('/api/health', (_req, res) => {
    sendSuccess(res, { status: 'UP' }, 'Service is healthy');
  });
  
  // Setup routes
  setupRoutes(app);
  
  // Error handling middleware
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logError(error);
    sendInternalError(res);
  });
  
  // 404 handler
  app.use('*', (_req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: false,
      message: 'Route not found',
    });
  });
  
  return app;
};

const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Create app
    const app = createApp();
    
    // Start server
    const port = process.env['PORT'] || 8081;
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logError(error as Error);
    process.exit(1);
  }
};

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

export { createApp, startServer };

