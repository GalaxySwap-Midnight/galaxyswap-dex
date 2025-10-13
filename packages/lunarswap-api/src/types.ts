import type { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type {
  Contract,
  Ledger,
  LunarswapPrivateState,
  Witnesses,
} from '@openzeppelin-midnight-apps/lunarswap-v1';

// Define EmptyState locally
export type EmptyState = Record<string, never>;

export type LunarswapPrivateStates = {
  readonly lunarswapPrivateState: LunarswapPrivateState;
};

export type LunarswapPublicState = {
  readonly pool: Ledger['pool'];
};

export type LunarswapContract = Contract<
  LunarswapPrivateState,
  Witnesses<LunarswapPrivateState>
>;

export type LunarswapCircuitKeys = Exclude<
  keyof LunarswapContract['impureCircuits'],
  number | symbol
>;

export const LunarswapPrivateStateId = 'lunarswapPrivateState';

export type LunarswapProviders = MidnightProviders<
  LunarswapCircuitKeys,
  typeof LunarswapPrivateStateId,
  LunarswapPrivateState
>;

export type DeployedLunarswapContract = FoundContract<LunarswapContract>;
