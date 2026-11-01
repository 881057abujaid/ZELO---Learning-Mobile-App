import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    findRefreshTokenByHashMock,
    revokeRefreshTokenFamilyMock,
    rotateRefreshTokenMock,
    createAccessTokenMock,
} = vi.hoisted(() => ({
    findRefreshTokenByHashMock: vi.fn(),
    revokeRefreshTokenFamilyMock: vi.fn(),
    rotateRefreshTokenMock: vi.fn(),
    createAccessTokenMock: vi.fn(),
}));

vi.mock("argon2", () => ({
    default: {
        hash: vi.fn(),
        verify: vi.fn(),
    },
}));

vi.mock("../../src/modules/auth/access-token.service.js", () => ({
    createAccessToken: createAccessTokenMock,
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
    createRefreshToken: vi.fn(),
    createUser: vi.fn(),
    findUserForLogin: vi.fn(),
    findRefreshTokenByHash: findRefreshTokenByHashMock,
    revokeRefreshTokenFamily: revokeRefreshTokenFamilyMock,
    rotateRefreshToken: rotateRefreshTokenMock,
}));

import { AppError } from "../../src/common/errors/app-error.js";
import { refreshUserSession } from "../../src/modules/auth/auth.service.js";

const now = new Date();
const validToken = {
    id: "token-id",
    userId: "user-id",
    familyId: "family-id",
    tokenHash: "stored-hash",
    createdAt: new Date(now.getTime() - 60_000),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    consumedAt: null,
    revokedAt: null,
    replacedByTokenId: null,
};

describe("refreshUserSession", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        findRefreshTokenByHashMock.mockResolvedValue({ ...validToken });
        revokeRefreshTokenFamilyMock.mockResolvedValue({ count: 1 });
        createAccessTokenMock.mockResolvedValue("new-access-token");
        rotateRefreshTokenMock.mockImplementation(async (input) => ({
            id: "replacement-id",
            userId: input.replacementToken.userId,
            familyId: input.replacementToken.familyId,
            tokenHash: input.replacementToken.tokenHash,
            createdAt: input.consumedAt,
            expiresAt: input.replacementToken.expiresAt,
            consumedAt: null,
            revokedAt: null,
            replacedByTokenId: null,
        }));
    });

    it("rotates the token while preserving the original session expiry", async () => {
        const result = await refreshUserSession({
            refreshToken: "raw-refresh-token",
        });

        expect(result).toMatchObject({
            accessToken: "new-access-token",
            tokenType: "Bearer",
            expiresIn: 900,
        });
        expect(result.refreshToken).toEqual(expect.any(String));
        expect(result.refreshToken).not.toBe("raw-refresh-token");

        expect(rotateRefreshTokenMock).toHaveBeenCalledWith(
            expect.objectContaining({
                currentTokenId: "token-id",
                replacementToken: expect.objectContaining({
                    userId: "user-id",
                    familyId: "family-id",
                    expiresAt: validToken.expiresAt,
                }),
            }),
        );
    });

    it("rejects a refresh token that is not stored", async () => {
        findRefreshTokenByHashMock.mockResolvedValue(null);

        await expect(
            refreshUserSession({ refreshToken: "unknown-token" }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "UNAUTHENTICATED",
        });

        expect(rotateRefreshTokenMock).not.toHaveBeenCalled();
    });

    it("revokes the family when a consumed token is reused", async () => {
        findRefreshTokenByHashMock.mockResolvedValue({
            ...validToken,
            consumedAt: new Date(),
        });

        await expect(
            refreshUserSession({ refreshToken: "reused-token" }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "UNAUTHENTICATED",
        });

        expect(revokeRefreshTokenFamilyMock).toHaveBeenCalledWith(
            "family-id",
            expect.any(Date),
        );
        expect(rotateRefreshTokenMock).not.toHaveBeenCalled();
    });

    it("rejects an expired refresh token without rotating it", async () => {
        findRefreshTokenByHashMock.mockResolvedValue({
            ...validToken,
            expiresAt: new Date(Date.now() - 1_000),
        });

        await expect(
            refreshUserSession({ refreshToken: "expired-token" }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "UNAUTHENTICATED",
        });

        expect(rotateRefreshTokenMock).not.toHaveBeenCalled();
        expect(revokeRefreshTokenFamilyMock).not.toHaveBeenCalled();
    });

    it("revokes the family if a concurrent request already consumed the token", async () => {
        rotateRefreshTokenMock.mockResolvedValue(null);
        findRefreshTokenByHashMock
            .mockResolvedValueOnce({ ...validToken })
            .mockResolvedValueOnce({
                ...validToken,
                consumedAt: new Date(),
                replacedByTokenId: "replacement-id",
            });

        await expect(
            refreshUserSession({ refreshToken: "racing-token" }),
        ).rejects.toMatchObject({
            statusCode: 401,
            code: "UNAUTHENTICATED",
        });

        expect(revokeRefreshTokenFamilyMock).toHaveBeenCalledWith(
            "family-id",
            expect.any(Date),
        );
    });

    it("does not return an internal error when the token is invalid", async () => {
        findRefreshTokenByHashMock.mockResolvedValue(null);

        try {
            await refreshUserSession({ refreshToken: "invalid-token" });
            throw new Error("Expected refresh to reject");
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).message).toBe(
                "Please sign in to continue.",
            );
        }
    });
});
