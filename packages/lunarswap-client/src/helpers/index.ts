import { function as function_ } from 'fp-ts';

/**
 * An alternative to pipe, which takes initial value independently of functions that operate on it
 *
 * @example
 * const times2sub1: (x: number) => number = through(x => x * 2, x => x - 1);
 * times2sub1(2) === 3
 */
export { pipe as through } from 'rxjs';
export * from './types.js';
export * from './functions.js';

/**
 * A functional "pipe" - takes initial value and passes it through provided functions, returning the result of last function
 * @example pipe(2, x => x * 2, x => x - 1) === 3;
 */
export const pipe = function_.pipe; 