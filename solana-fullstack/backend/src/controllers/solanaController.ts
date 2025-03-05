import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { logger } from '../utils/logger';
import { 
  CreateRecordDto, 
  UpdateRecordDto, 
  TransactionResult, 
  SolanaConfig 
} from '../types/solana';

class SolanaController {
  private connection: Connection;
  private program: Program | null = null;
  private config: SolanaConfig;

  constructor() {
    // Set default program ID if not provided in environment
    const programId = process.env.PROGRAM_ID || 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';

    this.config = {
      programId: new PublicKey(programId),
      network: process.env.SOLANA_NETWORK || 'devnet'
    };

    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );

    // Initialize Anchor provider and program
    this.initializeAnchor();
  }

  private initializeAnchor() {
    try {
      // Create a dummy keypair for the provider
      const wallet = new anchor.Wallet(Keypair.generate());

      const provider = new anchor.AnchorProvider(
        this.connection,
        wallet,
        { commitment: 'confirmed' }
      );

      // Set the provider globally
      anchor.setProvider(provider);

      try {
        const idl = require('../../target/idl/my_smart_contract.json');
        // Initialize the program
        this.program = new anchor.Program(idl, this.config.programId);
        logger.info('Anchor program initialized successfully');
      } catch (idlError) {
        logger.warn('Failed to load IDL file, program functionality will be limited:', idlError);
        this.program = null;
      }
    } catch (error) {
      logger.error('Failed to initialize Anchor program:', error);
      this.program = null;
    }
  }

  private ensureProgramInitialized() {
    if (!this.program) {
      throw new Error('Solana program not initialized. Please check your configuration and try again.');
    }
  }

  async createRecord(dto: CreateRecordDto): Promise<TransactionResult> {
    try {
      this.ensureProgramInitialized();
      const walletPublicKey = new PublicKey(dto.walletAddress);
      
      // Create a new record account
      const recordAccount = Keypair.generate();

      const tx = await this.program!.methods
        .createRecord(dto.data)
        .accounts({
          recordAccount: recordAccount.publicKey,
          author: walletPublicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([recordAccount])
        .rpc();

      logger.info('Record created successfully:', tx);

      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      logger.error('Failed to create record:', error);
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }

  async updateRecord(dto: UpdateRecordDto): Promise<TransactionResult> {
    try {
      this.ensureProgramInitialized();
      const walletPublicKey = new PublicKey(dto.walletAddress);

      const tx = await this.program!.methods
        .updateRecord(new anchor.BN(dto.index), dto.newData)
        .accounts({
          recordAccount: this.program!.programId,
          author: walletPublicKey,
        })
        .rpc();

      logger.info('Record updated successfully:', tx);

      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      logger.error('Failed to update record:', error);
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }

  async getRecords(walletAddress: string) {
    try {
      this.ensureProgramInitialized();
      const walletPublicKey = new PublicKey(walletAddress);

      // Fetch all record accounts for the given wallet
      const records = await this.program!.account.recordAccount.all([
        {
          memcmp: {
            offset: 8, // Discriminator size
            bytes: walletPublicKey.toBase58(),
          },
        },
      ]);

      return {
        success: true,
        data: records.map(record => ({
          author: record.account.author,
          data: record.account.data,
          timestamp: record.account.timestamp.toNumber()
        }))
      };
    } catch (error) {
      logger.error('Failed to fetch records:', error);
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const solanaController = new SolanaController();
