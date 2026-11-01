import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client.js";

const {
    userCreateMock,
    transactionMock,
    passwordResetTokenFindUniqueMock,
    passwordResetTokenUpdateManyMock,
    userUpdateMock,
    refreshTokenUpdateManyMock,
} = vi.hoisted(() => ({
    userCreateMock: vi.fn(),
    transactionMock: vi.fn(),
    passwordResetTokenFindUniqueMock: vi.fn(),
    passwordResetTokenUpdateManyMock: vi.fn(),
    userUpdateMock: vi.fn(),
    refreshTokenUpdateManyMock: vi.fn(),
}));

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        user: {
            create: userCreateMock,
        },
        $transaction: transactionMock,
    },
}));

import {
    createUser,
    completePasswordReset,
} from "../../src/modules/auth/auth.repository.js";

describe("createUser", () => {
    beforeEach(() => {
        userCreateMock.mockReset();
    });

    const input = {
        email: "learner@example.com",
        emailNormalized: "learner@example.com",
        passwordHash: "argon2$test-hash",
    };

    it("creates a user with the expected fields and selection", async () => {
        const createdUser = {
            id: "user-123",
            email: "learner@example.com",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
        };

        userCreateMock.mockResolvedValue(createdUser);

        const result = await createUser(input);

        expect(userCreateMock).toHaveBeenCalledWith({
            data: input,
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        expect(result).toEqual(createdUser);
        expect(result).not.toHaveProperty("passwordHash");
    });

    it("maps Prisma P2002 to a 409 duplicate-email AppError", async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed",
            {
                code: "P2002",
                clientVersion: "7.10.1",
                meta: {
                    target: ["emailNormalized"],
                },
            },
        );

        userCreateMock.mockRejectedValue(prismaError);

        await expect(createUser(input)).rejects.toMatchObject({
            name: "AppError",
            statusCode: 409,
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email already exists.",
        });
    });

    it("propagates unrelated database errors", async () => {
        const databaseError = new Error("Database unavailable");

        userCreateMock.mockRejectedValue(databaseError);

        await expect(createUser(input)).rejects.toBe(databaseError);
    });

    it("does not convert unrelated Prisma errors into duplicate-email errors", async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Foreign key constraint failed",
            {
                code: "P2003",
                clientVersion: "7.10.1",
            },
        );

        userCreateMock.mockRejectedValue(prismaError);

        await expect(createUser(input)).rejects.toBe(prismaError);
    });
});

describe("completePasswordReset", () => {
    const input = {
        tokenHash: "sha256-reset-token-hash",
        passwordHash: "argon2$new-password-hash",
        now: new Date("2026-11-01T10:00:00.000Z"),
    };

    const resetToken = {
        id: "reset-token-123",
        userId: "user-123",
    };

    const transaction = {
        passwordResetToken: {
            findUnique: passwordResetTokenFindUniqueMock,
            updateMany: passwordResetTokenUpdateManyMock,
        },
        user: {
            update: userUpdateMock,
        },
        refreshToken: {
            updateMany: refreshTokenUpdateManyMock,
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();

        transactionMock.mockImplementation(
            async (callback: (tx: typeof transaction) => unknown) =>
                callback(transaction),
        );

        passwordResetTokenFindUniqueMock.mockResolvedValue(
            resetToken,
        );

        passwordResetTokenUpdateManyMock.mockResolvedValue({
            count: 1,
        });

        userUpdateMock.mockResolvedValue({
            id: "user-123",
        });

        refreshTokenUpdateManyMock.mockResolvedValue({
            count: 2,
        });
    });

    it("consumes the token, updates the password and revokes active sessions", async () => {
        const result = await completePasswordReset(input);

        expect(result).toBe(true);

        expect(passwordResetTokenFindUniqueMock)
            .toHaveBeenCalledWith({
                where: {
                    tokenHash: input.tokenHash,
                },
                select: {
                    id: true,
                    userId: true,
                },
            });

        expect(passwordResetTokenUpdateManyMock)
            .toHaveBeenCalledWith({
                where: {
                    id: resetToken.id,
                    tokenHash: input.tokenHash,
                    consumedAt: null,
                    expiresAt: {
                        gt: input.now,
                    },
                },
                data: {
                    consumedAt: input.now,
                },
            });

        expect(userUpdateMock).toHaveBeenCalledWith({
            where: {
                id: resetToken.userId,
            },
            data: {
                passwordHash: input.passwordHash,
            },
        });

        expect(refreshTokenUpdateManyMock)
            .toHaveBeenCalledWith({
                where: {
                    userId: resetToken.userId,
                    revokedAt: null,
                },
                data: {
                    revokedAt: input.now,
                },
            });
    });

    it("returns false when the token does not exist", async () => {
        passwordResetTokenFindUniqueMock.mockResolvedValue(null);

        const result = await completePasswordReset(input);

        expect(result).toBe(false);
        expect(passwordResetTokenUpdateManyMock)
            .not.toHaveBeenCalled();
        expect(userUpdateMock).not.toHaveBeenCalled();
        expect(refreshTokenUpdateManyMock)
            .not.toHaveBeenCalled();
    });

    it("does not update the password when token consumption fails", async () => {
        passwordResetTokenUpdateManyMock.mockResolvedValue({
            count: 0,
        });

        const result = await completePasswordReset(input);

        expect(result).toBe(false);
        expect(userUpdateMock).not.toHaveBeenCalled();
        expect(refreshTokenUpdateManyMock)
            .not.toHaveBeenCalled();
    });

    it("propagates database errors so the transaction can roll back", async () => {
        const databaseError = new Error("Database unavailable");

        userUpdateMock.mockRejectedValue(databaseError);

        await expect(
            completePasswordReset(input),
        ).rejects.toBe(databaseError);

        expect(refreshTokenUpdateManyMock)
            .not.toHaveBeenCalled();
    });
});
