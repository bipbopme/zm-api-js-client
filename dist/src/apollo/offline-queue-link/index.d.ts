import { ApolloLink, NextLink, Observable, Operation } from 'apollo-link';
import { OfflineQueueLinkOptions, OperationEntry, StorageProvider } from './types';
export declare class OfflineQueueLink extends ApolloLink {
    isOpen: boolean;
    storage: StorageProvider;
    private namedQueues;
    private operationQueue;
    private storeKey;
    constructor({ storage, storeKey, isOpen }: OfflineQueueLinkOptions);
    cancelNamedQueue: (offlineQueueName: string) => void;
    close: () => void;
    dequeue: (entry: OperationEntry) => void;
    enqueue: (entry: OperationEntry) => void;
    getSize: () => Promise<any>;
    open: ({ apolloClient }?: {
        apolloClient?: any;
    }) => Promise<unknown> | undefined;
    persist: () => Promise<any>;
    purge: () => Promise<any>;
    request(operation: Operation, forward?: NextLink): Observable<unknown>;
    retry: () => Promise<unknown>;
    sync: ({ apolloClient }: {
        apolloClient?: any;
    }) => Promise<void | undefined> | undefined;
}
