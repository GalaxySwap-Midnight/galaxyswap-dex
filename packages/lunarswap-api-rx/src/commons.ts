import type { LunarswapDerivedState, UserAction } from './common-types.js';

export function combineLunarswapState(
  acc: LunarswapDerivedState,
  value: Partial<LunarswapDerivedState>,
): LunarswapDerivedState {
  return {
    pool: value.pool ?? acc.pool,
    lastAction: value.lastAction ?? acc.lastAction,
  };
}

export function createUserAction(action: UserAction): UserAction {
  return action;
}

export function clearUserAction(): UserAction {
  return {};
}
