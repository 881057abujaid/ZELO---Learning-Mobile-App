import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client.js";

const { userCreateMock } = vi.hoisted(() => ({
    userCreateMock: vi.fn(),
}));

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        user: {
            create: userCreateMock,
        },
    },
}));

import { createUser } from "../../src/modules/auth/auth.repository.js";
import { AppError } from "../../src/common/errors/app-error.js";

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