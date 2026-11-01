import argon2 from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import type {
    RegistrationInput,
    LoginInput,
    RefreshInput,
    ForgotPasswordInput,
    ResetPasswordInput,
} from "./auth.validation.js";
import { createAccessToken } from "./access-token.service.js";
import {
    createRefreshToken,
    createUser,
    findUserForLogin,
    findRefreshTokenByHash,
    revokeRefreshTokenFamily,
    rotateRefreshToken,
    findUserForPasswordReset,
    createPasswordResetToken,
    deletePasswordResetTokenByHash,
    completePasswordReset,
} from "./auth.repository.js";
import { sendPasswordResetEmail } from "./password-reset-email.service.js";
import { getPasswordResetUrlConfig } from "../../config/email-config.js";

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

export async function logoutUser(input: RefreshInput): Promise<void> {
    const tokenHash = createHash("sha256")
        .update(input.refreshToken)
        .digest("hex");

    const storedToken = await findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
        throw unauthenticatedError();
    }

    await revokeRefreshTokenFamily(storedToken.familyId, new Date());
}

const PASSWORD_RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export async function requestPasswordReset(
    input: ForgotPasswordInput,
): Promise<void> {
    const emailNormalized = input.email.trim().toLowerCase();

    const user = await findUserForPasswordReset(emailNormalized);

    // Avoid revealing whether an account exists.
    if (!user) {
        return;
    }

    // Validate configuration before creating a database token.
    const config = getPasswordResetUrlConfig();

    // Generate a cryptographically secure, URL-safe token.
    const resetToken = randomBytes(32).toString("base64url");

    // Build the configured destination URL and safely add the token.
    const resetUrl = new URL(config.passwordResetUrlBase);
    resetUrl.searchParams.set("token", resetToken);

    // Persist only the SHA-256 hash.
    const tokenHash = createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const now = new Date();

    await createPasswordResetToken({
        userId: user.id,
        tokenHash,
        createdAt: now,
        expiresAt: new Date(
            now.getTime() + PASSWORD_RESET_TOKEN_TTL_MS,
        ),
    });

    try {
        await sendPasswordResetEmail({
            to: user.email,
            resetUrl: resetUrl.toString(),
        });
    } catch (error) {
        try {
            await deletePasswordResetTokenByHash(tokenHash);
        } catch {
            // Preserve the original email delivery error.
        }

        throw error;
    }
}

export async function resetPassword(
    input: ResetPasswordInput,
): Promise<void> {
    const tokenHash = createHash("sha256")
        .update(input.token)
        .digest("hex");

    const passwordHash = await argon2.hash(input.newPassword);

    const completed = await completePasswordReset({
        tokenHash,
        passwordHash,
        now: new Date(),
    });

    if (!completed) {
        throw new AppError(
            400,
            "INVALID_OR_EXPIRED_RESET_TOKEN",
            "This password reset link is invalid or has expired.",
        );
    }
}