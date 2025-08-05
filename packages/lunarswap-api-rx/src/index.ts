import type { ContractAddress as ContractAddressType } from '@midnight-ntwrk/compact-runtime';
import type { Logger } from 'pino';
import {
  type LunarswapContract,
  type LunarswapDerivedState,
  type LunarswapProviders,
  type DeployedLunarswapContract,
  emptyState,
  type UserAction,
  type LunarswapId,
} from './common-types.js';
import {
  Contract,
  ledger,
  LunarswapPrivateState,
  LunarswapWitnesses,
} from '@midnight-dapps/lunarswap-v1';
import {
  deployContract,
  findDeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import {
  combineLatest,
  concat,
  defer,
  from,
  map,
  type Observable,
  of,
  retry,
  scan,
  Subject,
} from 'rxjs';
import {
  combineLunarswapState,
  createUserAction,
  clearUserAction,
} from './commons.js';
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';
import type {
  CoinInfo,
  Either,
  ZswapCoinPublicKey,
  QualifiedCoinInfo,
  ContractAddress,
} from '@midnight-dapps/compact-std';
import type { FinalizedCallTxData } from '@midnight-ntwrk/midnight-js-contracts';

const lunarswapContract: LunarswapContract = new Contract(LunarswapWitnesses());

export interface ILunarswap {
  readonly deployedContractAddress: string;
  readonly state$: Observable<LunarswapDerivedState>;

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
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>
  >;
  swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>
  >;
  isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean>;
  getAllPairLength(): Promise<bigint>;
  getPair(tokenA: CoinInfo, tokenB: CoinInfo): Promise<unknown>;
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
  public static readonly LP_TOKEN_NAME = 'Test Lunar';
  public static readonly LP_TOKEN_SYMBOL = 'TLUNAR';
  public static readonly LP_TOKEN_DECIMALS = BigInt(6);

  private constructor(
    public readonly lunarswapId: LunarswapId,
    public readonly deployedContract: DeployedLunarswapContract,
    public readonly providers: LunarswapProviders,
    private readonly logger: Logger,
  ) {
    this.deployedContractAddress =
      deployedContract.deployTxData.public.contractAddress;
    this.actions$ = new Subject<UserAction>();
    this.privateStates$ = new Subject<LunarswapPrivateState>();
    this.state$ = combineLatest(
      [
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, {
            type: 'all',
          })
          .pipe(map((contractState) => ledger(contractState.data))),
        concat(
          from(
            defer(
              () =>
                providers.privateStateProvider.get(
                  lunarswapId,
                ) as Promise<LunarswapPrivateState>,
            ),
          ),
          this.privateStates$,
        ),
        concat(of<UserAction>({}), this.actions$),
      ],
      (ledgerState, _privateState, userActions) => {
        const result: Partial<LunarswapDerivedState> = {
          pool: ledgerState.pool,
          lastAction: userActions,
        };
        return result;
      },
    ).pipe(
      scan(combineLunarswapState, emptyState),
      retry({
        delay: 500,
      }),
    );
  }

  readonly deployedContractAddress: string;
  readonly state$: Observable<LunarswapDerivedState>;
  readonly actions$: Subject<UserAction>;
  readonly privateStates$: Subject<LunarswapPrivateState>;

  async addLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'addLiquidity'>> {
    this.logger?.info({
      addLiquidity: { tokenA, tokenB, amountAMin, amountBMin, to },
    });
    this.actions$.next(
      createUserAction({
        addLiquidity: { tokenA, tokenB, amountAMin, amountBMin, to },
      }),
    );

    try {
      const txData = await this.deployedContract.callTx.addLiquidity(
        tokenA,
        tokenB,
        amountAMin,
        amountBMin,
        to,
      );
      this.logger?.trace({
        addLiquiditySuccess: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      return txData;
    } catch (e) {
      this.actions$.next(clearUserAction());
      throw e;
    }
  }

  async removeLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    liquidity: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<FinalizedCallTxData<LunarswapContract, 'removeLiquidity'>> {
    this.logger?.info({
      removeLiquidity: {
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        to,
      },
    });
    this.actions$.next(
      createUserAction({
        removeLiquidity: {
          tokenA,
          tokenB,
          liquidity,
          amountAMin,
          amountBMin,
          to,
        },
      }),
    );

    try {
      const txData = await this.deployedContract.callTx.removeLiquidity(
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        to,
      );
      this.logger?.trace({
        removeLiquiditySuccess: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      return txData;
    } catch (e) {
      this.actions$.next(clearUserAction());
      throw e;
    }
  }

  async swapExactTokensForTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapExactTokensForTokens'>
  > {
    this.logger?.info({
      swapExactTokensForTokens: {
        tokenIn,
        tokenOut,
        amountIn,
        amountOutMin,
        to,
      },
    });
    this.actions$.next(
      createUserAction({
        swapExactTokensForTokens: {
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMin,
          to,
        },
      }),
    );

    try {
      const txData =
        await this.deployedContract.callTx.swapExactTokensForTokens(
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMin,
          to,
        );
      this.logger?.trace({
        swapExactTokensForTokensSuccess: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      return txData;
    } catch (e) {
      this.actions$.next(clearUserAction());
      throw e;
    }
  }

  async swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<
    FinalizedCallTxData<LunarswapContract, 'swapTokensForExactTokens'>
  > {
    this.logger?.info({
      swapTokensForExactTokens: {
        tokenIn,
        tokenOut,
        amountIn,
        amountOutMin,
        to,
      },
    });
    this.actions$.next(
      createUserAction({
        swapTokensForExactTokens: {
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMin,
          to,
        },
      }),
    );

    try {
      const txData =
        await this.deployedContract.callTx.swapTokensForExactTokens(
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMin,
          to,
        );
      this.logger?.trace({
        swapTokensForExactTokensSuccess: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      return txData;
    } catch (e) {
      this.actions$.next(clearUserAction());
      throw e;
    }
  }

  async isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean> {
    return (await this.deployedContract.callTx.isPairExists(tokenA, tokenB))
      .private.result;
  }

  async getAllPairLength(): Promise<bigint> {
    return (await this.deployedContract.callTx.getAllPairLength()).private
      .result;
  }

  async getPair(tokenA: CoinInfo, tokenB: CoinInfo): Promise<unknown> {
    return await this.deployedContract.callTx.getPair(tokenA, tokenB);
  }

  async getPairReserves(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<[bigint, bigint]> {
    return (await this.deployedContract.callTx.getPairReserves(tokenA, tokenB))
      .private.result;
  }

  async getPairIdentity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<Uint8Array> {
    return (await this.deployedContract.callTx.getPairIdentity(tokenA, tokenB))
      .private.result;
  }

  async getLpTokenName(): Promise<string> {
    return (await this.deployedContract.callTx.getLpTokenName()).private.result;
  }

  async getLpTokenSymbol(): Promise<string> {
    return (await this.deployedContract.callTx.getLpTokenSymbol()).private
      .result;
  }

  async getLpTokenDecimals(): Promise<bigint> {
    return (await this.deployedContract.callTx.getLpTokenDecimals()).private
      .result;
  }

  async getLpTokenType(): Promise<Uint8Array> {
    return (await this.deployedContract.callTx.getLpTokenType()).private.result;
  }

  async getLpTokenTotalSupply(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
  ): Promise<QualifiedCoinInfo> {
    return (
      await this.deployedContract.callTx.getLpTokenTotalSupply(tokenA, tokenB)
    ).private.result;
  }

  static async deploy(
    lunarswapId: LunarswapId,
    providers: LunarswapProviders,
    lpTokenNonce: Uint8Array,
    logger: Logger,
  ): Promise<Lunarswap> {
    logger.info({
      deployContract: {
        lunarswapId,
      },
    });

    const deployedLunarswapContract = await deployContract(providers, {
      privateStateId: lunarswapId,
      contract: lunarswapContract,
      initialPrivateState: await Lunarswap.getPrivateState(
        lunarswapId,
        providers.privateStateProvider,
      ),
      args: [
        Lunarswap.LP_TOKEN_NAME,
        Lunarswap.LP_TOKEN_SYMBOL,
        lpTokenNonce,
        Lunarswap.LP_TOKEN_DECIMALS,
      ],
    });

    logger.trace({
      contractDeployed: {
        lunarswapId,
        finalizedDeployTxData: deployedLunarswapContract.deployTxData.public,
      },
    });

    return new Lunarswap(
      lunarswapId,
      deployedLunarswapContract,
      providers,
      logger,
    );
  }

  static async join(
    lunarswapId: string,
    providers: LunarswapProviders,
    contractAddress: ContractAddressType,
    logger: Logger,
  ): Promise<Lunarswap> {
    logger.info({
      subscribeContract: {
        lunarswapId,
        contractAddress,
      },
    });

    const deployedLunarswapContract = await findDeployedContract(providers, {
      contractAddress,
      contract: lunarswapContract,
      privateStateId: lunarswapId,
      initialPrivateState: await Lunarswap.getPrivateState(
        lunarswapId,
        providers.privateStateProvider,
      ),
    });

    logger.trace({
      contractSubscribed: {
        lunarswapId,
        finalizedDeployTxData: deployedLunarswapContract.deployTxData.public,
      },
    });

    return new Lunarswap(
      lunarswapId,
      deployedLunarswapContract,
      providers,
      logger,
    );
  }

  static async contractExists(
    providers: LunarswapProviders,
    contractAddress: ContractAddressType,
  ): Promise<boolean> {
    try {
      const state =
        await providers.publicDataProvider.queryContractState(contractAddress);
      if (state === null) {
        return false;
      }
      void ledger(state.data); // try to parse it
      return true;
    } catch (e) {
      return false;
    }
  }

  private static async getPrivateState(
    lunarswapId: string,
    privateStateProvider: PrivateStateProvider<
      LunarswapId,
      LunarswapPrivateState
    >,
  ): Promise<LunarswapPrivateState> {
    const existingPrivateState = await privateStateProvider.get(lunarswapId);
    return existingPrivateState ?? LunarswapPrivateState.generate();
  }
}

export * as utils from './utils/index.js';
export * from './common-types.js';
