'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useWallet } from '@/hooks/use-wallet';
import { useRuntimeConfiguration } from '@/lib/runtime-configuration';
import { createContractIntegration } from '@/lib/lunarswap-integration';
import { SLIPPAGE_TOLERANCE } from '@midnight-dapps/lunarswap-sdk';
import { ArrowDown, Fuel, Info, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TokenInput } from './token-input';
import { TokenSelectModal } from './token-select-modal';
import { Buffer } from 'buffer';
import { popularTokens } from '@/lib/token-config';

interface Token {
  symbol: string;
  name: string;
  address: string;
  type: string;
}

type SwapType = 'EXACT_INPUT' | 'EXACT_OUTPUT';
type ActiveField = 'from' | 'to' | null;

export function SwapCard() {
  const midnightWallet = useWallet();
  const runtimeConfig = useRuntimeConfiguration();
  const [isHydrated, setIsHydrated] = useState(false);
  const [contractReady, setContractReady] = useState(false);

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectingToken, setSelectingToken] = useState<'from' | 'to'>('from');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [swapType, setSwapType] = useState<SwapType>('EXACT_INPUT');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [slippageTolerance] = useState(SLIPPAGE_TOLERANCE.LOW); // 0.5% using SDK constant
  const [poolReserves, setPoolReserves] = useState<[bigint, bigint] | null>(
    null,
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check contract status when wallet connects
  // useEffect(() => {
  //   const checkContractStatus = async () => {
  //     if (
  //       !midnightWallet.walletAPI ||
  //       !midnightWallet.isConnected ||
  //       !runtimeConfig
  //     ) {
  //       setContractReady(false);
  //       return;
  //     }

  //     try {
  //       const contractIntegration = createContractIntegration(
  //         midnightWallet.providers,
  //         midnightWallet.walletAPI,
  //         midnightWallet.callback,
  //         runtimeConfig.LUNARSWAP_ADDRESS,
  //       );
  //       const status = await contractIntegration.joinContract();
  //       setContractReady(status.status === 'connected');
  //     } catch (error) {
  //       console.error('Contract status check failed:', error);
  //       setContractReady(false);
  //     }
  //   };

  //   checkContractStatus();
  // }, [
  //   midnightWallet.walletAPI,
  //   midnightWallet.providers,
  //   midnightWallet.isConnected,
  //   midnightWallet.callback,
  //   runtimeConfig,
  // ]);

  // Get available tokens from pools
  // useEffect(() => {
  //   const fetchAvailableTokens = async () => {
  //     if (
  //       !midnightWallet.isConnected ||
  //       !runtimeConfig ||
  //       !midnightWallet.walletAPI
  //     ) {
  //       setAvailableTokens([]);
  //       return;
  //     }

  //     setIsLoadingTokens(true);
  //     try {
  //       const contractIntegration = createContractIntegration(
  //         midnightWallet.providers,
  //         midnightWallet.walletAPI,
  //         midnightWallet.callback,
  //         runtimeConfig.LUNARSWAP_ADDRESS,
  //       );
  //       await contractIntegration.joinContract();

  //       const publicState = await contractIntegration.getPublicState();
  //       if (publicState) {
  //         const pairs = contractIntegration.getAllPairs();

  //         // Extract unique tokens from all pairs
  //         const tokenSet = new Set<string>();
  //         for (const { pair } of pairs) {
  //           // Add both tokens from each pair
  //           tokenSet.add(Buffer.from(pair.token0.color).toString('hex'));
  //           tokenSet.add(Buffer.from(pair.token1.color).toString('hex'));
  //         }

  //         // Filter popular tokens to only include those with pools
  //         const available = popularTokens.filter((token: Token) =>
  //           tokenSet.has(token.type),
  //         );

  //         setAvailableTokens(available);

  //         // Set default tokens if none are selected
  //         if (!fromToken && available.length > 0) {
  //           setFromToken(available[0]);
  //         }
  //         if (!toToken && available.length > 1) {
  //           setToToken(available[1]);
  //         } else if (!toToken && available.length === 1) {
  //           setToToken(available[0]);
  //         }
  //       } else {
  //         setAvailableTokens([]);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch available tokens:', error);
  //       setAvailableTokens([]);
  //     } finally {
  //       setIsLoadingTokens(false);
  //     }
  //   };

  //   fetchAvailableTokens();
  // }, [
  //   midnightWallet.isConnected,
  //   midnightWallet.providers,
  //   midnightWallet.walletAPI,
  //   midnightWallet.callback,
  //   runtimeConfig,
  //   fromToken,
  //   toToken,
  // ]);

  // Fetch pool reserves when tokens change
  // useEffect(() => {
  //   const fetchReserves = async () => {
  //     if (
  //       !midnightWallet.walletAPI ||
  //       !fromToken ||
  //       !toToken ||
  //       fromToken.symbol === toToken.symbol ||
  //       !runtimeConfig
  //     ) {
  //       setPoolReserves(null);
  //       return;
  //     }

  //     try {
  //       const contractIntegration = createContractIntegration(
  //         midnightWallet.providers,
  //         midnightWallet.walletAPI,
  //         midnightWallet.callback,
  //         runtimeConfig.LUNARSWAP_ADDRESS,
  //       );
  //       await contractIntegration.joinContract();

  //       const exists = await contractIntegration.isPairExists(
  //         fromToken.symbol,
  //         toToken.symbol,
  //       );
  //       if (exists) {
  //         const reserves = await contractIntegration.getPairReserves(
  //           fromToken.symbol,
  //           toToken.symbol,
  //         );
  //         setPoolReserves(reserves);
  //       } else {
  //         setPoolReserves(null);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch reserves:', error);
  //       setPoolReserves(null);
  //     }
  //   };

  //   fetchReserves();
  // }, [
  //   midnightWallet.walletAPI,
  //   midnightWallet.providers,
  //   midnightWallet.callback,
  //   runtimeConfig,
  //   fromToken,
  //   toToken,
  // ]);

  // Calculate output amount for exact input using SDK
  const calculateOutputAmount = useCallback(
    (inputAmount: string): string => {
      if (!poolReserves || !fromToken || !toToken) {
        return '';
      }

      try {
        const amountIn = BigInt(inputAmount);
        const reserveIn = poolReserves[0];
        const reserveOut = poolReserves[1];

        if (amountIn === 0n || reserveIn === 0n || reserveOut === 0n) {
          return '';
        }

        const amountInWithFee = amountIn * 997n;
        const numerator = amountInWithFee * reserveOut;
        const denominator = reserveIn * 1000n + amountInWithFee;
        const amountOut = numerator / denominator;

        return amountOut.toString();
      } catch {
        return '';
      }
    },
    [poolReserves, fromToken, toToken],
  );

  // Calculate input amount for exact output (reverse calculation)
  const calculateInputAmount = useCallback(
    (outputAmount: string): string => {
      if (!poolReserves || !fromToken || !toToken) {
        return '';
      }

      try {
        const amountOut = BigInt(outputAmount);
        const reserveIn = poolReserves[0];
        const reserveOut = poolReserves[1];

        if (amountOut === 0n || reserveIn === 0n || reserveOut === 0n) {
          return '';
        }

        const numerator = reserveIn * amountOut * 1000n;
        const denominator = (reserveOut - amountOut) * 997n;
        const amountIn = numerator / denominator + 1n;

        return amountIn.toString();
      } catch {
        return '';
      }
    },
    [poolReserves, fromToken, toToken],
  );

  // Handle from amount change (exact input)
  const handleFromAmountChange = useCallback(
    async (value: string) => {
      setFromAmount(value);
      setActiveField('from');
      setSwapType('EXACT_INPUT');

      if (!value || !poolReserves) {
        setToAmount('');
        return;
      }

      setIsCalculating(true);
      try {
        const calculatedToAmount = calculateOutputAmount(value);
        setToAmount(calculatedToAmount);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateOutputAmount, poolReserves],
  );

  // Handle to amount change (exact output)
  const handleToAmountChange = useCallback(
    async (value: string) => {
      setToAmount(value);
      setActiveField('to');
      setSwapType('EXACT_OUTPUT');

      if (!value || !poolReserves) {
        setFromAmount('');
        return;
      }

      setIsCalculating(true);
      try {
        const calculatedFromAmount = calculateInputAmount(value);
        setFromAmount(calculatedFromAmount);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateInputAmount, poolReserves],
  );

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenModal(false);

    // Clear amounts when tokens change
    setFromAmount('');
    setToAmount('');
    setActiveField(null);
  };

  const openTokenModal = (type: 'from' | 'to') => {
    setSelectingToken(type);
    setShowTokenModal(true);
  };

  const handleSwap = async () => {
    if (
      !fromToken ||
      !toToken ||
      !fromAmount ||
      !toAmount ||
      !midnightWallet.walletAPI ||
      !midnightWallet.address ||
      !runtimeConfig
    ) {
      return;
    }

    setIsSwapping(true);
    try {
      const contractIntegration = createContractIntegration(
        midnightWallet.providers,
        midnightWallet.walletAPI,
        midnightWallet.callback,
        runtimeConfig.LUNARSWAP_ADDRESS,
      );
      await contractIntegration.joinContract();

      if (swapType === 'EXACT_INPUT') {
        const result = await contractIntegration.swapExactTokensForTokens(
          fromToken.symbol,
          toToken.symbol,
          BigInt(fromAmount),
          BigInt(toAmount),
          midnightWallet.address,
        );
        toast.success(
          `Swapped ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}`,
        );
      } else {
        const result = await contractIntegration.swapTokensForExactTokens(
          fromToken.symbol,
          toToken.symbol,
          BigInt(fromAmount),
          BigInt(toAmount),
          midnightWallet.address,
        );
        toast.success(
          `Swapped ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
        );
      }

      // Clear amounts after successful swap
      setFromAmount('');
      setToAmount('');
      setActiveField(null);
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const getExchangeRate = () => {
    if (!poolReserves || !fromToken || !toToken) {
      return 'No rate available';
    }

    const [reserve0, reserve1] = poolReserves;
    if (reserve0 === 0n || reserve1 === 0n) {
      return 'No liquidity';
    }

    const rate = Number(reserve1) / Number(reserve0);
    return `1 ${fromToken.symbol} = ${rate.toFixed(6)} ${toToken.symbol}`;
  };

  const getButtonText = () => {
    if (!isHydrated) return 'Loading...';
    if (!midnightWallet.isConnected) return 'Connect Wallet';
    if (!fromToken || !toToken) return 'Select Tokens';
    if (!fromAmount || !toAmount) return 'Enter amounts';
    if (!contractReady) return 'Contract not ready';
    if (isSwapping) return 'Swapping...';
    return 'Swap';
  };

  const isButtonDisabled = () => {
    return (
      !isHydrated ||
      !midnightWallet.isConnected ||
      !fromToken ||
      !toToken ||
      !fromAmount ||
      !toAmount ||
      !contractReady ||
      isSwapping
    );
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Swap</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TokenInput
            token={fromToken}
            amount={fromAmount}
            onChange={handleFromAmountChange}
            onSelectToken={() => openTokenModal('from')}
            label="Sell"
            readonly={!midnightWallet.isConnected}
            disabled={!midnightWallet.isConnected}
            isActive={activeField === 'from'}
          />
          <div className="flex justify-center -my-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 z-10"
              onClick={() => {
                // Swap tokens and amounts
                const tempToken = fromToken;
                setFromToken(toToken);
                setToToken(tempToken);

                // Swap amounts and maintain active field logic
                if (activeField === 'from') {
                  setToAmount(fromAmount);
                  setFromAmount(toAmount);
                  handleToAmountChange(fromAmount);
                } else if (activeField === 'to') {
                  setFromAmount(toAmount);
                  setToAmount(fromAmount);
                  handleFromAmountChange(toAmount);
                } else {
                  setFromAmount(toAmount);
                  setToAmount(fromAmount);
                }
              }}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
          <TokenInput
            token={toToken}
            amount={toAmount}
            onChange={handleToAmountChange}
            onSelectToken={() => openTokenModal('to')}
            label="Buy"
            readonly={!midnightWallet.isConnected}
            disabled={!midnightWallet.isConnected}
            isActive={activeField === 'to'}
          />

          {fromAmount && toAmount && (
            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              <div className="flex justify-between">
                <span>Rate</span>
                <span>{getExchangeRate()}</span>
              </div>
              <div className="flex justify-between">
                <span>Slippage Tolerance</span>
                <span>{slippageTolerance / 100}%</span>
              </div>
              <div className="flex justify-between">
                <span>Trade Type</span>
                <span className="text-xs">
                  {swapType === 'EXACT_INPUT' ? 'Exact Input' : 'Exact Output'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <TooltipProvider>
            <div className="flex items-center justify-center w-full text-xs text-gray-500 dark:text-gray-400">
              <Fuel className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>Network fee applies</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 p-0"
                  >
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    {swapType === 'EXACT_INPUT'
                      ? 'You will receive at least the calculated amount minus slippage.'
                      : 'You will pay at most the calculated amount plus slippage.'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white font-medium py-6 rounded-xl disabled:opacity-50"
            disabled={isButtonDisabled()}
            onClick={handleSwap}
          >
            {(isCalculating || isSwapping) && (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            )}
            {getButtonText()}
          </Button>
        </CardFooter>
      </Card>

      <TokenSelectModal
        show={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSelect={handleTokenSelect}
      />
    </TooltipProvider>
  );
}
