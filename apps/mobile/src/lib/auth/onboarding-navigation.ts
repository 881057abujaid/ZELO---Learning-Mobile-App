import type { AuthProfile } from "./auth-api";

export type OnboardingRoute =
    | "/username"
    | "/avatar"
    | "/home";

export function getOnboardingRoute(
    user: AuthProfile,
): OnboardingRoute {
    const username = user.profile.username?.trim();
    const avatarKey = user.profile.avatarKey;

    // Step 1: Username onboarding incomplete
    if (!username) {
        return "/username";
    }

    // Step 2: Avatar onboarding incomplete
    if (!avatarKey) {
        return "/avatar";
    }

    // Step 3: Onboarding complete
    return "/home";
}