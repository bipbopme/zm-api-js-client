import { Operation } from 'apollo-link';
import { OfflineOperationEntry, OperationEntry } from './types';
export declare function hasSensitiveVariables(operation: Operation): boolean;
export declare function isMutationOperation({ query }: Operation): boolean;
export declare function deriveOfflineQueue(operationQueue: Array<OperationEntry>): Array<OfflineOperationEntry>;
