import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

const {
    hashMock,
    verifyMock,
    createUserMock,
    findUserForLoginMock,
    createRefreshTokenMock,
    createAccessTokenMock,
} = vi.hoisted(() => ({
    hashMock: vi.fn(),
    verifyMock: vi.fn(),
    createUserMock: vi.fn(),
    findUserForLoginMock: vi.fn(),
    createRefreshTokenMock: vi.fn(),
    createAccessTokenMock: vi.fn(),
}));

vi.mock("argon2", () => ({
    default: {
        hash: hashMock,
        verify: verifyMock,
    },
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
    createUser: createUserMock,
    findUserForLogin: findUserForLoginMock,
    createRefreshToken: createRefreshTokenMock,
}));

vi.mock("../../src/modules/auth/access-token.service.js", () => ({
    createAccessToken: createAccessTokenMock,
}));

import { loginUser } from "../../src/modules/auth/auth.service.js";

describe("loginUser", () => {
    const user = {
        id: "11111111-1111-4111-8111-111111111111",
        email: "learner@example.com",
        passwordHash: "argon2$test-hash",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        findUserForLoginMock.mockResolvedValue(user);
        verifyMock.mockResolvedValue(true);
        createAccessTokenMock.mockResolvedValue("test-access-token");
        createRefreshTokenMock.mockResolvedValue({});
    });

    it("verifies credentials and issues both tokens", async () => {
        const result = await loginUser({
            email: "learner@example.com",
            password: "SecurePassword123",
        });

        expect(findUserForLoginMock).toHaveBeenCalledWith(
            "learner@example.com",
        );

        expect(verifyMock).toHaveBeenCalledWith(
            user.passwordHash,
            "SecurePassword123",
        );

        expect(createAccessTokenMock).toHaveBeenCalledWith(user.id);

        expect(result).toMatchObject({
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
            accessToken: "test-access-token",
            tokenType: "Bearer",
            expiresIn: 900,
        });

        expect(result.refreshToken).toBeTruthy();
        expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("normalizes email before looking up the user", async () => {
        await loginUser({
            email: "Learner@Example.com",
            password: "SecurePassword123",
        });

        expect(findUserForLoginMock).toHaveBeenCalledWith(
            "learner@example.com",
        );
    });

    it("rejects an unknown email with generic credentials error", async () => {
        findUserForLoginMock.mockResolvedValue(null);

        await expect(
            loginUser({
                email: "unknown@example.com",
                password: "SecurePassword123",
            }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "INVALID_CREDENTIALS",
            message: "Email or password is incorrect.",
        });

        expect(verifyMock).not.toHaveBeenCalled();
        expect(createRefreshTokenMock).not.toHaveBeenCalled();
    });

    it("rejects an incorrect password with the same credentials error", async () => {
        verifyMock.mockResolvedValue(false);

        await expect(
            loginUser({
                email: "learner@example.com",
                password: "IncorrectPassword123",
            }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "INVALID_CREDENTIALS",
            message: "Email or password is incorrect.",
        });

        expect(createAccessTokenMock).not.toHaveBeenCalled();
        expect(createRefreshTokenMock).not.toHaveBeenCalled();
    });

    it("persists only the SHA-256 hash of the refresh token", async () => {
        const result = await loginUser({
            email: "learner@example.com",
            password: "SecurePassword123",
        });

        const persistedInput = createRefreshTokenMock.mock.calls[0][0];

        const expectedHash = createHash("sha256")
            .update(result.refreshToken)
            .digest("hex");

        expect(persistedInput.tokenHash).toBe(expectedHash);
        expect(persistedInput.tokenHash).not.toBe(result.refreshToken);
        expect(persistedInput.userId).toBe(user.id);
        expect(persistedInput.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it("does not issue tokens if refresh-token persistence fails", async () => {
        createRefreshTokenMock.mockRejectedValue(
            new Error("Database unavailable"),
        );

        await expect(
            loginUser({
                email: "learner@example.com",
                password: "SecurePassword123",
            }),
        ).rejects.toThrow("Database unavailable");
    });
});