import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type {
    LoginCredentials,
    UpdateMyProfileInput,
} from "./auth-api";

import {
    loginAndPersistSession,
    restoreSession,
    updateMyProfileSession,
} from "./auth-session";

import {
    resolveAuthState,
    type AuthState,
} from "./auth-state-core";

interface AuthContextValue {
    state: AuthState;
    retryRestore: () => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    updateProfile: (input: UpdateMyProfileInput) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        status: "loading",
    });

    const retryRestore = useCallback(async (): Promise<void> => {
        setState({
            status: "loading",
        });

        const nextState = await resolveAuthState(restoreSession);

        setState(nextState);
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<void> => {
            setState({
                status: "loading",
            });

            // Step 1: Authenticate and persist tokens.
            try {
                await loginAndPersistSession(credentials);
            } catch (error: unknown) {
                const message = error instanceof Error
                    ? error.message
                    : "Unable to sign in. Please try again.";

                setState({
                    status: "unauthenticated",
                });

                throw new Error(message);
            }

            // Step 2: Load the authenticated learner's profile.
            let profile;

            try {
                profile = await restoreSession();
            } catch (error: unknown) {
                const message = error instanceof Error
                    ? error.message
                    : "Unable to load your account profile. Please try again.";

                setState({
                    status: "error",
                    message,
                });

                throw new Error(message);
            }

            // Step 3: Handle a missing or invalid session.
            if (profile === null) {
                setState({
                    status: "unauthenticated",
                });

                throw new Error(
                    "Unable to load your account profile.",
                );
            }

            // Step 4: Publish the authenticated state.
            setState({
                status: "authenticated",
                profile,
            });
        },
        [],
    );

    const authenticatedUserId =
        state.status === "authenticated"
            ? state.profile.id
            : null;

    const updateProfile = useCallback(
        async (input: UpdateMyProfileInput): Promise<void> => {
            if (!authenticatedUserId) {
                throw new Error(
                    "You must be signed in to update your profile.",
                );
            }

            try {
                const updatedProfile =
                    await updateMyProfileSession(input);

                setState((currentState) => {
                    if (
                        currentState.status !== "authenticated" ||
                        currentState.profile.id !== authenticatedUserId
                    ) {
                        return currentState;
                    }

                    return {
                        status: "authenticated",
                        profile: {
                            ...currentState.profile,
                            profile: {
                                ...currentState.profile.profile,
                                ...updatedProfile,
                            },
                        },
                    };
                });
            } catch (error: unknown) {
                if (
                    error instanceof Error &&
                    error.message ===
                    "Your session has expired. Please sign in again."
                ) {
                    setState({
                        status: "unauthenticated",
                    });
                }

                throw error;
            }
        },
        [authenticatedUserId],
    );

    useEffect(() => {
        let cancelled = false;

        void resolveAuthState(restoreSession).then((nextState) => {
            if (!cancelled) {
                setState(nextState);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                state,
                retryRestore,
                login,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            "useAuth must be used within an AuthProvider.",
        );
    }

    return context;
}