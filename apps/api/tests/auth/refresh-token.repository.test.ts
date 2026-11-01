import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    refreshTokenCreateMock,
    refreshTokenFindUniqueMock,
    refreshTokenUpdateManyMock,
    refreshTokenUpdateMock,
    transactionMock,
    prismaTransactionMock,
} = vi.hoisted(() => {
    const refreshTokenCreateMock = vi.fn();
    const refreshTokenFindUniqueMock = vi.fn();
    const refreshTokenUpdateManyMock = vi.fn();
    const refreshTokenUpdateMock = vi.fn();

    const transactionMock = {
        refreshToken: {
            create: refreshTokenCreateMock,
            findUnique: refreshTokenFindUniqueMock,
            updateMany: refreshTokenUpdateManyMock,
            update: refreshTokenUpdateMock,
        },
    };

    return {
        refreshTokenCreateMock,
        refreshTokenFindUniqueMock,
        refreshTokenUpdateManyMock,
        refreshTokenUpdateMock,
        transactionMock,
        prismaTransactionMock: vi.fn(),
    };
});

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        user: {
            create: vi.fn(),
        },
        refreshToken: {
            create: refreshTokenCreateMock,
            findUnique: refreshTokenFindUniqueMock,
            updateMany: refreshTokenUpdateManyMock,
        },
        $transaction: prismaTransactionMock,
    },
}));

import {
    createRefreshToken,
    findRefreshTokenByHash,
    revokeRefreshTokenFamily,
    rotateRefreshToken,
} from "../../src/modules/auth/auth.repository.js";

describe("createRefreshToken", () => {
    beforeEach(() => {
        refreshTokenCreateMock.mockReset();
        refreshTokenFindUniqueMock.mockReset();
        refreshTokenUpdateManyMock.mockReset();
        refreshTokenUpdateMock.mockReset();
        prismaTransactionMock.mockReset();

        prismaTransactionMock.mockImplementation(
            async (callback: (transaction: typeof transactionMock) => unknown) =>
                callback(transactionMock),
        );
    });

    const input = {
        userId: "11111111-1111-4111-8111-111111111111",
        familyId: "22222222-2222-4222-8222-222222222222",
        tokenHash: "hashed-refresh-token",
        expiresAt: new Date("2026-12-01T00:00:00.000Z"),
    };

    it("creates a refresh token using only the provided persistence fields", async () => {
        const createdToken = {
            id: "33333333-3333-4333-8333-333333333333",
            ...input,
            createdAt: new Date("2026-11-01T00:00:00.000Z"),
            consumedAt: null,
            revokedAt: null,
            replacedByTokenId: null,
        };

        refreshTokenCreateMock.mockResolvedValue(createdToken);

        const result = await createRefreshToken(input);

        expect(refreshTokenCreateMock).toHaveBeenCalledWith({
            data: input,
            select: {
                id: true,
                userId: true,
                familyId: true,
                tokenHash: true,
                createdAt: true,
                expiresAt: true,
                consumedAt: true,
                revokedAt: true,
                replacedByTokenId: true,
            },
        });

        expect(result).toEqual(createdToken);
    });

    it("propagates database errors", async () => {
        const databaseError = new Error("Database unavailable");

        refreshTokenCreateMock.mockRejectedValue(databaseError);

        await expect(createRefreshToken(input)).rejects.toBe(databaseError);
    });
});

describe("findRefreshTokenByHash", () => {
    const tokenHash = "hashed-refresh-token";

    it("finds a refresh token by its unique hash", async () => {
        const storedToken = {
            id: "33333333-3333-4333-8333-333333333333",
            userId: "11111111-1111-4111-8111-111111111111",
            familyId: "22222222-2222-4222-8222-222222222222",
            tokenHash,
            createdAt: new Date("2026-11-01T00:00:00.000Z"),
            expiresAt: new Date("2026-12-01T00:00:00.000Z"),
            consumedAt: null,
            revokedAt: null,
            replacedByTokenId: null,
        };

        refreshTokenFindUniqueMock.mockResolvedValue(storedToken);

        const result = await findRefreshTokenByHash(tokenHash);

        expect(refreshTokenFindUniqueMock).toHaveBeenCalledWith({
            where: { tokenHash },
            select: {
                id: true,
                userId: true,
                familyId: true,
                tokenHash: true,
                createdAt: true,
                expiresAt: true,
                consumedAt: true,
                revokedAt: true,
                replacedByTokenId: true,
            },
        });

        expect(result).toEqual(storedToken);
    });

    it("returns null when the token hash does not exist", async () => {
        refreshTokenFindUniqueMock.mockResolvedValue(null);

        const result = await findRefreshTokenByHash(tokenHash);

        expect(result).toBeNull();
    });

    it("propagates database errors", async () => {
        const databaseError = new Error("Database unavailable");

        refreshTokenFindUniqueMock.mockRejectedValue(databaseError);

        await expect(
            findRefreshTokenByHash(tokenHash),
        ).rejects.toBe(databaseError);
    });
});

