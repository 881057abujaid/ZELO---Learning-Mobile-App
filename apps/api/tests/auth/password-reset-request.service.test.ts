import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { createHash } from "node:crypto";

const {
    findUserForPasswordResetMock,
    createPasswordResetTokenMock,
    deletePasswordResetTokenByHashMock,
    sendPasswordResetEmailMock,
    getPasswordResetUrlConfigMock,
} = vi.hoisted(() => ({
    findUserForPasswordResetMock: vi.fn(),
    createPasswordResetTokenMock: vi.fn(),
    deletePasswordResetTokenByHashMock: vi.fn(),
    sendPasswordResetEmailMock: vi.fn(),
    getPasswordResetUrlConfigMock: vi.fn(),
}));

vi.mock("argon2", () => ({
    default: {
        hash: vi.fn(),
        verify: vi.fn(),
    },
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
    createUser: vi.fn(),
    findUserForPasswordReset: findUserForPasswordResetMock,
    createPasswordResetToken: createPasswordResetTokenMock,
    deletePasswordResetTokenByHash:
        deletePasswordResetTokenByHashMock,

    loginUser: vi.fn(),
    findUserForLogin: vi.fn(),
    findRefreshTokenByHash: vi.fn(),
    revokeRefreshTokenFamily: vi.fn(),
    rotateRefreshToken: vi.fn(),
}));

vi.mock(
    "../../src/modules/auth/password-reset-email.service.js",
    () => ({
        sendPasswordResetEmail: sendPasswordResetEmailMock,
    }),
);

vi.mock("../../src/config/email-config.js", () => ({
    getPasswordResetUrlConfig: getPasswordResetUrlConfigMock,
}));

import {
    requestPasswordReset,
} from "../../src/modules/auth/auth.service.js";

describe("requestPasswordReset", () => {
    const user = {
        id: "user-123",
        email: "learner@example.com",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.useFakeTimers();
        vi.setSystemTime(
            new Date("2026-11-01T10:00:00.000Z"),
        );

        findUserForPasswordResetMock.mockResolvedValue(user);

        createPasswordResetTokenMock.mockResolvedValue({
            id: "reset-123",
            userId: user.id,
            createdAt: new Date("2026-11-01T10:00:00.000Z"),
            expiresAt: new Date("2026-11-01T10:30:00.000Z"),
        });

        deletePasswordResetTokenByHashMock.mockResolvedValue(
            undefined,
        );

        getPasswordResetUrlConfigMock.mockReturnValue({
            passwordResetUrlBase:
                "https://example.com/reset-password",
        });

        sendPasswordResetEmailMock.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns successfully when the account does not exist", async () => {
        findUserForPasswordResetMock.mockResolvedValue(null);

        await expect(
            requestPasswordReset({
                email: "unknown@example.com",
            }),
        ).resolves.toBeUndefined();

        expect(createPasswordResetTokenMock)
            .not.toHaveBeenCalled();

        expect(sendPasswordResetEmailMock)
            .not.toHaveBeenCalled();
    });

    it("stores only the SHA-256 hash of the raw reset token", async () => {
        await requestPasswordReset({
            email: "learner@example.com",
        });

        const tokenInput =
            createPasswordResetTokenMock.mock.calls[0]?.[0];

        expect(tokenInput).toBeDefined();
        expect(tokenInput.userId).toBe(user.id);

        const emailInput =
            sendPasswordResetEmailMock.mock.calls[0]?.[0];

        const resetUrl = new URL(emailInput.resetUrl);
        const rawToken = resetUrl.searchParams.get("token");

        expect(rawToken).toBeTruthy();

        const expectedHash = createHash("sha256")
            .update(rawToken!)
            .digest("hex");

        expect(tokenInput.tokenHash).toBe(expectedHash);
        expect(tokenInput.tokenHash).not.toBe(rawToken);
    });

    it("sets the reset token expiry to 30 minutes", async () => {
        const now = new Date();

        await requestPasswordReset({
            email: "learner@example.com",
        });

        const tokenInput =
            createPasswordResetTokenMock.mock.calls[0]?.[0];

        expect(tokenInput.createdAt.getTime())
            .toBe(now.getTime());

        expect(tokenInput.expiresAt.getTime())
            .toBe(now.getTime() + 30 * 60 * 1000);
    });

    it("normalizes the email before looking up the account", async () => {
        await requestPasswordReset({
            email: "Learner@Example.com",
        });

        expect(findUserForPasswordResetMock)
            .toBeDefined();

        expect(findUserForPasswordResetMock)
            .toHaveBeenCalledWith("learner@example.com");
    });

    it("deletes the reset token if email delivery fails", async () => {
        sendPasswordResetEmailMock.mockRejectedValue(
            new Error("Email delivery failed"),
        );

        await expect(
            requestPasswordReset({
                email: "learner@example.com",
            }),
        ).rejects.toThrow("Email delivery failed");

        const tokenInput =
            createPasswordResetTokenMock.mock.calls[0]?.[0];

        expect(deletePasswordResetTokenByHashMock)
            .toHaveBeenCalledWith(tokenInput.tokenHash);
    });

    it("does not create a token when reset URL configuration is invalid", async () => {
        getPasswordResetUrlConfigMock.mockImplementation(() => {
            throw new Error("Invalid email configuration");
        });

        await expect(
            requestPasswordReset({
                email: "learner@example.com",
            }),
        ).rejects.toThrow("Invalid email configuration");

        expect(createPasswordResetTokenMock)
            .not.toHaveBeenCalled();

        expect(sendPasswordResetEmailMock)
            .not.toHaveBeenCalled();
    });
});