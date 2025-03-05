import { Pool as PgPool } from 'pg';
import { getPostgresPool } from '../config/db';
import { Pool } from '../models/pool.model';
import { SpinWheel } from '../models/spinWheel.model';
import { logger } from '../utils/logger';

interface UpdateUserPointsParams {
  walletAddress: string;
  pointsDelta: number;
  poolId: string;
  transactionSignature: string;
  transactionType: string;
  amount?: number;
}

interface UpdatePoolMetadataParams {
  poolId: string;
  metadata: Record<string, any>;
  participantDelta?: number;
  pointsDelta?: number;
}

interface SpinWheelResult {
  walletAddress: string;
  poolId: string;
  points: number;
  multiplier?: number;
  reward?: string;
  transactionSignature?: string;
}

class DatabaseService {
  private pgPool: PgPool;

  constructor() {
    this.pgPool = getPostgresPool();
  }

  async updateUserPoints({
    walletAddress,
    pointsDelta,
    poolId,
    transactionSignature,
    transactionType,
    amount
  }: UpdateUserPointsParams): Promise<void> {
    const client = await this.pgPool.connect();

    try {
      await client.query('BEGIN');

      // Update user points
      const updateUserResult = await client.query(
        'UPDATE users SET points = points + $1 WHERE wallet_address = $2 RETURNING points',
        [pointsDelta, walletAddress]
      );

      if (updateUserResult.rowCount === 0) {
        // Create new user if doesn't exist
        await client.query(
          'INSERT INTO users (wallet_address, points) VALUES ($1, $2)',
          [walletAddress, pointsDelta]
        );
      }

      // Record transaction
      await client.query(
        `INSERT INTO transactions 
        (wallet_address, signature, type, status, amount, points_delta, pool_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [walletAddress, transactionSignature, transactionType, 'completed', amount || 0, pointsDelta, poolId]
      );

      await client.query('COMMIT');
      logger.info(`Successfully updated points for wallet ${walletAddress}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating user points:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updatePoolMetadata({
    poolId,
    metadata,
    participantDelta = 0,
    pointsDelta = 0
  }: UpdatePoolMetadataParams): Promise<void> {
    try {
      await Pool.findOneAndUpdate(
        { poolId },
        {
          $set: { metadata },
          $inc: {
            participantCount: participantDelta,
            totalPoints: pointsDelta
          },
          $setOnInsert: {
            name: `Pool ${poolId}`,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'active'
          }
        },
        { upsert: true, new: true }
      );

      logger.info(`Successfully updated pool metadata for pool ${poolId}`);
    } catch (error) {
      logger.error('Error updating pool metadata:', error);
      throw error;
    }
  }

  async recordSpinWheelResult(result: SpinWheelResult): Promise<void> {
    try {
      await SpinWheel.create({
        walletAddress: result.walletAddress,
        poolId: result.poolId,
        result: {
          points: result.points,
          multiplier: result.multiplier,
          reward: result.reward
        },
        transactionSignature: result.transactionSignature,
        status: result.transactionSignature ? 'completed' : 'pending'
      });

      logger.info(`Successfully recorded spin wheel result for wallet ${result.walletAddress}`);
    } catch (error) {
      logger.error('Error recording spin wheel result:', error);
      throw error;
    }
  }

  async getPoolMetadata(poolId: string): Promise<any> {
    try {
      const pool = await Pool.findOne({ poolId });
      return pool;
    } catch (error) {
      logger.error('Error fetching pool metadata:', error);
      throw error;
    }
  }

  async getUserSpinHistory(walletAddress: string, poolId?: string): Promise<any[]> {
    try {
      const query = { walletAddress };
      if (poolId) {
        Object.assign(query, { poolId });
      }

      const history = await SpinWheel.find(query)
        .sort({ timestamp: -1 })
        .limit(50);

      return history;
    } catch (error) {
      logger.error('Error fetching user spin history:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
