import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import { DatabaseConfig } from '../types';

const createDatabaseConnection = (): Sequelize => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  
  if (isProduction) {
    const config: DatabaseConfig = {
      host: process.env['PROD_DB_HOST']!,
      port: parseInt(process.env['PROD_DB_PORT'] || '5432'),
      database: process.env['PROD_DB_NAME']!,
      username: process.env['PROD_DB_USER']!,
      password: process.env['PROD_DB_PASSWORD']!,
      ssl: true,
    };
    
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
    
    // Sync database (alter: true for development)
    await sequelize.sync({ alter: process.env['NODE_ENV'] !== 'production' });
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

