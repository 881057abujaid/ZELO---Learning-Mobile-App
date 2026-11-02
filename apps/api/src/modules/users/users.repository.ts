import prisma from "../../lib/prisma.js";
import type { UpdateMyProfileInput } from "./users.schemas.js";

export async function findUserProfileById(userId: string) {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            profile: {
                select: {
                    username: true,
                    avatarKey: true,
                    bio: true,
                },
            },
        },
    });
}

export async function updateUserProfile(
    userId: string,
    input: UpdateMyProfileInput,
) {
    const usernameNormalized =
        input.username === undefined
            ? undefined
            : input.username.toLowerCase();

    return prisma.userProfile.upsert({
        where: {
            userId,
        },

        create: {
            userId,
            ...(input.username !== undefined && {
                username: input.username,
                usernameNormalized,
            }),
            ...(input.avatarKey !== undefined && {
                avatarKey: input.avatarKey,
            }),
            ...(input.bio !== undefined && {
                bio: input.bio,
            }),
        },

        update: {
            ...(input.username !== undefined && {
                username: input.username,
                usernameNormalized,
            }),

            ...(input.avatarKey !== undefined && {
                avatarKey: input.avatarKey,
            }),

            ...(input.bio !== undefined && {
                bio: input.bio,
            }),
        },

        select: {
            username: true,
            avatarKey: true,
            bio: true,
        },
    });
}
