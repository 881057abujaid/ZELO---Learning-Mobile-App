import { ApiError } from "../src/lib/api/api-error";
import {
    createAuthSessionService,
    type AuthSessionDependencies,
} from "../src/lib/auth/auth-session-core";

import type {
    LoginResponse,
} from "../src/lib/auth/auth-api";

import type {
    AuthTokens,
} from "../src/lib/auth/token-storage";

function assert(
    condition: unknown,
    message: string,
): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

async function expectFailure(
    action: () => Promise<unknown>,
    expectedError: unknown,
): Promise<void> {
    try {
        await action();
    } catch (error: unknown) {
        assert(
            error === expectedError,
            "The original error should be preserved.",
        );
        return;
    }

    throw new Error("Expected the operation to fail.");
}

const user = {
    id: "user-test-001",
    email: "learner@example.com",
    createdAt: "2026-01-01T00:00:00.000Z",
};

const loginResponse: LoginResponse = {
    user,
    accessToken: "test-access-token",
    refreshToken: "test-refresh-token",
    tokenType: "Bearer",
    expiresIn: 900,
};

const credentials = {
    email: user.email,
    password: "TestPassword123!",
};

function createDependencies(
    overrides: Partial<AuthSessionDependencies> = {},
): AuthSessionDependencies {
    return {
        loginWithEmail: async () => loginResponse,

        saveAuthTokens: async () => { },

        logoutAuthSession: async () => ({
            message: "Logged out",
        }),

        getAuthTokens: async () => null,

        clearAuthTokens: async () => { },

        refreshAuthSession: async (refreshToken) => ({
            accessToken: "refreshed-access-token",
            refreshToken: `rotated-${refreshToken}`,
        }),

        getMyProfile: async (accessToken) => ({
            ...user,
            profile: {
                username: "learner",
                avatarKey: null,
                bio: null,
            },
        }),

        updateMyProfile: async (_accessToken, input) => ({
            username: input.username ?? null,
            avatarKey: input.avatarKey ?? null,
            bio: input.bio ?? null,
        }),

        ...overrides,
    };
}

