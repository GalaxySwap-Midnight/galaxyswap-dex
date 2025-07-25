'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { createContractIntegration, type ContractStatusInfo } from '@/lib/contract-integration';
import { AlertCircle, CheckCircle, Clock, XCircle, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function ContractStatusIndicator() {
  const { walletAPI, providers, isConnected } = useWallet();
  const [statusInfo, setStatusInfo] = useState<ContractStatusInfo>({ status: 'not-configured' });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const checkContractStatus = useCallback(async () => {
    if (!walletAPI || !isConnected) {
      setStatusInfo({ 
        status: 'not-configured', 
        message: 'Please connect your wallet first' 
      });
      return;
    }

    setIsLoading(true);
    try {
      const contractIntegration = createContractIntegration(providers, walletAPI.wallet);
      const status = await contractIntegration.initialize();
      setStatusInfo(status);
    } catch (error) {
      setStatusInfo({
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to check contract status',
      });
    } finally {
      setIsLoading(false);
    }
  }, [walletAPI, providers, isConnected]);

  useEffect(() => {
    checkContractStatus();
  }, [checkContractStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'not-configured':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'not-deployed':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'not-configured':
        return 'Not Configured';
      case 'not-deployed':
        return 'Not Deployed';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'connecting':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'not-configured':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'not-deployed':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'not-configured':
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            <p className="mb-2">To deploy a contract:</p>
            <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              pnpm run deploy:local
            </code>
          </div>
        );
      case 'not-deployed':
      case 'error':
        return (
          <Button 
            onClick={checkContractStatus} 
            disabled={isLoading}
            size="sm" 
            variant="outline"
            className="mt-4 w-full"
          >
            Retry Connection
          </Button>
        );
      case 'connected':
        return (
          <div className="text-sm text-green-600 dark:text-green-400 mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            ✅ Ready for swaps and liquidity operations
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-8 px-2 rounded-full hover:bg-muted"
        >
          {getStatusIcon(statusInfo.status)}
          <span className="text-xs font-medium hidden sm:inline">
            {getStatusText(statusInfo.status)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(statusInfo.status)}
            Contract Status
          </DialogTitle>
        </DialogHeader>
        <div className={`p-4 rounded-lg ${getStatusColor(statusInfo.status)}`}>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">Status</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {statusInfo.message}
              </p>
            </div>
            
            {statusInfo.contractAddress && (
              <div>
                <h4 className="font-medium text-sm mb-1">Contract Address</h4>
                <code className="block p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono break-all">
                  {statusInfo.contractAddress}
                </code>
              </div>
            )}
            
            {statusInfo.error && (
              <div>
                <h4 className="font-medium text-sm mb-1 text-red-600 dark:text-red-400">Error Details</h4>
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  {statusInfo.error}
                </div>
              </div>
            )}
            
            {getActionButton(statusInfo.status)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 