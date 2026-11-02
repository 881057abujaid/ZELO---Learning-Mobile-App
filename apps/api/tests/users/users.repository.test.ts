import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    userProfileUpsertMock,
} = vi.hoisted(() => ({
    userProfileUpsertMock: vi.fn(),
}));

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        userProfile: {
            upsert: userProfileUpsertMock,
        },
    },
}));

import { updateUserProfile } from "../../src/modules/users/users.repository.js";

describe("updateUserProfile", () => {
    const userId = "11111111-1111-4111-8111-111111111111";

    beforeEach(() => {
        userProfileUpsertMock.mockReset();
    });

    it("normalizes the username and selects only permitted profile fields", async () => {
        const input = {
            username: "Student_01",
            avatarKey: "girl_01",
            bio: "Learning to code.",
        } as const;

        const updatedProfile = {
            username: "Student_01",
            avatarKey: "girl_01",
            bio: "Learning to code.",
        };

        userProfileUpsertMock.mockResolvedValue(updatedProfile);

        const result = await updateUserProfile(userId, input);

        expect(userProfileUpsertMock).toHaveBeenCalledWith({
            where: {
                userId,
            },
            create: {
                userId,
                username: "Student_01",
                usernameNormalized: "student_01",
                avatarKey: "girl_01",
                bio: "Learning to code.",
            },
            update: {
                username: "Student_01",
                usernameNormalized: "student_01",
                avatarKey: "girl_01",
                bio: "Learning to code.",
            },
            select: {
                username: true,
                avatarKey: true,
                bio: true,
            },
        });

        expect(result).toEqual(updatedProfile);
        expect(result).not.toHaveProperty("userId");
    });

    it("updates only the supplied bio field for an existing profile", async () => {
        const input = {
            bio: "Building projects with ZELO.",
        };

        const updatedProfile = {
            username: "student_01",
            avatarKey: "girl_01",
            bio: input.bio,
        };

        userProfileUpsertMock.mockResolvedValue(updatedProfile);

        const result = await updateUserProfile(userId, input);

        expect(userProfileUpsertMock).toHaveBeenCalledWith({
            where: {
                userId,
            },
            create: {
                userId,
                username: undefined,
                usernameNormalized: undefined,
                avatarKey: undefined,
                bio: input.bio,
            },
            update: {
                bio: input.bio,
            },
            select: {
                username: true,
                avatarKey: true,
                bio: true,
            },
        });

        expect(result).toEqual(updatedProfile);
    });

    it("allows the avatar and bio to be cleared with null", async () => {
        const input = {
            avatarKey: null,
            bio: null,
        };

        const updatedProfile = {
            username: "student_01",
            avatarKey: null,
            bio: null,
        };

        userProfileUpsertMock.mockResolvedValue(updatedProfile);

        const result = await updateUserProfile(userId, input);

        expect(userProfileUpsertMock).toHaveBeenCalledWith({
            where: {
                userId,
            },
            create: {
                userId,
                username: undefined,
                usernameNormalized: undefined,
                avatarKey: null,
                bio: null,
            },
            update: {
                avatarKey: null,
                bio: null,
            },
            select: {
                username: true,
                avatarKey: true,
                bio: true,
            },
        });

        expect(result).toEqual(updatedProfile);
    });

    it("updates the avatar without overwriting omitted fields", async () => {
        const input = {
            avatarKey: "boy_02",
        } as const;

        const updatedProfile = {
            username: "student_01",
            avatarKey: "boy_02",
            bio: "Learning to code.",
        };

        userProfileUpsertMock.mockResolvedValue(updatedProfile);

        await updateUserProfile(userId, input);

        expect(userProfileUpsertMock).toHaveBeenCalledWith(
            expect.objectContaining({
                update: {
                    avatarKey: "boy_02",
                },
            }),
        );
    });

    it("propagates Prisma errors to the service layer", async () => {
        const databaseError = new Error("Database unavailable");

        userProfileUpsertMock.mockRejectedValue(databaseError);

        await expect(
            updateUserProfile(userId, {
                bio: "Learning to code.",
            }),
        ).rejects.toBe(databaseError);
    });
});
