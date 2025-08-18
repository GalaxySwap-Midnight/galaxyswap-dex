import { Header } from '@/components/header';
import { NewPositionWizard } from '@/components/pool/new-position-wizard';
import { RemoveLiquidityWizard } from '@/components/pool/remove-liquidity-wizard';
import { Button } from '@/components/ui/button';
import { TopPoolsList } from '@/components/pool/top-pools-list';
import { StarsBackground } from '@/components/stars-background';
import { MoonDustBackground } from '@/components/moon-dust-background';
import { useEffect, useState } from 'react';
import { useViewPreference } from '@/hooks/use-view-preference';
import { useWallet } from '@/hooks/use-wallet';
import { Plus, Minus } from 'lucide-react';

export const metadata = {
  title: 'Manage Liquidity & Positions',
  description:
    'Add or remove liquidity from Midnight token pairs on Lunarswap. Manage your positions and earn trading fees while maintaining privacy.',
};

export default function PoolPage() {
  const [showNewPosition, setShowNewPosition] = useState(true); // Default to Add Liquidity
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const viewPreference = useViewPreference();
  const { isConnected } = useWallet();

  useEffect(() => {
    document.title = 'Manage Liquidity & Positions';
  }, []);

  const handleCloseWizards = () => {
    setShowNewPosition(false);
    setShowRemoveLiquidity(false);
  };

  const handleAddLiquidity = () => {
    setShowRemoveLiquidity(false);
    setShowNewPosition(true);
  };

  const handleRemoveLiquidity = () => {
    setShowNewPosition(false);
    setShowRemoveLiquidity(true);
  };

  // Get the current action title
  const getActionTitle = () => {
    if (showRemoveLiquidity) return 'Remove Liquidity';
    return 'Add Liquidity';
  };

  // Get the current action description
  const getActionDescription = () => {
    if (showRemoveLiquidity) {
      return 'Remove liquidity from your existing positions to withdraw your tokens and collect accumulated fees. Your privacy is maintained throughout the process.';
    }
    return 'Add liquidity to token pairs to earn trading fees. Create new positions or add to existing pools while maintaining privacy.';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-foreground">
      <StarsBackground />
      <MoonDustBackground />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-0 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Main Content - Left Side (70%) */}
            <div className="lg:col-span-7">
              {/* Centered Liquidity Wizard */}
              <div className="w-full max-w-4xl mx-auto">
                {/* Simple Add/Remove Choices */}
                <div className="flex items-center space-x-2 mb-6">
                  <Button
                    variant={showNewPosition ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleAddLiquidity}
                    className={`px-4 py-2 rounded-full transition-all ${
                      showNewPosition
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                  <Button
                    variant={showRemoveLiquidity ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleRemoveLiquidity}
                    className={`px-4 py-2 rounded-full transition-all ${
                      showRemoveLiquidity
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80'
                    }`}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>

                {/* Dynamic Title */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold">{getActionTitle()}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    {getActionDescription()}
                  </p>
                </div>

                {/* Add Liquidity Wizard - Default */}
                {showNewPosition && (
                  <div>
                    <NewPositionWizard onClose={handleCloseWizards} />
                  </div>
                )}

                {/* Remove Liquidity Wizard */}
                {showRemoveLiquidity && (
                  <div>
                    <RemoveLiquidityWizard onClose={handleCloseWizards} />
                  </div>
                )}

                {/* Privacy Notice - Now inside the left column for proper alignment */}
                <div className="mt-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Privacy-First Design
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                          Built on Midnight network, this application cannot directly query your wallet balances. 
                          When adding or removing liquidity, the system assumes you have sufficient funds to generate 
                          the required zero-knowledge proofs. Your privacy is maintained throughout the process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pools - Right Side (30%) */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <TopPoolsList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
