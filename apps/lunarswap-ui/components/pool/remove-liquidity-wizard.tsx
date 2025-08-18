'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Settings, X, Minus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SelectPositionStep } from './steps/select-position-step';
import { SetWithdrawalStep } from './steps/set-withdrawal-step';

type Step = 'select-position' | 'set-withdrawal';

interface PositionData {
  pairId: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Type: Uint8Array;
  token1Type: Uint8Array;
  fee: number;
  version: string;
  lpTokenType: Uint8Array;
}

interface CompletePositionData {
  pairId: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Type: Uint8Array;
  token1Type: Uint8Array;
  fee: number;
  version: string;
  lpTokenType: Uint8Array;
}

interface RemoveLiquidityWizardProps {
  onClose?: () => void;
}

export function RemoveLiquidityWizard({ onClose }: RemoveLiquidityWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-position');
  const [positionData, setPositionData] = useState<PositionData | null>(null);

  const handlePositionSubmit = (data: CompletePositionData) => {
    setPositionData(data);
    setCurrentStep('set-withdrawal');
  };

  const handleReset = () => {
    setPositionData(null);
    setCurrentStep('select-position');
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
                onClick={() => setCurrentStep('select-position')}
                type="button"
                className={`w-full text-left ${currentStep === 'select-position' ? '' : 'opacity-60 hover:opacity-80'}`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                      currentStep === 'select-position'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    1
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Step 1</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Select position to remove from
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <button
                onClick={() =>
                  positionData && setCurrentStep('set-withdrawal')
                }
                disabled={!positionData}
                type="button"
                className={`w-full text-left ${
                  currentStep === 'set-withdrawal'
                    ? ''
                    : positionData
                      ? 'opacity-60 hover:opacity-80'
                      : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                      currentStep === 'set-withdrawal'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Step 2</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Set withdrawal amounts
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
            <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="w-5 h-5 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                  Privacy-First Liquidity Removal
                </p>
                <p className="text-red-800 dark:text-red-200">
                  When removing liquidity, the system assumes you have sufficient balance to generate 
                  the required zero-knowledge proofs. Your actual balances remain private.
                </p>
              </div>
            </div>
          </div>

          {currentStep === 'select-position' && (
            <SelectPositionStep
              onSubmit={handlePositionSubmit}
              initialData={positionData}
            />
          )}
          {currentStep === 'set-withdrawal' && positionData && (
            <SetWithdrawalStep positionData={positionData} />
          )}
          {currentStep === 'set-withdrawal' && !positionData && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Please select a position before proceeding to withdrawal step.
              </p>
              <Button
                onClick={() => setCurrentStep('select-position')}
                variant="outline"
              >
                Back to Position Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 