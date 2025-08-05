import type { ValuesOf } from './types.js';

/**
 * An easier to write alternative for IIFE.
 *
 * Particularly useful for encapsulating intermediate variables, allowing to return and use further only the returned value
 */
export const block = <T>(thunk: () => T): T => thunk();

/**
 * Slightly more typesafe alternative for `Object.values`
 * @param object - Object to extract values from
 */
export const values = <T extends object>(object: T): ReadonlyArray<ValuesOf<T>> => {
  // this way it's slightly easier for TS to typecheck this properly compared to a purely functional version
  const arr = [];
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      arr.push(object[key]);
    }
  }
  return arr;
};

/**
 * Lazily computed variable. That is:
 *   - the value is computed only when first accessed
 *   - upon next accesses a cached value is immediately returned
 */
export function lazy<T>(factory: () => T): () => T {
  let value: T | null = null;
  return () => {
    if (value === null) {
      const newValue = factory();
      value = newValue;
      return newValue;
    }
    return value;
  };
} 