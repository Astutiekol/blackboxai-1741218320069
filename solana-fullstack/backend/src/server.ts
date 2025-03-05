import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabases, closeDatabaseConnections } from './config/db';
import { logger } from './utils/logger';
import solanaRoutes from './routes/solanaRoutes';
import { poolRoutes } from './routes/poolRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/solana', solanaRoutes);
app.use('/api/pool', poolRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize databases and start server
const startServer = async () => {
  try {
    // Initialize database connections with error handling
    await initDatabases().catch(error => {
      logger.error('Database initialization error:', error);
      logger.warn('Server will start with limited database functionality');
    });

    // Start the server
    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received. Starting graceful shutdown...`);
      
      // Close server first
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Then close database connections
        closeDatabaseConnections().finally(() => {
          logger.info('Graceful shutdown completed');
          process.exit(0);
        });
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
export default app;
