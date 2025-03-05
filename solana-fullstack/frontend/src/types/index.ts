import { PublicKey } from '@solana/web3.js';

export interface Record {
  author: string;
  data: string;
  timestamp: number;
}

export interface CreateRecordDto {
  data: string;
  walletAddress: string;
}

export interface UpdateRecordDto {
  index: number;
  newData: string;
  walletAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  signature?: string;
}

export interface SolanaConfig {
  programId: PublicKey;
  network: string;
}

export interface WalletContextState {
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
  disconnecting: boolean;
  select: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}
