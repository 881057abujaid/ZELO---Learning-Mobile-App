import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import request from "supertest";

const { logoutUserMock } = vi.hoisted(() => ({
    logoutUserMock: vi.fn(),
}));

vi.mock("../../src/modules/auth/auth.service.js", () => ({
    loginUser: vi.fn(),
    logoutUser: logoutUserMock,
    refreshUserSession: vi.fn(),
    registerUser: vi.fn(),
}));

async function createTestApp() {
    vi.resetModules();

    const { default: app } = await import("../../src/app.js");

    return app;
}

const validLogout = {
    refreshToken: "test-refresh-token",
};

describe("POST /api/v1/auth/logout", () => {
    beforeEach(() => {
        logoutUserMock.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("logs out successfully", async () => {
        logoutUserMock.mockResolvedValue(undefined);

        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/logout")
            .send(validLogout);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            data: {
                message: "Logged out successfully.",
            },
        });

        expect(logoutUserMock).toHaveBeenCalledWith(validLogout);
    });

    it("rejects a missing refresh token", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/logout")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(logoutUserMock).not.toHaveBeenCalled();
    });

    it("rejects unexpected request fields", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .post("/api/v1/auth/logout")
            .send({
                ...validLogout,
                userId: "another-user",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(logoutUserMock).not.toHaveBeenCalled();
    });

    it("returns the authentication error for an unknown refresh token", async () => {
        const app = await createTestApp();

        const { AppError: TestAppError } = await import(
            "../../src/common/errors/app-error.js"
        );

        logoutUserMock.mockRejectedValue(
            new TestAppError(
                401,
                "UNAUTHENTICATED",
                "Please sign in to continue.",
            ),
        );

        const response = await request(app)
            .post("/api/v1/auth/logout")
            .send(validLogout);

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            error: {
                code: "UNAUTHENTICATED",
                message: "Please sign in to continue.",
            },
        });
    });

    it("does not expose internal errors", async () => {
        const app = await createTestApp();

        logoutUserMock.mockRejectedValue(
            new Error("Database connection details"),
        );

        const response = await request(app)
            .post("/api/v1/auth/logout")
            .send(validLogout);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.error.message).not.toContain(
            "Database connection details",
        );
    });
});
