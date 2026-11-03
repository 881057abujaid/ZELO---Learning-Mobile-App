import type { AuthProfile } from "./auth-api";

export type AuthState =
    | {
        status: "loading";
    }
    | {
        status: "authenticated";
        profile: AuthProfile;
    }
    | {
        status: "unauthenticated";
    }
    | {
        status: "error";
        message: string;
    };

export async function resolveAuthState(
    restoreSession: () => Promise<AuthProfile | null>,
): Promise<AuthState> {
    try {
        const profile = await restoreSession();

        if (profile === null) {
            return {
                status: "unauthenticated",
            };
        }

        return {
            status: "authenticated",
            profile,
        };
    } catch (error: unknown) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Unable to restore your session.",
        };
    }
}