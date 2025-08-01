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
  LunarswapPrivateState,
  type Ledger,
  type Pair,
} from '@midnight-dapps/lunarswap-v1';
// TODO: Question: Why is ContractAddress exported differently in compact-std and compact-runtime?
// TODO: Question: why is also the coinInfo type are different?
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
} from './types';
import {
  deployContract,
  FinalizedCallTxData,
  findDeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';

const lunarswapContractInstance = new Contract(LunarswapWitnesses());

export interface ILunarswap {
  deployedContractAddressHex: string;
  state$: Observable<LunarswapPublicState>;
  addLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'addLiquidity'>>;
  removeLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    liquidity: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'removeLiquidity'>>;
  swapExactTokensForTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>>;
  swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>>;
  isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean>;
  getAllPairLength(): Promise<bigint>;
  getPair(tokenA: CoinInfo, tokenB: CoinInfo): Promise<Pair>;
  getPairReserves(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<[bigint, bigint]>;
  getPairIdentity(tokenA: CoinInfo, tokenB: CoinInfo): Promise<Uint8Array>;
  getLpTokenName(): Promise<string>;
  getLpTokenSymbol(): Promise<string>;
  getLpTokenDecimals(): Promise<bigint>;
  getLpTokenType(): Promise<Uint8Array>;
  getLpTokenTotalSupply(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<QualifiedCoinInfo>;
}

export class Lunarswap implements ILunarswap {
  public deployedContractAddressHex: string;
  public state$: Observable<LunarswapPublicState>;

  // Constructor arguments as constants
  public static readonly LP_TOKEN_NAME = 'Lunarswap LP';
  public static readonly LP_TOKEN_SYMBOL = 'LP';
  public static readonly LP_TOKEN_DECIMALS = BigInt(18);

  private constructor(
    public readonly deployedContract: DeployedLunarswapContract,
    providers: LunarswapProviders,
    public lpTokenNonce: Uint8Array,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddressHex =
      deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        // Combine public (ledger) state with...
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddressHex, {
            type: 'latest',
          })
          .pipe(
            map((contractState) => ledger(contractState.data)),
            tap((ledgerState) =>
              logger?.trace({
                ledgerState: {
                  ...ledgerState,
                  pool: ledgerState.pool,
                },
              }),
            ),
          ),
        from(providers.privateStateProvider.get('lunarswapPrivateState')).pipe(
          map((privateStates) => privateStates?.lunarswapPrivateState),
        ),
      ],
      (ledgerState, privateState) => {
        return {
          pool: ledgerState.pool,
          privateState: privateState,
        };
      },
    );
  }

  static async deploy(
    providers: LunarswapProviders,
    lpTokenNonce: Uint8Array,
    logger?: Logger,
  ): Promise<Lunarswap> {
    logger?.info('Deploying Lunarswap contract...');

    // Create a fresh contract instance for each deployment
    const lunarswapContractInstance: LunarswapContract = new Contract(
      LunarswapWitnesses(),
    );

    const deployedContract = await deployContract<LunarswapContract>(
      providers,
      {
        contract: lunarswapContractInstance,
        privateStateId: LunarswapPrivateStateId,
        initialPrivateState: await Lunarswap.getPrivateState(providers),
        args: [
          Lunarswap.LP_TOKEN_NAME, // lpTokenName
          Lunarswap.LP_TOKEN_SYMBOL, // lpTokenSymbol
          lpTokenNonce, // lpTokenNonce (32 bytes)
          Lunarswap.LP_TOKEN_DECIMALS, // lpTokenDecimals
        ],
      },
    );

    logger?.info('Lunarswap contract deployed');
    return new Lunarswap(deployedContract, providers, lpTokenNonce, logger);
  }

  static async join(
    providers: LunarswapProviders,
    contractAddress: ContractAddress,
    logger?: Logger,
  ): Promise<Lunarswap> {
    logger?.info('Joining Lunarswap contract...');

    // Convert contractAddress.bytes (Uint8Array) to hex string for findDeployedContract
    const contractAddressHex = Buffer.from(contractAddress.bytes).toString(
      'hex',
    );

    const deployedContract = await findDeployedContract(providers, {
      contractAddress: contractAddressHex,
      contract: lunarswapContractInstance as LunarswapContract,
      privateStateId: 'lunarswapPrivateState',
      initialPrivateState: await Lunarswap.getPrivateState(providers),
    });
    logger?.info('Lunarswap contract joined');
    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    // TODO: get lpTokenNonce from the contract
    const lpTokenNonce = crypto.getRandomValues(new Uint8Array(32));

    return new Lunarswap(deployedContract, providers, lpTokenNonce, logger);
  }

  static async getPublicState(
    providers: LunarswapProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<Ledger | null> {
    const contractState =
      await providers.publicDataProvider.queryContractState(contractAddress);
    return contractState ? ledger(contractState.data) : null;
  }

  static async getZswapChainState(
    providers: LunarswapProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<ZswapChainState | null> {
    // TODO: Question: Why not just use queryContractState for zswap?
    const result =
      await providers.publicDataProvider.queryZSwapAndContractState(
        contractAddress,
      );
    return result ? result[0] : null;
  }

  static async getDeployedContractState(
    providers: LunarswapProviders,
    contractAddress: ContractAddressRuntime,
  ): Promise<ContractState | null> {
    const deployedContract =
      await providers.publicDataProvider.queryDeployContractState(
        contractAddress,
      );
    return deployedContract ?? null;
  }

  static async getPrivateState(
    providers: LunarswapProviders,
  ): Promise<LunarswapPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(
      'lunarswapPrivateState',
    );
    return (
      existingPrivateState?.lunarswapPrivateState ??
      LunarswapPrivateState.generate()
    );
  }

  async addLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'addLiquidity'>> {
    console.log('API addLiquidity tokenA:', tokenA);
    console.log('API addLiquidity tokenB:', tokenB);
    console.log('API addLiquidity amountAMin:', amountAMin);
    console.log('API addLiquidity amountBMin:', amountBMin);
    console.log('API addLiquidity to:', to);

    const txData = await this.deployedContract.callTx.addLiquidity(
      tokenA,
      tokenB,
      amountAMin,
      amountBMin,
      to,
    );

    console.log('API addLiquidity txData:', txData);

    this.logger?.trace({
      transactionAdded: {
        circuit: 'addLiquidity',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });

    return txData;
  }

  async removeLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    liquidity: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'removeLiquidity'>> {
    const txData = await this.deployedContract.callTx.removeLiquidity(
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
    );

    this.logger?.trace({
      transactionAdded: {
        circuit: 'removeLiquidity',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });

    return txData;
  }

  async swapExactTokensForTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>> {
    const txData = await this.deployedContract.callTx.swapExactTokensForTokens(
      tokenIn,
      tokenOut,
      amountIn,
      amountOutMin,
      to,
    );

    this.logger?.trace({
      transactionAdded: {
        circuit: 'swapExactTokensForTokens',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });

    return txData;
  }

  async swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountOut: bigint,
    amountInMax: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>> {
    const txData = await this.deployedContract.callTx.swapTokensForExactTokens(
      tokenIn,
      tokenOut,
      amountOut,
      amountInMax,
      to,
    );

    this.logger?.trace({
      transactionAdded: {
        circuit: 'swapTokensForExactTokens',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });

    return txData;
  }

  async isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean> {
    const txData = await this.deployedContract.callTx.isPairExists(
      tokenA,
      tokenB,
    );
    return txData.private.result;
  }

  async getAllPairLength(): Promise<bigint> {
    const txData = await this.deployedContract.callTx.getAllPairLength();
    return txData.private.result;
  }

  async getPair(tokenA: CoinInfo, tokenB: CoinInfo): Promise<Pair> {
    const txData = await this.deployedContract.callTx.getPair(tokenA, tokenB);
    return txData.private.result;
  }

  async getPairReserves(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<[bigint, bigint]> {
    const txData = await this.deployedContract.callTx.getPairReserves(
      tokenA,
      tokenB,
    );
    return [txData.private.result[0], txData.private.result[1]];
  }

  async getPairIdentity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<Uint8Array> {
    const txData = await this.deployedContract.callTx.getPairIdentity(
      tokenA,
      tokenB,
    );
    return txData.private.result;
  }

  async getLpTokenName(): Promise<string> {
    const txData = await this.deployedContract.callTx.getLpTokenName();
    return txData.private.result;
  }

  async getLpTokenSymbol(): Promise<string> {
    const txData = await this.deployedContract.callTx.getLpTokenSymbol();
    return txData.private.result;
  }

  async getLpTokenDecimals(): Promise<bigint> {
    const txData = await this.deployedContract.callTx.getLpTokenDecimals();
    return txData.private.result;
  }

  async getLpTokenType(): Promise<Uint8Array> {
    const txData = await this.deployedContract.callTx.getLpTokenType();
    return txData.private.result;
  }

  async getLpTokenTotalSupply(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<QualifiedCoinInfo> {
    const txData = await this.deployedContract.callTx.getLpTokenTotalSupply(
      tokenA,
      tokenB,
    );
    return txData.private.result;
  }
}
