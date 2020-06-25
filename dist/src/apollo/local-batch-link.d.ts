import { ApolloLink, FetchResult, Observable, Operation } from 'apollo-link';
import { LocalBatchLinkOptions } from './types';
export declare class LocalBatchLink extends ApolloLink {
    off: any;
    on: any;
    schema: any;
    private batcher;
    constructor(options: LocalBatchLinkOptions);
    request(operation: Operation): Observable<FetchResult> | null;
}
