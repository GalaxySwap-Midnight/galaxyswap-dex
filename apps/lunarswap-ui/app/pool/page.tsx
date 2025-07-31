import { Header } from '@/components/header';
import { NewPositionWizard } from '@/components/pool/new-position-wizard';
import { PoolPositions } from '@/components/pool/pool-positions';
import { TokenRewards } from '@/components/pool/token-rewards';
import { TopPoolsList } from '@/components/pool/top-pools-list';
import { StarsBackground } from '@/components/stars-background';
import { MoonDustBackground } from '@/components/moon-dust-background';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useViewPreference } from '@/hooks/use-view-preference';
import { useWallet } from '@/hooks/use-wallet';

export const metadata = {
  title: 'Provide Liquidity & Earn Fees',
  description:
    'Provide liquidity to Midnight token pairs and earn trading fees on Lunarswap. Create new positions, manage existing pools, and track your rewards.',
};

export default function PoolPage() {
  const [showNewPosition, setShowNewPosition] = useState(false);
  const viewPreference = useViewPreference();
  const { isConnected } = useWallet();

  useEffect(() => {
    document.title = 'Provide Liquidity & Earn Fees';
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-foreground">
      <StarsBackground />
      <MoonDustBackground />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-0 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Pools</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Main Content - Left Side (70%) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <TokenRewards />
              </div>

              {showNewPosition && (
                <div>
                  <NewPositionWizard
                    onClose={() => setShowNewPosition(false)}
                  />
                </div>
              )}

              <div>
                <PoolPositions />
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
