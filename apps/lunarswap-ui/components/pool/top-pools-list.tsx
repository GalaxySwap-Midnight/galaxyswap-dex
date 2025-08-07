'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/use-wallet';
import { useLunarswapContext } from '@/lib/lunarswap-context';
import { Badge } from '@/components/ui/badge';

export function TopPoolsList() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { status, isLoading, allPairs } = useLunarswapContext();

  const handleExploreMorePools = () => {
    navigate('/explore', { state: { selectedOption: 'pools' } });
  };

  // Show wallet connection message when not connected
  if (!isConnected) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Top pools by TVL</h3>
        <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Droplets className="h-12 w-12 text-gray-400 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-1">
                  Connect Your Wallet
                </h4>
                <p className="text-sm text-muted-foreground">
                  Please connect your wallet to view liquidity pools and their
                  statistics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while contract is connecting
  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Top pools by TVL</h3>
        <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-1">Loading Pools...</h4>
                <p className="text-sm text-muted-foreground">
                  Connecting to Lunarswap contract and fetching pool data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if contract connection failed
  if (status === 'error') {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Top pools by TVL</h3>
        <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Droplets className="h-12 w-12 text-red-400 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-1">Connection Error</h4>
                <p className="text-sm text-muted-foreground">
                  Failed to connect to Lunarswap contract. Please try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Top pools by TVL</h3>

      {!allPairs || allPairs.length === 0 ? (
        <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Droplets className="h-12 w-12 text-gray-400 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-1">No Pools Found</h4>
                <p className="text-sm text-muted-foreground">
                  No liquidity pools are currently active on Lunarswap.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allPairs.slice(0, 5).map((pool, index) => (
            <Card
              key={pool.identity}
              className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </div>
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 mr-3">
                        <div className="absolute top-0 left-0 h-6 w-6 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900">
                          <img
                            src="/placeholder.svg?height=24&width=24"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full overflow-hidden bg-green-100 dark:bg-green-900">
                          <img
                            src="/placeholder.svg?height=24&width=24"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {(() => {
                            return `${Buffer.from(pool.pair.token0.color).toString('hex').slice(0, 4)}/${Buffer.from(pool.pair.token1.color).toString('hex').slice(0, 4)}`;
                          })()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {pool.identity.slice(0, 8)}...
                          {pool.identity.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <Badge variant="secondary" className="text-xs">
                        v1
                      </Badge>
                    </div>
                    <div>0.3%</div>
                    <div>Coming soon</div>
                    <div>Coming soon</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              className="text-blue-600 dark:text-blue-400 gap-1 text-sm"
              onClick={handleExploreMorePools}
            >
              Explore more pools
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
