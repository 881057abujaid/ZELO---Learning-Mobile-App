import {
    getMyProfile,
    loginWithEmail,
    logoutAuthSession,
    refreshAuthSession,
    updateMyProfile,
} from "./auth-api";

import {
    clearAuthTokens,
    getAuthTokens,
    saveAuthTokens,
} from "./token-storage";

import { createAuthSessionService } from "./auth-session-core";

export const {
    loginAndPersistSession,
    restoreSession,
    updateMyProfile: updateMyProfileSession,
} = createAuthSessionService({
    loginWithEmail,
    saveAuthTokens,
    logoutAuthSession,
    getAuthTokens,
    clearAuthTokens,
    refreshAuthSession,
    getMyProfile,
    updateMyProfile,
});