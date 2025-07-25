'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

// Sample token list - in a real app, this would come from an API
const popularTokens = [
  {
    symbol: 'NIGHT',
    name: 'Midnight',
    logo: '/placeholder.svg?height=32&width=32',
    balance: '1000.00', // Static balance for demo
    type: '0000000000000000000000000000000000000000000000000000000000000001', // NIGHT token address
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '/placeholder.svg?height=32&width=32',
    balance: '2500.00', // Static balance for demo
    type: '0000000000000000000000000000000000000000000000000000000000000002', // USDC token address
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    logo: '/placeholder.svg?height=32&width=32',
    balance: '1500.00', // Static balance for demo
    type: '0000000000000000000000000000000000000000000000000000000000000003', // USDT token address
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logo: '/placeholder.svg?height=32&width=32',
    balance: '800.00', // Static balance for demo
    type: '0000000000000000000000000000000000000000000000000000000000000004', // DAI token address
  },
];

interface TokenSelectorProps {
  selectedToken: any;
  onSelectToken: (token: any) => void;
  placeholder?: string;
  showTokenIcon?: boolean;
}

export function TokenSelector({
  selectedToken,
  onSelectToken,
  placeholder = 'Select a token',
  showTokenIcon = true,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = popularTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectToken = (token: any) => {
    onSelectToken(token);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="token-selector-dialog"
        className="w-full justify-between h-12 bg-white dark:bg-gray-800"
        onClick={() => setOpen(true)}
      >
        {selectedToken ? (
          <div className="flex items-center">
            {showTokenIcon && (
              <div className="relative h-6 w-6 mr-2">
                <img
                  src={selectedToken.logo || '/placeholder.svg'}
                  alt={selectedToken.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
            <span>{selectedToken.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            {placeholder}
          </span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id="token-selector-dialog"
          className="sm:max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-blue-900/30 text-foreground rounded-2xl"
        >
          <DialogHeader>
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
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => handleSelectToken(token)}
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={token.logo || '/placeholder.svg'}
                    alt={token.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {token.name}
                  </span>
                </div>
                <span className="ml-auto text-gray-500 dark:text-gray-400">
                  {token.balance}
                </span>
              </button>
            ))}

            {filteredTokens.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No tokens found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
