import type {
  ProverKey,
  VerifierKey,
  ZKIR,
} from '@midnight-ntwrk/midnight-js-types';
import { fetch } from 'cross-fetch';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

type CacheKey =
  | `proverKey:${string}`
  | `verifierKey:${string}`
  | `zkir:${string}`;

export class ZkConfigProviderWrapper<
  K extends string,
> extends FetchZkConfigProvider<K> {
  private readonly cache: Map<CacheKey, ProverKey | VerifierKey | ZKIR>;

  constructor(
    baseURL: string,
    fetchFunc: typeof fetch = fetch,
    private readonly callback: (
      action: 'downloadProverStarted' | 'downloadProverDone',
    ) => void,
  ) {
    super(baseURL, fetchFunc);
    this.cache = new Map();
  }

  private generateCacheKey(
    type: 'proverKey' | 'verifierKey' | 'zkir',
    circuitId: K,
  ): CacheKey {
    return `${type}:${circuitId}` as CacheKey;
  }

  async getProverKey(circuitId: K): Promise<ProverKey> {
    try {
      this.callback('downloadProverStarted');
      const cacheKey = this.generateCacheKey('proverKey', circuitId);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ProverKey;
      }

      const proverKey = await super.getProverKey(circuitId);
      this.cache.set(cacheKey, proverKey);
      return proverKey;
    } finally {
      this.callback('downloadProverDone');
    }
  }

  async getVerifierKey(circuitId: K): Promise<VerifierKey> {
    const cacheKey = this.generateCacheKey('verifierKey', circuitId);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as VerifierKey;
    }

    const verifierKey = await super.getVerifierKey(circuitId);
    this.cache.set(cacheKey, verifierKey);
    return verifierKey;
  }

  async getVerifierKeys(circuitIds: K[]): Promise<[K, VerifierKey][]> {
    // For lunarswap contracts, we need to provide verifier keys in the exact order
    // that matches the deployed contract's circuit order
    // Based on the contract state error, this is the correct order:
    const lunarswapCircuitOrder = [
      'addLiquidity',
      'removeLiquidity',
      'swapExactTokensForTokens',
      'swapTokensForExactTokens',
      'isPairExists',
      'getAllPairLength',
      'getPair',
      'getPairReserves',
      'getPairIdentity',
      'getLpTokenName',
      'getLpTokenSymbol',
      'getLpTokenDecimals',
      'getLpTokenType',
      'getLpTokenTotalSupply',
    ] as K[];

    // Check if this looks like a lunarswap contract
    const isLunarswap = lunarswapCircuitOrder.some(id => circuitIds.includes(id));

    if (isLunarswap) {
      console.log(
        '[ZkConfigProviderWrapper] Processing lunarswap verifier keys',
        { 
          requested: circuitIds, 
          requestedCount: circuitIds.length,
          lunarswapCircuits: lunarswapCircuitOrder.length 
        }
      );
      
      // For lunarswap, we need to provide verifier keys in the exact order
      // that matches the deployed contract's circuit order
      const orderedCircuitIds = lunarswapCircuitOrder.filter(id => 
        circuitIds.includes(id)
      );
      
      console.log('[ZkConfigProviderWrapper] Ordered circuit IDs:', orderedCircuitIds);
      
      const verifierKeys = await Promise.all(
        orderedCircuitIds.map(async (circuitId) => {
          const verifierKey = await this.getVerifierKey(circuitId);
          return [circuitId, verifierKey] as [K, VerifierKey];
        }),
      );
      return verifierKeys;
    }

    // For other contracts, use the original order
    const verifierKeys = await Promise.all(
      circuitIds.map(async (circuitId) => {
        const verifierKey = await this.getVerifierKey(circuitId);
        return [circuitId, verifierKey] as [K, VerifierKey];
      }),
    );
    return verifierKeys;
  }

  async getZKIR(circuitId: K): Promise<ZKIR> {
    const cacheKey = this.generateCacheKey('zkir', circuitId);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ZKIR;
    }

    const zkir = await super.getZKIR(circuitId);
    this.cache.set(cacheKey, zkir);
    return zkir;
  }
}
