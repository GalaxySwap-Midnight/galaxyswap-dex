import { block, pipe } from './helpers/index.js';
import type { ValuesOf } from './helpers/index.js';
import { either } from 'fp-ts';
import * as t from 'io-ts';
import type { Observable } from 'rxjs';

/**
 * Below are definitions for 2 most important pieces of the Lunarswap API:
 *   - the interface UI expects `LunarswapAPI`
 *   - state definition: `LunarswapState`
 */

export const Actions = {
  addLiquidity: 'addLiquidity',
  removeLiquidity: 'removeLiquidity',
  swapExactTokensForTokens: 'swapExactTokensForTokens',
  swapTokensForExactTokens: 'swapTokensForExactTokens',
} as const;

export const ActionCodec = t.union([
  t.literal(Actions.addLiquidity),
  t.literal(Actions.removeLiquidity),
  t.literal(Actions.swapExactTokensForTokens),
  t.literal(Actions.swapTokensForExactTokens),
]);

export type Action = t.TypeOf<typeof ActionCodec>;

export const AsyncActionStates = {
  inProgress: 'in_progress',
  error: 'error',
  success: 'success',
} as const;

export type AsyncActionState = ValuesOf<typeof AsyncActionStates>;

export const ActionIdCodec = t.string;
export type ActionId = t.TypeOf<typeof ActionIdCodec>;

export const DateCodec = t.string.pipe(
  block(() => {
    const validate: t.Validate<string, Date> = (str, context) => {
      const candidate = new Date(str);
      if (candidate.toString() === 'Invalid Date') {
        return either.left([
          {
            value: str,
            context,
            message: `Could not parse ${str} to a Date object`,
          },
        ]);
      }
      return either.right(candidate);
    };

    return new t.Type<Date, string, string>(
      'date',
      (value): value is Date => value instanceof Date,
      validate,
      (date) => date.toISOString(),
    );
  }),
);

export const BigintStringCodec = t.string.pipe(
  new t.Type<bigint, string, string>(
    'bigint',
    (value: unknown): value is bigint => typeof value === 'bigint' || value instanceof BigInt,
    (str: string, context: t.Context) =>
      pipe(
        str,
        either.fromPredicate(
          (str: string) => str.trim() !== '',
          () => [
            {
              value: str,
              context,
              message: 'Could not parse an empty string into a BigInt',
            },
          ],
        ),
        either.chain((str: string) =>
          either.tryCatch(
            () => BigInt(str),
            (): t.Errors => [
              {
                value: str,
                context,
                message: `Could not parse ${str} into a BigInt`,
              },
            ],
          ),
        ),
      ),
    (bigint: bigint) => bigint.toString(10),
  ),
);

const AsyncActionCommons = t.type({
  id: ActionIdCodec,
  action: ActionCodec,
  startedAt: DateCodec,
});

export const AsyncActionCodec = t.intersection([
  AsyncActionCommons,
  t.union([
    t.type({
      status: t.literal(AsyncActionStates.inProgress),
    }),
    t.type({
      status: t.literal(AsyncActionStates.error),
      error: t.string,
    }),
    t.type({
      status: t.literal(AsyncActionStates.success),
    }),
  ]),
]);
export type AsyncAction = t.TypeOf<typeof AsyncActionCodec>;

export const AsyncAction = block(() => {
  const succeeded = (action: AsyncAction): AsyncAction => ({
    ...action,
    status: 'success',
  });

  const failed =
    (error: string) =>
    (action: AsyncAction): AsyncAction => ({
      ...action,
      status: 'error',
      error,
    });

  return { succeeded, failed };
});

// Coin and token related codecs
export const CoinInfoCodec = t.type({
  type: t.unknown, // Uint8Array will be handled by runtime validation
  value: BigintStringCodec,
});
export type CoinInfo = t.TypeOf<typeof CoinInfoCodec>;

export const ContractAddressCodec = t.unknown; // Uint8Array will be handled by runtime validation
export type ContractAddress = t.TypeOf<typeof ContractAddressCodec>;

export const ZswapCoinPublicKeyCodec = t.unknown; // Uint8Array will be handled by runtime validation
export type ZswapCoinPublicKey = t.TypeOf<typeof ZswapCoinPublicKeyCodec>;

export const EitherCodec = <L, R>(leftCodec: t.Type<L>, rightCodec: t.Type<R>) =>
  t.union([leftCodec, rightCodec]);
export type Either<L, R> = L | R;

export const QualifiedCoinInfoCodec = t.type({
  type: t.unknown, // Uint8Array will be handled by runtime validation
  value: BigintStringCodec,
});
export type QualifiedCoinInfo = t.TypeOf<typeof QualifiedCoinInfoCodec>;

// Pair related codecs
export const PairCodec = t.type({
  tokenA: CoinInfoCodec,
  tokenB: CoinInfoCodec,
  reserveA: BigintStringCodec,
  reserveB: BigintStringCodec,
  totalSupply: BigintStringCodec,
  identity: t.unknown, // Uint8Array will be handled by runtime validation
});
export type Pair = t.TypeOf<typeof PairCodec>;

// Pool state codecs
export const PoolCodec = t.type({
  pairs: t.array(PairCodec),
});
export type Pool = t.TypeOf<typeof PoolCodec>;

