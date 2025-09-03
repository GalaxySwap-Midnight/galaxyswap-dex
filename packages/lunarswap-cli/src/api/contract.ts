import type { Logger } from 'pino';
import {
  Lunarswap,
  type LunarswapProviders,
} from '@midnight-dapps/lunarswap-api';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export const deployContract = async (
  providers: LunarswapProviders,
  logger: Logger,
): Promise<Lunarswap> => {
  logger.info('Deploying LunarSwap contract...');

  const lpTokenNonce = new Uint8Array(32).fill(0x44);

  let lunarswap: Lunarswap;
  try {
    const networkId = getZswapNetworkId();
    logger.info(`Network ID: ${networkId}`);
    lunarswap = await Lunarswap.deploy(providers, lpTokenNonce, logger);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to deploy LunarSwap contract:', error.message);
      logger.error('Failed to deploy LunarSwap contract:', error.stack);
      throw error;
    }
    logger.error('Failed to deploy LunarSwap contract:', error);
    throw new Error('Failed to deploy LunarSwap contract');
  }

  logger.info('LunarSwap contract deployed successfully!');
  logger.info(`Contract Address: ${lunarswap.deployedContractAddressHex}`);

  return lunarswap;
};

export const joinContract = async (
  providers: LunarswapProviders,
  contractAddress: string,
  logger: Logger,
): Promise<Lunarswap> => {
  logger.info('Joining LunarSwap contract...');

  // Use the LunarSwap API to join the contract
  const contractAddressBytes = new Uint8Array(
    Buffer.from(contractAddress, 'hex'),
  );

  const networkId = getZswapNetworkId();
  console.log('[joinContract] Zswap Network ID:', networkId);

  const ledgerNetworkId = getLedgerNetworkId();
  console.log('[joinContract] Ledger Network ID:', ledgerNetworkId)

  const currentContractState = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!currentContractState) {
    throw new Error('Contract state not found');
  }
  const operations = currentContractState.operations();
  console.log('[joinContract] Operations:', operations);
  console.log('[joinContract] Current Contract State:', currentContractState);

  const lunarswap = await Lunarswap.join(
    providers,
    { bytes: contractAddressBytes },
    logger,
  );

  logger.info('Successfully joined LunarSwap contract!', { lunarswap });
  console.log('Lunarswap instance:', lunarswap);
  logger.info(`Contract Address: ${lunarswap.deployedContractAddressHex}`);

  return lunarswap;
};
