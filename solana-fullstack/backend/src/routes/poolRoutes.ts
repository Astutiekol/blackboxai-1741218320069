import express from 'express';
import { poolController } from '../controllers/poolController';
import { logger } from '../utils/logger';

const router = express.Router();

// Middleware to log requests
const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.info(`${req.method} ${req.path} - Request received`);
  next();
};

router.use(logRequest);

// Route to update user pool data (points, transactions, metadata)
router.post('/update-user-data', poolController.updateUserPoolData);

// Route to get pool metadata
router.get('/metadata/:poolId', poolController.getPoolMetadata);

// Route to get user's spin wheel history
router.get('/spin-history/:walletAddress', poolController.getUserSpinHistory);

export const poolRoutes = router;
