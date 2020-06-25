import { ErrorLink } from 'apollo-link-error';
declare class ZimbraErrorLink extends ErrorLink {
    handlers: any[];
    constructor();
    executeHandlers: (data: object) => void;
    registerHandler: (handler: any) => void;
    unRegisterAllHandlers: () => void;
    unRegisterHandler: (handler: any) => void;
}
export { ZimbraErrorLink };
