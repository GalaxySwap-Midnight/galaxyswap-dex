import type {
  ContractAddress,
  ContractState,
} from '@midnight-ntwrk/compact-runtime';
import type {
  BlockHashConfig,
  BlockHeightConfig,
  ContractStateObservableConfig,
  FinalizedTxData,
  PublicDataProvider,
} from '@midnight-ntwrk/midnight-js-types';
import type { Logger } from 'pino';
import { retry } from '@/utils/retry';
import type { TransactionId, ZswapChainState } from '@midnight-ntwrk/ledger';
import type { Observable } from 'rxjs';

export class PublicDataProviderWrapper implements PublicDataProvider {
  constructor(
    private readonly wrapped: PublicDataProvider,
    private readonly callback: (
      action: 'watchForTxDataStarted' | 'watchForTxDataDone',
    ) => void,
    private readonly logger: Logger,
  ) {}

  queryContractState(
    contractAddress: ContractAddress,
    config?: BlockHeightConfig | BlockHashConfig,
  ): Promise<ContractState | null> {
    return retry(
      () => this.wrapped.queryContractState(contractAddress, config),
      'queryContractState',
      this.logger,
    );
  }

  queryZSwapAndContractState(
    contractAddress: ContractAddress,
    config?: BlockHeightConfig | BlockHashConfig,
  ): Promise<[ZswapChainState, ContractState] | null> {
    return retry(
      () => this.wrapped.queryZSwapAndContractState(contractAddress, config),
      'queryZSwapAndContractState',
      this.logger,
    );
  }

  queryDeployContractState(
    contractAddress: ContractAddress,
  ): Promise<ContractState | null> {
    return retry(
      () => this.wrapped.queryDeployContractState(contractAddress),
      'queryDeployContractState',
      this.logger,
    );
  }

  watchForContractState(
    contractAddress: ContractAddress,
  ): Promise<ContractState> {
    return retry(
      () => this.wrapped.watchForContractState(contractAddress),
      'watchForContractState',
      this.logger,
    );
  }

  watchForDeployTxData(
    contractAddress: ContractAddress,
  ): Promise<FinalizedTxData> {
    // Check if the wrapped provider has this method
    if (typeof (this.wrapped as any).watchForDeployTxData === 'function') {
      return retry(
        () => (this.wrapped as any).watchForDeployTxData(contractAddress),
        'watchForDeployTxData',
        this.logger,
      );
    }
    
    // Fallback: This method is not available in the current provider version
    throw new Error('watchForDeployTxData is not available in this provider version. Contract may already be deployed.');
  }

  watchForTxData(txId: TransactionId): Promise<FinalizedTxData> {
    return retry(
      () => this.wrapped.watchForTxData(txId),
      'watchForTxData',
      this.logger,
    );
  }

  contractStateObservable(
    address: ContractAddress,
    config: ContractStateObservableConfig,
  ): Observable<ContractState> {
    return this.wrapped.contractStateObservable(address, config);
  }
}
