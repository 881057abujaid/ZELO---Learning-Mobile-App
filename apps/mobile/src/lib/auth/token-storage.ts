import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "zelo.auth.access-token";
const REFRESH_TOKEN_KEY = "zelo.auth.refresh-token";

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

/**
 * Securely stores the access and refresh tokens.
 * If storage fails, attempts to remove partially stored credentials.
 */
export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
    if (
        !tokens.accessToken.trim() ||
        !tokens.refreshToken.trim()
    ) {
        throw new Error("Valid authentication tokens are required.");
    }

    try {
        await SecureStore.setItemAsync(
            ACCESS_TOKEN_KEY,
            tokens.accessToken,
        );

        await SecureStore.setItemAsync(
            REFRESH_TOKEN_KEY,
            tokens.refreshToken,
        );
    } catch {
        await Promise.allSettled([
            SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
            SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        ]);

        throw new Error(
            "Unable to securely store authentication tokens.",
        );
    }
}

/**
 * Returns the stored tokens, or null when the session is incomplete.
 */
export async function getAuthTokens(): Promise<AuthTokens | null> {
    let accessToken: string | null;
    let refreshToken: string | null;

    try {
        [accessToken, refreshToken] = await Promise.all([
            SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
            SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        ]);
    } catch {
        throw new Error(
            "Unable to retrieve authentication tokens securely.",
        );
    }

    if (!accessToken || !refreshToken) {
        return null;
    }

    return {
        accessToken,
        refreshToken,
    };
}

/**
 * Removes both authentication tokens from secure storage.
 */
export async function clearAuthTokens(): Promise<void> {
    try {
        await Promise.all([
            SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
            SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        ]);
    } catch {
        throw new Error(
            "Unable to clear authentication tokens securely.",
        );
    }
}
