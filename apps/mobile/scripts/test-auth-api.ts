import {
    loginWithEmail,
    registerWithEmail,
} from "../src/lib/auth/auth-api";
import { ApiError } from "../src/lib/api/api-error";

async function main(): Promise<void> {
    console.log("Testing ZELO authentication API...\n");

    // Test 1: Registration validation
    try {
        await registerWithEmail({
            email: "",
            password: "",
        });

        throw new Error(
            "Expected invalid registration data to be rejected.",
        );
    } catch (error: unknown) {
        if (!(error instanceof ApiError)) {
            throw error;
        }

        if (error.status !== 400) {
            throw new Error(
                `Expected HTTP 400 for invalid registration, received ${error.status}.`,
            );
        }

        console.log("PASS: Registration validation error");
    }

    // Test 2: Invalid login credentials
    try {
        await loginWithEmail({
            email: "missing-account@example.invalid",
            password: "InvalidPassword123!",
        });

        throw new Error(
            "Expected invalid login credentials to be rejected.",
        );
    } catch (error: unknown) {
        if (!(error instanceof ApiError)) {
            throw error;
        }

        if (
            error.status !== 401 ||
            error.code !== "INVALID_CREDENTIALS"
        ) {
            throw new Error(
                `Unexpected login error: HTTP ${error.status}, code ${error.code}.`,
            );
        }

        console.log("PASS: Invalid credentials handling");
    }

    console.log("\nAll authentication API smoke tests passed.");
}

main().catch((error: unknown) => {
    console.error("Authentication API smoke test failed:", error);
    process.exitCode = 1;
});