'use client';
import { useMemo, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { PublicDataProviderWrapper } from '@/providers/public';
import type { Logger } from 'pino';
import type { PublicDataProvider } from '@midnight-ntwrk/midnight-js-types';

interface PublicDataProviderComponentProps {
  config: { INDEXER_URI: string; INDEXER_WS_URI: string };
  providerCallback: (...args: unknown[]) => void;
  log: Logger;
  children: ReactNode;
}

const PublicDataProviderComponent: React.FC<PublicDataProviderComponentProps> = ({ config, providerCallback, log, children }) => {
  const [indexerProvider, setIndexerProvider] = useState<unknown>(null);

  useEffect(() => {
    import('@midnight-ntwrk/midnight-js-indexer-public-data-provider').then((mod) => {
      setIndexerProvider(mod.indexerPublicDataProvider);
    });
  }, []);

  const publicDataProvider = useMemo(() => {
    if (typeof indexerProvider !== 'function' || typeof window === 'undefined') return null;
    return new PublicDataProviderWrapper(
      (indexerProvider as (queryURL: string, subscriptionURL: string, webSocketImpl?: typeof WebSocket) => PublicDataProvider)(
        config.INDEXER_URI,
        config.INDEXER_WS_URI,
        WebSocket // Pass native WebSocket
      ),
      providerCallback,
      log
    );
  }, [indexerProvider, config, log, providerCallback]);

  if (!publicDataProvider) return <div>Loading indexer provider...</div>;

  return <>{children}</>;
};

const DynamicPublicDataProvider = dynamic(() => Promise.resolve(PublicDataProviderComponent), {
  ssr: false,
});

interface IndexerContextProps {
  config: { INDEXER_URI: string; INDEXER_WS_URI: string };
  providerCallback: (...args: unknown[]) => void;
  log: Logger;
  children: ReactNode;
}

const IndexerContext: React.FC<IndexerContextProps> = ({ config, providerCallback, log, children }) => {
  return (
    <DynamicPublicDataProvider config={config} providerCallback={providerCallback} log={log}>
      {children}
    </DynamicPublicDataProvider>
  );
};

export default IndexerContext;