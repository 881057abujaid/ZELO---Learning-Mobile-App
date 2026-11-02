import { apiRequest } from "../src/lib/api/api-client";
import { ApiError } from "../src/lib/api/api-error";

interface HealthResponse {
    status: string;
}

async function main(): Promise<void> {
    console.log("Testing ZELO API client...\n");

    // Test 1: Successful health request
    const health = await apiRequest<HealthResponse>("/health");

    if (health.status !== "ok") {
        throw new Error("Health endpoint returned an unexpected result.");
    }

    console.log("PASS: Success response parsing");

    // Test 2: API error response
    try {
        await apiRequest("/this-endpoint-does-not-exist");
        throw new Error("Expected the unknown endpoint to fail.");
    } catch (error: unknown) {
        if (!(error instanceof ApiError)) {
            throw error;
        }

        if (error.status !== 404) {
            throw new Error(
                `Expected HTTP 404, received ${error.status}.`,
            );
        }

        console.log("PASS: HTTP error handling");
    }

    console.log("\nAll API client smoke tests passed.");
}

main().catch((error: unknown) => {
    console.error("API client smoke test failed:", error);
    process.exitCode = 1;
});