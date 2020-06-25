import { AccountType, Cursor, ExternalAccountModifyAttrsInput, FolderView, Grantee, Owner, SearchType, SortBy, UploadDocument } from '../schema/generated-schema-types';
export declare enum GalSearchType {
    all = "all",
    account = "account",
    resource = "resource",
    group = "group"
}
export interface AutoCompleteOptions {
    folders?: string;
    includeGal?: boolean;
    name: string;
    needExp?: boolean;
    type?: GalSearchType;
}
export declare enum NeedIsMemberType {
    all = "all",
    directOnly = "directOnly",
    none = "none"
}
export interface AutoCompleteGALOptions {
    limit?: number;
    name: string;
    needExp?: boolean;
    type?: GalSearchType;
}
export interface Notification {
    created?: any;
    deleted?: any;
    modified?: any;
    seq?: number;
}
export declare type NotificationHandler = (notificaton: Notification) => void;
export declare type UserAgent = {
    name: string;
    version: string;
};
export declare type writeSessionId = (sessionId: string) => void;
export declare type readSessionId = () => string;
export declare type SessionHandler = {
    readSessionId: readSessionId;
    writeSessionId: writeSessionId;
};
export interface ZimbraClientOptions {
    csrfToken?: string;
    jwtToken?: string;
    localStoreClient?: any;
    notificationHandler?: NotificationHandler;
    sessionHandler?: SessionHandler;
    soapPathname?: string;
    userAgent?: UserAgent;
    zimbraOrigin?: string;
}
export interface FreeBusyOptions {
    end: number;
    names: Array<string>;
    start: number;
}
export interface WorkingHoursOptions {
    end: number;
    names: Array<string>;
    start: number;
}
export interface GetContactOptions {
    derefGroupMember: boolean;
    id: string;
    ids: Array<string>;
    memberOf: boolean;
}
export interface GetContactFrequencyOptions {
    by: string;
    email: string;
    offsetInMinutes: string;
    spec: Array<ContactFrequencySpec>;
}
export interface ContactFrequencySpec {
    interval: string;
    range: string;
}
export interface GetFolderOptions {
    depth?: number;
    folder?: {
        l?: string;
        path?: string;
        uuid?: string;
    };
    needGranteeName?: boolean;
    traverseMountpoints?: boolean;
    view?: FolderView;
    visible?: boolean;
}
export interface GetCustomMetadataOptions {
    id: string;
    section: string;
}
export interface GetMailboxMetadataOptions {
    section: string;
}
export interface MailItemHeader {
    n: string;
}
export interface GetMailItemOptions {
    header?: Array<MailItemHeader>;
    html?: boolean;
    id: string;
    ids: [String];
    max?: number;
    needExp?: boolean;
}
export interface GetMessageOptions extends GetMailItemOptions {
    neuter?: boolean;
    part?: string;
    raw?: boolean;
    read?: boolean;
    ridZ?: string;
}
export interface GetConversationOptions extends GetMailItemOptions {
    fetch?: string;
}
export interface RelatedContactsOptions {
    email: string;
}
export interface AppointmentOptions {
    id?: string;
}
export interface SaveDocumentInput {
    ct: string;
    descEnabled: Boolean;
    id: string;
    l: string;
    name: string;
    upload: UploadDocument;
    ver: Number;
}
export interface SearchOptions {
    calExpandInstEnd?: Number;
    calExpandInstStart?: Number;
    cursor?: Cursor;
    fetch?: string;
    fullConversation?: boolean;
    limit?: number;
    needExp?: boolean;
    needIsMember?: NeedIsMemberType;
    needIsOwner?: boolean;
    offset?: number;
    query?: string;
    recip?: number;
    sortBy?: SortBy;
    type?: GalSearchType;
    types?: SearchType;
}
export interface ShareInfoOptions {
    grantee?: Grantee;
    includeSelf?: Boolean;
    internal?: Boolean;
    owner?: Owner;
}
export interface ChangePasswordOptions {
    loginNewPassword: string;
    password: string;
    username: string;
}
export interface ModifyProfileImageOptions {
    content: string;
    contentType: string;
}
export interface LoginOptions {
    csrfTokenSecured: boolean;
    deviceTrusted?: boolean;
    password: string;
    persistAuthTokenCookie?: boolean;
    recoveryCode?: string;
    tokenType?: string;
    twoFactorCode?: string;
    username: string;
}
export interface ActionOptions {
    color?: number;
    constraints?: string;
    flags?: string;
    folderId?: string;
    id?: string;
    ids?: Array<string>;
    name?: string;
    op: string;
    rgb?: string;
    tagNames?: string;
}
export declare enum ActionType {
    contact = "ContactAction",
    conversation = "ConvAction",
    distributionList = "DistributionList",
    folder = "FolderAction",
    item = "ItemAction",
    message = "MsgAction",
    tag = "TagAction"
}
export declare enum ActionResultType {
    ConvAction = "Conversation",
    MsgAction = "MessageInfo"
}
export interface CreateFolderOptions {
    color?: number;
    fetchIfExists?: boolean;
    flags?: string;
    name: string;
    parentFolderId?: string;
    url?: string;
    view?: string;
}
export interface CreateSearchFolderOptions {
    name: string;
    parentFolderId?: string;
    query: string;
    view?: string;
}
export interface GetSMimePublicCertsOptions {
    contactAddr: string;
    store: string;
}
export declare enum SetRecoveryAccountOpType {
    send = "sendCode",
    validate = "validateCode",
    resend = "resendCode",
    reset = "reset"
}
export declare enum SetRecoveryAccountChannelType {
    email = "email"
}
export interface SetRecoveryAccountOptions {
    channel: SetRecoveryAccountChannelType;
    op: SetRecoveryAccountOpType;
    recoveryAccount?: string;
    recoveryAccountVerificationCode?: string;
}
export declare enum RecoverAccountOpType {
    get = "getRecoveryAccount",
    send = "sendRecoveryCode"
}
export interface RecoverAccountOptions {
    channel: SetRecoveryAccountChannelType;
    email: string;
    op: RecoverAccountOpType;
}
export interface ResetPasswordOptions {
    password: string;
}
export interface ExternalAccountModifyInput {
    attrs: ExternalAccountModifyAttrsInput;
    id: string;
    type?: AccountType;
}
export interface ExternalAccountDeleteInput {
    id: string;
}
export interface FilterRule {
    name: string;
}
export interface ApplyFilterRulesOptions {
    filterRules: Array<FilterRule>;
    ids: string;
}
