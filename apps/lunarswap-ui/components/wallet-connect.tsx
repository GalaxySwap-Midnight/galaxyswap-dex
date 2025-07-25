'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { cn } from '@/utils/cn';
import { connectToWallet, disconnectWallet } from '@/utils/wallet-utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AccountPanel } from './account-panel';
import { Identicon } from './identicon';
import { Download, ExternalLink } from 'lucide-react';

type BrowserType = 'chrome' | 'firefox' | 'other';

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
  const [walletAvailable, setWalletAvailable] = useState<boolean | null>(null);
  const [browserType, setBrowserType] = useState<BrowserType>('other');
  const [shouldAutoConnect, setShouldAutoConnect] = useState<boolean | null>(null);

  // Detect browser type
  useEffect(() => {
    const detectBrowser = (): BrowserType => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('firefox')) {
        return 'firefox';
      }
      if (userAgent.includes('chrome') || userAgent.includes('chromium') || userAgent.includes('edge')) {
        return 'chrome';
      }
      return 'other';
    };

    setBrowserType(detectBrowser());
  }, []);

  // Early detection of auto-connect condition
  useEffect(() => {
    if (isHydrated && !isConnected) {
      const wasConnected = localStorage.getItem('lunarswap-wallet-connected');
      setShouldAutoConnect(wasConnected === 'true');
    }
  }, [isHydrated, isConnected]);

  // Check wallet availability and auto-connect
  useEffect(() => {
    const checkWalletAvailability = async () => {
      try {
        // Check if the Midnight Lace wallet is available
        // Try multiple detection methods for better compatibility across browsers
        const isAvailable = !!(
          (typeof window !== 'undefined') && (
            // Check for midnight.mnLace (correct property name)
            (window.midnight?.mnLace) ||
            // Check if midnight API exists at all
            (typeof window.midnight !== 'undefined')
          )
        );
        
        setWalletAvailable(isAvailable);
        
        // Auto-connect if wallet is available and user was previously connected
        if (isAvailable && !isConnected && !isConnecting && shouldAutoConnect) {
          setIsConnecting(true);
          try {
            await connectToWallet();
            toast.success('Auto-connected to Midnight Lace wallet', {
              duration: 2000,
            });
          } catch (error) {
            // Auto-connect failed, remove the stored preference
            localStorage.removeItem('lunarswap-wallet-connected');
            setShouldAutoConnect(false);
            console.warn('Auto-connect failed:', error);
          } finally {
            setIsConnecting(false);
          }
        }
      } catch (error) {
        console.warn('Error checking wallet availability:', error);
        setWalletAvailable(false);
      }
    };

    if (isHydrated && shouldAutoConnect !== null) {
      checkWalletAvailability();
    }
  }, [isHydrated, isConnected, isConnecting, shouldAutoConnect]);

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
      
      // Store connection preference for auto-connect
      localStorage.setItem('lunarswap-wallet-connected', 'true');

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
    
    // Remove auto-connect preference
    localStorage.removeItem('lunarswap-wallet-connected');
    setShouldAutoConnect(false);
    
    // Use the shared disconnect utility
    disconnectWallet();
    
    // Show success toast
    toast.success('Wallet disconnected', {
      duration: 2000,
    });
  };

  const getDownloadUrl = (): string => {
    if (browserType === 'firefox') {
      return 'https://addons.mozilla.org/en-US/firefox/addon/lace-wallet/';
    }
    return 'https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg?hl=en-US&utm_source=ext_sidebar';
  };

  const getBrowserName = (): string => {
    switch (browserType) {
      case 'firefox':
        return 'Firefox';
      case 'chrome':
        return 'Chrome';
      default:
        return 'your browser';
    }
  };

  const renderStatus = () => {
    // Don't render anything until hydrated to prevent hydration mismatch
    if (!isHydrated || shouldAutoConnect === null) {
      return (
        <Button
          disabled
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-medium text-white opacity-70"
        >
          Loading...
        </Button>
      );
    }

    // Show connecting state if:
    // 1. Currently connecting (manual or auto-connect in progress)
    // 2. Should auto-connect (show connecting immediately, don't wait for wallet availability)
    if (isConnecting || (shouldAutoConnect && !isConnected)) {
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

    // Wait for wallet availability to be determined before showing other states
    if (walletAvailable === null) {
      return (
        <Button
          disabled
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-medium text-white opacity-70"
        >
          Loading...
        </Button>
      );
    }

    // If wallet is not available, show download button
    if (walletAvailable === false) {
      return (
        <Button
          onClick={() => window.open(getDownloadUrl(), '_blank')}
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-sm font-medium text-white flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Install Lace
          <ExternalLink className="h-3 w-3" />
        </Button>
      );
    }

    // If wallet is available but not connected, show connect button
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

      {/* Show install instructions tooltip when wallet is not available */}
      {walletAvailable === false && (
        <div className="hidden lg:block absolute top-16 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50 w-80">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Download className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Install Midnight Lace Wallet</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Get the official Midnight Lace wallet for {getBrowserName()} to connect to Lunarswap and manage your digital assets.
              </p>
              <Button
                size="sm"
                onClick={() => window.open(getDownloadUrl(), '_blank')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Download for {getBrowserName()}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <AccountPanel
        isVisible={showWalletInfo}
        onClose={() => setShowWalletInfo(false)}
        onDisconnect={handleDisconnect}
      />
    </>
  );
}
