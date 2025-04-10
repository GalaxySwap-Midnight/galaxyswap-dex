import type {
  MerkleTreePath,
} from '../artifacts/Index/contract/index.d.cts';
import type { AccessControl_Role } from "./compact";

/**
 * @description Represents a role assignment with its cryptographic commitment and Merkle tree metadata.
 */
export type RoleValue = {
  /** @description The role assigned to a user (e.g., Admin, Lp, Trader, None). */
  role: AccessControl_Role;

  /** @description The cryptographic commitment hash of the user-role pair, as a 32-byte array. */
  commitment: Uint8Array;

  /** @description The index of the commitment in the Merkle tree. */
  index: bigint;

  /** @description Optional Merkle tree path proving the commitment’s inclusion, if available. */
  path?: MerkleTreePath<Uint8Array>;
};
