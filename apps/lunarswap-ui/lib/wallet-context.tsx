'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { Logger } from 'pino';
import type { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import type { LunarswapCircuitKeys, LunarswapPrivateStateId } from '@midnight-dapps/lunarswap-api';
import type { LunarswapPrivateStates } from '@midnight-dapps/lunarswap-api';
import { type PublicDataProvider, type PrivateStateProvider, type ProofProvider, createBalancedTx } from '@midnight-ntwrk/midnight-js-types';
import type { CoinInfo, TransactionId } from '@midnight-ntwrk/ledger';
import type { BalancedTransaction, UnbalancedTransaction } from '@midnight-ntwrk/midnight-js-types';
import { Transaction, Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { WalletProvider, MidnightProvider } from '@midnight-ntwrk/midnight-js-types';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { useRuntimeConfiguration } from '@/lib/runtime-configuration';
import { connectToWallet } from '@/utils/wallet-utils';
import { PrivateDataProviderWrapper } from '@/providers/private';
import { PublicDataProviderWrapper } from '@/providers/public';
import { proofClient, noopProofClient } from '@/providers/proof';
import { ZkConfigProviderWrapper } from '@/providers/zk-config';
import { WalletConnect } from '@/components/wallet-connect';
import { formatAddress } from '@/utils/wallet-utils';
import { getErrorType } from '@/utils/wallet-utils';

// Types for Lunarswap
export interface WalletAPI {
  wallet: DAppConnectorWalletAPI;
  uris: ServiceUriConfig;
}

export type ProviderCallbackAction =
  | 'downloadProverStarted'
  | 'downloadProverDone'
  | 'proveTxStarted'
  | 'proveTxDone'
  | 'balanceTxStarted'
  | 'balanceTxDone'
  | 'submitTxStarted'
  | 'submitTxDone'
  | 'watchForTxDataStarted'
  | 'watchForTxDataDone';

export interface MidnightWalletState {
  isConnected: boolean;
  proofServerIsOnline: boolean;
  address?: string;
  widget?: React.ReactNode;
  walletAPI?: WalletAPI;
  privateStateProvider: PrivateStateProvider<typeof LunarswapPrivateStateId, LunarswapPrivateStates>;
  zkConfigProvider: ZkConfigProviderWrapper<LunarswapCircuitKeys>;
  proofProvider: ProofProvider<string>;
  publicDataProvider: PublicDataProvider;
  walletProvider: WalletProvider;
  midnightProvider: MidnightProvider;
  shake: () => void;
  callback: (action: ProviderCallbackAction) => void;
  walletError: string | null;
  setWalletError: (err: string | null) => void;
}

export const WalletContext = createContext<MidnightWalletState | null>(null);

interface MidnightWalletProviderProps {
  children: React.ReactNode;
  logger?: Logger;
}

const fallbackLogger: Logger = {
  trace: () => {},
  warn: () => {},
  error: () => {},
  level: 'info',
  fatal: () => {},
  info: () => {},
  debug: () => {},
  silent: false,
} as unknown as Logger;

export const MidnightWalletProvider: React.FC<MidnightWalletProviderProps> = ({ children, logger }) => {
  const config = useRuntimeConfiguration();
  // Fallback logger if not provided
  const log = logger || fallbackLogger;

  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [proofServerIsOnline, setProofServerIsOnline] = useState(false);
  const [walletAPI, setWalletAPI] = useState<WalletAPI | undefined>(undefined);
  const [snackBarText, setSnackBarText] = useState<string | undefined>(undefined);
  const [isRotate, setRotate] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Provider callback for UI feedback
  const providerCallback = useCallback((action: ProviderCallbackAction): void => {
    if (action === 'proveTxStarted') {
      setSnackBarText('Proving transaction...');
    } else if (action === 'proveTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'balanceTxStarted') {
      setSnackBarText('Signing the transaction with Midnight Lace wallet...');
    } else if (action === 'downloadProverDone') {
      setSnackBarText(undefined);
    } else if (action === 'downloadProverStarted') {
      setSnackBarText('Downloading prover key...');
    } else if (action === 'balanceTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'submitTxStarted') {
      setSnackBarText('Submitting transaction...');
    } else if (action === 'submitTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'watchForTxDataStarted') {
      setSnackBarText('Waiting for transaction finalization on blockchain...');
    } else if (action === 'watchForTxDataDone') {
      setSnackBarText(undefined);
    }
  }, []);

  // Providers
  const privateStateProvider: PrivateStateProvider<typeof LunarswapPrivateStateId, LunarswapPrivateStates> = useMemo(
    () =>
      new PrivateDataProviderWrapper(
        levelPrivateStateProvider({ privateStateStoreName: 'lunarswap-private-state' }),
        log,
      ),
    [log],
  );

  const zkConfigProvider = useMemo(
    () =>
      new ZkConfigProviderWrapper<LunarswapCircuitKeys>(
        window.location.origin,
        fetch.bind(window),
        providerCallback,
      ),
    [providerCallback],
  );

  const publicDataProvider = useMemo(
    () =>
      new PublicDataProviderWrapper(
        indexerPublicDataProvider(config.INDEXER_URI, config.INDEXER_WS_URI),
        providerCallback,
        log,
      ),
    [config, log, providerCallback],
  );

  const proofProvider = useMemo(() => {
    if (walletAPI) {
      return proofClient(walletAPI.uris.proverServerUri, providerCallback);
    }
    return noopProofClient();
  }, [walletAPI, providerCallback]);

  const walletProvider: WalletProvider = useMemo(() => {
    if (walletAPI && address) {
      const { coinPublicKey, encryptionPublicKey } = formatAddress(address);
      return {
        coinPublicKey,
        encryptionPublicKey,
        balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
          providerCallback('balanceTxStarted');
          return walletAPI.wallet
            .balanceAndProveTransaction(
              ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
              newCoins,
            )
            .then((zswapTx) => {
              const deserialized = Transaction.deserialize(zswapTx.serialize(getLedgerNetworkId()), getZswapNetworkId());
              // @ts-expect-error: type mismatch, but this is required for compatibility
              return createBalancedTx(deserialized);
            })
            .finally(() => {
              providerCallback('balanceTxDone');
            });
        },
      };
    }
    return {
      coinPublicKey: '',
      encryptionPublicKey: '',
      balanceTx() {
        return Promise.reject(new Error('readonly'));
      },
    };
  }, [walletAPI, address, providerCallback]);

  const midnightProvider: MidnightProvider = useMemo(() => {
    if (walletAPI) {
      return {
        submitTx(tx: BalancedTransaction): Promise<TransactionId> {
          providerCallback('submitTxStarted');
          return walletAPI.wallet.submitTransaction(tx).finally(() => {
            providerCallback('submitTxDone');
          });
        },
      };
    }
    return {
      submitTx() {
        return Promise.reject(new Error('readonly'));
      },
    };
  }, [walletAPI, providerCallback]);

  // Shake logic for UI
  const shake = useCallback((): void => {
    setRotate(true);
    setSnackBarText('Please connect to your Midnight Lace wallet');
    setTimeout(() => {
      setRotate(false);
      setSnackBarText(undefined);
    }, 3000);
  }, []);

  // Check proof server status
  const checkProofServerStatus = useCallback(async (proverServerUri: string): Promise<void> => {
    try {
      const response = await fetch(proverServerUri);
      if (!response.ok) {
        setProofServerIsOnline(false);
        return;
      }
      const text = await response.text();
      setProofServerIsOnline(text.includes("We're alive 🎉!"));
    } catch (error) {
      setProofServerIsOnline(false);
    }
  }, []);

  // Connect wallet logic
  const connect = useCallback(async (manual: boolean): Promise<void> => {
    setIsConnecting(true);
    let walletResult: Awaited<ReturnType<typeof connectToWallet>> | undefined;
    try {
      walletResult = await connectToWallet();
    } catch (e) {
      setIsConnecting(false);
      setWalletError(getErrorType(e as Error));
      if (manual) setOpenWallet(true);
      return;
    }
    if (!walletResult) {
      setIsConnecting(false);
      setWalletError('NO_WALLET_RESULT');
      if (manual) setOpenWallet(true);
      return;
    }
    setWalletError(null);
    await checkProofServerStatus(walletResult.serviceUriConfig.proverServerUri);
    try {
      const reqState = await walletResult.wallet.state();
      setAddress(reqState.address);
      setWalletAPI({
        wallet: walletResult.wallet,
        uris: walletResult.serviceUriConfig,
      });
    } catch (e) {
      setWalletError(getErrorType(e as Error));
    }
    setIsConnecting(false);
  }, [checkProofServerStatus]);

  // Widget UI
  const widget = <WalletConnect />;

  // State object
  const walletState: MidnightWalletState = useMemo(
    () => ({
      isConnected: !!address,
      proofServerIsOnline,
      address,
      widget,
      walletAPI,
      privateStateProvider,
      zkConfigProvider,
      proofProvider,
      publicDataProvider,
      walletProvider,
      midnightProvider,
      shake,
      callback: providerCallback,
      walletError,
      setWalletError,
    }),
    [address, proofServerIsOnline, walletAPI, privateStateProvider, zkConfigProvider, proofProvider, publicDataProvider, walletProvider, midnightProvider, providerCallback, shake, walletError],
  );

  // Auto-connect on mount
  useEffect(() => {
    if (!walletState.isConnected && !isConnecting) {
      void connect(false);
    }
  }, [walletState.isConnected, isConnecting, connect]);

  return <WalletContext.Provider value={walletState}>{children}</WalletContext.Provider>;
};
