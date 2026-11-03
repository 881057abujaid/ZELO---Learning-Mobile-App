import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    resolveAuthState,
    type AuthState,
} from "./auth-state-core";

import { restoreSession } from "./auth-session";


interface AuthContextValue {
    state: AuthState;
    retryRestore: () => Promise<void>;
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
        setState({ status: "loading" });

        const nextState = await resolveAuthState(restoreSession);

        setState(nextState);
    }, []);

    useEffect(() => {
        void retryRestore();
    }, [retryRestore]);

    return (
        <AuthContext.Provider
            value={{
                state,
                retryRestore,
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