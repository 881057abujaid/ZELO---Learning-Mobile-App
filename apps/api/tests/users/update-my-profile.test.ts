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

const { updateMyProfileMock, getMyProfileMock } = vi.hoisted(
    () => ({
        updateMyProfileMock: vi.fn(),
        getMyProfileMock: vi.fn(),
    }),
);

vi.mock("../../src/modules/users/users.service.js", () => ({
    getMyProfile: getMyProfileMock,
    updateMyProfile: updateMyProfileMock,
}));

const TEST_SECRET = "test-secret-for-access-token-tests-32";
const TEST_USER_ID = "11111111-1111-4111-8111-111111111111";
const OTHER_USER_ID = "22222222-2222-4222-8222-222222222222";

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

describe("PATCH /api/v1/users/me", () => {
    beforeEach(() => {
        updateMyProfileMock.mockReset();
        getMyProfileMock.mockReset();

        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("updates the authenticated user's profile", async () => {
        const updatedProfile = {
            username: "student_01",
            avatarKey: "girl_01",
            bio: "Learning to code.",
        };

        updateMyProfileMock.mockResolvedValue(updatedProfile);

        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updatedProfile);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            data: updatedProfile,
        });

        expect(updateMyProfileMock).toHaveBeenCalledWith(
            TEST_USER_ID,
            updatedProfile,
        );
    });

    it("rejects requests without an access token", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .send({
                username: "student_01",
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");

        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects usernames shorter than 3 characters", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                username: "ab",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects usernames containing unsupported characters", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                username: "student name!",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects avatar keys outside the approved list", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                avatarKey: "avatar_99",
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects bios longer than 160 characters", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                bio: "a".repeat(161),
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects an empty request body", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("rejects unknown fields, including a client-supplied userId", async () => {
        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                username: "student_01",
                userId: OTHER_USER_ID,
            });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe("VALIDATION_ERROR");
        expect(updateMyProfileMock).not.toHaveBeenCalled();
    });

    it("allows nullable avatar and bio fields to be cleared", async () => {
        const updatedProfile = {
            username: "student_01",
            avatarKey: null,
            bio: null,
        };

        updateMyProfileMock.mockResolvedValue(updatedProfile);

        const app = await createTestApp();
        const accessToken = await createAccessToken();

        const response = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                avatarKey: null,
                bio: null,
            });

        expect(response.status).toBe(200);

        expect(updateMyProfileMock).toHaveBeenCalledWith(
            TEST_USER_ID,
            {
                avatarKey: null,
                bio: null,
            },
        );
    });
});
