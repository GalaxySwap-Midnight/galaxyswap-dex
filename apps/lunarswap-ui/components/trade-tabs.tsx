'use client';

import { useState } from 'react';
import { SwapCard } from './swap-card';
import { FaucetCard } from './faucet-card';
import { Button } from './ui/button';
import { ArrowLeftRight, Coins } from 'lucide-react';

type TradeTab = 'swap' | 'faucet';

export function TradeTabs() {
  const [activeTab, setActiveTab] = useState<TradeTab>('swap');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Navigation */}
      <div className="flex bg-gray-100/80 dark:bg-gray-800/50 rounded-xl p-1 mb-6">
        <Button
          variant={activeTab === 'swap' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('swap')}
          className={`flex-1 rounded-lg transition-all ${
            activeTab === 'swap'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
          }`}
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Swap
        </Button>
        <Button
          variant={activeTab === 'faucet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('faucet')}
          className={`flex-1 rounded-lg transition-all ${
            activeTab === 'faucet'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
          }`}
        >
          <Coins className="h-4 w-4 mr-2" />
          Faucet
        </Button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-200">
        {activeTab === 'swap' && <SwapCard />}
        {activeTab === 'faucet' && <FaucetCard />}
      </div>
    </div>
  );
} 