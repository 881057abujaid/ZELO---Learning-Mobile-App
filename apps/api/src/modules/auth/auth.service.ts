import argon2 from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import type {
    RegistrationInput,
    LoginInput,
    RefreshInput,
} from "./auth.validation.js";
import { createAccessToken } from "./access-token.service.js";
import {
    createRefreshToken,
    createUser,
    findUserForLogin,
    findRefreshTokenByHash,
    revokeRefreshTokenFamily,
    rotateRefreshToken,
} from "./auth.repository.js";

export async function registerUser(input: RegistrationInput) {
    const email = input.email;
    const emailNormalized = email.toLowerCase();

    const passwordHash = await argon2.hash(input.password);

    return createUser({
        email,
        emailNormalized,
        passwordHash,
    });
}

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function loginUser(input: LoginInput) {
    const emailNormalized = input.email.toLowerCase();

    const user = await findUserForLogin(emailNormalized);

    // Same error for unknown email and incorrect password.
    if (!user) {
        throw new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Email or password is incorrect.",
        );
    }

    const passwordMatches = await argon2.verify(
        user.passwordHash,
        input.password,
    );

    if (!passwordMatches) {
        throw new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Email or password is incorrect.",
        );
    }

    const accessToken = await createAccessToken(user.id);

    // The raw refresh token is returned to the client only.
    // Only its SHA-256 hash is persisted in the database.
    const refreshToken = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const now = Date.now();

    await createRefreshToken({
        userId: user.id,
        familyId: randomUUID(),
        tokenHash,
        expiresAt: new Date(now + REFRESH_TOKEN_TTL_MS),
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
        tokenType: "Bearer" as const,
        expiresIn: 900,
    };
}

function unauthenticatedError(): AppError {
    return new AppError(
        401,
        "UNAUTHENTICATED",
        "Please sign in to continue.",
    );
}

export async function refreshUserSession(input: RefreshInput) {
    const tokenHash = createHash("sha256")
        .update(input.refreshToken)
        .digest("hex");

    const storedToken = await findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
        throw unauthenticatedError();
    }

    const now = new Date();

    // A previously consumed or revoked token being presented again is
    // treated as reuse. Revoke every token in that session family.
    if (storedToken.consumedAt || storedToken.revokedAt) {
        await revokeRefreshTokenFamily(storedToken.familyId, now);
        throw unauthenticatedError();
    }

    if (storedToken.expiresAt.getTime() <= now.getTime()) {
        throw unauthenticatedError();
    }

    // Create the access token before consuming the current refresh token,
    // so a signing/configuration failure does not burn a valid session.
    const accessToken = await createAccessToken(storedToken.userId);

    const replacementRefreshToken = randomBytes(32).toString("base64url");
    const replacementTokenHash = createHash("sha256")
        .update(replacementRefreshToken)
        .digest("hex");

    const replacement = await rotateRefreshToken({
        currentTokenId: storedToken.id,
        replacementToken: {
            userId: storedToken.userId,
            familyId: storedToken.familyId,
            tokenHash: replacementTokenHash,
            // Fixed absolute session expiry: rotation does not extend it.
            expiresAt: storedToken.expiresAt,
        },
        consumedAt: now,
    });

    if (!replacement) {
        // Another request may have rotated this token after our initial
        // lookup. Re-read it to distinguish a concurrent reuse from a
        // database race and revoke the family if it has been consumed.
        const latestToken = await findRefreshTokenByHash(tokenHash);

        if (
            latestToken &&
            (latestToken.consumedAt ||
                latestToken.revokedAt ||
                latestToken.replacedByTokenId)
        ) {
            await revokeRefreshTokenFamily(latestToken.familyId, new Date());
        }

        throw unauthenticatedError();
    }

    return {
        accessToken,
        refreshToken: replacementRefreshToken,
        tokenType: "Bearer" as const,
        expiresIn: 900,
    };
}
