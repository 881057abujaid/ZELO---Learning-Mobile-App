import {
    loginWithEmail,
    logoutAuthSession,
} from "./auth-api";

import { saveAuthTokens } from "./token-storage";

import { createAuthSessionService } from "./auth-session-core";

export const { loginAndPersistSession } =
    createAuthSessionService({
        loginWithEmail,
        saveAuthTokens,
        logoutAuthSession,
    });
