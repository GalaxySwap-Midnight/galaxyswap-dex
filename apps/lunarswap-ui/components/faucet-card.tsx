'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useWallet } from '@/hooks/use-wallet';
import { checkFaucetHealth, requestFaucetTokens } from '@/utils/faucet';
import { Coins, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SimpleCaptcha } from './simple-captcha';

export function FaucetCard() {
  const { address, isConnected } = useWallet();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [faucetStatus, setFaucetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const isHealthy = await checkFaucetHealth();
      if (isHealthy) {
        toast.success('Faucet is healthy and ready');
      } else {
        toast.error('Faucet is currently unavailable');
      }
    } catch (error) {
      console.error('Faucet health check failed:', error);
      toast.error('Faucet is currently unavailable');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleRequestTokens = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Show captcha first
    setShowCaptcha(true);
  };

  const handleCaptchaVerify = async (captchaToken: string) => {
    setShowCaptcha(false);
    
    if (!address) {
      toast.error('Wallet address not found');
      return;
    }
    
    setIsRequesting(true);
    setFaucetStatus('idle');

    try {
      console.log('[FaucetCard] Requesting tokens for address:', address);
      
      await requestFaucetTokens(address, captchaToken);
      
      console.log('[FaucetCard] Token request successful');
      setFaucetStatus('success');
      toast.success('DUST tokens requested successfully! They should arrive shortly.');
      
    } catch (error) {
      console.error('[FaucetCard] Failed to request tokens:', error);
      setFaucetStatus('error');
      toast.error('Failed to request tokens. Please try again later.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCaptchaClose = () => {
    setShowCaptcha(false);
  };

  const getButtonText = () => {
    if (isRequesting) return 'Requesting...';
    if (faucetStatus === 'success') return 'Tokens Requested!';
    if (faucetStatus === 'error') return 'Request Failed';
    return 'Request DUST Tokens';
  };

  const getButtonIcon = () => {
    if (isRequesting) return <Loader2 className="h-5 w-5 mr-2 animate-spin" />;
    if (faucetStatus === 'success') return <CheckCircle className="h-5 w-5 mr-2 text-green-500" />;
    if (faucetStatus === 'error') return <AlertCircle className="h-5 w-5 mr-2 text-red-500" />;
    return <Coins className="h-5 w-5 mr-2" />;
  };

  const getButtonVariant = () => {
    if (faucetStatus === 'success') return 'outline';
    if (faucetStatus === 'error') return 'destructive';
    return 'default';
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Faucet</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCheckHealth}
              disabled={isCheckingHealth}
              className="text-xs"
            >
              {isCheckingHealth ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Check Health'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Coins className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Get Test DUST Tokens</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Request DUST tokens to test the Midnight network. These tokens are free and can be used for testing transactions.
              </p>
            </div>

            {!isConnected ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Wallet Required</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please connect your wallet to request test tokens.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Wallet Connected</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Ready to request tokens for: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white font-medium py-6 rounded-xl disabled:opacity-50"
            disabled={!isConnected || isRequesting}
            onClick={handleRequestTokens}
            variant={getButtonVariant()}
          >
            {getButtonIcon()}
            {getButtonText()}
          </Button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Tokens will be sent to your connected wallet address</p>
            <p className="mt-1">This is a testnet faucet - tokens have no real value</p>
          </div>
        </CardFooter>
      </Card>

      <SimpleCaptcha
        isOpen={showCaptcha}
        onClose={handleCaptchaClose}
        onVerify={handleCaptchaVerify}
      />
    </>
  );
} 