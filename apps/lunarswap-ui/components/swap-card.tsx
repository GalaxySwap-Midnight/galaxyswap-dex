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
import { useLunarswapContext } from '@/lib/lunarswap-context';
import { SLIPPAGE_TOLERANCE, calculateAmountOut, calculateAmountIn } from '@midnight-dapps/lunarswap-sdk';
import { ArrowDown, Fuel, Info, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TokenInput } from './token-input';
import { TokenSelectModal } from './token-select-modal';
import { Buffer } from 'buffer';
import { popularTokens } from '@/lib/token-config';
import { decodeCoinInfo } from '@midnight-ntwrk/ledger';

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
  const { status, allPairs, lunarswap } = useLunarswapContext();
  const [isHydrated, setIsHydrated] = useState(false);

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

  // Get available tokens from global context
  useEffect(() => {
    console.log('Swap card - Getting available tokens:', {
      status,
      allPairsLength: allPairs.length,
      fromToken: fromToken?.symbol,
      toToken: toToken?.symbol
    });
    console.dir(allPairs, { depth: null });

    if (status !== 'connected' || allPairs.length === 0) {
      console.log('Swap card - No pairs available, setting empty tokens');
      setAvailableTokens([]);
      return;
    }

    // Extract unique tokens from all pairs
    const tokenSet = new Set<string>();
    for (const { pair } of allPairs) {
      const token0Color = decodeCoinInfo(pair.token0).type;
      const token1Color = decodeCoinInfo(pair.token1).type;
      tokenSet.add(token0Color);
      tokenSet.add(token1Color);
      console.log('Swap card - Added token colors:', {
        token0Color,
        token1Color
      });
    }

    console.log('Swap card - All token colors from pools:', 
      Array.from(tokenSet).map(color => color.slice(-8))
    );
    console.log('Swap card - Full token colors from pools:', Array.from(tokenSet));
    console.log('Swap card - Full token types from config:', popularTokens.map(t => ({ symbol: t.symbol, type: t.type })));

    // Filter popular tokens to only include those with pools
    const available = popularTokens.filter((token: Token) => {
      // Try exact match first
      let hasMatch = tokenSet.has(token.type);
      
      // If no exact match, try matching the last 8 characters
      if (!hasMatch && token.type) {
        const tokenTypeSuffix = token.type.slice(-8);
        hasMatch = Array.from(tokenSet).some(color => {
          const colorMatch = color === tokenTypeSuffix;
          console.log(`Swap card - Comparing: pool color "${color}" vs token suffix "${tokenTypeSuffix}" = ${colorMatch}`);
          return colorMatch;
        });
      }
      
      console.log(`Swap card - Token ${token.symbol}: type ${token.type.slice(-8)}, has match: ${hasMatch}`);
      return hasMatch;
    });

    console.log('Swap card - Available tokens after filtering:', available.map(t => t.symbol));
    console.log('Swap card - All popular tokens:', popularTokens.map(t => ({ symbol: t.symbol, type: t.type.slice(-8) })));

    // If no tokens match, show all popular tokens for debugging
    if (available.length === 0 && allPairs.length > 0) {
      console.log('Swap card - No matching tokens found, showing all popular tokens for debugging');
      setAvailableTokens(popularTokens.filter(t => t.type)); // Only show tokens with valid types
    } else {
      setAvailableTokens(available);
    }

    // Set default tokens if none are selected
    if (!fromToken && available.length > 0) {
      console.log('Swap card - Setting default from token:', available[0].symbol);
      setFromToken(available[0]);
    }
    if (!toToken && available.length > 1) {
      console.log('Swap card - Setting default to token:', available[1].symbol);
      setToToken(available[1]);
    } else if (!toToken && available.length === 1) {
      console.log('Swap card - Setting default to token (same as from):', available[0].symbol);
      setToToken(available[0]);
    }
  }, [status, allPairs, fromToken, toToken]);

  // Get pool reserves from global public state
  useEffect(() => {
    console.log('Getting reserves from public state for:', {
      fromToken: fromToken?.symbol,
      toToken: toToken?.symbol,
      allPairsLength: allPairs.length,
      status
    });

    if (
      !fromToken ||
      !toToken ||
      fromToken.symbol === toToken.symbol ||
      status !== 'connected' ||
      allPairs.length === 0
    ) {
      console.log('Skipping reserves fetch - conditions not met');
      setPoolReserves(null);
      return;
    }

    // Find the pair in the global allPairs data
    const pair = allPairs.find(p => {
      const token0Type = decodeCoinInfo(p.pair.token0).type;
      const token1Type = decodeCoinInfo(p.pair.token1).type;
      
      // Check if this pair matches our tokens
      return (token0Type === fromToken.type && token1Type === toToken.type) ||
             (token0Type === toToken.type && token1Type === fromToken.type);
    });

    if (pair) {
      const token0Type = decodeCoinInfo(pair.pair.token0).type;
      
      // Determine which token is which based on the order in the pair
      let reserve0: bigint;
      let reserve1: bigint;
      if (token0Type === fromToken.type) {
        reserve0 = pair.pair.token0.value;
        reserve1 = pair.pair.token1.value;
      } else {
        reserve0 = pair.pair.token1.value;
        reserve1 = pair.pair.token0.value;
      }
      
      console.log('Found pair reserves:', [reserve0.toString(), reserve1.toString()]);
      setPoolReserves([reserve0, reserve1]);
    } else {
      console.log('Pair not found in public state');
      setPoolReserves(null);
    }
  }, [allPairs, fromToken, toToken, status]);

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

        // Use SDK function for accurate calculation
        const amountOut = calculateAmountOut(amountIn, reserveIn, reserveOut, 30); // 0.3% fee
        return amountOut.toString();
      } catch (error) {
        console.error('Error calculating output amount:', error);
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

        // Use SDK function for accurate calculation
        const amountIn = calculateAmountIn(amountOut, reserveIn, reserveOut, 30); // 0.3% fee
        return amountIn.toString();
      } catch (error) {
        console.error('Error calculating input amount:', error);
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

      console.log('From amount changed:', {
        value,
        poolReserves: poolReserves ? [poolReserves[0].toString(), poolReserves[1].toString()] : null,
        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol
      });

      if (!value || !poolReserves) {
        setToAmount('');
        return;
      }

      setIsCalculating(true);
      try {
        const calculatedToAmount = calculateOutputAmount(value);
        console.log('Calculated to amount:', calculatedToAmount);
        setToAmount(calculatedToAmount);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateOutputAmount, poolReserves, fromToken, toToken],
  );

  // Handle to amount change (exact output)
  const handleToAmountChange = useCallback(
    async (value: string) => {
      setToAmount(value);
      setActiveField('to');
      setSwapType('EXACT_OUTPUT');

      console.log('To amount changed:', {
        value,
        poolReserves: poolReserves ? [poolReserves[0].toString(), poolReserves[1].toString()] : null,
        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol
      });

      if (!value || !poolReserves) {
        setFromAmount('');
        return;
      }

      setIsCalculating(true);
      try {
        const calculatedFromAmount = calculateInputAmount(value);
        console.log('Calculated from amount:', calculatedFromAmount);
        setFromAmount(calculatedFromAmount);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateInputAmount, poolReserves, fromToken, toToken],
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
      status !== 'connected'
    ) {
      return;
    }

    setIsSwapping(true);
    try {
      // Use the global lunarswap context instead of creating a new integration
      // The contract should already be connected through the context

      if (!lunarswap) {
        throw new Error('Lunarswap contract not available');
      }

      if (swapType === 'EXACT_INPUT') {
        const result = await lunarswap.swapExactTokensForTokens(
          fromToken.type,
          toToken.type,
          BigInt(fromAmount),
          BigInt(toAmount),
          midnightWallet.walletAPI.coinPublicKey,
        );
        toast.success(
          `Swapped ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}`,
        );
      } else {
        const result = await lunarswap.swapTokensForExactTokens(
          fromToken.type,
          toToken.type,
          BigInt(fromAmount),
          BigInt(toAmount),
          midnightWallet.walletAPI.coinPublicKey,
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
    if (status !== 'connected') return 'Contract not ready';
    if (isCalculating) return 'Finalizing quote...';
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
      status !== 'connected' ||
      isCalculating ||
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
            readonly={!midnightWallet.isConnected || !fromToken}
            disabled={!midnightWallet.isConnected}
            isActive={activeField === 'from'}
            isLoading={isCalculating && activeField === 'to'}
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
            readonly={!midnightWallet.isConnected || !toToken}
            disabled={!midnightWallet.isConnected}
            isActive={activeField === 'to'}
            isLoading={isCalculating && activeField === 'from'}
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
