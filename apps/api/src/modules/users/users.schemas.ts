import { z } from "zod";

export const AVATAR_KEYS = [
    "girl_01",
    "girl_02",
    "girl_03",
    "girl_04",
    "boy_01",
    "boy_02",
    "boy_03",
    "boy_04",
] as const;

export const updateMyProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must contain at least 3 characters.")
            .max(20, "Username cannot exceed 20 characters.")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username may contain only letters, numbers, and underscores.",
            )
            .optional(),

        avatarKey: z
            .enum(AVATAR_KEYS)
            .nullable()
            .optional(),

        bio: z
            .string()
            .max(160, "Bio cannot exceed 160 characters.")
            .nullable()
            .optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one profile field must be provided.",
    );

export type UpdateMyProfileInput = z.infer<
    typeof updateMyProfileSchema
>;
