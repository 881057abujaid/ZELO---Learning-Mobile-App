import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const { findUserProfileByIdMock } = vi.hoisted(() => ({
    findUserProfileByIdMock: vi.fn(),
}));

vi.mock("../../src/modules/users/users.repository.js", () => ({
    findUserProfileById: findUserProfileByIdMock,
}));

import { getMyProfile } from "../../src/modules/users/users.service.js";

const TEST_USER_ID = "11111111-1111-4111-8111-111111111111";

const mockUser = {
    id: TEST_USER_ID,
    email: "student@example.com",
    createdAt: new Date("2026-11-02T08:00:00.000Z"),
    profile: {
        username: "student_01",
        avatarKey: "avatar_01",
        bio: "Learning to code.",
    },
};

describe("getMyProfile", () => {
    beforeEach(() => {
        findUserProfileByIdMock.mockReset();
    });

    it("returns the permitted fields for an existing user", async () => {
        findUserProfileByIdMock.mockResolvedValue(mockUser);

        const result = await getMyProfile(TEST_USER_ID);

        expect(findUserProfileByIdMock).toHaveBeenCalledWith(TEST_USER_ID);

        expect(result).toEqual({
            id: TEST_USER_ID,
            email: "student@example.com",
            createdAt: mockUser.createdAt,
            profile: {
                username: "student_01",
                avatarKey: "avatar_01",
                bio: "Learning to code.",
            },
        });
    });

    it("returns null profile fields when the user has no profile", async () => {
        findUserProfileByIdMock.mockResolvedValue({
            ...mockUser,
            profile: null,
        });

        const result = await getMyProfile(TEST_USER_ID);

        expect(result.profile).toEqual({
            username: null,
            avatarKey: null,
            bio: null,
        });
    });

    it("throws USER_NOT_FOUND when the user does not exist", async () => {
        findUserProfileByIdMock.mockResolvedValue(null);

        await expect(getMyProfile(TEST_USER_ID)).rejects.toMatchObject({
            statusCode: 404,
            code: "USER_NOT_FOUND",
            message: "The requested user was not found.",
        });
    });

    it("does not expose sensitive fields returned by the repository", async () => {
        findUserProfileByIdMock.mockResolvedValue({
            ...mockUser,
            passwordHash: "sensitive-password-hash",
            refreshTokens: [{ tokenHash: "sensitive-token-hash" }],
            passwordResetTokens: [{ tokenHash: "sensitive-reset-hash" }],
        });

        const result = await getMyProfile(TEST_USER_ID);

        expect(result).not.toHaveProperty("passwordHash");
        expect(result).not.toHaveProperty("refreshTokens");
        expect(result).not.toHaveProperty("passwordResetTokens");

        expect(Object.keys(result).sort()).toEqual([
            "createdAt",
            "email",
            "id",
            "profile",
        ]);
    });

    it("propagates unexpected repository errors", async () => {
        const databaseError = new Error("Database connection failed");

        findUserProfileByIdMock.mockRejectedValue(databaseError);

        await expect(getMyProfile(TEST_USER_ID)).rejects.toBe(databaseError);
    });
});