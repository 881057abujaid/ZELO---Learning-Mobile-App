import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Module Schema
|--------------------------------------------------------------------------
*/

const contentIdSchema = z
    .string()
    .trim()
    .min(1, "ID cannot be empty.");

const moduleStatusSchema = z.enum([
    "draft",
    "review",
    "published",
    "archived",
]);

export const moduleSchema = z.object({
    id: contentIdSchema,

    worldId: contentIdSchema,

    title: z
        .string()
        .trim()
        .min(1, "Module title cannot be empty."),

    description: z
        .string()
        .trim()
        .min(1, "Module description cannot be empty."),

    order: z
        .number()
        .int()
        .positive("Module order must be a positive integer."),

    status: moduleStatusSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Inferred Type
|--------------------------------------------------------------------------
*/

export type CurriculumModule = z.infer<typeof moduleSchema>;