// Actions state codecs
export const ActionsStateCodec = t.type({
  latest: t.union([ActionIdCodec, t.null]),
  all: t.record(ActionIdCodec, AsyncActionCodec),
});
export type ActionsState = t.TypeOf<typeof ActionsStateCodec>;

// Main state codec
export const LunarswapStateCodec = t.type({
  pool: PoolCodec,
  actions: ActionsStateCodec,
});
export type LunarswapState = t.TypeOf<typeof LunarswapStateCodec>;

// Config codec
export const LunarswapConfigCodec = t.type({
  lpTokenName: t.string,
  lpTokenSymbol: t.string,
  lpTokenDecimals: BigintStringCodec,
  transactionTimeout: t.number,
});
export type LunarswapConfig = t.TypeOf<typeof LunarswapConfigCodec>;

// Input parameter codecs for API methods
export const AddLiquidityParamsCodec = t.type({
  tokenA: CoinInfoCodec,
  tokenB: CoinInfoCodec,
  amountAMin: BigintStringCodec,
  amountBMin: BigintStringCodec,
  to: EitherCodec(ZswapCoinPublicKeyCodec, ContractAddressCodec),
});
export type AddLiquidityParams = t.TypeOf<typeof AddLiquidityParamsCodec>;

export const RemoveLiquidityParamsCodec = t.type({
  tokenA: CoinInfoCodec,
  tokenB: CoinInfoCodec,
  liquidity: CoinInfoCodec,
  amountAMin: BigintStringCodec,
  amountBMin: BigintStringCodec,
  to: EitherCodec(ZswapCoinPublicKeyCodec, ContractAddressCodec),
});
export type RemoveLiquidityParams = t.TypeOf<typeof RemoveLiquidityParamsCodec>;

export const SwapExactTokensForTokensParamsCodec = t.type({
  tokenIn: CoinInfoCodec,
  tokenOut: CoinInfoCodec,
  amountIn: BigintStringCodec,
  amountOutMin: BigintStringCodec,
  to: EitherCodec(ZswapCoinPublicKeyCodec, ContractAddressCodec),
});
export type SwapExactTokensForTokensParams = t.TypeOf<typeof SwapExactTokensForTokensParamsCodec>;

export const SwapTokensForExactTokensParamsCodec = t.type({
  tokenIn: CoinInfoCodec,
  tokenOut: CoinInfoCodec,
  amountOut: BigintStringCodec,
  amountInMax: BigintStringCodec,
  to: EitherCodec(ZswapCoinPublicKeyCodec, ContractAddressCodec),
});
export type SwapTokensForExactTokensParams = t.TypeOf<typeof SwapTokensForExactTokensParamsCodec>;

export const PairQueryParamsCodec = t.type({
  tokenA: CoinInfoCodec,
  tokenB: CoinInfoCodec,
});
export type PairQueryParams = t.TypeOf<typeof PairQueryParamsCodec>;

/**
 * Definition of common, implementation- and technology-agnostic, Lunarswap API.
 * This interface provides a clean abstraction for lunarswap operations that can be
 * implemented by different backends (in-memory, Midnight.js, etc.).
 *
 * There are a couple of important points about this API in particular:
 *   - state being an observable and operations returning immediately force to implement the state
 *     management in a way friendly to the UI code (and is similar to e.g. MobX, Redux, Elm architecture or Bloc
 *     pattern in many ways)
 *   - usage of io-ts imposes some overhead, but provides possibility to reliably using the API in scenarios, where
 *     type information is being lost, like: web sockets, web workers, or other forms of messaging
 *   - using the observables for state allows to hide the exact model being used - it might be polling, it might
 *     be push-based notification, it might be mixture of both
 */
export interface LunarswapAPI {
  state$: Observable<LunarswapState>;
  config$: Observable<LunarswapConfig>;
  
  // Liquidity operations
  addLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<ActionId>;
  
  removeLiquidity(
    tokenA: CoinInfo,
    tokenB: CoinInfo,
    liquidity: CoinInfo,
    amountAMin: bigint,
    amountBMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<ActionId>;
  
  // Swap operations
  swapExactTokensForTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountIn: bigint,
    amountOutMin: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<ActionId>;
  
  swapTokensForExactTokens(
    tokenIn: CoinInfo,
    tokenOut: CoinInfo,
    amountOut: bigint,
    amountInMax: bigint,
    to: Either<ZswapCoinPublicKey, ContractAddress>,
  ): Promise<ActionId>;
  
  // Query operations
  isPairExists(tokenA: CoinInfo, tokenB: CoinInfo): Promise<boolean>;
  getAllPairLength(): Promise<bigint>;
  getPairReserves(tokenA: CoinInfo, tokenB: CoinInfo): Promise<[bigint, bigint]>;
  getPairIdentity(tokenA: CoinInfo, tokenB: CoinInfo): Promise<Uint8Array>;
  getLpTokenName(): Promise<string>;
  getLpTokenSymbol(): Promise<string>;
  getLpTokenDecimals(): Promise<bigint>;
  getLpTokenType(): Promise<Uint8Array>;
  getLpTokenTotalSupply(tokenA: CoinInfo, tokenB: CoinInfo): Promise<QualifiedCoinInfo>;
} 