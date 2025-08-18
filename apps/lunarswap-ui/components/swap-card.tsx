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
import { SLIPPAGE_TOLERANCE, calculateAmountOut, calculateAmountIn, computeAmountInMax, computeAmountOutMin } from '@midnight-dapps/lunarswap-sdk';
import { ArrowDown, Fuel, Info, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TokenInput } from './token-input';
import { TokenSelectModal } from './token-select-modal';
import { Buffer } from 'buffer';
import { popularTokens, getAvailableTokensForSelection } from '@/lib/token-config';
import { decodeCoinInfo } from '@midnight-ntwrk/ledger';

interface Token {
  symbol: string;
  name: string;
  address: string;
  type: string;
}

type SwapType = 'EXACT_INPUT' | 'EXACT_OUTPUT';
type ActiveField = 'from' | 'to' | null;

interface SwapCardProps {
  initialTokens?: {
    fromToken?: string;
    toToken?: string;
    fromTokenType?: string;
    toTokenType?: string;
  };
}

export function SwapCard({ initialTokens }: SwapCardProps) {
  const midnightWallet = useWallet();
  const { status, allPairs, lunarswap } = useLunarswapContext();
  const [isHydrated, setIsHydrated] = useState(false);

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectingToken, setSelectingToken] = useState<'from' | 'to'>('from');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [availableTokensForFrom, setAvailableTokensForFrom] = useState<Token[]>([]);
  const [availableTokensForTo, setAvailableTokensForTo] = useState<Token[]>([]);
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

  // Set initial tokens from navigation state
  useEffect(() => {
    if (initialTokens?.fromToken && initialTokens?.toToken && availableTokens.length > 0) {
      const fromTokenData = availableTokens.find(t => t.symbol === initialTokens.fromToken);
      const toTokenData = availableTokens.find(t => t.symbol === initialTokens.toToken);
      
      if (fromTokenData) {
        setFromToken(fromTokenData);
      }
      if (toTokenData) {
        setToToken(toTokenData);
      }
    }
  }, [initialTokens, availableTokens]);

  // Function to get available tokens for a specific selected token
  const getAvailableTokensForToken = useCallback((selectedToken: Token | null, allTokens: Token[]) => {
    console.log('getAvailableTokensForToken called with:', {
      selectedToken: selectedToken?.symbol,
      allTokensCount: allTokens.length,
      allPairsCount: allPairs.length
    });
    
    if (!selectedToken || allPairs.length === 0) {
      console.log('Returning all tokens (no selected token or no pairs)');
      return allTokens;
    }

    const selectedTokenType = selectedToken.type.replace(/^0x/i, '').toLowerCase();
    const selectedTokenTypeWithoutPrefix = selectedTokenType.replace(/^0200/, '');

    // Find all pairs that contain the selected token
    const relevantPairs = allPairs.filter(pair => {
      const token0Type = Array.from(pair.pair.token0Type)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();
      const token1Type = Array.from(pair.pair.token1Type)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();

      return token0Type === selectedTokenTypeWithoutPrefix || 
             token1Type === selectedTokenTypeWithoutPrefix ||
             token0Type === selectedTokenType || 
             token1Type === selectedTokenType;
    });

    // Get the other token from each relevant pair
    const availableTokenTypes = new Set<string>();
    relevantPairs.forEach(pair => {
      const token0Type = Array.from(pair.pair.token0Type)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();
      const token1Type = Array.from(pair.pair.token1Type)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();

      if (token0Type === selectedTokenTypeWithoutPrefix || token0Type === selectedTokenType) {
        availableTokenTypes.add(token1Type);
      } else {
        availableTokenTypes.add(token0Type);
      }
    });

    // Filter tokens that match the available types
    const filteredTokens = allTokens.filter(token => {
      const tokenType = token.type.replace(/^0x/i, '').toLowerCase();
      const tokenTypeWithoutPrefix = tokenType.replace(/^0200/, '');
      
      const hasMatch = availableTokenTypes.has(tokenType) || 
             availableTokenTypes.has(tokenTypeWithoutPrefix) ||
             availableTokenTypes.has(`0200${tokenTypeWithoutPrefix}`) ||
             availableTokenTypes.has(tokenType.replace(/^0200/, ''));
      
      console.log(`Token ${token.symbol}: ${tokenType} has match: ${hasMatch}`);
      return hasMatch;
    });
    
    console.log('getAvailableTokensForToken returning:', filteredTokens.map(t => t.symbol));
    return filteredTokens;
  }, [allPairs]);

  // Get available tokens from global context - run immediately when component mounts
  useEffect(() => {
    console.log('Swap card - Getting available tokens:', {
      status,
      allPairsLength: allPairs.length,
      fromToken: fromToken?.symbol,
      toToken: toToken?.symbol
    });

    // Set loading state when starting to fetch tokens
    setIsLoadingTokens(true);

    // If we have pairs but status is not connected yet, still try to get tokens
    if (allPairs.length === 0) {
      console.log('Swap card - No pairs available, setting empty tokens');
      setAvailableTokens([]);
      setAvailableTokensForFrom([]);
      setAvailableTokensForTo([]);
      setIsLoadingTokens(false);
      return;
    }

    // Use the new function to get tokens from available pools
    const available = getAvailableTokensForSelection(allPairs);

    console.log('Swap card - Available tokens after filtering:', available.map(t => t.symbol));
    console.log('Swap card - All pairs:', allPairs.map(pair => ({
      token0Type: Array.from(pair.pair.token0Type).map(b => b.toString(16).padStart(2, '0')).join(''),
      token1Type: Array.from(pair.pair.token1Type).map(b => b.toString(16).padStart(2, '0')).join('')
    })));
    console.log('Swap card - Popular tokens:', popularTokens.map(t => ({
      symbol: t.symbol,
      type: t.type.replace(/^0x/i, '').toLowerCase()
    })));

    // Only set available tokens if we have matches from pools
    if (available.length > 0) {
      console.log('Swap card - Setting available tokens:', available.map(t => t.symbol));
      setAvailableTokens(available);
    } else {
      console.log('Swap card - No matching tokens found in pools, setting empty list');
      setAvailableTokens([]);
    }

    // No default token selection - let user choose
    console.log('Swap card - No default tokens set, user must select');
    
    // Clear loading state after token processing is complete
    setIsLoadingTokens(false);
  }, [status, allPairs]);

  // Update contextual token lists when tokens change or when availableTokens are loaded
  useEffect(() => {
    if (availableTokens.length > 0) {
      const fromTokens = getAvailableTokensForToken(toToken, availableTokens);
      const toTokens = getAvailableTokensForToken(fromToken, availableTokens);
      
      console.log('SwapCard - Setting contextual tokens:', {
        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol,
        fromTokens: fromTokens.map(t => t.symbol),
        toTokens: toTokens.map(t => t.symbol)
      });
      
      setAvailableTokensForFrom(fromTokens);
      setAvailableTokensForTo(toTokens);
    } else {
      // Clear contextual tokens if no available tokens
      setAvailableTokensForFrom([]);
      setAvailableTokensForTo([]);
    }
  }, [fromToken, toToken, availableTokens, getAvailableTokensForToken]);

  // Get pool reserves via integration API (reliable across schema changes)
  useEffect(() => {
    const fetchReserves = async () => {
      console.log('Getting reserves via integration for:', {
        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol,
        status
      });

      if (!fromToken || !toToken || fromToken.symbol === toToken.symbol) {
        setPoolReserves(null);
        return;
      }

      if (status !== 'connected' || !lunarswap) {
        setPoolReserves(null);
        return;
      }

      try {
        // Fetch reserves with fromToken first, toToken second
        // This ensures consistent ordering: [fromTokenReserve, toTokenReserve]
        const reserves = await lunarswap.getPairReserves(
          fromToken.type,
          toToken.type,
        );
        if (reserves) {
          const [fromTokenReserve, toTokenReserve] = reserves;
          console.log('Found pair reserves:', {
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            fromTokenReserve: fromTokenReserve.toString(),
            toTokenReserve: toTokenReserve.toString()
          });
          // Store reserves in consistent order: [fromTokenReserve, toTokenReserve]
          setPoolReserves([fromTokenReserve, toTokenReserve]);
        } else {
          console.log('No reserves found for selected tokens');
          setPoolReserves(null);
        }
      } catch (err) {
        console.log('Failed to fetch reserves for selected tokens', err);
        setPoolReserves(null);
      }
    };

    fetchReserves();
  }, [fromToken, toToken, status, lunarswap]);

  // Calculate output amount for exact input using SDK
  const calculateOutputAmount = useCallback(
    (inputAmount: string): string => {
      if (!poolReserves || !fromToken || !toToken) {
        return '';
      }

      try {
        const amountIn = BigInt(inputAmount);
        // poolReserves[0] = fromTokenReserve, poolReserves[1] = toTokenReserve
        const reserveIn = poolReserves[0];  // fromTokenReserve
        const reserveOut = poolReserves[1]; // toTokenReserve

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
        // poolReserves[0] = fromTokenReserve, poolReserves[1] = toTokenReserve
        const reserveIn = poolReserves[0];  // fromTokenReserve
        const reserveOut = poolReserves[1]; // toTokenReserve

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

  const handleTokenSelect = (token: Token | null) => {
    if (token === null) {
      // Clear both selected tokens when clearing
      setFromToken(null);
      setToToken(null);
    } else {
      // Set the selected token
      if (selectingToken === 'from') {
        setFromToken(token);
      } else {
        setToToken(token);
      }
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

  // Get the appropriate token list based on which field is being selected
  const getTokensForSelection = () => {
    let tokens;
    
    // If no token is selected in the other field, show all available tokens
    if (selectingToken === 'from' && !toToken) {
      tokens = availableTokens;
    } else if (selectingToken === 'to' && !fromToken) {
      tokens = availableTokens;
    } else {
      // If a token is selected in the other field, show contextual tokens
      if (selectingToken === 'from') {
        tokens = availableTokensForFrom.length > 0 ? availableTokensForFrom : availableTokens;
      } else {
        tokens = availableTokensForTo.length > 0 ? availableTokensForTo : availableTokens;
      }
    }
    
    // If no tokens available, return empty array
    if (tokens.length === 0) {
      console.log('getTokensForSelection - No tokens available, returning empty array');
      return [];
    }
    
    console.log('getTokensForSelection returning:', {
      selectingToken,
      fromToken: fromToken?.symbol,
      toToken: toToken?.symbol,
      tokens: tokens.map(t => t.symbol),
      availableTokensForFrom: availableTokensForFrom.map(t => t.symbol),
      availableTokensForTo: availableTokensForTo.map(t => t.symbol),
      availableTokens: availableTokens.map(t => t.symbol)
    });
    
    return tokens;
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

    // Additional validation
    if (!poolReserves) {
      toast.error('Pool reserves not available. Please try again.');
      return;
    }

    const fromAmountBigInt = BigInt(fromAmount);
    const toAmountBigInt = BigInt(toAmount);
    
    // Check if amounts are reasonable
    if (fromAmountBigInt <= 0n || toAmountBigInt <= 0n) {
      toast.error('Invalid amounts. Please enter valid amounts.');
      return;
    }

    // Check if reserves are valid
    const [fromTokenReserve, toTokenReserve] = poolReserves;
    if (fromTokenReserve <= 0n || toTokenReserve <= 0n) {
      toast.error('Invalid pool reserves. Please try again.');
      return;
    }

    // Check if the swap amounts are reasonable relative to reserves
    if (swapType === 'EXACT_INPUT' && fromAmountBigInt > fromTokenReserve) {
      toast.error('Input amount exceeds available liquidity.');
      return;
    }
    
    if (swapType === 'EXACT_OUTPUT' && toAmountBigInt > toTokenReserve) {
      toast.error('Output amount exceeds available liquidity.');
      return;
    }

    // Check if user has sufficient balance (basic check)
    // Note: This is a UI-level check, the contract will do the final validation

    setIsSwapping(true);
    try {
      // Use the global lunarswap context instead of creating a new integration
      // The contract should already be connected through the context

      if (!lunarswap) {
        throw new Error('Lunarswap contract not available');
      }

      if (swapType === 'EXACT_INPUT') {
        // For EXACT_INPUT, we need to apply slippage tolerance to amountOutMin
        const calculatedAmountOut = toAmountBigInt;
        const amountOutMin = computeAmountOutMin(calculatedAmountOut, slippageTolerance);
        
        // Validate slippage-adjusted amount
        if (amountOutMin <= 0n) {
          toast.error('Invalid slippage calculation. Please try again.');
          return;
        }
        
        console.log('EXACT_INPUT swap:', {
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromTokenType: fromToken.type,
          toTokenType: toToken.type,
          amountIn: fromAmount,
          calculatedAmountOut: calculatedAmountOut.toString(),
          amountOutMin: amountOutMin.toString(),
          slippageTolerance,
          poolReserves: poolReserves.map(r => r.toString())
        });

        const result = await lunarswap.swapExactTokensForTokens(
          fromToken.type,  // tokenIn
          toToken.type,    // tokenOut
          fromAmountBigInt, // amountIn
          amountOutMin,    // amountOutMin (with slippage)
          midnightWallet.walletAPI.coinPublicKey,
        );
        toast.success(
          `Swapped ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}`,
        );
      } else {
        // For EXACT_OUTPUT, we need to apply slippage tolerance to amountInMax
        const calculatedAmountIn = fromAmountBigInt;
        const amountInMax = computeAmountInMax(calculatedAmountIn, slippageTolerance);
        
        // Validate slippage-adjusted amount
        if (amountInMax <= 0n) {
          toast.error('Invalid slippage calculation. Please try again.');
          return;
        }
        
        console.log('EXACT_OUTPUT swap:', {
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromTokenType: fromToken.type,
          toTokenType: toToken.type,
          calculatedAmountIn: calculatedAmountIn.toString(),
          amountInMax: amountInMax.toString(),
          slippageTolerance,
          toAmount: toAmount,
          poolReserves: poolReserves.map(r => r.toString())
        });

        const result = await lunarswap.swapTokensForExactTokens(
          fromToken.type,  // tokenIn
          toToken.type,    // tokenOut
          toAmountBigInt,  // amountOut (exact)
          amountInMax,     // amountInMax (with slippage)
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
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Insufficient input amount')) {
          toast.error('Swap failed: Insufficient input amount. The calculated amount may be too low due to price impact or insufficient liquidity.');
        } else if (error.message.includes('Insufficient output amount')) {
          toast.error('Swap failed: Insufficient output amount. The trade may have failed due to high slippage or insufficient liquidity.');
        } else {
          toast.error(`Swap failed: ${error.message}`);
        }
      } else {
        toast.error('Swap failed. Please try again.');
      }
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
        customTokens={getTokensForSelection()}
        selectedToken={selectingToken === 'from' ? fromToken : toToken}
        isLoading={isLoadingTokens}
      />
    </TooltipProvider>
  );
}
