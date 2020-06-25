import { JsonRequestOptions } from '../request/types';
import { AddMsgInput, CalendarItemInput, ClientInfoInput, CounterAppointmentInput, CreateContactInput, CreateIdentityInput, CreateMountpointInput, CreateTagInput, DeleteAppointmentInput, DeleteIdentityInput, EnableTwoFactorAuthInput, ExternalAccountAddInput, ExternalAccountImportInput, ExternalAccountTestInput, FilterInput, FolderActionChangeColorInput, FolderActionCheckCalendarInput, ForwardAppointmentInput, ForwardAppointmentInviteInput, GetRightsInput, GrantRightsInput, InviteReplyInput, ModifyContactInput, ModifyIdentityInput, PreferencesInput, RevokeRightsInput, SearchFolderInput, SendMessageInput, ShareNotificationInput, SignatureInput, WhiteBlackListInput, ZimletPreferenceInput } from '../schema/generated-schema-types';
import { ActionOptions, ActionType, ApplyFilterRulesOptions, AppointmentOptions, AutoCompleteGALOptions, AutoCompleteOptions, ChangePasswordOptions, CreateFolderOptions, CreateSearchFolderOptions, ExternalAccountDeleteInput, ExternalAccountModifyInput, FreeBusyOptions, GetContactFrequencyOptions, GetContactOptions, GetConversationOptions, GetCustomMetadataOptions, GetFolderOptions, GetMailboxMetadataOptions, GetMessageOptions, GetSMimePublicCertsOptions, LoginOptions, ModifyProfileImageOptions, RecoverAccountOptions, RelatedContactsOptions, ResetPasswordOptions, SaveDocumentInput, SearchOptions, SetRecoveryAccountOptions, ShareInfoOptions, WorkingHoursOptions, ZimbraClientOptions } from './types';
export declare class ZimbraBatchClient {
    notificationsEmitter: any;
    notificationsEvents: any;
    origin: string;
    sessionId: any;
    soapPathname: string;
    private batchDataLoader;
    private csrfToken?;
    private dataLoader;
    private jwtToken?;
    private sessionHandler?;
    private userAgent?;
    constructor(options?: ZimbraClientOptions);
    accountInfo: () => Promise<any>;
    action: (type: ActionType, options: ActionOptions) => Promise<boolean>;
    addExternalAccount: ({ accountType, ...accountInfo }: ExternalAccountAddInput) => Promise<any>;
    addMessage: (options: AddMsgInput) => Promise<any>;
    applyFilterRules: ({ ids, filterRules }: ApplyFilterRulesOptions) => Promise<any>;
    autoComplete: (options: AutoCompleteOptions) => Promise<any>;
    autoCompleteGAL: (options: AutoCompleteGALOptions) => Promise<any>;
    cancelTask: ({ inviteId }: any) => Promise<boolean>;
    changeFolderColor: ({ id, color }: FolderActionChangeColorInput) => Promise<boolean>;
    changePassword: ({ loginNewPassword, password, username }: ChangePasswordOptions) => Promise<any>;
    checkCalendar: ({ id, value }: FolderActionCheckCalendarInput) => Promise<boolean>;
    clientInfo: ({ domain }: ClientInfoInput) => Promise<any>;
    contactAction: (options: ActionOptions) => Promise<boolean>;
    conversationAction: (options: ActionOptions) => Promise<boolean>;
    counterAppointment: (body: CounterAppointmentInput) => Promise<boolean>;
    createAppointment: (accountName: string, appointment: CalendarItemInput) => Promise<boolean>;
    createAppointmentException: (accountName: string, appointment: CalendarItemInput) => Promise<boolean>;
    createAppSpecificPassword: (appName: string) => Promise<any>;
    createContact: (data: CreateContactInput) => Promise<any>;
    createFolder: (_options: CreateFolderOptions) => Promise<any>;
    createIdentity: ({ attrs, ...rest }: CreateIdentityInput) => Promise<{}>;
    createMountpoint: (_options: CreateMountpointInput) => Promise<boolean>;
    createSearchFolder: (_options: CreateSearchFolderOptions) => Promise<any>;
    createSignature: (options: SignatureInput) => Promise<any>;
    createTag: (tag: CreateTagInput) => Promise<any>;
    createTask: (task: CalendarItemInput) => Promise<boolean>;
    declineCounterAppointment: (body: CounterAppointmentInput) => Promise<boolean>;
    deleteAppointment: (appointment: DeleteAppointmentInput) => Promise<boolean>;
    deleteExternalAccount: ({ id }: ExternalAccountDeleteInput) => Promise<boolean>;
    deleteIdentity: (identity: DeleteIdentityInput) => Promise<boolean>;
    deleteSignature: (options: SignatureInput) => Promise<boolean>;
    disableTwoFactorAuth: () => Promise<boolean>;
    discoverRights: () => Promise<any>;
    dismissCalendarItem: (appointment: any, task: any) => Promise<boolean>;
    downloadAttachment: ({ id, part }: any) => Promise<{
        id: string;
        content: any;
    }>;
    downloadMessage: ({ id, isSecure }: any) => Promise<{
        id: any;
        content: any;
    }>;
    enableTwoFactorAuth: ({ name, password, authToken, twoFactorCode, csrfTokenSecured }: EnableTwoFactorAuthInput) => Promise<any>;
    folderAction: (options: ActionOptions) => Promise<boolean>;
    forwardAppointment: (body: ForwardAppointmentInput) => Promise<boolean>;
    forwardAppointmentInvite: (body: ForwardAppointmentInviteInput) => Promise<boolean>;
    freeBusy: ({ start, end, names }: FreeBusyOptions) => Promise<any>;
    generateScratchCodes: (username: String) => Promise<any>;
    getAppointment: (options: AppointmentOptions) => Promise<any>;
    getAppSpecificPasswords: () => Promise<any>;
    getAttachmentUrl: (attachment: any) => string;
    getAvailableLocales: () => Promise<any>;
    getContact: ({ id, ids, ...rest }: GetContactOptions) => Promise<any>;
    getContactFrequency: (options: GetContactFrequencyOptions) => Promise<any>;
    getContactProfileImageUrl: (attachment: any) => string;
    getConversation: (options: GetConversationOptions) => Promise<any>;
    getCustomMetadata: ({ id, section }: GetCustomMetadataOptions) => Promise<{}>;
    getDataSources: () => Promise<{}>;
    getFilterRules: () => Promise<any>;
    getFolder: (options: GetFolderOptions) => Promise<any>;
    getIdentities: () => Promise<{}>;
    getMailboxMetadata: ({ section }: GetMailboxMetadataOptions) => Promise<{}>;
    getMessage: ({ id, html, raw, header, read, max, ridZ }: GetMessageOptions) => Promise<{
        [key: string]: any;
    } | null>;
    getMessagesMetadata: ({ ids }: GetMessageOptions) => Promise<any>;
    getPreferences: () => Promise<any>;
    getProfileImageUrl: (profileImageId: any) => string;
    getRights: (options: GetRightsInput) => Promise<any>;
    getScratchCodes: (username: String) => Promise<any>;
    getSearchFolder: () => Promise<{
        folders: any;
    } | {
        folders?: undefined;
    }>;
    getSignatures: () => Promise<{}>;
    getSMimePublicCerts: (options: GetSMimePublicCertsOptions) => Promise<any>;
    getTag: () => Promise<any>;
    getTasks: (options: SearchOptions) => Promise<any>;
    getTrustedDevices: () => Promise<any>;
    getWhiteBlackList: () => Promise<any>;
    getWorkingHours: ({ start, end, names }: WorkingHoursOptions) => Promise<any>;
    grantRights: (body: GrantRightsInput) => Promise<any>;
    importExternalAccount: ({ accountType, id }: ExternalAccountImportInput) => Promise<boolean>;
    itemAction: (options: ActionOptions) => Promise<boolean>;
    jsonRequest: (options: JsonRequestOptions) => Promise<any>;
    login: ({ username, password, recoveryCode, tokenType, persistAuthTokenCookie, twoFactorCode, deviceTrusted, csrfTokenSecured }: LoginOptions) => Promise<{}>;
    logout: () => Promise<boolean>;
    messageAction: (options: ActionOptions) => Promise<boolean>;
    modifyAppointment: (accountName: string, appointment: CalendarItemInput) => Promise<any>;
    modifyContact: (data: ModifyContactInput) => Promise<any>;
    modifyExternalAccount: ({ id, type: accountType, attrs }: ExternalAccountModifyInput) => Promise<boolean>;
    modifyFilterRules: (filters: FilterInput[]) => Promise<boolean>;
    modifyIdentity: ({ attrs, ...rest }: ModifyIdentityInput) => Promise<any>;
    modifyPrefs: (prefs: PreferencesInput) => Promise<boolean>;
    modifyProfileImage: ({ content, contentType }: ModifyProfileImageOptions) => Promise<any>;
    modifyProps: (props: any) => Promise<boolean>;
    modifySearchFolder: (options: SearchFolderInput) => Promise<boolean>;
    modifySignature: (options: SignatureInput) => Promise<boolean>;
    modifyTask: (task: CalendarItemInput) => Promise<boolean>;
    modifyWhiteBlackList: (whiteBlackList: WhiteBlackListInput) => Promise<boolean>;
    modifyZimletPrefs: (zimlet: ZimletPreferenceInput[]) => Promise<any>;
    noop: () => Promise<boolean>;
    recoverAccount: ({ channel, email, op }: RecoverAccountOptions) => Promise<any>;
    relatedContacts: ({ email }: RelatedContactsOptions) => Promise<any>;
    resetPassword: ({ password }: ResetPasswordOptions) => Promise<boolean>;
    resolve: (path: string) => string;
    revokeAppSpecificPassword: (appName: string) => Promise<boolean>;
    revokeOtherTrustedDevices: () => Promise<boolean>;
    revokeRights: (body: RevokeRightsInput) => Promise<any>;
    revokeTrustedDevice: () => Promise<boolean>;
    saveDocument: (document: SaveDocumentInput) => Promise<boolean>;
    saveDraft: (options: SendMessageInput) => Promise<{
        message: any;
    }>;
    search: (options: SearchOptions) => Promise<any>;
    searchGal: (options: SearchOptions) => Promise<any>;
    sendDeliveryReport: (messageId: string) => Promise<boolean>;
    sendInviteReply: (requestOptions: InviteReplyInput) => Promise<any>;
    sendMessage: (body: SendMessageInput) => Promise<any>;
    sendShareNotification: (body: ShareNotificationInput) => Promise<boolean>;
    setCsrfToken: (csrfToken: string) => void;
    setCustomMetadata: (variables: any) => Promise<boolean>;
    setJwtToken: (jwtToken: string) => void;
    setRecoveryAccount: (options: SetRecoveryAccountOptions) => Promise<boolean>;
    setUserAgent: (userAgent: Object) => void;
    shareInfo: (options: ShareInfoOptions) => Promise<any>;
    snoozeCalendarItem: (appointment: any, task: any) => Promise<boolean>;
    taskFolders: () => Promise<any>;
    testExternalAccount: ({ accountType, ...accountInfo }: ExternalAccountTestInput) => Promise<{}>;
    uploadMessage: (message: string) => any;
    private batchDataHandler;
    private checkAndUpdateSessionId;
    private dataHandler;
    private download;
    private getAdditionalRequestOptions;
    private normalizeMessage;
}