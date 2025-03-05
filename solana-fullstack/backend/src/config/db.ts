import { Pool } from 'pg';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// PostgreSQL Configuration
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'solana_app',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  // Add connection retry options
  connectionTimeoutMillis: 5000,
  max: 20,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: true
});

// MongoDB Configuration
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/solana_app';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  maxPoolSize: 10
};

// Initialize PostgreSQL
export const initPostgres = async (): Promise<void> => {
  try {
    const client = await pgPool.connect();
    logger.info('PostgreSQL connected successfully');

    // Create necessary tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(44) UNIQUE NOT NULL,
        username VARCHAR(50),
        email VARCHAR(255),
        points DECIMAL(20, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(44) NOT NULL,
        signature VARCHAR(88) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        amount DECIMAL(20, 9),
        points_delta DECIMAL(20, 2) DEFAULT 0,
        pool_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
      );
    `);
    logger.info('PostgreSQL tables initialized successfully');
    client.release();
  } catch (error) {
    logger.error('PostgreSQL connection error:', error);
    // Don't throw error, allow the application to continue without PostgreSQL
    logger.warn('Application will continue without PostgreSQL functionality');
  }
};

// Initialize MongoDB
export const initMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri, mongooseOptions as any);
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Don't throw error, allow the application to continue without MongoDB
    logger.warn('Application will continue without MongoDB functionality');
  }
};

// Initialize all databases
export const initDatabases = async (): Promise<void> => {
  try {
    await Promise.allSettled([initPostgres(), initMongo()]);
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error during database initialization:', error);
    // Don't throw error, let the application continue with limited functionality
    logger.warn('Application will start with limited database functionality');
  }
};

// Get PostgreSQL pool
export const getPostgresPool = (): Pool => pgPool;

// Cleanup function for graceful shutdown
export const closeDatabaseConnections = async (): Promise<void> => {
  try {
    await Promise.allSettled([
      pgPool.end(),
      mongoose.connection.close()
    ]);
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.error('Error closing database connections:', error);
    // Don't throw error during shutdown
  }
};

// Export mongoose instance for schema definitions
export { mongoose };
