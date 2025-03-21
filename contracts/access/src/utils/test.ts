import {
  type CircuitContext,
  type CoinPublicKey,
  type ContractAddress,
  type ContractState,
  QueryContext,
  emptyZswapLocalState,
} from '@midnight-ntwrk/compact-runtime';
import type * as Contract from '..//artifacts/TestAccessControl/contract/index.cjs';

// Runtime requires a bit of additional structure for running circuits...
export function circuitContext<T>(
  privateState: T,
  contractState: ContractState,
  coinPublicKey: CoinPublicKey,
  contractAddress: ContractAddress,
): CircuitContext<T> {
  return {
    originalState: contractState,
    currentPrivateState: privateState,
    transactionContext: new QueryContext(contractState.data, contractAddress),
    currentZswapLocalState: emptyZswapLocalState(coinPublicKey),
  };
}

export const emptyMerkleTreePath: Contract.MerkleTreePath<Uint8Array> = {
  leaf: new Uint8Array(32),
  path: Array(10).fill({
    sibling: { field: BigInt(0) },
    goes_left: false,
  }),
};
