export declare function getAttachmentUrl(attachment: {
    [key: string]: any;
}, { origin, jwtToken }: {
    jwtToken?: string;
    origin?: string;
}): string;
export declare function getContactProfileImageUrl(attachment: {
    [key: string]: any;
}, { origin, jwtToken }: {
    jwtToken?: string;
    origin?: string;
}): string;
export declare function getProfileImageUrl(profileImageId: string, { origin, jwtToken }: {
    jwtToken?: string;
    origin?: string;
}): string;
export declare function normalizeMimeParts(message: {
    [key: string]: any;
}, { origin, jwtToken }: {
    jwtToken?: string;
    origin?: string;
}): {
    [key: string]: any;
};
