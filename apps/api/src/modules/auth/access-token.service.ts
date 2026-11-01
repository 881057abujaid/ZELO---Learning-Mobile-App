import { SignJWT } from "jose";
import { getAuthConfig } from "../../config/auth-config.js";

export const ACCESS_TOKEN_ISSUER = "zelo-api";
export const ACCESS_TOKEN_AUDIENCE = "zelo-mobile";
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export async function createAccessToken(
    userId: string,
): Promise<string> {
    if (!userId.trim()) {
        throw new Error("A valid user ID is required to issue an access token.");
    }

    const config = getAuthConfig();
    const signingKey = new TextEncoder().encode(
        config.accessTokenSecret,
    );

    return new SignJWT({})
        .setProtectedHeader({
            alg: "HS256",
            typ: "JWT",
        })
        .setSubject(userId)
        .setIssuer(ACCESS_TOKEN_ISSUER)
        .setAudience(ACCESS_TOKEN_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
        .sign(signingKey);
}