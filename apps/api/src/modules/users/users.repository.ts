import prisma from "../../lib/prisma.js";

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