import { beforeEach, describe, expect, it, vi } from "vitest";

const { hashMock, createUserMock } = vi.hoisted(() => ({
    hashMock: vi.fn(),
    createUserMock: vi.fn(),
}));

vi.mock("argon2", () => ({
    default: {
        hash: hashMock,
    },
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
    createUser: createUserMock,
}));

import { registerUser } from "../../src/modules/auth/auth.service.js";

describe("registerUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("hashes the password before creating the user", async () => {
        hashMock.mockResolvedValue("argon2$test-hash");

        createUserMock.mockResolvedValue({
            id: "user-123",
            email: "learner@example.com",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
        });

        await registerUser({
            email: "learner@example.com",
            password: "SecurePassword123",
        });

        expect(hashMock).toHaveBeenCalledWith("SecurePassword123");

        expect(createUserMock).toHaveBeenCalledWith({
            email: "learner@example.com",
            emailNormalized: "learner@example.com",
            passwordHash: "argon2$test-hash",
        });

        expect(createUserMock).toHaveBeenCalledTimes(1);
    });

    it("normalizes the email to lowercase", async () => {
        hashMock.mockResolvedValue("argon2$test-hash");
        createUserMock.mockResolvedValue({
            id: "user-123",
            email: "Learner@Example.com",
            createdAt: new Date(),
        });

        await registerUser({
            email: "Learner@Example.com",
            password: "SecurePassword123",
        });

        expect(createUserMock).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "Learner@Example.com",
                emailNormalized: "learner@example.com",
            }),
        );
    });

    it("does not create a user if password hashing fails", async () => {
        hashMock.mockRejectedValue(new Error("Hashing failed"));

        await expect(
            registerUser({
                email: "learner@example.com",
                password: "SecurePassword123",
            }),
        ).rejects.toThrow("Hashing failed");

        expect(createUserMock).not.toHaveBeenCalled();
    });

    it("propagates repository errors", async () => {
        hashMock.mockResolvedValue("argon2$test-hash");
        createUserMock.mockRejectedValue(
            new Error("Database unavailable"),
        );

        await expect(
            registerUser({
                email: "learner@example.com",
                password: "SecurePassword123",
            }),
        ).rejects.toThrow("Database unavailable");
    });
});