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