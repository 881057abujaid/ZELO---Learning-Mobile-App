import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { registerUserMock } = vi.hoisted(() => ({
    registerUserMock: vi.fn(),
}));

vi.mock("../../src/modules/auth/auth.service.js", () => ({
    registerUser: registerUserMock,
}));

async function createTestApp() {
    vi.resetModules();

    const { default: app } = await import("../../src/app.js");

    return app;
}

const validRegistration = {
    email: "learner@example.com",
    password: "SecurePassword123",
};

describe("POST /api/v1/auth/register", () => {
    beforeEach(() => {
        registerUserMock.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("registers a user and returns 201 without exposing the password hash", async () => {
        registerUserMock.mockResolvedValue({
            id: "user-123",
            email: "learner@example.com",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
        });

        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(validRegistration);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            success: true,
            data: {
                user: {
                    id: "user-123",
                    email: "learner@example.com",
                    createdAt: "2026-01-01T00:00:00.000Z",
                },
            },
        });

        expect(response.body.data.user.passwordHash).toBeUndefined();
        expect(registerUserMock).toHaveBeenCalledTimes(1);
    });

    it("rejects invalid input before calling the registration service", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                email: "not-an-email",
                password: "short",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(registerUserMock).not.toHaveBeenCalled();
    });

    it("rejects unexpected fields", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                ...validRegistration,
                role: "ADMIN",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(registerUserMock).not.toHaveBeenCalled();
    });

    it("returns 409 when the email is already registered", async () => {
        const app = await createTestApp();

        const { AppError: TestAppError } = await import(
            "../../src/common/errors/app-error.js"
        );

        registerUserMock.mockRejectedValue(
            new TestAppError(
                409,
                "EMAIL_ALREADY_EXISTS",
                "An account with this email already exists.",
            ),
        );

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(validRegistration);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            success: false,
            error: {
                code: "EMAIL_ALREADY_EXISTS",
                message: "An account with this email already exists.",
            },
        });
    });

    it("returns a safe 500 response for unexpected errors", async () => {
        registerUserMock.mockRejectedValue(
            new Error("Sensitive internal database details"),
        );

        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(validRegistration);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong. Please try again later.",
            },
        });

        expect(JSON.stringify(response.body)).not.toContain(
            "Sensitive internal database details",
        );
    });

    it("returns 404 for an unknown endpoint", async () => {
        const app = await createTestApp();

        const response = await request(app).get(
            "/api/v1/auth/unknown",
        );

        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe("NOT_FOUND");
    });

    it("rate-limits registration after five attempts", async () => {
        registerUserMock.mockResolvedValue({
            id: "user-123",
            email: "learner@example.com",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
        });

        const app = await createTestApp();

        for (let attempt = 0; attempt < 5; attempt += 1) {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(validRegistration);

            expect(response.status).toBe(201);
        }

        const limitedResponse = await request(app)
            .post("/api/v1/auth/register")
            .send(validRegistration);

        expect(limitedResponse.status).toBe(429);
        expect(limitedResponse.body.error.code).toBe("RATE_LIMITED");
        expect(registerUserMock).toHaveBeenCalledTimes(5);
    });
});