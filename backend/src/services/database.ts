import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import { DatabaseConfig } from '../types';

const createDatabaseConnection = (): Sequelize => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  
  // Log environment variables for debugging
  logger.info('Database connection config:', {
    NODE_ENV: process.env['NODE_ENV'],
    hasDATABASE_URL: !!process.env['DATABASE_URL'],
    hasDB_HOST: !!process.env['DB_HOST'],
    DATABASE_URL: process.env['DATABASE_URL'] ? '***hidden***' : 'not set',
    DB_HOST: process.env['DB_HOST'],
    allEnvVars: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('PG') || key.includes('DB')).join(', ')
  });
  
  if (isProduction) {
    // Use DATABASE_URL from Railway environment variables
    const databaseUrl = process.env['DATABASE_URL'];
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required for production');
    }
    
    logger.info('Using DATABASE_URL for connection:', databaseUrl ? '***hidden***' : 'not set');
    return new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });
  }
  
  const config: DatabaseConfig = {
    host: process.env['DB_HOST']!,
    port: parseInt(process.env['DB_PORT'] || '5432'),
    database: process.env['DB_NAME']!,
    username: process.env['DB_USER']!,
    password: process.env['DB_PASS']!,
  };
  
  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    logging: false,
  });
};

export const sequelize = createDatabaseConnection();

export const initializeDatabase = async (): Promise<void> => {
  try {
    logger.info('Attempting to authenticate with database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    await import('../models/Product');
    await import('../models/Project');
    await import('../models/Invoice');
    await import('../models/InvoiceItem');
    logger.info('Models initialized successfully');
    
    const { initializeAssociations } = await import('../models/associations');
    initializeAssociations();
    logger.info('Model associations initialized successfully');
    
    await sequelize.sync({ force: false, alter: false });
    logger.info('Database synchronized successfully');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

