import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type {
  LunarswapPrivateState,
  Contract,
  Witnesses,
  Ledger,
  Pair,
} from '@midnight-dapps/lunarswap-v1';
import type {
  CoinInfo,
  ContractAddress,
  Either,
  ZswapCoinPublicKey,
} from '@midnight-dapps/compact-std';

export type LunarswapId = string;

export type LunarswapContract = Contract<
  LunarswapPrivateState,
  Witnesses<LunarswapPrivateState>
>;

export type LunarswapCircuitKeys = Exclude<
  keyof LunarswapContract['impureCircuits'],
  number | symbol
>;

export type LunarswapProviders = MidnightProviders<
  LunarswapCircuitKeys,
  LunarswapId,
  LunarswapPrivateState
>;

export type DeployedLunarswapContract = FoundContract<LunarswapContract>;

export type UserAction = {
  addLiquidity?: {
    tokenA: CoinInfo;
    tokenB: CoinInfo;
    amountAMin: bigint;
    amountBMin: bigint;
    to: Either<ZswapCoinPublicKey, ContractAddress>;
  };
  removeLiquidity?: {
    tokenA: CoinInfo;
    tokenB: CoinInfo;
    liquidity: CoinInfo;
    amountAMin: bigint;
    amountBMin: bigint;
    to: Either<ZswapCoinPublicKey, ContractAddress>;
  };
  swapExactTokensForTokens?: {
    tokenIn: CoinInfo;
    tokenOut: CoinInfo;
    amountIn: bigint;
    amountOutMin: bigint;
    to: Either<ZswapCoinPublicKey, ContractAddress>;
  };
  swapTokensForExactTokens?: {
    tokenIn: CoinInfo;
    tokenOut: CoinInfo;
    amountIn: bigint;
    amountOutMin: bigint;
    to: Either<ZswapCoinPublicKey, ContractAddress>;
  };
};

export type LunarswapDerivedState = {
  readonly pool: Ledger['pool'];
  readonly lastAction?: UserAction;
};

export const emptyState: LunarswapDerivedState = {
  pool: {
    isEmpty: () => true,
    size: () => 0n,
    member: () => false,
    lookup: () => undefined as unknown as Pair,
    [Symbol.iterator]: () => ({
      next: () => ({
        done: true,
        value: undefined,
      }),
    }),
  },
};

export type LunarswapContractInfo = {
  address: string;
  pool: Ledger['pool'];
  totalSupply: bigint;
};