async function main(): Promise<void> {
    console.log("Testing ZELO authentication sessions...\n");

    // Test 1: Successful login persists tokens and returns the user.
    {
        let savedTokens: AuthTokens | undefined;

        const service = createAuthSessionService(
            createDependencies({
                saveAuthTokens: async (tokens) => {
                    savedTokens = tokens;
                },
            }),
        );

        const result =
            await service.loginAndPersistSession(credentials);

        assert(
            result.id === user.id,
            "The authenticated user should be returned.",
        );

        assert(
            result.email === user.email,
            "The returned email should match the user profile.",
        );

        assert(
            savedTokens?.accessToken === loginResponse.accessToken,
            "The access token should be saved.",
        );

        assert(
            savedTokens?.refreshToken === loginResponse.refreshToken,
            "The refresh token should be saved.",
        );

        assert(
            !("accessToken" in result),
            "The user profile must not expose tokens.",
        );

        console.log("PASS: Successful login and token persistence");
    }

    // Test 2: Login failure must not save tokens.
    {
        const loginError = new Error("Invalid credentials");
        let storageCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                loginWithEmail: async () => {
                    throw loginError;
                },
                saveAuthTokens: async () => {
                    storageCalled = true;
                },
            }),
        );

        await expectFailure(
            () => service.loginAndPersistSession(credentials),
            loginError,
        );

        assert(
            !storageCalled,
            "Tokens must not be saved after login failure.",
        );

        console.log("PASS: Login failure does not save tokens");
    }

    // Test 3: Storage failure attempts backend logout.
    {
        const storageError = new Error("Secure storage unavailable");
        let logoutCalled = false;
        let revokedToken: string | undefined;

        const service = createAuthSessionService(
            createDependencies({
                saveAuthTokens: async () => {
                    throw storageError;
                },
                logoutAuthSession: async (refreshToken) => {
                    logoutCalled = true;
                    revokedToken = refreshToken;
                    return { message: "Logged out" };
                },
            }),
        );

        await expectFailure(
            () => service.loginAndPersistSession(credentials),
            storageError,
        );

        assert(
            logoutCalled,
            "Backend logout should be attempted after storage failure.",
        );

        assert(
            revokedToken === loginResponse.refreshToken,
            "Logout must use the newly issued refresh token.",
        );

        console.log("PASS: Storage failure attempts session revocation");
    }

    // Test 4: A logout failure must not replace the storage error.
    {
        const storageError = new Error("Storage failed");
        const logoutError = new Error("Network unavailable");

        const service = createAuthSessionService(
            createDependencies({
                saveAuthTokens: async () => {
                    throw storageError;
                },
                logoutAuthSession: async () => {
                    throw logoutError;
                },
            }),
        );

        await expectFailure(
            () => service.loginAndPersistSession(credentials),
            storageError,
        );

        console.log("PASS: Storage error survives logout failure");
    }

    // Test 5: No stored tokens means there is no session.
    {
        let profileCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => null,
                getMyProfile: async () => {
                    profileCalled = true;
                    throw new Error("Profile should not be requested");
                },
            }),
        );

        const result = await service.restoreSession();

        assert(
            result === null,
            "Restoration should return null when no tokens exist.",
        );

        assert(
            !profileCalled,
            "Profile must not be requested without stored tokens.",
        );

        console.log("PASS: Missing tokens return no session");
    }

    // Test 6: A valid access token restores the profile directly.
    {
        let refreshCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "valid-access-token",
                    refreshToken: "valid-refresh-token",
                }),
                getMyProfile: async (accessToken) => {
                    assert(
                        accessToken === "valid-access-token",
                        "The stored access token should be used.",
                    );

                    return {
                        ...user,
                        profile: {
                            username: "learner",
                            avatarKey: null,
                            bio: null,
                        },
                    };
                },
                refreshAuthSession: async () => {
                    refreshCalled = true;

                    return {
                        accessToken: "unexpected-access-token",
                        refreshToken: "unexpected-refresh-token",
                    };
                },
            }),
        );

        const result = await service.restoreSession();

        assert(
            result?.id === user.id,
            "The restored profile should belong to the expected user.",
        );

        assert(
            !refreshCalled,
            "A valid access token must not trigger a refresh.",
        );

        console.log("PASS: Valid access token restores the profile");
    }

    // Test 7: An expired access token triggers refresh and profile retry.
    {
        let profileAttempts = 0;
        let refreshedTokenUsed = false;
        let savedTokens: AuthTokens | undefined;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "valid-refresh-token",
                }),

                getMyProfile: async (accessToken) => {
                    profileAttempts += 1;

                    if (profileAttempts === 1) {
                        throw new ApiError(
                            "Access token expired",
                            401,
                            "UNAUTHENTICATED",
                        );
                    }

                    refreshedTokenUsed =
                        accessToken === "refreshed-access-token";

                    return {
                        ...user,
                        profile: {
                            username: "learner",
                            avatarKey: null,
                            bio: null,
                        },
                    };
                },

                refreshAuthSession: async (refreshToken) => {
                    assert(
                        refreshToken === "valid-refresh-token",
                        "The stored refresh token should be used.",
                    );

                    return {
                        accessToken: "refreshed-access-token",
                        refreshToken: "rotated-refresh-token",
                    };
                },

                saveAuthTokens: async (tokens) => {
                    savedTokens = tokens;
                },
            }),
        );

        const result = await service.restoreSession();

        assert(
            result?.id === user.id,
            "The profile should be restored after refreshing.",
        );

        assert(
            profileAttempts === 2,
            "The profile should be requested again after refreshing.",
        );

        assert(
            refreshedTokenUsed,
            "The refreshed access token should be used for the retry.",
        );

        assert(
            savedTokens?.accessToken === "refreshed-access-token",
            "The refreshed access token should be persisted.",
        );

        assert(
            savedTokens?.refreshToken === "rotated-refresh-token",
            "The rotated refresh token should be persisted.",
        );

        console.log("PASS: Expired access token refreshes the session");
    }

    // Test 8: An invalid refresh token clears stored credentials.
    {
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "revoked-refresh-token",
                }),

                getMyProfile: async () => {
                    throw new ApiError(
                        "Access token expired",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                refreshAuthSession: async () => {
                    throw new ApiError(
                        "Refresh token is invalid",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        const result = await service.restoreSession();

        assert(
            result === null,
            "An invalid refresh token should produce no session.",
        );

        assert(
            clearCalled,
            "Stored tokens should be cleared after refresh authentication fails.",
        );

        console.log("PASS: Invalid refresh token clears stored credentials");
    }

    // Test 9: Network errors must not clear stored credentials.
    {
        const networkError = new ApiError(
            "Network unavailable",
            0,
            "NETWORK_ERROR",
        );

        let refreshCalled = false;
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "stored-access-token",
                    refreshToken: "stored-refresh-token",
                }),

                getMyProfile: async () => {
                    throw networkError;
                },

                refreshAuthSession: async () => {
                    refreshCalled = true;

                    return {
                        accessToken: "new-access-token",
                        refreshToken: "new-refresh-token",
                    };
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        await expectFailure(
            () => service.restoreSession(),
            networkError,
        );

        assert(
            !refreshCalled,
            "A network error must not trigger token refresh.",
        );

        assert(
            !clearCalled,
            "Credentials must not be cleared after a network error.",
        );

        console.log("PASS: Network errors preserve stored credentials");
    }

    // Test 10: A token persistence failure must propagate.
    {
        const storageError = new Error(
            "Secure storage unavailable",
        );

        let clearCalled = false;
        let profileAttempts = 0;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "valid-refresh-token",
                }),

                getMyProfile: async () => {
                    profileAttempts += 1;

                    throw new ApiError(
                        "Access token expired",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                refreshAuthSession: async () => ({
                    accessToken: "refreshed-access-token",
                    refreshToken: "rotated-refresh-token",
                }),

                saveAuthTokens: async () => {
                    throw storageError;
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        await expectFailure(
            () => service.restoreSession(),
            storageError,
        );

        assert(
            profileAttempts === 1,
            "Profile retry must not happen when token persistence fails.",
        );

        assert(
            !clearCalled,
            "Restoration must not clear tokens after a persistence failure.",
        );

        console.log("PASS: Token persistence failure propagates safely");
    }

    // Test 11: A valid access token updates the profile.
    {
        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "valid-access-token",
                    refreshToken: "valid-refresh-token",
                }),
                updateMyProfile: async (accessToken, input) => {
                    assert(
                        accessToken === "valid-access-token",
                        "The stored access token should be used.",
                    );

                    return {
                        username: input.username ?? null,
                        avatarKey: input.avatarKey ?? null,
                        bio: input.bio ?? null,
                    };
                },
            }),
        );

        const result = await service.updateMyProfile({
            username: "newlearner",
        });

        assert(
            result.username === "newlearner",
            "The updated username should be returned.",
        );

        console.log("PASS: Profile updates with a valid access token");
    }

    // Test 12: An expired access token triggers refresh and update retry.
    {
        let updateAttempts = 0;
        let savedTokens: AuthTokens | undefined;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "valid-refresh-token",
                }),

                updateMyProfile: async (accessToken, input) => {
                    updateAttempts += 1;

                    if (updateAttempts === 1) {
                        throw new ApiError(
                            "Access token expired",
                            401,
                            "UNAUTHENTICATED",
                        );
                    }

                    assert(
                        accessToken === "refreshed-access-token",
                        "The refreshed access token should be used.",
                    );

                    return {
                        username: input.username ?? null,
                        avatarKey: input.avatarKey ?? null,
                        bio: input.bio ?? null,
                    };
                },

                refreshAuthSession: async (refreshToken) => {
                    assert(
                        refreshToken === "valid-refresh-token",
                        "The stored refresh token should be used.",
                    );

                    return {
                        accessToken: "refreshed-access-token",
                        refreshToken: "rotated-refresh-token",
                    };
                },

                saveAuthTokens: async (tokens) => {
                    savedTokens = tokens;
                },
            }),
        );

        const result = await service.updateMyProfile({
            username: "refreshedlearner",
        });

        assert(
            result.username === "refreshedlearner",
            "The profile should update after refreshing.",
        );

        assert(
            updateAttempts === 2,
            "The update should be retried exactly once.",
        );

        assert(
            savedTokens?.accessToken === "refreshed-access-token",
            "The refreshed access token should be saved.",
        );

        assert(
            savedTokens?.refreshToken === "rotated-refresh-token",
            "The rotated refresh token should be saved.",
        );

        console.log("PASS: Expired access token refreshes and retries profile update");
    }

    // Test 13: An invalid refresh token clears stored credentials.
    {
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "invalid-refresh-token",
                }),

                updateMyProfile: async () => {
                    throw new ApiError(
                        "Access token expired",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                refreshAuthSession: async () => {
                    throw new ApiError(
                        "Refresh token invalid",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        let errorMessage = "";

        try {
            await service.updateMyProfile({
                username: "learner",
            });
        } catch (error: unknown) {
            errorMessage = error instanceof Error
                ? error.message
                : "";
        }

        assert(
            clearCalled,
            "Stored credentials should be cleared.",
        );

        assert(
            errorMessage.includes("session has expired"),
            "The user should receive a session expiry message.",
        );

        console.log("PASS: Invalid refresh token clears credentials");
    }

    // Test 14: A network error must preserve stored credentials.
    {
        const networkError = new ApiError(
            "Network unavailable",
            0,
            "NETWORK_ERROR",
        );

        let refreshCalled = false;
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "stored-access-token",
                    refreshToken: "stored-refresh-token",
                }),

                updateMyProfile: async () => {
                    throw networkError;
                },

                refreshAuthSession: async () => {
                    refreshCalled = true;

                    return {
                        accessToken: "new-access-token",
                        refreshToken: "new-refresh-token",
                    };
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        await expectFailure(
            () => service.updateMyProfile({
                username: "learner",
            }),
            networkError,
        );

        assert(
            !refreshCalled,
            "Network errors must not trigger token refresh.",
        );

        assert(
            !clearCalled,
            "Credentials must not be cleared after a network error.",
        );

        console.log("PASS: Network errors preserve profile session credentials");
    }

    // Test 15: Token persistence failure prevents profile update retry.
    {
        const storageError = new Error(
            "Secure storage unavailable",
        );

        let updateAttempts = 0;
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "valid-refresh-token",
                }),

                updateMyProfile: async () => {
                    updateAttempts += 1;

                    throw new ApiError(
                        "Access token expired",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                refreshAuthSession: async () => ({
                    accessToken: "refreshed-access-token",
                    refreshToken: "rotated-refresh-token",
                }),

                saveAuthTokens: async () => {
                    throw storageError;
                },

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        await expectFailure(
            () => service.updateMyProfile({
                username: "learner",
            }),
            storageError,
        );

        assert(
            updateAttempts === 1,
            "The update must not retry if token persistence fails.",
        );

        assert(
            !clearCalled,
            "Credentials must not be cleared after storage failure.",
        );

        console.log("PASS: Token storage failure prevents update retry");
    }

    // Test 16: Authentication failure after retry clears credentials.
    {
        let updateAttempts = 0;
        let clearCalled = false;

        const service = createAuthSessionService(
            createDependencies({
                getAuthTokens: async () => ({
                    accessToken: "expired-access-token",
                    refreshToken: "valid-refresh-token",
                }),

                updateMyProfile: async () => {
                    updateAttempts += 1;

                    throw new ApiError(
                        "Access token expired",
                        401,
                        "UNAUTHENTICATED",
                    );
                },

                refreshAuthSession: async () => ({
                    accessToken: "refreshed-access-token",
                    refreshToken: "rotated-refresh-token",
                }),

                clearAuthTokens: async () => {
                    clearCalled = true;
                },
            }),
        );

        let errorMessage = "";

        try {
            await service.updateMyProfile({
                username: "learner",
            });
        } catch (error: unknown) {
            errorMessage = error instanceof Error
                ? error.message
                : "";
        }

        assert(
            updateAttempts === 2,
            "The profile update should be attempted twice.",
        );

        assert(
            clearCalled,
            "Credentials should be cleared after retry authentication failure.",
        );

        assert(
            errorMessage.includes("session has expired"),
            "The user should receive a session expiry message.",
        );

        console.log("PASS: Retry authentication failure clears credentials");
    }

    console.log("\nAll authentication session tests passed.");
}

main().catch((error: unknown) => {
    console.error("Authentication session tests failed:", error);
    process.exitCode = 1;
});
