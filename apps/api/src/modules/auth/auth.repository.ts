import { Prisma } from "../../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../common/errors/app-error.js";

interface CreateUserInput {
    email: string;
    emailNormalized: string;
    passwordHash: string;
}

export async function createUser(input: CreateUserInput) {
    try {
        return await prisma.user.create({
            data: {
                email: input.email,
                emailNormalized: input.emailNormalized,
                passwordHash: input.passwordHash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
    } catch (error: unknown) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new AppError(
                409,
                "EMAIL_ALREADY_EXISTS",
                "An account with this email already exists.",
            );
        }

        throw error;
    }
}

interface CreateRefreshTokenInput {
    userId: string;
    familyId: string;
    tokenHash: string;
    expiresAt: Date;
}

export async function createRefreshToken(input: CreateRefreshTokenInput) {
    return prisma.refreshToken.create({
        data: {
            userId: input.userId,
            familyId: input.familyId,
            tokenHash: input.tokenHash,
            expiresAt: input.expiresAt,
        },
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
}

export async function findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
        where: {
            tokenHash,
        },
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
}

interface RotateRefreshTokenInput {
    currentTokenId: string;
    replacementToken: {
        userId: string;
        familyId: string;
        tokenHash: string;
        expiresAt: Date;
    };
    consumedAt: Date;
}

export async function rotateRefreshToken(input: RotateRefreshTokenInput) {
    return prisma.$transaction(async (transaction) => {
        const consumedToken = await transaction.refreshToken.updateMany({
            where: {
                id: input.currentTokenId,
                userId: input.replacementToken.userId,
                familyId: input.replacementToken.familyId,
                consumedAt: null,
                revokedAt: null,
                expiresAt: {
                    gt: input.consumedAt,
                },
            },
            data: {
                consumedAt: input.consumedAt,
            },
        });

        if (consumedToken.count !== 1) {
            return null;
        }

        const replacement = await transaction.refreshToken.create({
            data: {
                userId: input.replacementToken.userId,
                familyId: input.replacementToken.familyId,
                tokenHash: input.replacementToken.tokenHash,
                expiresAt: input.replacementToken.expiresAt,
            },
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

        await transaction.refreshToken.update({
            where: {
                id: input.currentTokenId,
            },
            data: {
                replacedByTokenId: replacement.id,
            },
        });

        return replacement;
    });
}

export async function revokeRefreshTokenFamily(
    familyId: string,
    revokedAt: Date,
) {
    return prisma.refreshToken.updateMany({
        where: {
            familyId,
            revokedAt: null,
        },
        data: {
            revokedAt,
        },
    });
}

export async function findUserForLogin(emailNormalized: string) {
    return prisma.user.findUnique({
        where: {
            emailNormalized,
        },
        select: {
            id: true,
            email: true,
            passwordHash: true,
            createdAt: true,
        },
    });
}

interface CreatePasswordResetTokenInput {
    userId: string;
    tokenHash: string;
    createdAt: Date;
    expiresAt: Date;
}

export async function createPasswordResetToken(
    input: CreatePasswordResetTokenInput,
) {
    return prisma.$transaction(async (transaction) => {
        // Remove older recovery tokens for this user.
        await transaction.passwordResetToken.deleteMany({
            where: {
                userId: input.userId,
            },
        });

        // Store only the hash, never the raw recovery token.
        return transaction.passwordResetToken.create({
            data: {
                userId: input.userId,
                tokenHash: input.tokenHash,
                createdAt: input.createdAt,
                expiresAt: input.expiresAt,
            },
            select: {
                id: true,
                userId: true,
                createdAt: true,
                expiresAt: true,
            },
        });
    });
}

export async function findUserForPasswordReset(emailNormalized: string) {
    return prisma.user.findUnique({
        where: { emailNormalized },
        select: {
            id: true,
            email: true,
        },
    });
}


export async function deletePasswordResetTokenByHash(
    tokenHash: string,
) {
    return prisma.passwordResetToken.deleteMany({
        where: {
            tokenHash,
        },
    });
}

interface CompletePasswordResetInput {
    tokenHash: string;
    passwordHash: string;
    now: Date;
}

export async function completePasswordReset(
    input: CompletePasswordResetInput,
): Promise<boolean> {
    return prisma.$transaction(async (transaction) => {
        // Find the account associated with this reset token.
        const resetToken =
            await transaction.passwordResetToken.findUnique({
                where: {
                    tokenHash: input.tokenHash,
                },
                select: {
                    id: true,
                    userId: true,
                },
            });

        if (!resetToken) {
            return false;
        }

        // Consume the token conditionally. Only one concurrent
        // request can successfully consume an unused token.
        const consumed =
            await transaction.passwordResetToken.updateMany({
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

        if (consumed.count !== 1) {
            return false;
        }

        // Update the password only after successful token consumption.
        await transaction.user.update({
            where: {
                id: resetToken.userId,
            },
            data: {
                passwordHash: input.passwordHash,
            },
        });

        // Revoke every refresh session belonging to this user.
        await transaction.refreshToken.updateMany({
            where: {
                userId: resetToken.userId,
                revokedAt: null,
            },
            data: {
                revokedAt: input.now,
            },
        });

        return true;
    });
}
