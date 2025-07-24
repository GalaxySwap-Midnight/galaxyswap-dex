'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { cn } from '@/utils/cn';
import { connectToWallet, disconnectWallet } from '@/utils/wallet-utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AccountPanel } from './account-panel';
import { Identicon } from './identicon';

export function WalletConnect() {
  const {
    isConnected,
    address,
    walletAPI,
    shake,
  } = useWallet();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Mark as hydrated after initial render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const connectWallet = async () => {
    // Prevent multiple clicks
    if (isConnecting) {
      return;
    }

    setIsConnecting(true);

    try {
      await connectToWallet();

      // Show success toast
      toast.success('Successfully connected to Midnight Lace wallet', {
        duration: 3000,
      });
    } catch (error) {
      // Simple error handling - show the error as it is
      const errorMsg = error instanceof Error ? error.message : String(error);

      console.error('Wallet connection failed:', errorMsg);
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setShowWalletInfo(false);
    
    // Use the shared disconnect utility
    disconnectWallet();
    
    // Show success toast
    toast.success('Wallet disconnected', {
      duration: 2000,
    });
  };

  const renderStatus = () => {
    // Don't render anything until hydrated to prevent hydration mismatch
    if (!isHydrated) {
      return (
        <Button
          disabled
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-medium text-white opacity-70"
        >
          Loading...
        </Button>
      );
    }

    // Show connecting state while connecting
    if (isConnecting) {
      return (
        <Button
          disabled
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-medium text-white opacity-70"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </div>
        </Button>
      );
    }

    // If connected, show wallet info
    if (isConnected && address) {
      return (
        <button
          type="button"
          onClick={() => setShowWalletInfo(true)}
          className={cn(
            'flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition-colors',
            showWalletInfo && 'invisible',
          )}
          aria-hidden={showWalletInfo}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Identicon address={address} size={32} />
          </div>
          <span className="font-medium text-sm text-muted-foreground">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
        </button>
      );
    }

    // If not connected, show connect button
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Connect
      </Button>
    );
  };

  return (
    <>
      <div className="flex items-center">{renderStatus()}</div>

      <AccountPanel
        isVisible={showWalletInfo}
        onClose={() => setShowWalletInfo(false)}
        onDisconnect={handleDisconnect}
      />
    </>
  );
}
