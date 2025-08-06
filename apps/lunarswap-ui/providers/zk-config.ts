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
  private contractOperations: string[] | null = null;

  constructor(
    baseURL: string,
    private readonly callback: (
      action: 'downloadProverStarted' | 'downloadProverDone',
    ) => void,
    fetchFunc: typeof fetch = fetch,
  ) {
    super(baseURL, fetchFunc);
    this.cache = new Map();
  }

  setContractOperations(operations: string[]): void {
    this.contractOperations = operations;
    console.log('[ZkConfigProviderWrapper] Set contract operations:', operations);
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
    // Check if this looks like a lunarswap contract
    const lunarswapCircuitIds = [
      'swapTokensForExactTokens',
      'getPairReserves', 
      'addLiquidity',
      'getLpTokenSymbol',
      'getLpTokenName',
      'getLpTokenType',
      'getLpTokenTotalSupply',
      'getAllPairLength',
      'getPairIdentity',
      'isPairExists',
      'removeLiquidity',
      'getPair',
      'getLpTokenDecimals',
      'swapExactTokensForTokens',
    ];

    const isLunarswap = lunarswapCircuitIds.some((id) =>
      circuitIds.includes(id as K),
    );

    if (isLunarswap) {
      console.log(
        '[ZkConfigProviderWrapper] Processing lunarswap verifier keys',
        {
          requested: circuitIds,
          requestedCount: circuitIds.length,
        },
      );

      // For lunarswap contracts, we need to get the actual contract state operations
      // to determine the correct order dynamically
      try {
        // Use the contract operations if available, otherwise fall back to the known order
        let orderedCircuitIds: K[];
        
        if (this.contractOperations && this.contractOperations.length > 0) {
          console.log(
            '[ZkConfigProviderWrapper] Using dynamic contract operations order:',
            this.contractOperations,
          );
          
          // Filter the requested circuits to only include those that exist in the contract operations
          orderedCircuitIds = this.contractOperations
            .filter((op) => circuitIds.includes(op as K))
            .map((op) => op as K);
            
          console.log(
            '[ZkConfigProviderWrapper] Ordered circuit IDs based on dynamic contract operations:',
            orderedCircuitIds,
          );
        } else {
          console.log(
            '[ZkConfigProviderWrapper] No contract operations available, using fallback order',
          );
          
          // Fallback to the known lunarswap circuit order
          orderedCircuitIds = lunarswapCircuitIds.filter((id) =>
            circuitIds.includes(id as K),
          ) as K[];
        }

        // Always use the ordered circuit IDs for lunarswap contracts
        // This ensures the verifier keys are in the correct order
        const verifierKeys = await Promise.all(
          orderedCircuitIds.map(async (circuitId) => {
            console.log(`[ZkConfigProviderWrapper] Fetching verifier key for circuit: ${circuitId}`);
            const verifierKey = await this.getVerifierKey(circuitId);
            console.log(`[ZkConfigProviderWrapper] Verifier key for ${circuitId}:`, verifierKey ? 'FOUND' : 'NOT FOUND');
            return [circuitId, verifierKey] as [K, VerifierKey];
          }),
        );
        
        console.log('[ZkConfigProviderWrapper] Final verifier keys array length:', verifierKeys.length);
        console.log('[ZkConfigProviderWrapper] Verifier keys circuit IDs:', verifierKeys.map(([id]) => id));
        
        return verifierKeys;
      } catch (error) {
        console.warn(
          '[ZkConfigProviderWrapper] Failed to get dynamic order, falling back to requested order:',
          error,
        );
        // Fallback to requested order
        const verifierKeys = await Promise.all(
          circuitIds.map(async (circuitId) => {
            const verifierKey = await this.getVerifierKey(circuitId);
            return [circuitId, verifierKey] as [K, VerifierKey];
          }),
        );
        return verifierKeys;
      }
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
