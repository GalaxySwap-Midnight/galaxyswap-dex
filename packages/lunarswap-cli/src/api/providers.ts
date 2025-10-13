import { Transaction } from '@midnight-ntwrk/ledger';
import type {
  CoinInfo as LedgerCoinInfo,
  TransactionId,
} from '@midnight-ntwrk/ledger';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
  type BalancedTransaction,
  type MidnightProvider,
  type UnbalancedTransaction,
  type WalletProvider,
  createBalancedTx,
} from '@midnight-ntwrk/midnight-js-types';
import type { Resource } from '@midnight-ntwrk/wallet';
import type { Wallet } from '@midnight-ntwrk/wallet-api';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import type { LunarswapProviders } from '@openzeppelin-midnight-apps/lunarswap-api';
import type { LunarswapPrivateStateId } from '@openzeppelin-midnight-apps/lunarswap-api';
import { firstValueFrom } from 'rxjs';
import type { Config } from '../config';
import { contractConfig } from '../config';

const createWalletAndMidnightProvider = async (
  wallet: Wallet,
): Promise<WalletProvider & MidnightProvider> => {
  const state = await firstValueFrom(wallet.state());
  return {
    coinPublicKey: state.coinPublicKey,
    encryptionPublicKey: state.encryptionPublicKey,
    balanceTx(
      tx: UnbalancedTransaction,
      newCoins: LedgerCoinInfo[],
    ): Promise<BalancedTransaction> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(
            tx.serialize(getZswapNetworkId()),
            getZswapNetworkId(),
          ),
          newCoins,
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) =>
          Transaction.deserialize(
            zswapTx.serialize(getZswapNetworkId()),
            getZswapNetworkId(),
          ),
        )
        .then(createBalancedTx);
    },
    submitTx(tx: BalancedTransaction): Promise<TransactionId> {
      return wallet.submitTransaction(tx);
    },
  };
};

export const configureProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<LunarswapProviders> => {
  const walletAndMidnightProvider =
    await createWalletAndMidnightProvider(wallet);

  return {
    privateStateProvider: levelPrivateStateProvider<
      typeof LunarswapPrivateStateId
    >({
      privateStateStoreName: contractConfig.privateStateStoreName,
    }),
    publicDataProvider: indexerPublicDataProvider(
      config.indexer,
      config.indexerWS,
    ),
    zkConfigProvider: new NodeZkConfigProvider<
      | 'addLiquidity'
      | 'removeLiquidity'
      | 'swapExactTokensForTokens'
      | 'swapTokensForExactTokens'
      | 'isPairExists'
      | 'getAllPairLength'
    >(contractConfig.zkConfigPath),
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};
