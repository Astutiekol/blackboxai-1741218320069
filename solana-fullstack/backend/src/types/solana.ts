import { PublicKey } from '@solana/web3.js';

export interface CreateRecordDto {
  data: string;
  walletAddress: string;
}

export interface UpdateRecordDto {
  index: number;
  newData: string;
  walletAddress: string;
}

export interface RecordData {
  author: PublicKey;
  data: string;
  timestamp: number;
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface SolanaConfig {
  programId: PublicKey;
  network: string;
}
