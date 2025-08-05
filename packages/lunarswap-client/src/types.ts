import type {
  LunarswapPrivateState,
  Contract,
  Witnesses,
  Ledger,
} from '@midnight-dapps/lunarswap-v1';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

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

export type Config = Readonly<{
  transactionTimeout: number;
}>;

import type { Logger } from 'pino';

export type LunarswapClientProviders = LunarswapProviders & {
  logging: Logger;
};

export class ContractNotFoundError extends Error {
  constructor(public readonly address: string) {
    super(`Contract at address ${address} was not found`);
  }
}

export class ContractDeploymentFailed extends Error {
  constructor() {
    super('Contract deployment failed');
  }
} 