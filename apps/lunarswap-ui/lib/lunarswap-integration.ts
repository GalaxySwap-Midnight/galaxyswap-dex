import { Buffer } from 'buffer';
import type {
  MidnightProviders,
  PrivateStateProvider,
  ProofProvider,
  UnprovenTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import {
  Lunarswap,
  LunarswapCircuitKeys,
  type LunarswapProviders,
  LunarswapPrivateStateId,
} from '@midnight-dapps/lunarswap-api';
import type {
  CoinInfo,
  Either,
  ZswapCoinPublicKey,
  ContractAddress,
} from '@midnight-dapps/compact-std';
import {
  deployContract,
  FinalizedCallTxData,
  findDeployedContract,
  type FoundContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import {
  type Contract,
  LunarswapWitnesses,
  type LunarswapPrivateState,
  type Witnesses,
  type Ledger,
  type Pair,
} from '@midnight-dapps/lunarswap-v1';
import { LunarswapSimulator } from '@midnight-dapps/lunarswap-v1';
import { ZkConfigProviderWrapper } from '@/providers/zk-config';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { proofClient } from '@/providers/proof';
import type { ProviderCallbackAction, WalletAPI } from './wallet-context';
import {
  getLedgerNetworkId,
  getZswapNetworkId,
} from '@midnight-ntwrk/midnight-js-network-id';
import { encodeCoinInfo } from '@midnight-ntwrk/compact-runtime';
import { encodeCoinPublicKey } from '@midnight-ntwrk/ledger';
import {
  ShieldedAddress,
  MidnightBech32m,
  ShieldedCoinPublicKey,
} from '@midnight-ntwrk/wallet-sdk-address-format';
import { ensureLunarswapProofParams } from '../utils/proof-params';

// Contract status types
export type ContractStatus =
  | 'not-configured' // No contract address configured
  | 'connecting' // Attempting to connect
  | 'connected' // Successfully connected
  | 'not-deployed' // Contract address configured but not found on network
  | 'error'; // Connection error

export interface ContractStatusInfo {
  status: ContractStatus;
  contractAddress?: string;
  error?: string;
  message?: string;
}

type LunarswapContract = Contract<
  LunarswapPrivateState,
  Witnesses<LunarswapPrivateState>
>;
type DeployedLunarswap = FoundContract<LunarswapContract>;

// Contract interaction utilities
export class LunarswapIntegration {
  private providers: LunarswapProviders;
  private walletAPI: WalletAPI;
  private lunarswap: Lunarswap | null = null;
  private poolData: Ledger | null = null;
  private callback: (action: ProviderCallbackAction) => void;
  private _status: ContractStatus = 'not-configured';
  private _statusInfo: ContractStatusInfo = { status: 'not-configured' };
  private contractAddress?: string;
  private lunarswapSimulator: LunarswapSimulator;
  constructor(
    providers: LunarswapProviders,
    walletAPI: WalletAPI,
    callback: (action: ProviderCallbackAction) => void,
    contractAddress?: string,
  ) {
    this.providers = providers;
    this.walletAPI = walletAPI;
    this.contractAddress = contractAddress;
    this.callback = callback;
    this.lunarswapSimulator = new LunarswapSimulator(
      'LP',
      'LP',
      new Uint8Array(32),
      BigInt(18),
    );
  }

  /**
   * Get current contract status
   */
  get status(): ContractStatus {
    return this._status;
  }

  /**
   * Get detailed status information
   */
  get statusInfo(): ContractStatusInfo {
    return this._statusInfo;
  }

  /**
   * Check if contract is ready for operations
   */
  get isReady(): boolean {
    return this._status === 'connected' && this.lunarswap !== null;
  }

  /**
   * Initialize contract connection
   */
  async joinContract(): Promise<ContractStatusInfo> {
    const targetAddress = this.contractAddress;

    if (!targetAddress) {
      this._status = 'not-configured';
      this._statusInfo = {
        status: 'not-configured',
        message: 'No contract address configured',
      };
      return this._statusInfo;
    }

    this._status = 'connecting';
    this._statusInfo = {
      status: 'connecting',
      contractAddress: targetAddress,
      message: 'Connecting to Lunarswap contract...',
    };

    try {
      this.lunarswap = await Lunarswap.join(this.providers, {
        bytes: new Uint8Array(Buffer.from(targetAddress, 'hex')),
      });

      this._status = 'connected';
      this._statusInfo = {
        status: 'connected',
        contractAddress: targetAddress,
        message: 'Successfully connected to Lunarswap contract',
      };

      //await this.getPublicState();

      return this._statusInfo;
    } catch (error) {
      this._status = 'error';
      this._statusInfo = {
        status: 'error',
        contractAddress: targetAddress,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to connect to Lunarswap contract',
      };

      return this._statusInfo;
    }
  }

  /**
   * Fetch the public ledger pool data
   */
  async getPublicState(): Promise<Ledger | null> {
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    try {
      // Use the Lunarswap API to get public state
      this.poolData = await Lunarswap.getPublicState(
        this.providers,
        this.lunarswap.deployedContractAddressHex,
      );
      return this.poolData;
    } catch (error) {
      console.error('Failed to fetch pool data:', error);

      // Handle the specific case where watchForDeployTxData is not available
      if (
        error instanceof Error &&
        error.message.includes('watchForDeployTxData is not available')
      ) {
        console.log(
          'Contract appears to be already deployed, returning empty pool data',
        );
        // Return empty pool data instead of throwing
        return null;
      }

      return null;
    }
  }

  /**
   * Get all available pairs in the pool
   */
  getAllPairs(): Array<{ identity: string; pair: Pair }> {
    if (!this.poolData) {
      return [];
    }

    const pairs: Array<{ identity: string; pair: Pair }> = [];

    // Iterate through the pool map
    for (const [identity, pair] of this.poolData.pool) {
      pairs.push({
        identity: Buffer.from(identity).toString('hex'),
        pair,
      });
    }

    return pairs;
  }

  /**
   * Check if a pair exists for given tokens
   */
  async isPairExists(tokenA: string, tokenB: string): Promise<boolean> {
    if (!this.isReady) {
      console.warn('Contract not ready for isPairExists operation');
      return false;
    }

    if (!this.poolData) {
      //await this.getPublicState();
    }

    if (!this.poolData || !this.lunarswap) {
      return false;
    }

    try {
      const tokenAInfo = LunarswapIntegration.createCoinInfo(tokenA, BigInt(0));
      const tokenBInfo = LunarswapIntegration.createCoinInfo(tokenB, BigInt(0));

      // Use the Lunarswap API method
      const pairIdentity = this.lunarswapSimulator.getPairIdentity(
        tokenAInfo,
        tokenBInfo,
      );

      console.log('[DEBUG] pairIdentity:', pairIdentity);

      // Check if this identity exists in the pool
      return this.poolData.pool.member(pairIdentity);
    } catch (error) {
      console.error('Failed to check pair existence:', error);
      return false;
    }
  }

  /**
   * Get pair reserves for given tokens
   */
  async getPairReserves(
    tokenA: string,
    tokenB: string,
  ): Promise<[bigint, bigint] | null> {
    if (!this.isReady) {
      console.warn('Contract not ready for getPairReserves operation');
      return null;
    }

    if (!this.poolData) {
      //await this.getPublicState();
    }

    if (!this.poolData || !this.lunarswap) {
      return null;
    }

    try {
      const tokenAInfo = LunarswapIntegration.createCoinInfo(tokenA, BigInt(0));
      const tokenBInfo = LunarswapIntegration.createCoinInfo(tokenB, BigInt(0));

      // Use the Lunarswap API method
      const identity = this.lunarswapSimulator.getPairIdentity(
        tokenAInfo,
        tokenBInfo,
      );
      const pool = this.poolData.pool.lookup(identity);
      return [pool.token0.value, pool.token1.value];
    } catch (error) {
      console.error('Failed to get pair reserves:', error);
      return null;
    }
  }

  /**
   * Swap exact input tokens for output tokens
   */
  async swapExactTokensForTokens(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    amountOutMin: bigint,
    recipientCoinPublicKey: string,
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>
  > {
    await this.ensureContractJoined();

    // Ensure proof parameters are downloaded before transaction
    await this.ensureProofParams();

    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenInInfo = LunarswapIntegration.createCoinInfo(tokenIn, amountIn);
    const tokenOutInfo = LunarswapIntegration.createCoinInfo(
      tokenOut,
      BigInt(0),
    );
    const recipientAddress = LunarswapIntegration.createRecipient(
      recipientCoinPublicKey,
    );

    // Use the Lunarswap API method
    return await this.lunarswap.swapExactTokensForTokens(
      tokenInInfo,
      tokenOutInfo,
      amountIn,
      amountOutMin,
      recipientAddress,
    );
  }

  /**
   * Swap tokens for exact output tokens
   */
  async swapTokensForExactTokens(
    tokenIn: string,
    tokenOut: string,
    amountOut: bigint,
    amountInMax: bigint,
    recipientCoinPublicKey: string,
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>
  > {
    await this.ensureContractJoined();

    // Ensure proof parameters are downloaded before transaction
    await this.ensureProofParams();

    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenInInfo = LunarswapIntegration.createCoinInfo(tokenIn, BigInt(0));
    const tokenOutInfo = LunarswapIntegration.createCoinInfo(
      tokenOut,
      BigInt(0),
    );
    const recipientAddress = LunarswapIntegration.createRecipient(
      recipientCoinPublicKey,
    );

    // Use the Lunarswap API method
    return await this.lunarswap.swapTokensForExactTokens(
      tokenInInfo,
      tokenOutInfo,
      amountOut,
      amountInMax,
      recipientAddress,
    );
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(
    tokenA: string,
    tokenB: string,
    amountA: bigint,
    amountB: bigint,
    minAmountA: bigint,
    minAmountB: bigint,
    recipientCoinPublicKey: string,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'addLiquidity'>> {
    await this.ensureContractJoined();

    // Ensure proof parameters are downloaded before transaction
    await this.ensureProofParams();

    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenAInfo = LunarswapIntegration.createCoinInfo(tokenA, amountA);
    const tokenBInfo = LunarswapIntegration.createCoinInfo(tokenB, amountB);
    const recipientAddress = LunarswapIntegration.createRecipient(
      recipientCoinPublicKey,
    );

    // Add console logs for debugging
    console.log('addLiquidity called with:', {
      tokenA,
      tokenB,
      amountA,
      amountB,
      minAmountA,
      minAmountB,
      recipientCoinPublicKey,
    });
    console.log('addLiquidity tokenAInfo:', tokenAInfo);
    console.log('addLiquidity tokenBInfo:', tokenBInfo);
    console.log('addLiquidity recipientAddress:', recipientAddress);
    console.log(
      'addLiquidity wallet coinPublicKey:',
      this.walletAPI.coinPublicKey,
    );

    return await this.lunarswap.addLiquidity(
      tokenAInfo,
      tokenBInfo,
      minAmountA,
      minAmountB,
      recipientAddress,
    );
  }

  /**
   * Remove liquidity from a pool
   */
  async removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: string,
    minAmountA: bigint,
    minAmountB: bigint,
    recipientCoinPublicKey: string,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'removeLiquidity'>> {
    await this.ensureContractJoined();

    // Ensure proof parameters are downloaded before transaction
    await this.ensureProofParams();

    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenAInfo = LunarswapIntegration.createCoinInfo(tokenA, BigInt(0));
    const tokenBInfo = LunarswapIntegration.createCoinInfo(tokenB, BigInt(0));
    const liquidityInfo = LunarswapIntegration.createCoinInfo(
      'LP',
      BigInt(liquidity),
    );
    const recipientAddress = LunarswapIntegration.createRecipient(
      recipientCoinPublicKey,
    );

    // Use the Lunarswap API method
    return await this.lunarswap.removeLiquidity(
      tokenAInfo,
      tokenBInfo,
      liquidityInfo,
      minAmountA,
      minAmountB,
      recipientAddress,
    );
  }

  /**
   * Ensure proof parameters are downloaded before transactions
   */
  private async ensureProofParams(): Promise<void> {
    try {
      console.log(
        '[LunarswapIntegration] Ensuring proof parameters are downloaded...',
      );

      // Get the proof server URL from the wallet API
      const proofServerUrl =
        this.walletAPI?.uris?.proverServerUri || 'http://localhost:6300';

      const result = await ensureLunarswapProofParams(proofServerUrl);

      if (!result.success) {
        console.warn(
          '[LunarswapIntegration] Some proof parameters failed to download:',
          result.errors,
        );
        // Don't throw here - let the transaction proceed and fail naturally if needed
      } else {
        console.log(
          '[LunarswapIntegration] Proof parameters ready:',
          result.downloaded,
        );
      }
    } catch (error) {
      console.error(
        '[LunarswapIntegration] Error ensuring proof parameters:',
        error,
      );
      // Don't throw here - let the transaction proceed and fail naturally if needed
    }
  }

  /**
   * Ensure the contract is initialized
   */
  private async ensureContractJoined(): Promise<void> {
    if (!this.lunarswap) {
      const status = await this.joinContract();
      if (status.status !== 'connected') {
        throw new Error(`Contract not ready: ${status.message}`);
      }
    }
  }

  /**
   * Create CoinInfo from token symbol/address and amount
   */
  static createCoinInfo(type: string, value: bigint): CoinInfo {
    console.log('[DEBUG] createCoinInfo type:', type);
    console.log('[DEBUG] createCoinInfo value:', value);

    // Convert hex string to bytes and ensure it's exactly 32 bytes
    const colorBytes = new Uint8Array(Buffer.from(type, 'hex'));

    // If the color is longer than 32 bytes, truncate it
    // If it's shorter than 32 bytes, pad it with zeros
    const color = new Uint8Array(32);
    if (colorBytes.length >= 32) {
      color.set(colorBytes.slice(0, 32));
    } else {
      color.set(colorBytes);
    }

    return {
      color,
      value,
      nonce: new Uint8Array(32),
    };
  }

  /**
   * Create recipient address
   */
  static createRecipient(
    recipientCoinPublicKey: string,
  ): Either<ZswapCoinPublicKey, ContractAddress> {
    console.log('[DEBUG] createRecipient called with:', recipientCoinPublicKey);

    if (!recipientCoinPublicKey || recipientCoinPublicKey.length === 0) {
      console.error('[DEBUG] Empty recipient address provided');
      throw new Error('Recipient address cannot be empty');
    }

    const bech32mCoinPublicKey = MidnightBech32m.parse(recipientCoinPublicKey);
    const coinPublicKey = ShieldedCoinPublicKey.codec.decode(
      getZswapNetworkId(),
      bech32mCoinPublicKey,
    );

    return {
      is_left: true,
      left: { bytes: coinPublicKey.data },
      right: { bytes: new Uint8Array(32) },
    };
  }

  /**
   * Calculate pool address for token pair using the actual getPairIdentity circuit
   */
  private async calculatePoolAddress(
    tokenA: string,
    tokenB: string,
  ): Promise<string> {
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenAInfo = LunarswapIntegration.createCoinInfo(tokenA, BigInt(0));
      const tokenBInfo = LunarswapIntegration.createCoinInfo(tokenB, BigInt(0));

      // Use the Lunarswap API method
      const pairIdentity = await this.lunarswap.getPairIdentity(
        tokenAInfo,
        tokenBInfo,
      );

      return `0x${Buffer.from(pairIdentity).toString('hex')}`;
    } catch (error) {
      console.error(
        'Failed to calculate pool address using getPairIdentity:',
        error,
      );
      throw error;
    }
  }
}

// Factory function to create contract integration
export const createContractIntegration = (
  providers: LunarswapProviders,
  walletAPI: WalletAPI,
  callback: (action: ProviderCallbackAction) => void,
  contractAddress?: string,
) => {
  return new LunarswapIntegration(
    providers,
    walletAPI,
    callback,
    contractAddress,
  );
};
