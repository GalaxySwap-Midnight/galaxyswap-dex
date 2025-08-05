import type {
  CoinInfo,
  ContractAddress,
  Either,
  ZswapCoinPublicKey,
  QualifiedCoinInfo,
} from '@midnight-dapps/compact-std';
import {
  Contract,
  ledger,
  LunarswapWitnesses,
  type LunarswapPrivateState,
  type Ledger,
  type Pair,
} from '@midnight-dapps/lunarswap-v1';
import type {
  ContractAddress as ContractAddressRuntime,
  ContractState,
} from '@midnight-ntwrk/compact-runtime';
import type { ZswapChainState } from '@midnight-ntwrk/ledger';
import { combineLatest, from, map, tap, type Observable } from 'rxjs';
import type { Logger } from 'pino';
import {
  type DeployedLunarswapContract,
  type LunarswapContract,
  type LunarswapProviders,
  type LunarswapPublicState,
  LunarswapPrivateStateId,
  type LunarswapCircuitKeys,
  type Config,
  ContractNotFoundError,
  ContractDeploymentFailed,
} from './types.js';
import type { LunarswapAPI } from './api.js';
import {
  deployContract,
  type FinalizedCallTxData,
  findDeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';

const lunarswapContractInstance: LunarswapContract = new Contract(LunarswapWitnesses());



/**
 * A Midnight.JS-based implementation of Lunarswap
 * It does use Midnight.JS and real contract implementation, as well as requires access to node, wallet, pub-sub and proof server
 * in order to fully work.
 *
 * This class is also the primary implementation final DApp uses to make calls and get state.
 *
 * In its structure it has many similarities with the `DirectAPI` implementation from contract package. But the implementations
 * used make this class connect to a network and create transactions instead of performing everything in memory. So there are 3 main parts:
 * - state management
 * - orchestrating contract calls
 * - exposing calls to specific contract circuits
 *
 * Most of the state management code is held in the constructor. It boils down to getting stream of state changes of each
 * state piece (contract, private, ephemeral) and combining them into single Lunarswap state (using exactly the same code, as
 * in-memory implementation does)
 *
 * Calls are orchestrated in the `callCircuit` method.
 *
 * The majority of other methods are ones to call specific circuits through a `callCircuit` one.
 */
export class LunarswapClientAPI implements LunarswapAPI {
  public deployedContractAddressHex: string;
  public state$: Observable<LunarswapPublicState>;

  // Constructor arguments as constants
  public static readonly LP_TOKEN_NAME = 'Test Lunar';
  public static readonly LP_TOKEN_SYMBOL = 'TLUNAR';
  public static readonly LP_TOKEN_DECIMALS = BigInt(6);

  private constructor(
    private readonly providers: LunarswapClientProviders,
    public readonly contract: DeployedLunarswapContract,
    public lpTokenNonce: Uint8Array,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddressHex = contract.address;
    
    // Set up state observable
    this.state$ = combineLatest([
      from(this.getPublicState()),
      from(this.getPrivateState()),
    ]).pipe(
      map(([publicState, privateState]) => ({
        pool: publicState?.pool || { pairs: [] },
      })),
      tap((state) => {
        this.logger?.trace({ state }, 'Lunarswap state updated');
      }),
    );
  }

  /**
   * Deploys contract to the network. Exact behavior will depend on passed providers, and this is place where one can
   * differentiate between e.g. browser environment and a headless local testing one.
   *
   * What happens is that:
   * 1. a brand new private state is being generated
   * 2. a private state provider is overridden to use in-memory implementation, this will be useful in step #4
   * 3. within `deployContractCall` Midnight.js prepares initial contract state, prepares deploy transaction and submits it
   * 4. After successful deploy, the resulting private state is rewritten to persistent storage, this time under contract address - this allows to:
   *    - have private state available for future calls
   *    - have private state available for other participants
   */
  static async deploy(
    providers: LunarswapClientProviders,
    lpTokenNonce: Uint8Array,
    config: Config,
    logger?: Logger,
  ): Promise<LunarswapClientAPI> {
    const instanceLogger = logger?.child({ what: 'LunarswapClientAPI.deploy' });
    instanceLogger?.info('Deploying Lunarswap contract');

    try {
      const contract = await deployContract(
        lunarswapContractInstance,
        providers,
        instanceLogger,
      );

      instanceLogger?.info({ address: contract.address }, 'Lunarswap contract deployed successfully');

      return new LunarswapClientAPI(providers, contract, lpTokenNonce, logger);
    } catch (error) {
      instanceLogger?.error({ error }, 'Failed to deploy Lunarswap contract');
      throw new ContractDeploymentFailed();
    }
  }

  /**
   * Joins an existing contract. This is the primary way to interact with already deployed contracts.
   */
  static async join(
    providers: LunarswapClientProviders,
    contractAddress: ContractAddress,
    config: Config,
    logger?: Logger,
  ): Promise<LunarswapClientAPI> {
    const instanceLogger = logger?.child({ what: 'LunarswapClientAPI.join' });
    instanceLogger?.info({ address: contractAddress }, 'Joining existing Lunarswap contract');

    try {
      const contract = await findDeployedContract(
        lunarswapContractInstance,
        contractAddress,
        providers,
        instanceLogger,
      );

      if (!contract) {
        throw new ContractNotFoundError(contractAddress);
      }

      instanceLogger?.info({ address: contract.address }, 'Successfully joined Lunarswap contract');

      // For now, we'll use a default nonce - in a real implementation this would be retrieved from the contract
      const lpTokenNonce = new Uint8Array(32);

      return new LunarswapClientAPI(providers, contract, lpTokenNonce, logger);
    } catch (error) {
      instanceLogger?.error({ error, address: contractAddress }, 'Failed to join Lunarswap contract');
      throw error;
    }
  }

  /**
   * Gets the public state of the contract
   */
  static async getPublicState(
    providers: LunarswapClientProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<Ledger | null> {
    return await ledger.getPublicState(providers, contractAddress);
  }

  /**
   * Gets the Zswap chain state
   */
  static async getZswapChainState(
    providers: LunarswapClientProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<ZswapChainState | null> {
    return await ledger.getZswapChainState(providers, contractAddress);
  }

  /**
   * Gets the deployed contract state
   */
  static async getDeployedContractState(
    providers: LunarswapClientProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<ContractState | null> {
    return await ledger.getDeployedContractState(providers, contractAddress);
  }

  /**
   * Gets the private state
   */
  static async getPrivateState(
    providers: LunarswapClientProviders,
  ): Promise<LunarswapPrivateState> {
    return await providers.privateStateProvider.getPrivateState(LunarswapPrivateStateId);
  }

  /**
   * Add liquidity to a pair
   */
  async addLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'addLiquidity'>> {
    const action = {
      tokenA,
      tokenB,
      amountAMin,
      amountBMin,
      to,
    };

    return await this.callCircuit('addLiquidity', () =>
      lunarswapContractInstance.addLiquidity(
        this.providers,
        this.contract,
        action,
      ),
    );
  }

  /**
   * Remove liquidity from a pair
   */
  async removeLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    liquidity: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'removeLiquidity'>> {
    const action = {
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
    };

    return await this.callCircuit('removeLiquidity', () =>
      lunarswapContractInstance.removeLiquidity(
        this.providers,
        this.contract,
        action,
      ),
    );
  }

  /**
   * Swap exact tokens for tokens
   */
  async swapExactTokensForTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>> {
    const action = {
      tokenIn,
      tokenOut,
      amountIn,
      amountOutMin,
      to,
    };

    return await this.callCircuit('swapExactTokensForTokens', () =>
      lunarswapContractInstance.swapExactTokensForTokens(
        this.providers,
        this.contract,
        action,
      ),
    );
  }

  /**
   * Swap tokens for exact tokens
   */
  async swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountOut: bigint,
    amountInMax: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>> {
    const action = {
      tokenIn,
      tokenOut,
      amountOut,
      amountInMax,
      to,
    };

    return await this.callCircuit('swapTokensForExactTokens', () =>
      lunarswapContractInstance.swapTokensForExactTokens(
        this.providers,
        this.contract,
        action,
      ),
    );
  }

  /**
   * Check if a pair exists
   */
  async isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean> {
    const publicState = await this.getPublicState();
    return publicState?.pool.pairs.some(
      (pair) =>
        (pair.tokenA.type === tokenA.type && pair.tokenB.type === tokenB.type) ||
        (pair.tokenA.type === tokenB.type && pair.tokenB.type === tokenA.type),
    ) || false;
  }

  /**
   * Get all pair length
   */
  async getAllPairLength(): Promise<bigint> {
    const publicState = await this.getPublicState();
    return BigInt(publicState?.pool.pairs.length || 0);
  }

  /**
   * Get a specific pair
   */
  async getPair(tokenA: CoinInfo, tokenB: CoinInfo): Promise<Pair> {
    const publicState = await this.getPublicState();
    const pair = publicState?.pool.pairs.find(
      (p) =>
        (p.tokenA.type === tokenA.type && p.tokenB.type === tokenB.type) ||
        (p.tokenA.type === tokenB.type && p.tokenB.type === tokenA.type),
    );
    if (!pair) {
      throw new Error('Pair not found');
    }
    return pair;
  }

  /**
   * Get pair reserves
   */
  async getPairReserves(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<[bigint, bigint]> {
    const pair = await this.getPair(tokenA, tokenB);
    return [pair.reserveA, pair.reserveB];
  }

  /**
   * Get pair identity
   */
  async getPairIdentity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<Uint8Array> {
    const pair = await this.getPair(tokenA, tokenB);
    return pair.identity;
  }

  /**
   * Get LP token name
   */
  async getLpTokenName(): Promise<string> {
    return LunarswapClientAPI.LP_TOKEN_NAME;
  }

  /**
   * Get LP token symbol
   */
  async getLpTokenSymbol(): Promise<string> {
    return LunarswapClientAPI.LP_TOKEN_SYMBOL;
  }

  /**
   * Get LP token decimals
   */
  async getLpTokenDecimals(): Promise<bigint> {
    return LunarswapClientAPI.LP_TOKEN_DECIMALS;
  }

  /**
   * Get LP token type
   */
  async getLpTokenType(): Promise<Uint8Array> {
    return this.lpTokenNonce;
  }

  /**
   * Get LP token total supply
   */
  async getLpTokenTotalSupply(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<QualifiedCoinInfo> {
    const pair = await this.getPair(tokenA, tokenB);
    return {
      type: this.lpTokenNonce,
      value: pair.totalSupply,
    };
  }

  /**
   * Call a circuit with proper error handling and logging
   */
  private async callCircuit<K extends LunarswapCircuitKeys>(
    circuitName: K,
    doCallTx: () => Promise<FinalizedCallTxData<LunarswapContract, K>>,
  ): Promise<FinalizedCallTxData<LunarswapContract, K>> {
    const actionId = `${circuitName}_${Date.now()}`;
    const logActionStatus = (status: string) =>
      this.logger?.trace({ actionId, circuitName }, status);

    logActionStatus('Starting circuit call');

    try {
      const result = await doCallTx();
      logActionStatus('Circuit call completed successfully');
      return result;
    } catch (error) {
      this.logger?.error({ error, actionId, circuitName }, 'Circuit call failed');
      throw error;
    }
  }

  /**
   * Get the current public state
   */
  private async getPublicState(): Promise<Ledger | null> {
    return await LunarswapClientAPI.getPublicState(
      this.providers,
      this.contract.address,
    );
  }

  /**
   * Get the current private state
   */
  private async getPrivateState(): Promise<LunarswapPrivateState> {
    return await LunarswapClientAPI.getPrivateState(this.providers);
  }
} 