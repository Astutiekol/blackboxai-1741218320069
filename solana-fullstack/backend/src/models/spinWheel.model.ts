import { Schema, model } from 'mongoose';

interface ISpinWheel {
  walletAddress: string;
  poolId: string;
  result: {
    points: number;
    multiplier?: number;
    reward?: string;
  };
  timestamp: Date;
  transactionSignature?: string;
  status: 'pending' | 'completed' | 'failed';
}

const spinWheelSchema = new Schema<ISpinWheel>({
  walletAddress: { 
    type: String, 
    required: true,
    index: true 
  },
  poolId: { 
    type: String, 
    required: true,
    index: true 
  },
  result: {
    points: { type: Number, required: true },
    multiplier: { type: Number },
    reward: { type: String }
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  transactionSignature: { type: String },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

// Create compound indexes for common queries
spinWheelSchema.index({ walletAddress: 1, poolId: 1 });
spinWheelSchema.index({ poolId: 1, timestamp: -1 });

export const SpinWheel = model<ISpinWheel>('SpinWheel', spinWheelSchema);
