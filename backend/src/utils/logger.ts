import winston from 'winston';
// import { Environment } from '../types';

const createLogger = (): winston.Logger => {
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  
  return winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'sisTest-backend' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });
};

export const logger = createLogger();

export const logError = (error: Error, context?: Record<string, unknown>): void => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    context,
  });
};

export const logInfo = (message: string, meta?: Record<string, unknown>): void => {
  logger.info(message, meta);
};

export const logWarning = (message: string, meta?: Record<string, unknown>): void => {
  logger.warn(message, meta);
};

