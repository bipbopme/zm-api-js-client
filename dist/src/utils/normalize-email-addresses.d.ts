export declare function parseAddress(address: string): {
    address: string;
    name: string;
} | {
    address: string;
    name?: undefined;
};
export declare function normalizeEmailAddresses(message: {
    [key: string]: any;
}): {
    [key: string]: any;
};
