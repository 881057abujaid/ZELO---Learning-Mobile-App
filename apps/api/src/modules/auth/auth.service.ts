import argon2 from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import type { RegistrationInput, LoginInput } from "./auth.validation.js";
import { createAccessToken } from "./access-token.service.js";
import {
    createRefreshToken,
    createUser,
    findUserForLogin,
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
