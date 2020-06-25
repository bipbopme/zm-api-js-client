import { BatchRequestOptions, BatchRequestResponse, JsonRequestOptions, RequestResponse } from './types';
export declare const DEFAULT_HOSTNAME = "/@zimbra";
export declare const DEFAULT_SOAP_PATHNAME = "/service/soap";
export declare function batchJsonRequest(options: BatchRequestOptions): Promise<BatchRequestResponse>;
export declare function jsonRequest(requestOptions: JsonRequestOptions): Promise<RequestResponse>;
