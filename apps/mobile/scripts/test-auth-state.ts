import {
    resolveAuthState,
    type AuthState,
} from "../src/lib/auth/auth-state-core";

import type { AuthProfile } from "../src/lib/auth/auth-api";

function assert(
    condition: unknown,
    message: string,
): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

const profile: AuthProfile = {
    id: "user-test-001",
    email: "learner@example.com",
    createdAt: "2026-01-01T00:00:00.000Z",
    profile: {
        username: "learner",
        avatarKey: null,
        bio: null,
    },
};

async function main(): Promise<void> {
    console.log("Testing ZELO authentication state...\n");

    const authenticated = await resolveAuthState(
        async () => profile,
    );

    assert(
        authenticated.status === "authenticated",
        "A restored profile should produce authenticated state.",
    );

    if (authenticated.status === "authenticated") {
        assert(
            authenticated.profile.id === profile.id,
            "The restored profile should be preserved.",
        );
    }

    console.log("PASS: Successful restoration authenticates the learner");

    const unauthenticated = await resolveAuthState(
        async () => null,
    );

    assert(
        unauthenticated.status === "unauthenticated",
        "A missing session should produce unauthenticated state.",
    );

    console.log("PASS: Missing session produces unauthenticated state");

    const networkError = new Error("Network unavailable");

    const failed = await resolveAuthState(async () => {
        throw networkError;
    });

    assert(
        failed.status === "error",
        "A restoration failure should produce error state.",
    );

    if (failed.status === "error") {
        assert(
            failed.message === networkError.message,
            "The original error message should be preserved.",
        );
    }

    console.log("PASS: Network failure produces an error state");

    const unknownError = await resolveAuthState(async () => {
        throw "unexpected failure";
    });

    assert(
        unknownError.status === "error",
        "Unknown failures should produce error state.",
    );

    if (unknownError.status === "error") {
        assert(
            unknownError.message ===
            "Unable to restore your session.",
            "Unknown errors should use the fallback message.",
        );
    }

    console.log("PASS: Unknown errors use a safe fallback message");

    const initialState: AuthState = {
        status: "loading",
    };

    assert(
        initialState.status === "loading",
        "The initial state should be representable.",
    );

    console.log("PASS: Loading state is correctly typed");

    console.log("\nAll authentication state tests passed.");
}

main().catch((error: unknown) => {
    console.error("Authentication state tests failed:", error);
    process.exitCode = 1;
});