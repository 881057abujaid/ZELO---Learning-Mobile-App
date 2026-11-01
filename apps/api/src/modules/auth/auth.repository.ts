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
