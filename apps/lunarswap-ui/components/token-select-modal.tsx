'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Droplets, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Identicon } from '@/components/identicon';
import { useLunarswapContext } from '@/lib/lunarswap-context';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import { popularTokens } from '@/lib/token-config';

interface Token {
  symbol: string;
  name: string;
  type: string;
  address: string;
}

interface TokenSelectModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export function TokenSelectModal({
  show,
  onClose,
  onSelect,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { lunarswap, status } = useLunarswapContext();
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  // Get available tokens from pools
  useEffect(() => {
    const fetchAvailableTokens = async () => {
      if (!isConnected || !lunarswap || status !== 'connected') {
        setAvailableTokens([]);
        return;
      }

      setIsLoading(true);
      try {
        const publicState = await lunarswap.getPublicState();
        if (publicState) {
          const pairs = lunarswap.getAllPairs();

          // Extract unique tokens from all pairs
          const tokenSet = new Set<string>();
          for (const { pair } of pairs) {
            // Add both tokens from each pair
            tokenSet.add(Buffer.from(pair.token0.color).toString('hex'));
            tokenSet.add(Buffer.from(pair.token1.color).toString('hex'));
          }

          // Filter popular tokens to only include those with pools
          const available = popularTokens.filter((token) =>
            tokenSet.has(token.type),
          );

          setAvailableTokens(available);
        } else {
          setAvailableTokens([]);
        }
      } catch (error) {
        console.error('Failed to fetch available tokens:', error);
        setAvailableTokens([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (show) {
      fetchAvailableTokens();
    }
  }, [show, isConnected, lunarswap, status]);

  const filteredTokens = availableTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddLiquidity = () => {
    onClose();
    navigate('/pool/new');
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 text-foreground rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name or paste address"
            className="pl-9 bg-gray-100/80 dark:bg-gray-700/60 border-gray-300/50 dark:border-blue-900/30 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2" />
              Loading available tokens...
            </div>
          ) : !isConnected ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Droplets className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm mb-2">
                Connect your wallet to see available tokens
              </p>
            </div>
          ) : availableTokens.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Droplets className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm mb-2">No liquidity pools available</p>
              <p className="text-xs mb-3">
                Add liquidity to create trading pairs
              </p>
              <Button
                onClick={handleAddLiquidity}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Liquidity
              </Button>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No tokens found matching your search
            </div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.symbol}
                type="button"
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => onSelect(token)}
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Identicon address={token.address} size={32} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {token.name}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
