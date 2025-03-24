import type * as Contract from '../artifacts/MockAccessControl/contract/index.cjs';

export type RoleValue = {
  role: Contract.AccessControl_Role;
  commitment: Uint8Array;
  index: bigint;
  path?: Contract.MerkleTreePath<Uint8Array>;
};
