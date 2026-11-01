import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
    sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
    Resend: vi.fn(function () {
        return {
            emails: {
                send: sendMock,
            },
        };
    }),
}));

import { sendPasswordResetEmail } from "../../src/modules/auth/password-reset-email.service.js";

describe("sendPasswordResetEmail", () => {
    beforeEach(() => {
        vi.stubEnv("RESEND_API_KEY", "test_resend_api_key");
        vi.stubEnv("RESEND_FROM_EMAIL", "ZELO <noreply@example.com>");

        sendMock.mockReset();
        sendMock.mockResolvedValue({ data: { id: "email_test_123" }, error: null });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("sends a password reset email with the correct content", async () => {
        const input = {
            to: "student@example.com",
            resetUrl: "zelo://reset-password?token=test_token",
        };

        await sendPasswordResetEmail(input);

        expect(sendMock).toHaveBeenCalledOnce();
        expect(sendMock).toHaveBeenCalledWith(
            expect.objectContaining({
                from: "ZELO <noreply@example.com>",
                to: "student@example.com",
                subject: "Reset your ZELO password",
                text: expect.stringContaining(input.resetUrl),
                html: expect.stringContaining(input.resetUrl),
            }),
        );

        const emailContent = sendMock.mock.calls[0][0];

        expect(emailContent.text).toContain("30 minutes");
        expect(emailContent.html).toContain("Reset Password");
        expect(emailContent.html).toContain("30 minutes");
    });

    it("throws an error when the Resend API key is missing", async () => {
        vi.stubEnv("RESEND_API_KEY", "");

        await expect(
            sendPasswordResetEmail({
                to: "student@example.com",
                resetUrl: "zelo://reset-password?token=test_token",
            }),
        ).rejects.toThrow(
            "Password recovery email service is not configured.",
        );

        expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws an error when the sender email is missing", async () => {
        vi.stubEnv("RESEND_FROM_EMAIL", "");

        await expect(
            sendPasswordResetEmail({
                to: "student@example.com",
                resetUrl: "zelo://reset-password?token=test_token",
            }),
        ).rejects.toThrow(
            "Password recovery email service is not configured.",
        );

        expect(sendMock).not.toHaveBeenCalled();
    });

    it("throws an error when Resend reports a delivery failure", async () => {
        sendMock.mockResolvedValue({
            data: null,
            error: {
                name: "validation_error",
                message: "Email delivery failed",
            },
        });

        await expect(
            sendPasswordResetEmail({
                to: "student@example.com",
                resetUrl: "zelo://reset-password?token=test_token",
            }),
        ).rejects.toThrow(
            "Password recovery email delivery failed.",
        );
    });
});