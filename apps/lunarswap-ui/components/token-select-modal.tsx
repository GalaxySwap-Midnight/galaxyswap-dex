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

interface Token {
  symbol: string;
  name: string;
  type: string;
  address: string;
}

const popularTokens: Token[] = [
  {
    symbol: 'TUSD',
    name: 'Test USD',
    type: '0200fb81b15b883bcbba5630c6f9111d85bd6b237afda821789e2bd049f483cfbf3c',
    address:
      '020050fdd8e2eea82068e6bab6ad0c78ef7e0c050dd9fc1d0a32495c95310c4e1959',
  },
  {
    symbol: 'TEURO',
    name: 'Test Euro',
    type: '02003af426c10783ffe699149c2ef39edb7a6e05e2a2bfe1c3a90e1add8a9d6e2dac',
    address:
      '02007285b48ebb1f85fc6cc7b1754a64deed1f2210b4c758a37309039510acb8781a',
  },
  {
    symbol: 'TJPY',
    name: 'Test Japanese Yen',
    type: '020011a6de51d7633b00f9c5f9408c836a5566870f9366f14022814735eec0663a0b',
    address:
      '02003854ada114516d9ebe65061da7c3f9f00830afdd47c749ed9e2836d36a026d01',
  },
  {
    symbol: 'TCNY',
    name: 'Test Chinese Yuan',
    type: '0200e6b100604d6e10e080948e43cfc4aa1646e32d972d4aada3ac36ce430443911d',
    address:
      '02001e10cca412097c53af918b4532865823e3850fbaf2f66203036acfab324df5c9',
  },
  {
    symbol: 'TARS',
    name: 'Test Argentine Peso',
    type: '020063482c03ec84e6e9bf55ef1eef9ea431f2c434921fab43f9d4c3e60d884a4c6a',
    address:
      '02009161411a0e1e51467c8559444efb09d6a372aca23b3e6613c5b9394ba3d4befd',
  },
];

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
          const available = popularTokens.filter(token => 
            tokenSet.has(token.type)
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
              <p className="text-sm mb-2">Connect your wallet to see available tokens</p>
            </div>
          ) : availableTokens.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Droplets className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm mb-2">No liquidity pools available</p>
              <p className="text-xs mb-3">Add liquidity to create trading pairs</p>
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
