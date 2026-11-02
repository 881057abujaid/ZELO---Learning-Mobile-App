import type {
    AuthUser,
    LoginCredentials,
    LoginResponse,
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
    };
}
