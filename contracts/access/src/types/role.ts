import type * as Contract from '..//artifacts/TestAccessControl/contract/index.cjs';

export type RoleValue = {
  role: Contract.Role;
  commitment: Uint8Array;
  index: bigint;
  path?: Contract.MerkleTreePath<Uint8Array>;
};
