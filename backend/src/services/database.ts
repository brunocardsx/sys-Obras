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
  });
  
  if (isProduction) {
    // Use DATABASE_URL if available (Railway), otherwise use individual variables
    if (process.env['DATABASE_URL']) {
      logger.info('Using DATABASE_URL for connection');
      return new Sequelize(process.env['DATABASE_URL']!, {
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
    
    logger.info('Using individual DB variables for connection');
    const config: DatabaseConfig = {
      host: process.env['DB_HOST']!,
      port: parseInt(process.env['DB_PORT'] || '5432'),
      database: process.env['DB_NAME']!,
      username: process.env['DB_USER']!,
      password: process.env['DB_PASS']!,
      ssl: true,
    };
    
    logger.info('Database config:', {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      hasPassword: !!config.password,
      password: config.password ? '***hidden***' : 'not set',
    });
    
    return new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: false,
      }
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

