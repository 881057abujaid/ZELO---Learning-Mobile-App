import { Prisma } from "../../generated/prisma/client.js";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const {
    findUserProfileByIdMock,
    updateUserProfileMock,
} = vi.hoisted(() => ({
    findUserProfileByIdMock: vi.fn(),
    updateUserProfileMock: vi.fn(),
}));

vi.mock("../../src/modules/users/users.repository.js", () => ({
    findUserProfileById: findUserProfileByIdMock,
    updateUserProfile: updateUserProfileMock,
}));

import {
    getMyProfile,
    updateMyProfile,
} from "../../src/modules/users/users.service.js";

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
        updateUserProfileMock.mockReset();
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

describe("updateMyProfile", () => {
    beforeEach(() => {
        updateUserProfileMock.mockReset();
    });

    it("updates the authenticated user's profile", async () => {
        const input = {
            username: "student_01",
            avatarKey: "girl_01",
            bio: "Learning to code.",
        } as const;

        const updatedProfile = {
            username: "student_01",
            avatarKey: "girl_01",
            bio: "Learning to code.",
        } as const;

        updateUserProfileMock.mockResolvedValue(updatedProfile);

        const result = await updateMyProfile(TEST_USER_ID, input);

        expect(updateUserProfileMock).toHaveBeenCalledWith(
            TEST_USER_ID,
            input,
        );

        expect(result).toEqual(updatedProfile);
    });

    it("maps duplicate username conflicts to HTTP 409", async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed on the usernameNormalized field.",
            {
                code: "P2002",
                clientVersion: "7.10.1",
                meta: {
                    target: ["usernameNormalized"],
                },
            },
        );

        updateUserProfileMock.mockRejectedValue(prismaError);

        await expect(
            updateMyProfile(TEST_USER_ID, {
                username: "student_01",
            }),
        ).rejects.toMatchObject({
            statusCode: 409,
            code: "USERNAME_TAKEN",
            message: "This username is already in use.",
        });
    });

    it("propagates unexpected repository errors", async () => {
        const databaseError = new Error("Database connection failed");

        updateUserProfileMock.mockRejectedValue(databaseError);

        await expect(
            updateMyProfile(TEST_USER_ID, {
                bio: "Learning to code.",
            }),
        ).rejects.toBe(databaseError);
    });

    it("propagates unrelated unique constraint errors", async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed on another field.",
            {
                code: "P2002",
                clientVersion: "7.10.1",
                meta: {
                    target: ["someOtherField"],
                },
            },
        );

        updateUserProfileMock.mockRejectedValue(prismaError);

        await expect(
            updateMyProfile(TEST_USER_ID, {
                username: "student_01",
            }),
        ).rejects.toBe(prismaError);
    });
});