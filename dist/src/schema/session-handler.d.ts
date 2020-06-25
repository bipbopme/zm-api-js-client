import { ZimbraSessionOptions } from './types';
export declare class SessionHandler {
    private cache;
    private cacheKeyForSession;
    constructor(options: ZimbraSessionOptions);
    readSessionId: () => any;
    writeSessionId: (sessionId: string) => void;
}
