import {
    getOnboardingRoute,
    type OnboardingRoute,
} from "../src/lib/auth/onboarding-navigation";

import type { AuthProfile } from "../src/lib/auth/auth-api";

function assert(
    condition: unknown,
    message: string,
): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function createProfile(
    username: string | null,
    avatarKey: string | null,
): AuthProfile {
    return {
        id: "user-test-001",
        email: "learner@example.com",
        createdAt: "2026-01-01T00:00:00.000Z",
        profile: {
            username,
            avatarKey,
            bio: null,
        },
    };
}

function testRoute(
    profile: AuthProfile,
    expectedRoute: OnboardingRoute,
    description: string,
): void {
    const actualRoute = getOnboardingRoute(profile);

    assert(
        actualRoute === expectedRoute,
        `${description}. Expected ${expectedRoute}, received ${actualRoute}`,
    );

    console.log(`PASS: ${description}`);
}

async function main(): Promise<void> {
    console.log("Testing ZELO onboarding navigation...\n");

    testRoute(
        createProfile(null, null),
        "/username",
        "Missing username redirects to username screen",
    );

    testRoute(
        createProfile("learner", null),
        "/avatar",
        "Completed username with missing avatar redirects to avatar screen",
    );

    testRoute(
        createProfile("learner", "girl_01"),
        "/home",
        "Completed onboarding redirects to home",
    );

    testRoute(
        createProfile("   ", "girl_01"),
        "/username",
        "Whitespace username is treated as incomplete",
    );

    testRoute(
        createProfile(" learner ", "girl_01"),
        "/home",
        "Username surrounding whitespace is ignored",
    );

    console.log("\nAll onboarding navigation tests passed.");
}

main().catch((error: unknown) => {
    console.error("Onboarding navigation tests failed:", error);
    process.exitCode = 1;
});