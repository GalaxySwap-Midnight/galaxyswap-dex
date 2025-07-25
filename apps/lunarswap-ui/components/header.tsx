'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { VersionSwitcher } from './version-switcher';
import { WalletConnect } from './wallet-connect';
import { ContractStatusIndicator } from './contract-status-indicator';

export function Header() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('/');

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/30 dark:bg-gray-900/20 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/30 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Logo size={36} />
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-300 dark:to-blue-400 bg-clip-text text-transparent font-bold tracking-tight">
                Lunarswap
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition ${
                  currentPath === '/'
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400'
                }`}
              >
                Swap
              </Link>
              <Link
                to="/pool"
                className={`text-sm font-medium transition ${
                  currentPath === '/pool' || currentPath.startsWith('/pool/')
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400'
                }`}
              >
                Pool
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ContractStatusIndicator />
            <VersionSwitcher />
            <WalletConnect />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
