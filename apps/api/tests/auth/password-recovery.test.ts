import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import request from "supertest";

const {
    requestPasswordResetMock,
    resetPasswordServiceMock,
} = vi.hoisted(() => ({
    requestPasswordResetMock: vi.fn(),
    resetPasswordServiceMock: vi.fn(),
}));

vi.mock("../../src/modules/auth/auth.service.js", () => ({
    requestPasswordReset: requestPasswordResetMock,
    resetPassword: resetPasswordServiceMock,

    // Other controller imports must also be present in the mock.
    registerUser: vi.fn(),
    loginUser: vi.fn(),
    refreshUserSession: vi.fn(),
    logoutUser: vi.fn(),
}));

async function createTestApp() {
    vi.resetModules();

    const { default: app } = await import("../../src/app.js");

    return app;
}

const validForgotPassword = {
    email: "learner@example.com",
};

const validResetPassword = {
    token: "test-reset-token",
    newPassword: "NewSecurePassword123",
};

describe("Password recovery endpoints", () => {
    beforeEach(() => {
        requestPasswordResetMock.mockReset();
        resetPasswordServiceMock.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("POST /api/v1/auth/forgot-password", () => {
        it("returns a generic success response", async () => {
            requestPasswordResetMock.mockResolvedValue(undefined);

            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send(validForgotPassword);

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                data: {
                    message:
                        "If an account exists for that email, password reset instructions have been sent.",
                },
            });

            expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
            expect(requestPasswordResetMock).toHaveBeenCalledWith(
                validForgotPassword,
            );
        });

        it("trims surrounding whitespace before passing the email to the service", async () => {
            requestPasswordResetMock.mockResolvedValue(undefined);

            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send({
                    email: "  LEARNER@example.com  ",
                });

            expect(response.status).toBe(200);

            expect(requestPasswordResetMock).toHaveBeenCalledWith({
                email: "LEARNER@example.com",
            });
        });

        it("rejects invalid email input", async () => {
            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send({
                    email: "not-an-email",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe("VALIDATION_ERROR");

            expect(requestPasswordResetMock).not.toHaveBeenCalled();
        });

        it("rejects unexpected fields", async () => {
            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send({
                    ...validForgotPassword,
                    role: "ADMIN",
                });

            expect(response.status).toBe(400);
            expect(response.body.error.code).toBe("VALIDATION_ERROR");

            expect(requestPasswordResetMock).not.toHaveBeenCalled();
        });

        it("returns a safe error response when the service fails", async () => {
            requestPasswordResetMock.mockRejectedValue(
                new Error("Sensitive email provider details"),
            );

            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send(validForgotPassword);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);

            expect(JSON.stringify(response.body)).not.toContain(
                "Sensitive email provider details",
            );
        });
    });

    describe("POST /api/v1/auth/reset-password", () => {
        it("returns success when the password is reset", async () => {
            resetPasswordServiceMock.mockResolvedValue(undefined);

            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/reset-password")
                .send(validResetPassword);

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                data: {
                    message: "Password has been reset successfully.",
                },
            });

            expect(resetPasswordServiceMock).toHaveBeenCalledTimes(1);
            expect(resetPasswordServiceMock).toHaveBeenCalledWith(
                validResetPassword,
            );
        });

        it("rejects a missing reset token", async () => {
            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/reset-password")
                .send({
                    newPassword: "NewSecurePassword123",
                });

            expect(response.status).toBe(400);
            expect(response.body.error.code).toBe("VALIDATION_ERROR");

            expect(resetPasswordServiceMock).not.toHaveBeenCalled();
        });

        it("rejects a password that is too short", async () => {
            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/reset-password")
                .send({
                    token: "test-reset-token",
                    newPassword: "short",
                });

            expect(response.status).toBe(400);
            expect(response.body.error.code).toBe("VALIDATION_ERROR");

            expect(resetPasswordServiceMock).not.toHaveBeenCalled();
        });

        it("rejects unexpected request fields", async () => {
            const app = await createTestApp();

            const response = await request(app)
                .post("/api/v1/auth/reset-password")
                .send({
                    ...validResetPassword,
                    userId: "user-123",
                });

            expect(response.status).toBe(400);
            expect(response.body.error.code).toBe("VALIDATION_ERROR");

            expect(resetPasswordServiceMock).not.toHaveBeenCalled();
        });

        it("returns a safe error response when reset fails", async () => {
            const app = await createTestApp();

            const { AppError: TestAppError } = await import(
                "../../src/common/errors/app-error.js"
            );

            resetPasswordServiceMock.mockRejectedValue(
                new TestAppError(
                    400,
                    "INVALID_OR_EXPIRED_RESET_TOKEN",
                    "This password reset link is invalid or has expired.",
                ),
            );

            const response = await request(app)
                .post("/api/v1/auth/reset-password")
                .send(validResetPassword);

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                error: {
                    code: "INVALID_OR_EXPIRED_RESET_TOKEN",
                    message:
                        "This password reset link is invalid or has expired.",
                },
            });
        });
    });
});