import { describe, it, expect } from 'vitest';
import { block, pipe, values, lazy } from './index.js';

describe('Lunarswap Helpers', () => {
  it('should work with block function', () => {
    const result = block(() => {
      const x = 1;
      const y = 2;
      return x + y;
    });
    expect(result).toBe(3);
  });

  it('should work with pipe function', () => {
    const result = pipe(
      2,
      (x: number) => x * 2,
      (x: number) => x - 1,
    );
    expect(result).toBe(3);
  });

  it('should work with values function', () => {
    const obj = { a: 1, b: 2, c: 3 } as const;
    const result = values(obj);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should work with lazy function', () => {
    let callCount = 0;
    const lazyValue = lazy(() => {
      callCount++;
      return 42;
    });

    expect(callCount).toBe(0);
    expect(lazyValue()).toBe(42);
    expect(callCount).toBe(1);
    expect(lazyValue()).toBe(42);
    expect(callCount).toBe(1); // Should not call again
  });
}); 