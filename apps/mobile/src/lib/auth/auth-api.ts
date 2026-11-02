import { apiRequest } from "../api/api-client";

export interface AuthUser {
    id: string;
    email: string;
    createdAt: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    expiresIn: number;
}

export interface RegisterResponse {
    user: AuthUser;
}

export interface LoginResponse extends AuthTokens {
    user: AuthUser;
}

export type RefreshResponse = AuthTokens;

export interface LogoutResponse {
    message: string;
}

/**
 * Creates a learner account using email and password.
 *
 * This endpoint does not create an authenticated mobile
 * session. Session creation is handled by the login endpoint.
 */
export function registerWithEmail(
    credentials: RegisterCredentials,
): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/register", {
        method: "POST",
        body: credentials,
    });
}

/**
 * Authenticates a learner and returns their session tokens.
 *
 * Token persistence is handled by the session-management layer.
 */
export function loginWithEmail(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: credentials,
    });
}

/**
 * Exchanges the current refresh token for rotated tokens.
 */
export function refreshAuthSession(
    refreshToken: string,
): Promise<RefreshResponse> {
    return apiRequest<RefreshResponse>("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
    });
}

/**
 * Revokes the session associated with the supplied refresh token.
 */
export function logoutAuthSession(
    refreshToken: string,
): Promise<LogoutResponse> {
    return apiRequest<LogoutResponse>("/auth/logout", {
        method: "POST",
        body: { refreshToken },
    });
}
