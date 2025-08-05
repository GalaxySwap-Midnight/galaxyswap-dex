'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  LunarswapIntegration,
  type ContractStatusInfo,
  type ContractStatus,
} from './lunarswap-integration';
import { useRuntimeConfiguration } from './runtime-configuration';
import { useMidnightWallet } from './wallet-context';

interface LunarswapContextType {
  lunarswap: LunarswapIntegration | null;
  status: ContractStatus;
  statusInfo: ContractStatusInfo;
  isLoading: boolean;
  error: string | null;
  refreshContract: () => Promise<void>;
}

const LunarswapContext = createContext<LunarswapContextType | null>(null);

export const useLunarswapContext = () => {
  const context = useContext(LunarswapContext);
  if (!context) {
    throw new Error(
      'useLunarswapContext must be used within a LunarswapContext',
    );
  }
  return context;
};

interface LunarswapProviderProps {
  children: ReactNode;
}

export const LunarswapProvider = ({ children }: LunarswapProviderProps) => {
  const runtimeConfig = useRuntimeConfiguration();
  const midnightWallet = useMidnightWallet();
  const [lunarswap, setLunarswap] = useState<LunarswapIntegration | null>(null);
  const [status, setStatus] = useState<ContractStatus>('not-configured');
  const [statusInfo, setStatusInfo] = useState<ContractStatusInfo>({
    status: 'not-configured',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or update contract integration
  const initializeLunarswap = useCallback(async () => {
    if (!runtimeConfig?.LUNARSWAP_ADDRESS) {
      setStatus('not-configured');
      setStatusInfo({
        status: 'not-configured',
        message: 'No contract address configured',
      });
      setLunarswap(null);
      return;
    }

    // TODO: Question: why is it required to have connected wallet to join contract?
    if (!midnightWallet.isConnected || !midnightWallet.walletAPI) {
      setStatus('not-configured');
      setStatusInfo({
        status: 'not-configured',
        message: 'Please connect your wallet first',
      });
      setLunarswap(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[LunarswapContext] Creating contract integration...');
      const lunarswap = new LunarswapIntegration(
        midnightWallet.providers,
        midnightWallet.walletAPI,
        midnightWallet.callback,
        runtimeConfig.LUNARSWAP_ADDRESS,
      );

      if (!lunarswap) {
        setStatus('not-configured');
        setStatusInfo({
          status: 'not-configured',
          message: 'Failed to create contract integration',
        });
        setLunarswap(null);
        return;
      }

      setLunarswap(lunarswap);

      console.log('[LunarswapContext] Joining contract...');
      const result = await lunarswap.joinContract();

      setStatus(result.status);
      setStatusInfo(result);

      console.log('[LunarswapContext] Contract join result:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        '[LunarswapContext] Failed to initialize contract:',
        errorMessage,
      );
      setError(errorMessage);
      setStatus('error');
      setStatusInfo({
        status: 'error',
        error: errorMessage,
        message: 'Failed to initialize contract',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    runtimeConfig,
    midnightWallet.isConnected,
    midnightWallet.walletAPI,
    midnightWallet.callback,
    midnightWallet.providers,
  ]);

  // Refresh contract integration
  const refreshContract = useCallback(async () => {
    await initializeLunarswap();
  }, [initializeLunarswap]);

  // Initialize contract when dependencies change
  useEffect(() => {
    console.log(
      '[LunarswapContext] Dependencies changed, reinitializing contract...',
      {
        isConnected: midnightWallet.isConnected,
        hasWalletAPI: !!midnightWallet.walletAPI,
        hasProviders: !!midnightWallet.providers,
        providers: midnightWallet.providers
          ? Object.keys(midnightWallet.providers)
          : [],
      },
    );
    initializeLunarswap();
  }, [
    initializeLunarswap,
    midnightWallet.isConnected,
    midnightWallet.walletAPI,
    midnightWallet.providers,
  ]);

  const contextValue: LunarswapContextType = {
    lunarswap,
    status,
    statusInfo,
    isLoading,
    error,
    refreshContract,
  };

  return (
    <LunarswapContext.Provider value={contextValue}>
      {children}
    </LunarswapContext.Provider>
  );
};
