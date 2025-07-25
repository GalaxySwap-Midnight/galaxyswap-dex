import type {
  MidnightProviders,
  UnprovenTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import type { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { LunarswapProviders } from '@midnight-dapps/lunarswap-api';
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

// Predefined tokens for the demo (4 coins that can generate pairs)
export const DEMO_TOKENS = {
  NIGHT: {
    symbol: 'NIGHT',
    name: 'Midnight',
    address: '0000000000000000000000000000000000000000000000000000000000000001',
  },
  USDC: {
    symbol: 'USDC', 
    name: 'USD Coin',
    address: '0000000000000000000000000000000000000000000000000000000000000002',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether', 
    address: '0000000000000000000000000000000000000000000000000000000000000003',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0000000000000000000000000000000000000000000000000000000000000004',
  },
} as const;

// Contract addresses for Lunarswap (you'll need to replace these with actual deployed contract addresses)
export const LUNARSWAP_CONTRACTS = {
  SWAP_ROUTER: '0x...', // Replace with actual swap router contract address
  FACTORY: '0x...', // Replace with actual factory contract address
  WNIGHT: '0x...', // Replace with actual wrapped NIGHT token address
  // Add the main Lunarswap contract address here when deployed
  LUNARSWAP_CONTRACT: process.env.NEXT_PUBLIC_LUNARSWAP_CONTRACT_ADDRESS || '', 
} as const;

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
  private deployedContract: DeployedLunarswap | null = null;
  private poolData: Ledger | null = null;
  private _status: ContractStatus = 'not-configured';
  private _statusInfo: ContractStatusInfo = { status: 'not-configured' };

  constructor(
    providers: LunarswapProviders,
    walletAPI: DAppConnectorWalletAPI,
  ) {
    this.providers = providers;
    this.walletAPI = walletAPI;
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
    return this._status === 'connected' && this.deployedContract !== null;
  }

  /**
   * Connect to deployed Lunarswap contract with graceful error handling
   */
  async initialize(contractAddress?: string): Promise<ContractStatusInfo> {
    const targetAddress = contractAddress || LUNARSWAP_CONTRACTS.LUNARSWAP_CONTRACT;
    
    // Check if address is configured
    if (!targetAddress || targetAddress === '0x...' || targetAddress === '') {
      this._status = 'not-configured';
      this._statusInfo = {
        status: 'not-configured',
        message: 'Contract address not configured. Please deploy the contract first or set NEXT_PUBLIC_LUNARSWAP_CONTRACT_ADDRESS.',
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
      // Set up private state like in MintButton
      await this.providers.privateStateProvider.set('lunarswapPrivateState', {});
      
      // Create contract instance with proper witnesses
      const contract: LunarswapContract = new Contract(LunarswapWitnesses());

      // Find deployed contract (following MintButton pattern)
      this.deployedContract = await findDeployedContract(this.providers, {
        privateStateId: 'lunarswapPrivateState',
        contractAddress: targetAddress,
        contract,
      });
      
      this._status = 'connected';
      this._statusInfo = {
        status: 'connected',
        contractAddress: targetAddress,
        message: 'Successfully connected to Lunarswap contract',
      };
      
      console.log('Connected to Lunarswap contract at:', targetAddress);
      
      // Fetch initial pool data
      await this.fetchPoolData();
      
      return this._statusInfo;
    } catch (error) {
      console.error('Failed to connect to Lunarswap contract:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Determine if it's a deployment issue or connection issue
      if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        this._status = 'not-deployed';
        this._statusInfo = {
          status: 'not-deployed',
          contractAddress: targetAddress,
          error: errorMessage,
          message: 'Contract address configured but contract not found on network. Contract may not be deployed yet.',
        };
      } else {
        this._status = 'error';
        this._statusInfo = {
          status: 'error',
          contractAddress: targetAddress,
          error: errorMessage,
          message: 'Failed to connect to contract due to network or configuration error.',
        };
      }
      
      return this._statusInfo;
    }
  }

  /**
   * Fetch the public ledger pool data
   */
  async fetchPoolData(): Promise<Ledger | null> {
    if (!this.deployedContract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Get the contract address for querying public state
      const contractAddress = this.deployedContract.deployTxData.public.contractAddress;
      
      // Query the public contract state using getPublicState pattern
      const contractState = await this.providers.publicDataProvider.queryContractState(contractAddress);
      
      if (contractState?.data) {
        // Import the ledger function from lunarswap-v1 to decode the state
        const { ledger } = await import('@midnight-dapps/lunarswap-v1');
        this.poolData = ledger(contractState.data);
        console.log('Pool data fetched:', {
          poolSize: this.poolData.pool.size(),
          isEmpty: this.poolData.pool.isEmpty()
        });
      }
      
      return this.poolData;
    } catch (error) {
      console.error('Failed to fetch pool data:', error);
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

    if (!this.poolData || !this.deployedContract) {
      return false;
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Get pair identity using the circuit
      const txData = await this.deployedContract.callTx.getPairIdentity(tokenAInfo, tokenBInfo);
      const pairIdentity = txData.private.result as Uint8Array;
      
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

    if (!this.poolData || !this.deployedContract) {
      return null;
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Use the contract circuit to get reserves
      const txData = await this.deployedContract.callTx.getPairReserves(tokenAInfo, tokenBInfo);
      const reserves = txData.private.result as [bigint, bigint];
      
      return reserves;
    } catch (error) {
      console.error('Failed to get pair reserves:', error);
      return null;
    }
  }

  /**
   * Execute exact input swap (swapExactTokensForTokens)
   */
  async swapExactTokensForTokens(params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOutMin: string;
    to: string;
  }) {
    if (!this.isReady) {
      throw new Error('Contract not ready. Please ensure contract is deployed and connected.');
    }
    
    if (!this.deployedContract) {
      throw new Error('Lunarswap contract not initialized');
    }
    
    try {
      const tokenInInfo = this.createCoinInfo(params.tokenIn, params.amountIn);
      const tokenOutInfo = this.createCoinInfo(params.tokenOut, '0');
      const recipientAddr = this.createRecipient(params.to);

      // Call the contract method directly
      await this.deployedContract.callTx.swapExactTokensForTokens(
        tokenInInfo,
        tokenOutInfo,
        BigInt(params.amountIn),
        BigInt(params.amountOutMin),
        recipientAddr
      );

      return {
        success: true,
        txHash: 'placeholder-hash',
      };
    } catch (error) {
      console.error('Exact input swap execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute exact output swap (swapTokensForExactTokens)
   */
  async swapTokensForExactTokens(params: {
    tokenIn: string;
    tokenOut: string;
    amountOut: string;
    amountInMax: string;
    to: string;
  }) {
    if (!this.isReady) {
      throw new Error('Contract not ready. Please ensure contract is deployed and connected.');
    }
    
    if (!this.deployedContract) {
      throw new Error('Lunarswap contract not initialized');
    }
    
    try {
      const tokenInInfo = this.createCoinInfo(params.tokenIn, params.amountInMax);
      const tokenOutInfo = this.createCoinInfo(params.tokenOut, params.amountOut);
      const recipientAddr = this.createRecipient(params.to);

      // Call the contract method directly
      await this.deployedContract.callTx.swapTokensForExactTokens(
        tokenInInfo,
        tokenOutInfo,
        BigInt(params.amountOut),
        BigInt(params.amountInMax),
        recipientAddr
      );

      return {
        success: true,
        txHash: 'placeholder-hash',
      };
    } catch (error) {
      console.error('Exact output swap execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute a token swap using Midnight.js (legacy method)
   */
  async executeSwap(params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOutMin: string;
    recipient: string;
    deadline: number;
  }) {
    await this.ensureInitialized();
    
    if (!this.deployedContract) {
      throw new Error('Lunarswap contract not initialized');
    }
    
    try {
      const tokenInInfo = this.createCoinInfo(params.tokenIn, params.amountIn);
      const tokenOutInfo = this.createCoinInfo(params.tokenOut, '0');
      const recipientAddr = this.createRecipient(params.recipient);

      // Call the contract method directly (like mint() in MintButton)
      await this.deployedContract.callTx.swapExactTokensForTokens(
        tokenInInfo,
        tokenOutInfo,
        BigInt(params.amountIn),
        BigInt(params.amountOutMin),
        recipientAddr
      );

      return {
        success: true,
        txHash: 'placeholder-hash', // The actual hash would come from the transaction
      };
    } catch (error) {
      console.error('Swap execution failed:', error);
      throw error;
    }
  }

  /**
   * Add liquidity to a pool (following MintButton pattern)
   */
  async addLiquidity(params: {
    tokenA: string;
    tokenB: string;
    amountADesired: string;
    amountBDesired: string;
    amountAMin: string;
    amountBMin: string;
    recipient: string;
    deadline: number;
  }) {
    if (!this.isReady) {
      throw new Error('Contract not ready. Please ensure contract is deployed and connected.');
    }
    
    if (!this.deployedContract) {
      throw new Error('Lunarswap contract not initialized');
    }
    
    try {
      // Create CoinInfo objects for the tokens
      const tokenAInfo = this.createCoinInfo(params.tokenA, params.amountADesired);
      const tokenBInfo = this.createCoinInfo(params.tokenB, params.amountBDesired);
      const recipientAddr = this.createRecipient(params.recipient);

      // Call the contract method directly (like found.callTx.mint() in MintButton)
      await this.deployedContract.callTx.addLiquidity(
        tokenAInfo,
        tokenBInfo,
        BigInt(params.amountAMin),
        BigInt(params.amountBMin),
        recipientAddr
      );

      return {
        success: true,
        txHash: 'placeholder-hash', // The actual hash would come from the transaction result
        poolAddress: await this.calculatePoolAddress(params.tokenA, params.tokenB),
      };
    } catch (error) {
      console.error('Add liquidity execution failed:', error);
      throw error;
    }
  }

  /**
   * Deploy a new Lunarswap contract (for development/testing)
   */
  async deployNewContract(): Promise<string> {
    try {
      // Set up private state
      await this.providers.privateStateProvider.set('lunarswapPrivateState', {});
      
      // Create contract instance with proper witnesses
      const contract: LunarswapContract = new Contract(LunarswapWitnesses());
      
      // Deploy contract with proper arguments (following lunarswap-api pattern)
      const deployedContract = await deployContract(this.providers, {
        privateStateId: 'lunarswapPrivateState',
        contract,
        initialPrivateState: {},
        args: [
          'Lunarswap LP', // lpTokenName
          'LP', // lpTokenSymbol
          crypto.getRandomValues(new Uint8Array(32)), // lpTokenNonce
          BigInt(18) // lpTokenDecimals
        ],
      });

      this.deployedContract = deployedContract;
      const contractAddress = deployedContract.deployTxData.public.contractAddress;
      
      console.log('Deployed new Lunarswap contract at:', contractAddress);
      return contractAddress;
    } catch (error) {
      console.error('Failed to deploy Lunarswap contract:', error);
      throw error;
    }
  }

  /**
   * Ensure the contract is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.deployedContract) {
      await this.initialize();
    }
  }

  /**
   * Create a CoinInfo object for a token using the predefined addresses
   */
  private createCoinInfo(tokenSymbolOrAddress: string, amount: string): CoinInfo {
    let tokenAddress: string;
    
    // Check if it's a symbol from our demo tokens
    const demoToken = Object.values(DEMO_TOKENS).find(token => token.symbol === tokenSymbolOrAddress);
    if (demoToken) {
      tokenAddress = demoToken.address;
    } else {
      // Assume it's already an address
      tokenAddress = tokenSymbolOrAddress.replace('0x', '');
    }
    
    // Create a proper CoinInfo object with all required fields
    return {
      color: new Uint8Array(Buffer.from(tokenAddress, 'hex')),
      value: BigInt(amount),
      nonce: new Uint8Array(32), // Generate a new nonce (or use existing one)
    };
  }

  /**
   * Create recipient address (Either<ZswapCoinPublicKey, ContractAddress>)
   */
  private createRecipient(recipient: string): Either<ZswapCoinPublicKey, ContractAddress> {
    // This is a simplified implementation - you would need to determine
    // whether the recipient is a wallet address or contract address
    if (recipient.startsWith('0x')) {
      // Contract address (right side of Either)
      return {
        is_left: false,
        left: { bytes: new Uint8Array(32) },
        right: {
          bytes: new Uint8Array(Buffer.from(recipient.replace('0x', ''), 'hex'))
        }
      };
    }
    
    // Wallet public key (left side of Either)
    return {
      is_left: true,
      left: { bytes: new Uint8Array(Buffer.from(recipient, 'hex')) },
      right: { bytes: new Uint8Array(32) }
    };
  }

  /**
   * Calculate pool address for token pair using the actual getPairIdentity circuit
   */
  private async calculatePoolAddress(tokenA: string, tokenB: string): Promise<string> {
    if (!this.deployedContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenAInfo = this.createCoinInfo(tokenA, '0');
      const tokenBInfo = this.createCoinInfo(tokenB, '0');
      
      // Use the actual getPairIdentity circuit from the contract
      const txData = await this.deployedContract.callTx.getPairIdentity(tokenAInfo, tokenBInfo);
      const pairIdentity = txData.private.result as Uint8Array;
      
      return `0x${Buffer.from(pairIdentity).toString('hex')}`;
    } catch (error) {
      console.error('Failed to calculate pool address using getPairIdentity circuit:', error); 
      throw error;
    }
  }
}

/**
 * Create a contract integration instance
 */
export const createContractIntegration = (
  providers: LunarswapProviders,
  walletAPI: DAppConnectorWalletAPI,
) => {
  return new LunarswapContractIntegration(providers, walletAPI);
};
