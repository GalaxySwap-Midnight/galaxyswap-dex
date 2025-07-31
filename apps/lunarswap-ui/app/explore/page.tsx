import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { StarsBackground } from '@/components/stars-background';
import { MoonDustBackground } from '@/components/moon-dust-background';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Coins,
  Droplets,
  ArrowRightLeft,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,

} from 'lucide-react';
import { DEMO_TOKENS } from '@/lib/lunarswap-integration';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Search, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Identicon } from '@/components/identicon';
import { useViewPreference } from '@/hooks/use-view-preference';
import { useWallet } from '@/hooks/use-wallet';
import { useLunarswapContext } from '@/lib/lunarswap-context';
import type { Pair } from '@midnight-dapps/lunarswap-v1';
import { useLocation, useNavigate } from 'react-router-dom';

type ExploreOption = 'tokens' | 'pools' | 'transactions';

export const metadata = {
  title: 'Discover the Midnight Ecosystem',
  description:
    'Discover the complete Midnight ecosystem on Lunarswap. Explore tokens, liquidity pools, and transaction data. Your gateway to the most celestial DEX in the galaxy.',
};

export default function ExplorePage() {
  useEffect(() => {
    document.title = 'Discover the Midnight Ecosystem';
  }, []);

  const viewPreference = useViewPreference();
  const { isConnected } = useWallet();
  const { lunarswap, status, isLoading } = useLunarswapContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<ExploreOption>('tokens');

  // Handle navigation state to automatically select pools section
  useEffect(() => {
    if (location.state?.selectedOption === 'pools') {
      setSelectedOption('pools');
    }
  }, [location.state]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    viewPreference === 'horizontal' ? 'grid' : 'list',
  );
  const [poolData, setPoolData] = useState<Array<{ identity: string; pair: Pair }> | null>(null);
  const [poolLoading, setPoolLoading] = useState(false);

  // Update view mode when view preference changes
  useEffect(() => {
    setViewMode(viewPreference === 'horizontal' ? 'grid' : 'list');
  }, [viewPreference]);

  // Fetch pool data when contract is connected
  useEffect(() => {
    const fetchPoolData = async () => {
      if (!isConnected || !lunarswap || status !== 'connected') {
        setPoolData(null);
        return;
      }

      setPoolLoading(true);
      try {
        const publicState = await lunarswap.getPublicState();
        if (publicState) {
          const pairs = lunarswap.getAllPairs();
          setPoolData(pairs);
        } else {
          setPoolData([]);
        }
      } catch (error) {
        console.error('Failed to fetch pool data:', error);
        setPoolData([]);
      } finally {
        setPoolLoading(false);
      }
    };

    fetchPoolData();
  }, [isConnected, lunarswap, status]);

  const exploreOptions = [
    {
      id: 'tokens' as ExploreOption,
      title: 'Tokens',
      icon: Coins,
      available: true,
    },
    {
      id: 'pools' as ExploreOption,
      title: 'Pools',
      icon: Droplets,
      available: true,
    },
    {
      id: 'transactions' as ExploreOption,
      title: 'Transactions',
      icon: ArrowRightLeft,
      available: false,
      badge: 'Coming Soon',
      badgeVariant: 'secondary' as const,
    },
  ];

  const tokens = Object.values(DEMO_TOKENS);
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderTokensContent = () => (
    <div className="mt-8">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tokens by name, symbol, or address..."
            className="pl-9 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}{' '}
        found
      </div>

      {filteredTokens.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No tokens found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTokens.map((token) => (
                <Card
                  key={token.symbol}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 hover:border-blue-500/50 transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Identicon address={token.address} size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {token.symbol}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {token.name}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Address:
                        </span>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full text-left"
                          onClick={() =>
                            copyToClipboard(
                              token.address,
                              `address-${token.symbol}`,
                            )
                          }
                          title="Click to copy address"
                        >
                          {token.address}
                        </button>
                        {copiedField === `address-${token.symbol}` && (
                          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Copied!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Type:
                        </span>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full text-left"
                          onClick={() =>
                            copyToClipboard(token.type, `type-${token.symbol}`)
                          }
                          title="Click to copy type"
                        >
                          {token.type}
                        </button>
                        {copiedField === `type-${token.symbol}` && (
                          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Copied!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="w-full text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Explorer - Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTokens.map((token) => (
                <Card
                  key={token.symbol}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 hover:border-blue-500/50 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Identicon address={token.address} size={48} />
                        </div>
                        <div>
                          <div className="font-semibold">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              token.address,
                              `address-${token.symbol}`,
                            )
                          }
                        >
                          {copiedField === `address-${token.symbol}` ? (
                            'Copied!'
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Address
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(token.type, `type-${token.symbol}`)
                          }
                        >
                          {copiedField === `type-${token.symbol}` ? (
                            'Copied!'
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Type
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          Explorer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPoolsContent = () => {
    // Show nothing until wallet is connected
    if (!isConnected) {
      return (
        <div className="mt-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
            <CardContent className="p-8 text-center">
              <Droplets className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                Please connect your wallet to view liquidity pools and their statistics.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show loading while contract is connecting
    if (isLoading || poolLoading) {
      return (
        <div className="mt-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading Pools...</h3>
              <p className="text-muted-foreground">
                Connecting to Lunarswap contract and fetching pool data.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show error if contract connection failed
    if (status === 'error') {
      return (
        <div className="mt-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
            <CardContent className="p-8 text-center">
              <Droplets className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
              <p className="text-muted-foreground mb-4">
                Failed to connect to Lunarswap contract. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show pools data
    return (
      <div className="mt-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Top Pools by TVL</h3>
            <p className="text-muted-foreground">
              {poolData ? `${poolData.length} active liquidity pools` : 'No pools found'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/pool/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Droplets className="h-4 w-4 mr-2" />
            Add Liquidity
          </Button>
        </div>

        {!poolData || poolData.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
            <CardContent className="p-8 text-center">
              <Droplets className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Pools Found</h3>
              <p className="text-muted-foreground">
                No liquidity pools are currently active on Lunarswap.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 pt-4 px-4 font-medium">#</th>
                      <th className="pb-3 pt-4 px-4 font-medium">Pool</th>
                      <th className="pb-3 pt-4 px-4 font-medium">Protocol</th>
                      <th className="pb-3 pt-4 px-4 font-medium">Fee Tier</th>
                      <th className="pb-3 pt-4 px-4 font-medium">TVL</th>
                      <th className="pb-3 pt-4 px-4 font-medium">Pool APR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poolData.map((pool, index) => (
                      <tr
                        key={pool.identity}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
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
                              <div className="font-medium">
                                {pool.pair.token0.color}/{pool.pair.token1.color}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {pool.identity.slice(0, 8)}...{pool.identity.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">
                            v1
                          </Badge>
                        </td>
                        <td className="py-3 px-4">0.3%</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">Coming soon</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">Coming soon</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderTransactionsContent = () => (
    <div className="mt-8">
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30">
        <CardContent className="p-8 text-center">
          <ArrowRightLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Transactions Coming Soon
          </h3>
          <p className="text-muted-foreground mb-4">
            Transaction history and trading activity will be available in a
            future update.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Features in development:</p>
            <ul className="mt-2 space-y-1">
              <li>• Recent transaction history</li>
              <li>• Trading activity analytics</li>
              <li>• Transaction details and status</li>
              <li>• User transaction tracking</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderContent = () => {
    switch (selectedOption) {
      case 'tokens':
        return renderTokensContent();
      case 'pools':
        return renderPoolsContent();

      case 'transactions':
        return renderTransactionsContent();
      default:
        return renderTokensContent();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-foreground">
      <StarsBackground />
      <MoonDustBackground />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-0 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Lunarswap</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover tokens, liquidity pools, and transaction data across the
              Lunarswap ecosystem.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            {exploreOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedOption === option.id;

              if (option.available) {
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className="text-left"
                  >
                    <Card
                      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-blue-200 dark:bg-blue-800/50'
                                : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50'
                            }`}
                          >
                            <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <ArrowRight
                            className={`h-4 w-4 transition-opacity ${
                              isSelected
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          />
                        </div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </button>
                );
              }

              return (
                <Card
                  key={option.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 opacity-60"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/30">
                        <IconComponent className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <Badge variant={option.badgeVariant} className="text-xs">
                        {option.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-600 dark:text-gray-400">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
