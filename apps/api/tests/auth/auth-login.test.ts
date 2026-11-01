import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { loginUserMock } = vi.hoisted(() => ({
    loginUserMock: vi.fn(),
}));

vi.mock("../../src/modules/auth/auth.service.js", () => ({
    loginUser: loginUserMock,
    registerUser: vi.fn(),
}));

async function createTestApp() {
    vi.resetModules();

    const { default: app } = await import("../../src/app.js");

    return app;
}

const validLogin = {
    email: "learner@example.com",
    password: "SecurePassword123",
};

describe("POST /api/v1/auth/login", () => {
    beforeEach(() => {
        loginUserMock.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("authenticates a user and returns tokens", async () => {
        loginUserMock.mockResolvedValue({
            user: {
                id: "user-123",
                email: "learner@example.com",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
            },
            accessToken: "test-access-token",
            refreshToken: "test-refresh-token",
            tokenType: "Bearer",
            expiresIn: 900,
        });

        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send(validLogin);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            data: {
                user: {
                    id: "user-123",
                    email: "learner@example.com",
                    createdAt: "2026-01-01T00:00:00.000Z",
                },
                accessToken: "test-access-token",
                refreshToken: "test-refresh-token",
                tokenType: "Bearer",
                expiresIn: 900,
            },
        });

        expect(response.body.data.user.passwordHash).toBeUndefined();
        expect(loginUserMock).toHaveBeenCalledWith(validLogin);
    });

    it("rejects invalid login input before calling the service", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "invalid-email",
                password: "",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(loginUserMock).not.toHaveBeenCalled();
    });

    it("rejects unexpected request fields", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                ...validLogin,
                role: "ADMIN",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(loginUserMock).not.toHaveBeenCalled();
    });

    it("returns the generic credentials error for invalid credentials", async () => {
        const app = await createTestApp();

        // Import AppError after createTestApp resets and loads modules.
        const { AppError: TestAppError } = await import(
            "../../src/common/errors/app-error.js"
        );

        loginUserMock.mockRejectedValue(
            new TestAppError(
                401,
                "INVALID_CREDENTIALS",
                "Email or password is incorrect.",
            ),
        );

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send(validLogin);

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            error: {
                code: "INVALID_CREDENTIALS",
                message: "Email or password is incorrect.",
            },
        });
    });

    it("rate-limits repeated login attempts", async () => {
        loginUserMock.mockResolvedValue({
            user: {
                id: "user-123",
                email: "learner@example.com",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
            },
            accessToken: "test-access-token",
            refreshToken: "test-refresh-token",
            tokenType: "Bearer",
            expiresIn: 900,
        });

        const app = await createTestApp();

        for (let attempt = 0; attempt < 5; attempt += 1) {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send(validLogin);

            expect(response.status).toBe(200);
        }

        const limitedResponse = await request(app)
            .post("/api/v1/auth/login")
            .send(validLogin);

        expect(limitedResponse.status).toBe(429);
        expect(limitedResponse.body.error.code).toBe("RATE_LIMITED");
        expect(loginUserMock).toHaveBeenCalledTimes(5);
    });
});