'use client';

import { Button } from '../../ui/button';
import { CardContent, CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { useWallet } from '../../../hooks/use-wallet';
import { useLunarswapContext } from '../../../lib/lunarswap-context';
import { createContractIntegration } from '../../../lib/lunarswap-integration';
import { SplitTokenIcon } from '../split-token-icon';
import { TokenIcon } from '../token-icon';
import {
  calculateAddLiquidityAmounts,
  SLIPPAGE_TOLERANCE,
  hasLiquidity,
} from '@midnight-dapps/lunarswap-sdk';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRuntimeConfiguration } from '@/lib/runtime-configuration';
import type {
  LunarswapProviders,
  LunarswapCircuitKeys,
} from '@midnight-dapps/lunarswap-api';
import type { LunarswapPrivateState } from '@midnight-dapps/lunarswap-v1';
import type {
  PrivateStateProvider,
  ProofProvider,
  PublicDataProvider,
  WalletProvider,
  MidnightProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { proofClient } from '@/providers/proof';
import { ZkConfigProviderWrapper } from '@/providers/zk-config';
import type { ProviderCallbackAction, WalletAPI } from '@/lib/wallet-context';

interface TokenData {
  symbol: string;
  name: string;
  type: string;
  address: string;
}

interface PairData {
  version: string;
  fee: number;
  tokenA: TokenData;
  tokenB: TokenData;
}

interface SetDepositStepProps {
  pairData: PairData;
}

export function SetDepositStep({ pairData }: SetDepositStepProps) {
  const runtimeConfig = useRuntimeConfiguration();
  const {
    isConnected,
    address,
    providers,
    walletAPI,
    callback,
    publicDataProvider,
    walletProvider,
    midnightProvider,
  } = useWallet();
  const { lunarswap, status, isLoading } = useLunarswapContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poolExists, setPoolExists] = useState<boolean | null>(null);
  const [poolReserves, setPoolReserves] = useState<[bigint, bigint] | null>(
    null,
  );
  const [calculatedAmounts, setCalculatedAmounts] = useState<{
    amountAOptimal: bigint;
    amountBOptimal: bigint;
    amountAMin: bigint;
    amountBMin: bigint;
  } | null>(null);

  const [amountA, setAmountA] = useState<string>('');
  const [amountB, setAmountB] = useState<string>('');

  // Transaction state tracking for better user feedback
  const [transactionState, setTransactionState] = useState<
    | 'idle'
    | 'checking-balance'
    | 'fetching-params'
    | 'generating-proof'
    | 'submitting-transaction'
    | 'confirming'
    | 'success'
    | 'error'
  >('idle');

  // Use the token objects directly from pairData
  const tokenADetails = pairData.tokenA;
  const tokenBDetails = pairData.tokenB;

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch pool data when component mounts
  // useEffect(() => {
  //   const fetchPoolInfo = async () => {
  //     if (!isConnected || !lunarswap || status !== 'connected') return;

  //     try {
  //       // Check if pair exists
  //       const exists = await lunarswap.isPairExists(
  //         pairData.tokenA.type,
  //         pairData.tokenB.type,
  //       );
  //       console.log('[DEBUG] exists:', exists);
  //       setPoolExists(exists);

  //       if (exists) {
  //         // Get reserves if pair exists
  //         const reserves = await lunarswap.getPairReserves(
  //           pairData.tokenA.type,
  //           pairData.tokenB.type,
  //         );
  //         console.log('[DEBUG] reserves:', reserves);
  //         setPoolReserves(reserves);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch pool info:', error);
  //     }
  //   };

  //   fetchPoolInfo();
  // }, [isConnected, lunarswap, status, pairData.tokenA.type, pairData.tokenB.type]);

  // Calculate optimal amounts when inputs change
  useEffect(() => {
    const calculateAmounts = () => {
      if (
        !amountA ||
        !amountB ||
        Number.parseFloat(amountA) <= 0 ||
        Number.parseFloat(amountB) <= 0
      ) {
        setCalculatedAmounts(null);
        return;
      }

      try {
        // Get current reserves (use 0 for new pools)
        let reserveA = BigInt(0);
        let reserveB = BigInt(0);

        if (poolReserves && hasLiquidity(poolReserves[0], poolReserves[1])) {
          [reserveA, reserveB] = poolReserves;
        }

        // Calculate optimal amounts using SDK
        const amounts = calculateAddLiquidityAmounts(
          BigInt(amountA),
          BigInt(amountB),
          reserveA,
          reserveB,
          SLIPPAGE_TOLERANCE.LOW,
        );

        setCalculatedAmounts(amounts);
      } catch (error) {
        console.error('Error calculating optimal amounts:', error);
        setCalculatedAmounts(null);
      }
    };

    calculateAmounts();
  }, [amountA, amountB, poolReserves]);

  const handleAddLiquidity = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!lunarswap || status !== 'connected') {
      toast.error('Contract not connected. Please try again.');
      return;
    }

    if (!amountA || !amountB) {
      toast.error('Please enter valid amounts');
      return;
    }

    if (!address) {
      toast.error('Wallet address not available');
      return;
    }

    if (!walletAPI) {
      toast.error('Wallet API not available');
      return;
    }

    setIsSubmitting(true);
    setTransactionState('checking-balance');

    try {
      // Stage 1: Check balance and prepare transaction
      setTransactionState('checking-balance');
      console.log(
        '[AddLiquidity] Checking balance and preparing transaction...',
      );

      // Get current reserves (use 0 for new pools)
      let reserveA = BigInt(0);
      let reserveB = BigInt(0);

      if (poolReserves && hasLiquidity(poolReserves[0], poolReserves[1])) {
        [reserveA, reserveB] = poolReserves;
      }

      // Use SDK to calculate optimal amounts and minimum amounts with slippage protection
      const { amountAOptimal, amountBOptimal, amountAMin, amountBMin } =
        calculateAddLiquidityAmounts(
          BigInt(amountA),
          BigInt(amountB),
          reserveA,
          reserveB,
          SLIPPAGE_TOLERANCE.LOW, // 0.5% slippage tolerance
        );

      // Create LunarswapIntegration instance
      const lunarswapIntegration = createContractIntegration(
        providers,
        walletAPI,
        callback,
        runtimeConfig.LUNARSWAP_ADDRESS,
      );

      // Stage 2: Fetch proof parameters
      setTransactionState('fetching-params');
      console.log('[AddLiquidity] Fetching proof parameters...');

      // Stage 3: Generate ZK proof and submit transaction
      setTransactionState('generating-proof');
      console.log(
        '[AddLiquidity] Generating ZK proof and submitting transaction...',
      );

      // Use the LunarswapIntegration to add liquidity
      const txData = await lunarswapIntegration.addLiquidity(
        pairData.tokenA.type,
        pairData.tokenB.type,
        BigInt(amountA),
        BigInt(amountB),
        BigInt(amountAMin),
        BigInt(amountBMin),
        walletAPI.coinPublicKey,
      );

      // Stage 4: Confirming transaction
      setTransactionState('confirming');
      console.log('[AddLiquidity] Confirming transaction...');

      console.log('txData', txData);

      // Stage 5: Success
      setTransactionState('success');
      toast.success('Liquidity added successfully!');

      // Refresh pool data after successful transaction
      const exists = await lunarswap.isPairExists(
        pairData.tokenA.type,
        pairData.tokenB.type,
      );
      setPoolExists(exists);
      if (exists) {
        const reserves = await lunarswap.getPairReserves(
          pairData.tokenA.type,
          pairData.tokenB.type,
        );
        setPoolReserves(reserves);
      }
    } catch (error: unknown) {
      // Enhanced error handling with better user messages
      setTransactionState('error');
      let errorMessage = 'Failed to add liquidity';

      if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        const errorReason =
          (error as { reason?: string })?.reason?.toLowerCase() || '';

        // Check for insufficient balance errors
        if (
          errorText.includes('insufficient balance') ||
          errorReason.includes('insufficient balance') ||
          errorText.includes('insufficient funds') ||
          errorReason.includes('insufficient funds')
        ) {
          errorMessage = `Insufficient token balance. Please ensure you have enough ${pairData.tokenA.symbol} and ${pairData.tokenB.symbol} tokens.`;
        } else if (
          errorText.includes('slippage') ||
          errorReason.includes('slippage')
        ) {
          errorMessage =
            'Transaction failed due to price movement. Try adjusting your slippage tolerance or try again.';
        } else if (
          errorText.includes('pair does not exist') ||
          errorReason.includes('pair does not exist')
        ) {
          errorMessage = `Trading pair for ${pairData.tokenA.symbol}/${pairData.tokenB.symbol} does not exist yet.`;
        } else if (
          errorText.includes('user rejected') ||
          errorReason.includes('user rejected')
        ) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (
          errorText.includes('network') ||
          errorReason.includes('network')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else {
          // Use the original error message for other cases
          errorMessage = error.message;
        }
      }

      // Show all transaction errors as error notifications
      toast.error(errorMessage);

      console.error('Add liquidity error:', error);
    } finally {
      setIsSubmitting(false);
      // Reset transaction state after a delay
      setTimeout(() => {
        setTransactionState('idle');
      }, 2000);
    }
  };

  const getButtonText = () => {
    if (!isHydrated) return 'Loading...';
    if (!isConnected) return 'Connect Wallet';
    if (!amountA || !amountB) return 'Enter amounts';

    // Show transaction state-specific messages
    switch (transactionState) {
      case 'checking-balance':
        return 'Checking Balance...';
      case 'fetching-params':
        return 'Fetching Parameters...';
      case 'generating-proof':
        return 'Generating ZK Proof...';
      case 'submitting-transaction':
        return 'Submitting Transaction...';
      case 'confirming':
        return 'Confirming Transaction...';
      case 'success':
        return 'Success!';
      case 'error':
        return 'Transaction Failed';
      default:
        return isSubmitting ? 'Adding Liquidity...' : 'Add Liquidity';
    }
  };

  const getButtonVariant = () => {
    switch (transactionState) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'checking-balance':
      case 'fetching-params':
      case 'generating-proof':
      case 'submitting-transaction':
      case 'confirming':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getProgressPercentage = () => {
    switch (transactionState) {
      case 'checking-balance':
        return 20;
      case 'fetching-params':
        return 40;
      case 'generating-proof':
        return 60;
      case 'submitting-transaction':
        return 80;
      case 'confirming':
        return 90;
      case 'success':
        return 100;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  const isButtonDisabled = () => {
    return (
      !isHydrated ||
      !isConnected ||
      !amountA ||
      !amountB ||
      isSubmitting ||
      !lunarswap ||
      status !== 'connected' ||
      !calculatedAmounts // Disable if calculations aren't ready
    );
  };

  return (
    <>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SplitTokenIcon
                tokenASymbol={tokenADetails.symbol}
                tokenBSymbol={tokenBDetails.symbol}
                size={32}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="font-medium mr-2">{tokenADetails.symbol}</span>
                <span className="text-gray-500">/</span>
                <span className="font-medium ml-2">{tokenBDetails.symbol}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{pairData.version}</span>
              <span className="mx-1">·</span>
              <span>{pairData.fee}%</span>
            </div>
          </div>

          {/* Pool Status */}
          {poolExists !== null && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-sm">
                <span className="font-medium">Pool Status: </span>
                {poolExists ? (
                  <span className="text-green-600">Exists</span>
                ) : (
                  <span className="text-orange-600">New Pool</span>
                )}
              </div>
              {poolExists && poolReserves && (
                <div className="text-xs text-gray-500 mt-1">
                  Reserves: {poolReserves[0].toString()} {tokenADetails.symbol}{' '}
                  / {poolReserves[1].toString()} {tokenBDetails.symbol}
                </div>
              )}
            </div>
          )}

          <h3 className="text-lg font-medium mb-2">Deposit tokens</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Specify the token amounts for your liquidity contribution.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg">
              <Input
                type="text"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="text-2xl font-medium border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="0"
              />
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <TokenIcon
                    symbol={tokenADetails.symbol}
                    size={20}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">
                    {tokenADetails.symbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg">
              <Input
                type="text"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="text-2xl font-medium border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="0"
              />
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <TokenIcon
                    symbol={tokenBDetails.symbol}
                    size={20}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">
                    {tokenBDetails.symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Preview */}
          {calculatedAmounts && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                Liquidity Calculation Preview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Optimal {tokenADetails.symbol}:
                  </span>
                  <span className="font-mono font-medium">
                    {Number(calculatedAmounts.amountAOptimal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Optimal {tokenBDetails.symbol}:
                  </span>
                  <span className="font-mono font-medium">
                    {Number(calculatedAmounts.amountBOptimal)}
                  </span>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600 dark:text-blue-400">
                      Min {tokenADetails.symbol} (with 0.5% slippage):
                    </span>
                    <span className="font-mono">
                      {Number(calculatedAmounts.amountAMin)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600 dark:text-blue-400">
                      Min {tokenBDetails.symbol} (with 0.5% slippage):
                    </span>
                    <span className="font-mono">
                      {Number(calculatedAmounts.amountBMin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSubmitting && (
            <div className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
              <div className="flex items-center justify-between mb-2">
                <span>Processing transaction...</span>
                <span className="text-xs font-mono">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-xs text-blue-500 mt-1">
                {transactionState === 'checking-balance' &&
                  'Checking your token balances...'}
                {transactionState === 'fetching-params' &&
                  'Downloading proof parameters...'}
                {transactionState === 'generating-proof' &&
                  'Generating zero-knowledge proof...'}
                {transactionState === 'submitting-transaction' &&
                  'Submitting to blockchain...'}
                {transactionState === 'confirming' &&
                  'Waiting for confirmation...'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className={`w-full text-white py-3 rounded-xl disabled:opacity-50 transition-all duration-300 ${getButtonVariant()}`}
          disabled={isButtonDisabled()}
          onClick={handleAddLiquidity}
        >
          {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </>
  );
}
