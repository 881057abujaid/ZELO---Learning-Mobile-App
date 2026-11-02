import { AppError } from "../../common/errors/app-error.js";
import { findUserProfileById } from "./users.repository.js";

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