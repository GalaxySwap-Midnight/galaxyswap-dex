import { describe, it, expect } from 'vitest';
import { LunarswapClientAPI } from './lunarswap-client-api.js';
import type { LunarswapClientProviders, Config } from './types.js';

describe('LunarswapClientAPI', () => {
  it('should have correct static constants', () => {
    expect(LunarswapClientAPI.LP_TOKEN_NAME).toBe('Test Lunar');
    expect(LunarswapClientAPI.LP_TOKEN_SYMBOL).toBe('TLUNAR');
    expect(LunarswapClientAPI.LP_TOKEN_DECIMALS).toBe(BigInt(6));
  });

  it('should define LunarswapClientProviders type', () => {
    // This is a type test - if it compiles, the type is correctly defined
    const providers: LunarswapClientProviders = {} as LunarswapClientProviders;
    expect(providers).toBeDefined();
  });

  it('should define Config type', () => {
    // This is a type test - if it compiles, the type is correctly defined
    const config: Config = { transactionTimeout: 30000 };
    expect(config.transactionTimeout).toBe(30000);
  });
}); 