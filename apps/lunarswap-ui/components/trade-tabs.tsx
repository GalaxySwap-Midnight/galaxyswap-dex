'use client';

import { useState } from 'react';
import { SwapCard } from './swap-card';
import { Button } from './ui/button';
import { ArrowLeftRight, Settings } from 'lucide-react';

interface TradeTabsProps {
  initialTokens?: {
    fromToken?: string;
    toToken?: string;
    fromTokenType?: string;
    toTokenType?: string;
  };
}

export function TradeTabs({ initialTokens }: TradeTabsProps) {
  const [activeTab, setActiveTab] = useState<'swap'>('swap');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Label-style navigation above the box */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 ml-6">
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 rounded-full bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all"
          >
            Swap
          </Button>
        </div>
      </div>

      {/* Swap Card Content */}
      <div className="transition-all duration-200">
        <SwapCard initialTokens={initialTokens} />
      </div>
    </div>
  );
}
