import { test, beforeEach, expect } from 'vitest';
import { RoleContractMock } from './mock/roleContract';
import { RoleValue } from '../types';
import * as RoleContract from '../artifacts/role/contract/index.cjs';
import {
  CoinPublicKey,
  CompactError,
  CompactTypeBytes,
  CompactTypeEnum,
  encodeCoinPublicKey,
  persistentHash,
} from '@midnight-ntwrk/compact-runtime';
import { sampleCoinPublicKey } from '@midnight-ntwrk/zswap';
import { circuitContext } from '../utils';

let roleMock: RoleContractMock;
let admin: CoinPublicKey;
let adminPkBytes: Uint8Array;
let adminPkBytesBuffer: string;

beforeEach(() => {
  // Fixing Admin address for testing purposes
  admin = '9905a18ce5bd2d7945818b18be9b0afe387efe29c8ffa81d90607a651fb83a2b';
  adminPkBytes = encodeCoinPublicKey(admin);
  adminPkBytesBuffer = Buffer.from(adminPkBytes).toString('hex');
  roleMock = new RoleContractMock(admin);
});

test.skip('initialize', () => {
  const currentPublicState = roleMock.getCurrentLedger();
  const currentPrivateState = roleMock.getCurrentPrivateState();

  const adminRoleCommitContract = RoleContract.pureCircuits.hashRole(
    { bytes: adminPkBytes },
    RoleContract.Role.Admin,
  );
  //   const adminRoleHash = persistentHash<[RoleContract.Role]>(
  //     RoleContract.Role,
  //     [RoleContract.Role.Admin],
  //   );
  //   const adminRoleCommitmt = persistentHash<[Uint8Array, Uint8Array]>(
  //     CompactTypeBytes.arguments,
  //     [adminPkBytes, adminRoleHash],
  //   );

  const actualAdminRoleValue = currentPrivateState.roles[admin];
  const expectedAdminRoleValue: RoleValue = {
    role: RoleContract.Role.Admin,
    commitment: adminRoleCommitContract,
  };

  // Check the hash calculation
  expect(actualAdminRoleValue).toEqual(expectedAdminRoleValue);

  const root = currentPublicState.roleCommits.root();
  const adminPath = currentPublicState.roleCommits.findPathForLeaf(
    adminRoleCommitContract,
  );

  expect(!currentPublicState.roleCommits.isFull(), 'It is not full!');
  expect(
    currentPublicState.roleCommits.checkRoot(root),
    'Failed to check the root',
  );
});

test('add role', () => {
  const currentPublicState = roleMock.getCurrentLedger();
  const currentPrivateState = roleMock.getCurrentPrivateState();
  const currentContractState = roleMock.getCurrentContractState();

  const lpUser = sampleCoinPublicKey();
  const notLpUser = sampleCoinPublicKey();
  const notAuthorizedUser = sampleCoinPublicKey();

  // Failed test: Non Admin call!
  expect(() =>
    roleMock.contract.circuits.addRole(
      circuitContext(
        currentPrivateState,
        currentContractState,
        notAuthorizedUser,
        roleMock.contractAddress,
      ),
      { bytes: encodeCoinPublicKey(lpUser) },
      RoleContract.Role.Lp,
    ),
  ).toThrowError('RoleError: Unauthorized action!');

  // Success test: Admin call!
  roleMock.contract.circuits.addRole(
    circuitContext(
      currentPrivateState,
      currentContractState,
      admin,
      roleMock.contractAddress,
    ),
    { bytes: encodeCoinPublicKey(lpUser) },
    RoleContract.Role.Lp,
  );

  const lpRoleCommitContract = RoleContract.pureCircuits.hashRole(
    { bytes: encodeCoinPublicKey(lpUser) },
    RoleContract.Role.Lp,
  );

  const actualLpRoleValue = currentPrivateState.roles[lpUser];
  const expectedLpRoleValue: RoleValue = {
    role: RoleContract.Role.Lp,
    commitment: lpRoleCommitContract,
  };

  expect(actualLpRoleValue).toEqual(expectedLpRoleValue);
});

//test('remove role', () => {});