describe("rotateRefreshToken", () => {
    const input = {
        currentTokenId: "33333333-3333-4333-8333-333333333333",
        replacementToken: {
            userId: "11111111-1111-4111-8111-111111111111",
            familyId: "22222222-2222-4222-8222-222222222222",
            tokenHash: "replacement-token-hash",
            expiresAt: new Date("2026-12-01T00:00:00.000Z"),
        },
        consumedAt: new Date("2026-11-01T00:00:00.000Z"),
    };

    it("consumes the current token and persists its replacement atomically", async () => {
        const replacement = {
            id: "44444444-4444-4444-8444-444444444444",
            ...input.replacementToken,
            createdAt: input.consumedAt,
            consumedAt: null,
            revokedAt: null,
            replacedByTokenId: null,
        };

        refreshTokenUpdateManyMock.mockResolvedValue({ count: 1 });
        refreshTokenCreateMock.mockResolvedValue(replacement);
        refreshTokenUpdateMock.mockResolvedValue({
            id: input.currentTokenId,
            replacedByTokenId: replacement.id,
        });

        const result = await rotateRefreshToken(input);

        expect(prismaTransactionMock).toHaveBeenCalledOnce();

        expect(refreshTokenUpdateManyMock).toHaveBeenCalledWith({
            where: {
                id: input.currentTokenId,
                userId: input.replacementToken.userId,
                familyId: input.replacementToken.familyId,
                consumedAt: null,
                revokedAt: null,
                expiresAt: { gt: input.consumedAt },
            },
            data: {
                consumedAt: input.consumedAt,
            },
        });

        expect(refreshTokenCreateMock).toHaveBeenCalledWith({
            data: input.replacementToken,
            select: {
                id: true,
                userId: true,
                familyId: true,
                tokenHash: true,
                createdAt: true,
                expiresAt: true,
                consumedAt: true,
                revokedAt: true,
                replacedByTokenId: true,
            },
        });

        expect(refreshTokenUpdateMock).toHaveBeenCalledWith({
            where: { id: input.currentTokenId },
            data: { replacedByTokenId: replacement.id },
        });

        expect(result).toEqual(replacement);
    });

    it("does not create a replacement when the current token cannot be consumed", async () => {
        refreshTokenUpdateManyMock.mockResolvedValue({ count: 0 });

        const result = await rotateRefreshToken(input);

        expect(result).toBeNull();
        expect(refreshTokenCreateMock).not.toHaveBeenCalled();
        expect(refreshTokenUpdateMock).not.toHaveBeenCalled();
    });

    it("propagates transaction failures", async () => {
        const databaseError = new Error("Database unavailable");

        prismaTransactionMock.mockRejectedValue(databaseError);

        await expect(rotateRefreshToken(input)).rejects.toBe(databaseError);
    });
});

describe("revokeRefreshTokenFamily", () => {
    const familyId = "22222222-2222-4222-8222-222222222222";
    const revokedAt = new Date("2026-11-01T00:00:00.000Z");

    beforeEach(() => {
        refreshTokenUpdateManyMock.mockReset();
    });

    it("revokes all unrevoked tokens in the specified family", async () => {
        refreshTokenUpdateManyMock.mockResolvedValue({ count: 3 });

        const result = await revokeRefreshTokenFamily(
            familyId,
            revokedAt,
        );

        expect(refreshTokenUpdateManyMock).toHaveBeenCalledWith({
            where: {
                familyId,
                revokedAt: null,
            },
            data: {
                revokedAt,
            },
        });

        expect(result).toEqual({ count: 3 });
    });

    it("returns zero when no unrevoked tokens match the family", async () => {
        refreshTokenUpdateManyMock.mockResolvedValue({ count: 0 });

        const result = await revokeRefreshTokenFamily(
            familyId,
            revokedAt,
        );

        expect(result).toEqual({ count: 0 });
    });

    it("propagates database errors", async () => {
        const databaseError = new Error("Database unavailable");

        refreshTokenUpdateManyMock.mockRejectedValue(databaseError);

        await expect(
            revokeRefreshTokenFamily(familyId, revokedAt),
        ).rejects.toBe(databaseError);
    });
});