import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logError } from './utils/logger';
import { HTTP_STATUS } from './types/constants';
import { sendSuccess, sendInternalError } from './utils/response';
import { initializeDatabase } from './services/database';
import { setupRoutes } from './routes';

const createApp = (): express.Application => {
  const app = express();
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs (reasonable for production)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  app.get('/api/health', (_req, res) => {
    sendSuccess(res, { 
      status: 'UP', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }, 'Service is healthy');
  });
  
  setupRoutes(app);
  
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logError(error);
    sendInternalError(res);
  });
  
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
    await initializeDatabase();
    
    const app = createApp();
    
    const port = process.env['PORT'] || 8081;
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logError(error as Error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { createApp, startServer };

