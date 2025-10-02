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
  
  const allowedOrigins = [
    'http://localhost:3001',
    'https://sys-obras-ics3-git-master-brunocardsxs-projects.vercel.app',
    'https://*.vercel.app'
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          const pattern = allowedOrigin.replace('*', '.*');
          return new RegExp(pattern).test(origin);
        }
        return origin === allowedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
    logger.info('Starting server initialization...');
    
    // Initialize database first
    logger.info('Initializing database...');
    await initializeDatabase();
    logger.info('Database initialized successfully');
    
    // Create Express app
    logger.info('Creating Express app...');
    const app = createApp();
    logger.info('Express app created successfully');
    
    const port = process.env['PORT'] || 8081;
    logger.info(`Starting server on port ${port}...`);
    
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info('Health check available at /api/health');
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    logError(error as Error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { createApp, startServer };

