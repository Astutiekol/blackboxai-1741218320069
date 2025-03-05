import express from 'express';
import { solanaController } from '../controllers/solanaController';
import { logger } from '../utils/logger';

const router = express.Router();

// Create a new record
router.post('/record', async (req, res) => {
  try {
    const result = await solanaController.createRecord(req.body);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    logger.error('Error creating record:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update an existing record
router.put('/record', async (req, res) => {
  try {
    const result = await solanaController.updateRecord(req.body);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    logger.error('Error updating record:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get records for a wallet
router.get('/records/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const result = await solanaController.getRecords(walletAddress);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    logger.error('Error fetching records:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
