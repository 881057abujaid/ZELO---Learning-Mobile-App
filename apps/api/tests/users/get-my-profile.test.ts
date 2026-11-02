import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import request from "supertest";
import { SignJWT } from "jose";

import {
    ACCESS_TOKEN_AUDIENCE,
    ACCESS_TOKEN_ISSUER,
} from "../../src/modules/auth/access-token.service.js";

const { getMyProfileMock } = vi.hoisted(() => ({
    getMyProfileMock: vi.fn(),
}));

vi.mock("../../src/modules/users/users.service.js", () => ({
    getMyProfile: getMyProfileMock,
}));

const TEST_SECRET = "test-secret-for-access-token-tests-32";
const TEST_USER_ID = "11111111-1111-4111-8111-111111111111";

async function createTestApp() {
    vi.resetModules();

    const { default: app } = await import("../../src/app.js");

    return app;
}

async function createAccessToken(
    userId = TEST_USER_ID,
): Promise<string> {
    return new SignJWT({})
        .setProtectedHeader({
            alg: "HS256",
            typ: "JWT",
        })
        .setSubject(userId)
        .setIssuer(ACCESS_TOKEN_ISSUER)
        .setAudience(ACCESS_TOKEN_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(new TextEncoder().encode(TEST_SECRET));
}

const mockProfile = {
    id: TEST_USER_ID,
    email: "student@example.com",
    createdAt: "2026-11-02T08:00:00.000Z",
    profile: {
        username: null,
        avatarKey: null,
        bio: null,
    },
};

describe("GET /api/v1/users/me", () => {
    beforeEach(() => {
        getMyProfileMock.mockReset();

        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns the authenticated user's permitted profile fields", async () => {
        getMyProfileMock.mockResolvedValue(mockProfile);

        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .get("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            data: mockProfile,
        });

        expect(getMyProfileMock).toHaveBeenCalledWith(TEST_USER_ID);
    });

    it("rejects requests without an access token", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/api/v1/users/me");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");

        expect(getMyProfileMock).not.toHaveBeenCalled();
    });

    it("does not expose private account credentials", async () => {
        getMyProfileMock.mockResolvedValue(mockProfile);

        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .get("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);

        expect(response.body.data).not.toHaveProperty("passwordHash");
        expect(response.body.data).not.toHaveProperty("refreshTokens");
        expect(response.body.data).not.toHaveProperty(
            "passwordResetTokens",
        );
    });

    it("returns null profile fields when the user has no profile yet", async () => {
        getMyProfileMock.mockResolvedValue({
            ...mockProfile,
            profile: {
                username: null,
                avatarKey: null,
                bio: null,
            },
        });

        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .get("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);

        expect(response.body.data.profile).toEqual({
            username: null,
            avatarKey: null,
            bio: null,
        });
    });
});