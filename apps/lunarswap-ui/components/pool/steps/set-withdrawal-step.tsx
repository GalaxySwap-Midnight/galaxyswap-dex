'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SplitTokenIcon } from '@/components/pool/split-token-icon';
import { useState } from 'react';
import { useLunarswapContext } from '@/lib/lunarswap-context';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  calculateRemoveLiquidityMinimums,
  SLIPPAGE_TOLERANCE,
} from '@midnight-dapps/lunarswap-sdk';

interface PositionData {
  pairId: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Type: Uint8Array;
  token1Type: Uint8Array;
  fee: number;
  version: string;
  lpTokenType: Uint8Array;
}

interface SetWithdrawalStepProps {
  positionData: PositionData;
}

export function SetWithdrawalStep({ positionData }: SetWithdrawalStepProps) {
  const { lunarswap, status } = useLunarswapContext();
  const { isConnected, walletAPI } = useWallet();
  const [withdrawalPercentage, setWithdrawalPercentage] = useState(25);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);

  const handlePercentageChange = (value: number[]) => {
    const percentage = value[0];
    setWithdrawalPercentage(percentage);
    
    // Mock calculation - in real app this would calculate based on actual position data
    // For now, we'll use placeholder values since we can't see actual balances
    const mockToken0Total = 1000; // Mock total amount
    const mockToken1Total = 1000; // Mock total amount
    
    setToken0Amount(((mockToken0Total * percentage) / 100).toFixed(2));
    setToken1Amount(((mockToken1Total * percentage) / 100).toFixed(2));
  };

  const handleRemoveLiquidity = async () => {
    if (!isConnected || !walletAPI || !lunarswap || status !== 'connected') {
      toast.error('Wallet not connected or contract not ready');
      return;
    }

    setIsRemovingLiquidity(true);

    try {
      // Calculate liquidity amount based on percentage (placeholder for now)
      // TODO: Replace with actual LP balance * (withdrawalPercentage / 100)
      const liquidityAmount = '1000';

      // Prepare token type hex strings
      const token0Hex = Buffer.from(positionData.token0Type).toString('hex');
      const token1Hex = Buffer.from(positionData.token1Type).toString('hex');
      const lpTokenTypeHex = Buffer.from(positionData.lpTokenType).toString('hex');

      // Fetch current reserves for this pair - required for accurate minimum calculations
      const reserves = await lunarswap.getPairReserves(token0Hex, token1Hex);
      if (!reserves) {
        throw new Error('Unable to fetch pool reserves. Please try again later.');
      }

      const [reserveA, reserveB] = reserves;
      
      // Use SDK to compute minimums. Normalize LP supply to 100 and use percentage as tokens to remove
      const lpTokensToRemove = BigInt(withdrawalPercentage);
      const totalLpSupply = 100n;
      const { amountAMin, amountBMin } = calculateRemoveLiquidityMinimums(
        lpTokensToRemove,
        totalLpSupply,
        reserveA,
        reserveB,
        SLIPPAGE_TOLERANCE.LOW,
      );

      console.log('Removing liquidity:', {
        position: positionData,
        lpTokenType: lpTokenTypeHex,
        percentage: withdrawalPercentage,
        token0Amount,
        token1Amount,
        liquidityAmount,
        minAmountA: amountAMin.toString(),
        minAmountB: amountBMin.toString(),
      });

      // Call the actual removeLiquidity method (expects string types)
      const result = await lunarswap.removeLiquidity(
        token0Hex,
        token1Hex,
        lpTokenTypeHex,
        liquidityAmount,
        amountAMin,
        amountBMin,
        walletAPI.coinPublicKey,
      );

      console.log('Remove liquidity result:', result);
      
      toast.success(`Successfully initiated liquidity removal for ${withdrawalPercentage}% of your ${positionData.token0Symbol}/${positionData.token1Symbol} position`);
      
      // Reset form or redirect
      setWithdrawalPercentage(25);
      setToken0Amount('');
      setToken1Amount('');

    } catch (error) {
      console.error('Error removing liquidity:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Insufficient')) {
          toast.error('Insufficient liquidity balance for removal');
        } else if (error.message.includes('Slippage')) {
          toast.error('Transaction failed due to high slippage. Try reducing the amount.');
        } else {
          toast.error(`Remove liquidity failed: ${error.message}`);
        }
      } else {
        toast.error('Remove liquidity failed. Please try again.');
      }
    } finally {
      setIsRemovingLiquidity(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Set Withdrawal Amount</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how much liquidity to remove from your {positionData.token0Symbol}/{positionData.token1Symbol} position
        </p>
      </div>

      {/* Position Summary */}
      <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SplitTokenIcon
                tokenASymbol={positionData.token0Symbol}
                tokenBSymbol={positionData.token1Symbol}
                size={32}
              />
              <div>
                <div className="font-medium">
                  {positionData.token0Symbol}/{positionData.token1Symbol}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Fee: {positionData.fee}% • {positionData.version}
                </div>
              </div>
            </div>
            <Badge variant="outline">
              {positionData.pairId.slice(0, 8)}...{positionData.pairId.slice(-8)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Percentage */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">
          Withdrawal Percentage: {withdrawalPercentage}%
        </Label>
        <Slider
          value={[withdrawalPercentage]}
          onValueChange={handlePercentageChange}
          max={100}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Token Amounts */}
      <div className="space-y-4 mb-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {positionData.token0Symbol} Amount (Estimated)
          </Label>
          <Input
            value={token0Amount}
            onChange={(e) => setToken0Amount(e.target.value)}
            placeholder="0.00"
            className="w-full"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Estimated amount based on percentage selection
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {positionData.token1Symbol} Amount (Estimated)
          </Label>
          <Input
            value={token1Amount}
            onChange={(e) => setToken1Amount(e.target.value)}
            placeholder="0.00"
            className="w-full"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Estimated amount based on percentage selection
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-red-900 dark:text-red-100 mb-1">
              Important: Privacy-First Operation
            </p>
            <p className="text-red-800 dark:text-red-200">
              The system will generate zero-knowledge proofs assuming you have sufficient balance. 
              Your actual token amounts remain private throughout the process. The amounts shown above 
              are estimates based on the selected percentage.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline"
          disabled={isRemovingLiquidity}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRemoveLiquidity}
          disabled={isRemovingLiquidity || !isConnected || status !== 'connected'}
          className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
        >
          {isRemovingLiquidity && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {isRemovingLiquidity ? 'Removing Liquidity...' : 'Remove Liquidity'}
        </Button>
      </div>
    </div>
  );
} 