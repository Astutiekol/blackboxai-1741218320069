import { Schema, model } from 'mongoose';

interface IPool {
  poolId: string;
  name: string;
  totalPoints: number;
  participantCount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  metadata: Record<string, any>;
  updatedAt: Date;
}

const poolSchema = new Schema<IPool>({
  poolId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  participantCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  metadata: { type: Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes
poolSchema.index({ poolId: 1 });
poolSchema.index({ status: 1 });

export const Pool = model<IPool>('Pool', poolSchema);
