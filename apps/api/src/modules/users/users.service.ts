import { Prisma } from "../../../generated/prisma/client.js";
import { AppError } from "../../common/errors/app-error.js";
import {
    findUserProfileById,
    updateUserProfile,
} from "./users.repository.js";
import type { UpdateMyProfileInput } from "./users.schemas.js";

export async function getMyProfile(userId: string) {
    const user = await findUserProfileById(userId);

    if (!user) {
        throw new AppError(
            404,
            "USER_NOT_FOUND",
            "The requested user was not found.",
        );
    }

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        profile: {
            username: user.profile?.username ?? null,
            avatarKey: user.profile?.avatarKey ?? null,
            bio: user.profile?.bio ?? null,
        },
    };
}

export async function updateMyProfile(
    userId: string,
    input: UpdateMyProfileInput,
) {
    try {
        return await updateUserProfile(userId, input);
    } catch (error: unknown) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const target = error.meta?.target;

            const targetFields = Array.isArray(target)
                ? target
                : typeof target === "string"
                    ? [target]
                    : [];

            if (
                targetFields.some(
                    (field) =>
                        field === "usernameNormalized" ||
                        field === "username_normalized",
                )
            ) {
                throw new AppError(
                    409,
                    "USERNAME_TAKEN",
                    "This username is already in use.",
                );
            }
        }

        throw error;
    }
}
