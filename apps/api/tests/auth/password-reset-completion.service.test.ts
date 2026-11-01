import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/common/errors/app-error.js";

const { hashMock, completePasswordResetMock } = vi.hoisted(() => ({
    hashMock: vi.fn(),
    completePasswordResetMock: vi.fn(),
}));

vi.mock("argon2", () => ({
    default: {
        hash: hashMock,
    },
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
    completePasswordReset: completePasswordResetMock,
}));

import { resetPassword } from "../../src/modules/auth/auth.service.js";

describe("resetPassword", () => {
    const input = {
        token: "raw-reset-token",
        newPassword: "NewSecurePassword123!",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        hashMock.mockResolvedValue("argon2$hashed-password");

        completePasswordResetMock.mockResolvedValue(true);
    });

    it("resets the password successfully", async () => {
        await expect(resetPassword(input)).resolves.toBeUndefined();

        expect(hashMock).toHaveBeenCalledWith(input.newPassword);
        expect(completePasswordResetMock).toHaveBeenCalledTimes(1);
    });

    it("passes the SHA-256 token hash and password hash to the repository", async () => {
        await resetPassword(input);

        const crypto = await import("node:crypto");
        const expectedTokenHash = crypto
            .createHash("sha256")
            .update(input.token)
            .digest("hex");

        expect(completePasswordResetMock).toHaveBeenCalledWith({
            tokenHash: expectedTokenHash,
            passwordHash: "argon2$hashed-password",
            now: expect.any(Date),
        });
    });

    it("throws AppError when the token is invalid or expired", async () => {
        completePasswordResetMock.mockResolvedValue(false);

        await expect(resetPassword(input)).rejects.toMatchObject({
            statusCode: 400,
            code: "INVALID_OR_EXPIRED_RESET_TOKEN",
            message: "This password reset link is invalid or has expired.",
        });
    });

    it("propagates password hashing errors", async () => {
        const hashingError = new Error("Password hashing failed");
        hashMock.mockRejectedValue(hashingError);

        await expect(resetPassword(input)).rejects.toBe(hashingError);

        expect(completePasswordResetMock).not.toHaveBeenCalled();
    });

    it("propagates repository errors", async () => {
        const repositoryError = new Error("Database unavailable");
        completePasswordResetMock.mockRejectedValue(repositoryError);

        await expect(resetPassword(input)).rejects.toBe(repositoryError);
    });
});
