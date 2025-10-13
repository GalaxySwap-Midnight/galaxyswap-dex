import type { Logger } from 'pino';
import type { Wallet } from '@midnight-ntwrk/wallet-api';
import type { Resource } from '@midnight-ntwrk/wallet';
import { firstValueFrom } from 'rxjs';
import type { ShieldedToken } from '@openzeppelin-midnight-apps/shielded-token-api';

import type {
  Either,
  ZswapCoinPublicKey,
  CoinInfo,
  ContractAddress,
} from '@openzeppelin-midnight-apps/compact-std';
import {
  ShieldedAddress,
  MidnightBech32m,
  ShieldedCoinPublicKey,
} from '@midnight-ntwrk/wallet-sdk-address-format';
import { getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// Helper function to create CoinInfo from user input
export const createCoinInfo = (color: string, value: bigint): CoinInfo => ({
  color: new Uint8Array(Buffer.from(color, 'hex')),
  value,
  nonce: new Uint8Array(32),
});

// Helper function to create Either for recipient
export const createRecipient = (
  address: string,
): Either<ZswapCoinPublicKey, ContractAddress> => {
  // For minting, we typically want to use the wallet's coin public key (left side)
  // rather than a contract address (right side)
  return {
    is_left: true,
    left: { bytes: new Uint8Array(Buffer.from(address, 'hex')) },
    right: { bytes: new Uint8Array(32) },
  };
};

export const mintTokens = async (
  shieldedToken: ShieldedToken,
  wallet: Wallet & Resource,
  amount: bigint,
  logger: Logger,
  recipientCoinPublicKey?: string,
): Promise<void> => {
  logger.info('Minting tokens...', {
    amount: amount.toString(),
    recipient: recipientCoinPublicKey ? 'custom' : 'self',
  });

  let recipient: Either<ZswapCoinPublicKey, ContractAddress>;

  if (recipientCoinPublicKey) {
    logger.debug(
      '[mintTokens] Parsing recipientCoinPublicKey:',
      recipientCoinPublicKey,
    );
    // Parse the shielded address string to get the MidnightBech32m object
    const bech32mAddress = MidnightBech32m.parse(recipientCoinPublicKey);
    logger.debug('[mintTokens] Parsed bech32mAddress:', bech32mAddress);

    // Decode the bech32m address to get the ShieldedAddress object
    const shieldedAddress = ShieldedAddress.codec.decode(
      getZswapNetworkId(),
      bech32mAddress,
    );
    logger.debug('[mintTokens] Decoded shieldedAddress:', shieldedAddress);
    logger.debug('[mintTokens] zswap network id:', getZswapNetworkId());

    // Extract the coin public key from the shielded address
    const coinPublicKeyBytes = shieldedAddress.coinPublicKey.data;
    logger.debug(
      '[mintTokens] Extracted coinPublicKeyBytes:',
      Buffer.from(coinPublicKeyBytes).toString('hex'),
    );

    // Use the provided recipient's coin public key
    recipient = {
      is_left: true,
      left: { bytes: coinPublicKeyBytes },
      right: { bytes: new Uint8Array(32) },
    };
    logger.debug('[mintTokens] Constructed recipient (custom):', {
      is_left: recipient.is_left,
      left: Buffer.from(recipient.left.bytes).toString('hex'),
      right: Buffer.from(recipient.right.bytes).toString('hex'),
    });
  } else {
    // Use the wallet's own coin public key (default behavior)
    logger.debug(
      '[mintTokens] No recipientCoinPublicKey provided, using wallet state',
    );
    const state = await firstValueFrom(wallet.state());
    logger.debug('[mintTokens] Wallet state:', {
      address: state.address,
      coinPublicKey: Buffer.from(state.coinPublicKey).toString('hex'),
    });

    // Convert the coin public key string to Uint8Array
    const bech32mCoinPublicKey = MidnightBech32m.parse(state.coinPublicKey);
    const coinPublicKey = ShieldedCoinPublicKey.codec.decode(
      getZswapNetworkId(),
      bech32mCoinPublicKey,
    );
    recipient = {
      is_left: true,
      left: { bytes: coinPublicKey.data },
      right: { bytes: new Uint8Array(32) },
    };
    logger.debug('[mintTokens] Constructed recipient (self):', {
      is_left: recipient.is_left,
      left: Buffer.from(recipient.left.bytes).toString('hex'),
      right: Buffer.from(recipient.right.bytes).toString('hex'),
    });
  }

  logger.debug(
    '[mintTokens] Calling shieldedToken.mint with recipient and amount',
    {
      recipient: {
        is_left: recipient.is_left,
        left: Buffer.from(recipient.left.bytes).toString('hex'),
        right: Buffer.from(recipient.right.bytes).toString('hex'),
      },
      amount: amount.toString(),
    },
  );

  await shieldedToken.mint(recipient, amount);

  logger.info('Tokens minted successfully!');
};

export const burnTokens = async (
  shieldedToken: ShieldedToken,
  coin: CoinInfo,
  amount: bigint,
  logger: Logger,
): Promise<void> => {
  logger.info('Burning tokens...', {
    coinColor: Buffer.from(coin.color).toString('hex'),
    coinValue: coin.value.toString(),
    burnAmount: amount.toString(),
  });

  await shieldedToken.burn(coin, amount);

  logger.info('Tokens burned successfully!');
};

export const getTokenInfo = async (
  shieldedToken: ShieldedToken,
  logger: Logger,
): Promise<void> => {
  logger.info('Getting token information...');

  try {
    const name = await shieldedToken.name();
    const symbol = await shieldedToken.symbol();
    const decimals = await shieldedToken.decimals();
    const totalSupply = await shieldedToken.totalSupply();
    const type = await shieldedToken.type();

    logger.info('Token information retrieved successfully');
    logger.info('');
    logger.info('📊 Token Information:');
    logger.info(
      `   Contract Address: ${shieldedToken.deployedContractAddressHex}`,
    );
    logger.info(`   Name: ${name}`);
    logger.info(`   Symbol: ${symbol}`);
    logger.info(`   Decimals: ${decimals}`);
    logger.info(`   Total Supply: ${totalSupply}`);
    logger.info(`   Type: ${Buffer.from(type).toString('hex')}`);
    logger.info('');
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Not sufficient funds')
    ) {
      logger.error('❌ Cannot retrieve token information: Token balance error');
      logger.error(
        '💡 This may be a temporary wallet sync issue. Try again in a moment.',
      );
    } else {
      logger.error(
        '❌ Failed to retrieve token information:',
        error instanceof Error ? error.message : error,
      );
    }
    // Don't throw - just return gracefully to the menu
    logger.info('Returning to main menu...');
  }
};
