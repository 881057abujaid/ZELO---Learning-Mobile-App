import { z } from "zod";

export const registrationSchema = z
    .object({
        email: z
            .string()
            .trim()
            .min(1)
            .max(320)
            .email(),

        password: z
            .string()
            .min(8)
            .max(128),
    })
    .strict();

export type RegistrationInput = z.infer<
    typeof registrationSchema
>;

export const loginSchema = z
    .object({
        email: z
            .string()
            .trim()
            .min(1)
            .max(320)
            .email(),

        password: z
            .string()
            .min(1)
            .max(128),
    })
    .strict();

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z
    .object({
        refreshToken: z
            .string()
            .min(1)
            .max(512),
    })
    .strict();

export type RefreshInput = z.infer<typeof refreshSchema>;
