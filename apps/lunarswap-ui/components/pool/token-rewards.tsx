import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { useNavigate } from 'react-router-dom';

export function TokenRewards() {
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  const handleFindPoolsClick = () => {
    navigate('/explore', { state: { selectedOption: 'pools' } });
  };

  // Don't show anything if wallet is not connected
  if (!isConnected) {
    return null;
  }

  // Connected wallet - show disabled view
  return (
    <Card className="bg-transparent border border-gray-200/50 dark:border-blue-900/30 rounded-xl overflow-hidden opacity-60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl font-bold">0 LUNAR</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <span>Rewards earned</span>
              <div className="relative inline-flex group">
                <HelpCircle className="h-4 w-4 ml-1" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48">
                  Currently reading balance from connected wallet is not
                  supported yet
                </div>
              </div>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            disabled
          >
            Collect rewards
          </Button>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            type="button"
            onClick={handleFindPoolsClick}
            className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
            disabled
          >
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <span className="font-medium">
                  Find pools with LUNAR rewards
                </span>
                <svg
                  role="img"
                  aria-labelledby="find-rewards-arrow-title"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title id="find-rewards-arrow-title">Right arrow</title>
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Currently reading balance from connected wallet is not supported
              yet
            </p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
