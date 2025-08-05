import type { ContractAddress } from '@midnight-dapps/compact-std';
import { LunarswapClientAPI } from './lunarswap-client-api.js';
import type { Config, LunarswapClientProviders } from './types.js';

export type LunarswapClientInstanceConfig = Config & {
  readonly lpTokenNonce: Uint8Array;
};

/**
 * Creates a new Lunarswap client instance by deploying a new contract
 */
export async function deployLunarswapClient(
  who: string,
  providers: LunarswapClientProviders,
  config: LunarswapClientInstanceConfig,
): Promise<LunarswapClientAPI> {
  return await LunarswapClientAPI.deploy(
    who,
    providers,
    config,
    config.lpTokenNonce,
  );
}

/**
 * Creates a new Lunarswap client instance by joining an existing contract
 */
export async function joinLunarswapClient(
  who: string,
  providers: LunarswapClientProviders,
  contractAddress: ContractAddress,
  config: Config,
): Promise<LunarswapClientAPI> {
  return await LunarswapClientAPI.join(
    who,
    providers,
    contractAddress,
    config,
  );
} 