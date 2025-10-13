import { type MidnightWalletState, WalletContext } from '@/lib/wallet-context';
import { useContext } from 'react';

/**
 * Retrieves the currently in-scope wallet provider.
 *
 * @returns The currently in-scope wallet context implementation.
 */
export const useWallet = (): MidnightWalletState => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('A <WalletProvider /> is required.');
  }

  return context;
};
