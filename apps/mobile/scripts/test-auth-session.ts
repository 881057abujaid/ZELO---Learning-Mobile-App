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

    console.log("\nAll authentication session tests passed.");
}

main().catch((error: unknown) => {
    console.error("Authentication session tests failed:", error);
    process.exitCode = 1;
});
