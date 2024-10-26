import { fromBase64, toBase64 } from "src/shared/helpers/base64";

export const VERY_WEAK_AUTH_TOKEN_PREFIX = "VeryWeakAuth ";

export function encodeVeryWeakAuthToken(email: string, id: number) {
    const tokenData = {
        email,
        id
    };
    const strTokenData = JSON.stringify(tokenData);

    return toBase64(strTokenData);
}

export function decodeVeryWeakAuthToken(encodedToken: string) {
    return JSON.parse(fromBase64(encodedToken));
}

export function decodeVeryWeakAuthHeader(authHeader: string) {
    return decodeVeryWeakAuthToken(authHeader.replace(VERY_WEAK_AUTH_TOKEN_PREFIX, ''));
}
