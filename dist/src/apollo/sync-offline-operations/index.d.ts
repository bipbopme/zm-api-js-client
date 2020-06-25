import { OfflineOperationEntry, StorageProvider } from '../offline-queue-link/types';
import { SyncOfflineOperationsOptions } from './types';
export declare class SyncOfflineOperations {
    apolloClient: any;
    storage: StorageProvider;
    private offlineData;
    private storeKey;
    constructor({ apolloClient, storage, storeKey }: SyncOfflineOperationsOptions);
    addOfflineData: (queue?: OfflineOperationEntry[]) => void;
    clearOfflineData: () => Promise<any>;
    getOfflineData: () => Promise<any>;
    hasOfflineData: () => boolean;
    init: () => Promise<any>;
    sync: () => Promise<void> | undefined;
}
