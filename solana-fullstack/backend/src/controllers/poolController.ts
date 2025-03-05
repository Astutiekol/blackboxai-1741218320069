import { Request, Response } from 'express';
import { databaseService } from '../services/database.service';
import { logger } from '../utils/logger';

class PoolController {
  async updateUserPoolData(req: Request, res: Response) {
    try {
      const {
        walletAddress,
        pointsDelta,
        poolId,
        transactionSignature,
        transactionType,
        amount,
        poolMetadata,
        spinWheelResult
      } = req.body;

      // Validate required fields
      if (!walletAddress || !poolId || pointsDelta === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: walletAddress, poolId, or pointsDelta'
        });
      }

      // Update user points and record transaction
      await databaseService.updateUserPoints({
        walletAddress,
        pointsDelta,
        poolId,
        transactionSignature,
        transactionType,
        amount
      });

      // Update pool metadata if provided
      if (poolMetadata) {
        await databaseService.updatePoolMetadata({
          poolId,
          metadata: poolMetadata,
          participantDelta: 1, // Increment participant count
          pointsDelta
        });
      }

      // Record spin wheel result if provided
      if (spinWheelResult) {
        await databaseService.recordSpinWheelResult({
          walletAddress,
          poolId,
          ...spinWheelResult,
          transactionSignature
        });
      }

      res.status(200).json({
        success: true,
        message: 'Your points and transaction history have been successfully updated'
      });
    } catch (error) {
      logger.error('Error updating user pool data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getPoolMetadata(req: Request, res: Response) {
    try {
      const { poolId } = req.params;

      if (!poolId) {
        return res.status(400).json({
          success: false,
          message: 'Pool ID is required'
        });
      }

      const poolMetadata = await databaseService.getPoolMetadata(poolId);

      if (!poolMetadata) {
        return res.status(404).json({
          success: false,
          message: 'Pool not found'
        });
      }

      res.status(200).json({
        success: true,
        data: poolMetadata
      });
    } catch (error) {
      logger.error('Error fetching pool metadata:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pool metadata',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserSpinHistory(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const { poolId } = req.query;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required'
        });
      }

      const history = await databaseService.getUserSpinHistory(
        walletAddress,
        poolId as string | undefined
      );

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error('Error fetching user spin history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user spin history',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const poolController = new PoolController();
