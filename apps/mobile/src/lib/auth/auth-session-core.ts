import { ApiError } from "../api/api-error";

import type {
    AuthProfile,
    AuthUser,
    LoginCredentials,
    LoginResponse,
    UpdateMyProfileInput,
    UpdateMyProfileResponse,
} from "./auth-api";

import type { AuthTokens } from "./token-storage";

export interface AuthSessionDependencies {
    loginWithEmail: (
        credentials: LoginCredentials,
    ) => Promise<LoginResponse>;

    saveAuthTokens: (
        tokens: AuthTokens,
    ) => Promise<void>;

    logoutAuthSession: (
        refreshToken: string,
    ) => Promise<unknown>;

    getAuthTokens: () => Promise<AuthTokens | null>;

    clearAuthTokens: () => Promise<void>;

    refreshAuthSession: (
        refreshToken: string,
    ) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;

    getMyProfile: (
        accessToken: string,
    ) => Promise<AuthProfile>;

    updateMyProfile: (
        accessToken: string,
        input: UpdateMyProfileInput,
    ) => Promise<UpdateMyProfileResponse>;
}

function isUnauthenticatedError(
    error: unknown,
): error is ApiError {
    return (
        error instanceof ApiError &&
        error.status === 401 &&
        error.code === "UNAUTHENTICATED"
    );
}

export function createAuthSessionService(
    dependencies: AuthSessionDependencies,
) {
    return {
        async loginAndPersistSession(
            credentials: LoginCredentials,
        ): Promise<AuthUser> {
            const response =
                await dependencies.loginWithEmail(credentials);

            try {
                await dependencies.saveAuthTokens({
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
            } catch (storageError: unknown) {
                try {
                    await dependencies.logoutAuthSession(
                        response.refreshToken,
                    );
                } catch {
                    // Preserve the original storage error.
                }

                throw storageError;
            }

            return response.user;
        },

        async restoreSession(): Promise<AuthProfile | null> {
            const tokens = await dependencies.getAuthTokens();

            if (!tokens) {
                return null;
            }

            try {
                return await dependencies.getMyProfile(
                    tokens.accessToken,
                );
            } catch (profileError: unknown) {
                if (!isUnauthenticatedError(profileError)) {
                    throw profileError;
                }
            }

            let refreshedTokens: {
                accessToken: string;
                refreshToken: string;
            };

            try {
                refreshedTokens =
                    await dependencies.refreshAuthSession(
                        tokens.refreshToken,
                    );
            } catch (refreshError: unknown) {
                if (isUnauthenticatedError(refreshError)) {
                    await dependencies.clearAuthTokens();
                    return null;
                }

                // Network and server errors must not erase credentials.
                throw refreshError;
            }

            await dependencies.saveAuthTokens({
                accessToken: refreshedTokens.accessToken,
                refreshToken: refreshedTokens.refreshToken,
            });

            try {
                return await dependencies.getMyProfile(
                    refreshedTokens.accessToken,
                );
            } catch (profileError: unknown) {
                if (!isUnauthenticatedError(profileError)) {
                    throw profileError;
                }

                await dependencies.clearAuthTokens();
                return null;
            }
        },

        async updateMyProfile(
            input: UpdateMyProfileInput,
        ): Promise<UpdateMyProfileResponse> {
            const tokens = await dependencies.getAuthTokens();

            if (!tokens) {
                throw new Error(
                    "Your session has expired. Please sign in again.",
                );
            }

            try {
                return await dependencies.updateMyProfile(
                    tokens.accessToken,
                    input,
                );
            } catch (profileError: unknown) {
                if (!isUnauthenticatedError(profileError)) {
                    throw profileError;
                }
            }

            let refreshedTokens: {
                accessToken: string;
                refreshToken: string;
            };

            try {
                refreshedTokens =
                    await dependencies.refreshAuthSession(
                        tokens.refreshToken,
                    );
            } catch (refreshError: unknown) {
                if (isUnauthenticatedError(refreshError)) {
                    await dependencies.clearAuthTokens();

                    throw new Error(
                        "Your session has expired. Please sign in again.",
                    );
                }

                throw refreshError;
            }

            await dependencies.saveAuthTokens({
                accessToken: refreshedTokens.accessToken,
                refreshToken: refreshedTokens.refreshToken,
            });

            try {
                return await dependencies.updateMyProfile(
                    refreshedTokens.accessToken,
                    input,
                );
            } catch (profileError: unknown) {
                if (isUnauthenticatedError(profileError)) {
                    await dependencies.clearAuthTokens();

                    throw new Error(
                        "Your session has expired. Please sign in again.",
                    );
                }

                throw profileError;
            }
        },
    };
}
