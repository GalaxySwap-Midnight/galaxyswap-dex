import { Buffer } from 'buffer';
import type {
  MidnightProviders,
  UnprovenTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import type { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import { Lunarswap, type LunarswapProviders } from '@midnight-dapps/lunarswap-api';
import type { CoinInfo, Either, ZswapCoinPublicKey, ContractAddress } from '@midnight-dapps/compact-std';
import { deployContract, findDeployedContract, type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import { 
  Contract, 
  LunarswapWitnesses,
  type LunarswapPrivateState,
  type Witnesses,
  type Ledger,
  type Pair
} from '@midnight-dapps/lunarswap-v1';

// Contract status types
export type ContractStatus = 
  | 'not-configured'    // No contract address configured
  | 'connecting'        // Attempting to connect
  | 'connected'         // Successfully connected
  | 'not-deployed'      // Contract address configured but not found on network
  | 'error';            // Connection error

export interface ContractStatusInfo {
  status: ContractStatus;
  contractAddress?: string;
  error?: string;
  message?: string;
}

type LunarswapContract = Contract<LunarswapPrivateState, Witnesses<LunarswapPrivateState>>;
type DeployedLunarswap = FoundContract<LunarswapContract>;



// Contract interaction utilities
export class LunarswapContractIntegration {
  private providers: LunarswapProviders;
  private walletAPI: DAppConnectorWalletAPI;
  private lunarswap: Lunarswap | null = null;
  private poolData: Ledger | null = null;
  private _status: ContractStatus = 'not-configured';
  private _statusInfo: ContractStatusInfo = { status: 'not-configured' };
  private contractAddress?: string;

  constructor(
    providers: LunarswapProviders,
    walletAPI: DAppConnectorWalletAPI,
    contractAddress?: string,
  ) {
    this.providers = providers;
    this.walletAPI = walletAPI;
    this.contractAddress = contractAddress;
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
  async initialize(): Promise<ContractStatusInfo> {
    // Use the provided contract address or fallback to the hardcoded one
    const targetAddress = this.contractAddress || LUNARSWAP_CONTRACT;

    console.log('targetAddress', targetAddress);
    
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
      console.log('Starting contract connection...');
      console.log('Providers:', this.providers);
      console.log('Wallet API:', this.walletAPI);
      
      // Check wallet network
      try {
        const walletState = await this.walletAPI.state();
        console.log('Wallet state:', walletState);
      } catch (error) {
        console.warn('Could not get wallet state:', error);
      }
      
      // Use Lunarswap.join() like the CLI does
      const contractAddressBytes = new Uint8Array(Buffer.from(targetAddress, 'hex'));
      console.log('Contract address bytes:', contractAddressBytes);
      
      console.log('About to call Lunarswap.join()...');
      console.log('Lunarswap object:', Lunarswap);
      console.log('Providers keys:', Object.keys(this.providers));
      
      // First, try to get public state to verify contract exists
      try {
        console.log('Checking if contract exists on network...');
        const publicState = await Lunarswap.getPublicState(
          this.providers,
          targetAddress
        );
        console.log('Public state result:', publicState);
        
        if (!publicState) {
          this._status = 'not-deployed';
          this._statusInfo = {
            status: 'not-deployed',
            contractAddress: targetAddress,
            message: 'Contract not found on network - it may not be deployed or may be on a different network',
          };
          return this._statusInfo;
        }
      } catch (error) {
        console.error('Failed to get public state:', error);
        // Don't throw here, try to join anyway
        console.log('Public state check failed, but continuing with join attempt...');
      }
      
      // Add timeout to prevent hanging
      const joinPromise = Lunarswap.join(
        this.providers,
        { bytes: contractAddressBytes },
      );
      
      console.log('Join promise created, waiting for result...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          console.log('Timeout reached, rejecting promise');
          reject(new Error('Contract connection timeout after 30 seconds'));
        }, 30000);
      });
      
      this.lunarswap = await Promise.race([joinPromise, timeoutPromise]) as typeof this.lunarswap;
      
      console.log('Lunarswap instance created:', this.lunarswap);
      
      this._status = 'connected';
      this._statusInfo = {
        status: 'connected',
        contractAddress: targetAddress,
        message: 'Successfully connected to Lunarswap contract',
      };
      
      console.log('Connected to Lunarswap contract at:', targetAddress);
      
      // Fetch initial pool data
      console.log('Fetching initial pool data...');
      await this.fetchPoolData();
      console.log('Pool data fetched successfully');
      
      return this._statusInfo;
    } catch (error) {
      console.error('Failed to connect to Lunarswap contract:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', (error as Error)?.constructor?.name);
      console.error('Error message:', (error as Error)?.message);
      console.error('Error stack:', (error as Error)?.stack);
      
      // Handle the specific case where watchForDeployTxData is not available
      // This usually means the contract is already deployed
      if (error instanceof Error && error.message.includes('watchForDeployTxData is not available')) {
        console.log('Contract appears to be already deployed, treating as connected');
        
        this._status = 'connected';
        this._statusInfo = {
          status: 'connected',
          contractAddress: targetAddress,
          message: 'Contract is already deployed and accessible',
        };
        
        return this._statusInfo;
      }
      
      // Handle TypeError for watchForDeployTxData not being a function
      if (error instanceof TypeError && error.message.includes('watchForDeployTxData is not a function')) {
        console.log('Contract appears to be already deployed (TypeError), treating as connected');
        this._status = 'connected';
        this._statusInfo = {
          status: 'connected',
          contractAddress: targetAddress,
          message: 'Contract is already deployed and accessible',
        };
        return this._statusInfo;
      }
      
      // Check if the error indicates the contract is not deployed
      if (error instanceof Error && (
        error.message.includes('Contract not found') ||
        error.message.includes('not deployed') ||
        error.message.includes('not found on network')
      )) {
        this._status = 'not-deployed';
        this._statusInfo = {
          status: 'not-deployed',
          contractAddress: targetAddress,
          error: error.message,
          message: 'Contract is not deployed on the current network',
        };
        return this._statusInfo;
      }
      
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
   * Deploy a new contract
   */
  async deployNewContract(): Promise<string> {
    try {
      console.log('Deploying new Lunarswap contract...');
      
      // Use the Lunarswap API to deploy
      const lpTokenNonce = new Uint8Array(32).fill(0x44);
      this.lunarswap = await Lunarswap.deploy(this.providers, lpTokenNonce);
      const contractAddress = this.lunarswap.deployedContractAddressHex;

      console.log('Deployed new Lunarswap contract at:', contractAddress);
      
      // Update status
      this._status = 'connected';
      this._statusInfo = {
        status: 'connected',
        contractAddress: contractAddress,
        message: 'Successfully deployed and connected to new Lunarswap contract',
      };
      
      return contractAddress;
    } catch (error) {
      console.error('Failed to deploy new contract:', error);
      this._status = 'error';
      this._statusInfo = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to deploy new contract',
      };
      throw error;
    }
  }

  /**
   * Try to connect to existing contract, or deploy a new one if not found
   */
  async initializeOrDeploy(): Promise<ContractStatusInfo> {
    const status = await this.initialize();
    
    if (status.status === 'not-deployed') {
      console.log('Contract not deployed, attempting to deploy a new one...');
      try {
        const newAddress = await this.deployNewContract();
        return {
          status: 'connected',
          contractAddress: newAddress,
          message: 'Successfully deployed and connected to new Lunarswap contract',
        };
      } catch (error) {
        return {
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
          message: 'Failed to deploy new contract',
        };
      }
    }
    
    return status;
  }

  /**
   * Fetch the public ledger pool data
   */
  async fetchPoolData(): Promise<Ledger | null> {
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    try {
      // Use the Lunarswap API to get public state
      this.poolData = await Lunarswap.getPublicState(
        this.providers,
        this.lunarswap.deployedContractAddressHex
      );
      return this.poolData;
    } catch (error) {
      console.error('Failed to fetch pool data:', error);
      
      // Handle the specific case where watchForDeployTxData is not available
      if (error instanceof Error && error.message.includes('watchForDeployTxData is not available')) {
        console.log('Contract appears to be already deployed, returning empty pool data');
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
        pair
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
      await this.fetchPoolData();
    }

    if (!this.poolData || !this.lunarswap) {
      return false;
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Use the Lunarswap API method
      const pairIdentity = await this.lunarswap.getPairIdentity(tokenAInfo, tokenBInfo);
      
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
  async getPairReserves(tokenA: string, tokenB: string): Promise<[bigint, bigint] | null> {
    if (!this.isReady) {
      console.warn('Contract not ready for getPairReserves operation');
      return null;
    }

    if (!this.poolData) {
      await this.fetchPoolData();
    }

    if (!this.poolData || !this.lunarswap) {
      return null;
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Use the Lunarswap API method
      const reserves = await this.lunarswap.getPairReserves(tokenAInfo, tokenBInfo);
      
      return reserves;
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
    amountIn: string,
    amountOutMin: string,
    recipient: string,
  ): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenInInfo = this.createCoinInfo(tokenIn, amountIn);
    const tokenOutInfo = this.createCoinInfo(tokenOut, '0');
    const recipientAddress = this.createRecipient(recipient);

    // Use the Lunarswap API method
    await this.lunarswap.swapExactTokensForTokens(
      tokenInInfo,
      tokenOutInfo,
      BigInt(amountIn),
      BigInt(amountOutMin),
      recipientAddress,
    );
  }

  /**
   * Swap tokens for exact output tokens
   */
  async swapTokensForExactTokens(
    tokenIn: string,
    tokenOut: string,
    amountOut: string,
    amountInMax: string,
    recipient: string,
  ): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenInInfo = this.createCoinInfo(tokenIn, '0');
    const tokenOutInfo = this.createCoinInfo(tokenOut, '0');
    const recipientAddress = this.createRecipient(recipient);

    // Use the Lunarswap API method
    await this.lunarswap.swapTokensForExactTokens(
      tokenInInfo,
      tokenOutInfo,
      BigInt(amountOut),
      BigInt(amountInMax),
      recipientAddress,
    );
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string,
    minAmountA: string,
    minAmountB: string,
    recipient: string,
  ): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenAInfo = this.createCoinInfo(tokenA, amountA);
    const tokenBInfo = this.createCoinInfo(tokenB, amountB);
    const recipientAddress = this.createRecipient(recipient);

    // Use the Lunarswap API method
    await this.lunarswap.addLiquidity(
      tokenAInfo,
      tokenBInfo,
      BigInt(minAmountA),
      BigInt(minAmountB),
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
    minAmountA: string,
    minAmountB: string,
    recipient: string,
  ): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    const tokenAInfo = this.createCoinInfo(tokenA, '0');
    const tokenBInfo = this.createCoinInfo(tokenB, '0');
    const liquidityInfo = this.createCoinInfo('LP', liquidity);
    const recipientAddress = this.createRecipient(recipient);

    // Use the Lunarswap API method
    await this.lunarswap.removeLiquidity(
      tokenAInfo,
      tokenBInfo,
      liquidityInfo,
      BigInt(minAmountA),
      BigInt(minAmountB),
      recipientAddress,
    );
  }

  /**
   * Ensure the contract is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.lunarswap) {
      const status = await this.initialize();
      if (status.status !== 'connected') {
        throw new Error(`Contract not ready: ${status.message}`);
      }
    }
  }

  /**
   * Create CoinInfo from token symbol/address and amount
   */
  private createCoinInfo(tokenSymbolOrAddress: string, amount: string): CoinInfo {

    // Check if it's a token address (hex string)
    if (tokenSymbolOrAddress.startsWith('0x') || tokenSymbolOrAddress.length === 64) {
      const address = tokenSymbolOrAddress.startsWith('0x') 
        ? tokenSymbolOrAddress.slice(2) 
        : tokenSymbolOrAddress;
      
      return {
        color: new Uint8Array(Buffer.from(address, 'hex')),
        value: BigInt(amount),
        nonce: new Uint8Array(32),
      };
    }

    // Handle native token
    if (tokenSymbolOrAddress === 'NIGHT') {
      return {
        color: new Uint8Array(32), // Native token has zero color
        value: BigInt(amount),
        nonce: new Uint8Array(32),
      };
    }

    // For other tokens, try to find in DEMO_TOKENS
    const tokenDetails = Object.values(DEMO_TOKENS).find(
      token => token.symbol === tokenSymbolOrAddress
    );

    if (tokenDetails) {
      return {
        color: new Uint8Array(Buffer.from(tokenDetails.type, 'hex')),
        value: BigInt(amount),
        nonce: new Uint8Array(32),
      };
    }

    throw new Error(`Unknown token: ${tokenSymbolOrAddress}`);
  }

  /**
   * Create recipient address
   */
  private createRecipient(recipient: string): Either<ZswapCoinPublicKey, ContractAddress> {

    if (recipient.startsWith('0x')) {
      // Contract address
      return {
        is_left: false,
        left: { bytes: new Uint8Array(32) },
        right: { bytes: new Uint8Array(Buffer.from(recipient.slice(2), 'hex')) }
      };
    } else {
      // Public key
      return {
        is_left: true,
        left: { bytes: new Uint8Array(Buffer.from(recipient, 'hex')) },
        right: { bytes: new Uint8Array(32) }
      };
    }
  }

  /**
   * Calculate pool address for token pair using the actual getPairIdentity circuit
   */
  private async calculatePoolAddress(tokenA: string, tokenB: string): Promise<string> {
    if (!this.lunarswap) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Use the Lunarswap API method
      const pairIdentity = await this.lunarswap.getPairIdentity(tokenAInfo, tokenBInfo);
      
      return `0x${Buffer.from(pairIdentity).toString('hex')}`;
    } catch (error) {
      console.error('Failed to calculate pool address using getPairIdentity:', error); 
      throw error;
    }
  }
}

// Factory function to create contract integration
export const createContractIntegration = (
  providers: LunarswapProviders,
  walletAPI: DAppConnectorWalletAPI,
  contractAddress?: string,
) => {
  return new LunarswapContractIntegration(providers, walletAPI, contractAddress);
};

// Token configuration
export const DEMO_TOKENS = {
  TUSD: { symbol: 'TUSD', name: 'Test USD', address: '020050fdd8e2eea82068e6bab6ad0c78ef7e0c050dd9fc1d0a32495c95310c4e1959', type: '0200fb81b15b883bcbba5630c6f9111d85bd6b237afda821789e2bd049f483cfbf3c' },
  TEURO: { symbol: 'TEURO', name: 'Test Euro', address: '02007285b48ebb1f85fc6cc7b1754a64deed1f2210b4c758a37309039510acb8781a', type: '02003af426c10783ffe699149c2ef39edb7a6e05e2a2bfe1c3a90e1add8a9d6e2dac' },
  TJPY: { symbol: 'TJPY', name: 'Test Japanese Yen', address: '02003854ada114516d9ebe65061da7c3f9f00830afdd47c749ed9e2836d36a026d01', type: '020011a6de51d7633b00f9c5f9408c836a5566870f9366f14022814735eec0663a0b' },
  TCNY: { symbol: 'TCNY', name: 'Test Chinese Yuan', address: '02001e10cca412097c53af918b4532865823e3850fbaf2f66203036acfab324df5c9', type: '0200e6b100604d6e10e080948e43cfc4aa1646e32d972d4aada3ac36ce430443911d' },
  TARS: { symbol: 'TARS', name: 'Test Argentine Peso', address: '02009161411a0e1e51467c8559444efb09d6a372aca23b3e6613c5b9394ba3d4befd', type: '020063482c03ec84e6e9bf55ef1eef9ea431f2c434921fab43f9d4c3e60d884a4c6a' },
} as const;

// Contract addresses
export const LUNARSWAP_CONTRACT = '02000400f75026235c9af6b5963f7d27a8b814dc348946491dab3097cae6a2dfdbb0';
