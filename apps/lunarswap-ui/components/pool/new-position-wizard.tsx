'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Settings, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SelectPairStep } from './steps/select-pair-step';
import { SetDepositStep } from './steps/set-deposit-step';
import { popularTokens, getAvailableTokensForSelection } from '@/lib/token-config';

type Step = 'select-pair' | 'set-deposit';

interface TokenData {
  symbol: string;
  name: string;
  type: string;
  address: string;
}

interface PairSelectionData {
  tokenA: TokenData | null;
  tokenB: TokenData | null;
  fee: number;
  version: string;
}

interface CompletePairData {
  tokenA: TokenData;
  tokenB: TokenData;
  fee: number;
  version: string;
}

interface NewPositionWizardProps {
  onClose?: () => void;
  initialTokens?: {
    tokenA?: string;
    tokenB?: string;
    tokenAType?: string;
    tokenBType?: string;
  };
}

export function NewPositionWizard({ onClose, initialTokens }: NewPositionWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-pair');
  const [pairData, setPairData] = useState<PairSelectionData>({
    tokenA: null,
    tokenB: null,
    fee: 0.3, // Default fee tier
    version: 'v1', // Default to V1 since V2/V3 are coming soon
  });

  // Set initial tokens from navigation state
  useEffect(() => {
    if (initialTokens?.tokenA && initialTokens?.tokenB) {
      // Find token data from popular tokens
      const tokenAData = popularTokens.find(t => t.symbol === initialTokens.tokenA);
      const tokenBData = popularTokens.find(t => t.symbol === initialTokens.tokenB);
      
      if (tokenAData && tokenBData) {
        setPairData(prev => ({
          ...prev,
          tokenA: tokenAData,
          tokenB: tokenBData
        }));
      }
    }
  }, [initialTokens]);

  const handlePairSubmit = (data: CompletePairData) => {
    setPairData(data);
    setCurrentStep('set-deposit');
  };

  const handleReset = () => {
    setPairData({
      tokenA: null,
      tokenB: null,
      fee: 0.3,
      version: 'v1', // Reset to V1 since V2/V3 are coming soon
    });
    setCurrentStep('select-pair');
  };

  // Type guard to check if pair data is complete
  const isCompletePairData = (
    data: PairSelectionData,
  ): data is CompletePairData => {
    return data.tokenA !== null && data.tokenB !== null;
  };

  return (
    <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden">
      <div className="flex">
        {/* Left sidebar with steps */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-6">
          <div className="relative">
            {/* Line connecting steps */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {/* Step 1 */}
            <div className="relative mb-12">
              <button
                onClick={() => setCurrentStep('select-pair')}
                type="button"
                className={`w-full text-left ${currentStep === 'select-pair' ? '' : 'opacity-60 hover:opacity-80'}`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                      currentStep === 'select-pair'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    1
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Step 1</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Select token pair and fees
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <button
                onClick={() =>
                  isCompletePairData(pairData) && setCurrentStep('set-deposit')
                }
                disabled={!isCompletePairData(pairData)}
                type="button"
                className={`w-full text-left ${
                  currentStep === 'set-deposit'
                    ? ''
                    : isCompletePairData(pairData)
                      ? 'opacity-60 hover:opacity-80'
                      : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                      currentStep === 'set-deposit'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Step 2</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Enter deposit amounts
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1">
          {/* Privacy Notice */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Privacy-First Position Creation
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  When creating positions, the system assumes you have sufficient balance to generate 
                  the required zero-knowledge proofs. Your actual balances remain private.
                </p>
              </div>
            </div>
          </div>

          {currentStep === 'select-pair' && (
            <SelectPairStep
              onSubmit={handlePairSubmit}
              initialData={pairData}
            />
          )}
          {currentStep === 'set-deposit' && isCompletePairData(pairData) && (
            <SetDepositStep pairData={pairData} />
          )}
          {currentStep === 'set-deposit' && !isCompletePairData(pairData) && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Please select both tokens before proceeding to deposit step.
              </p>
              <Button
                onClick={() => setCurrentStep('select-pair')}
                variant="outline"
              >
                Back to Token Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
