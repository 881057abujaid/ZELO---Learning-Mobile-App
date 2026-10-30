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
