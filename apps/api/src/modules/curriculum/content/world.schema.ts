import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Shared World Primitives
|--------------------------------------------------------------------------
*/

const contentIdSchema = z
    .string()
    .trim()
    .min(1, "ID cannot be empty.");

const slugSchema = z
    .string()
    .trim()
    .min(1, "Slug cannot be empty.")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers, and hyphens.",
    );

const worldStatusSchema = z.enum([
    "draft",
    "review",
    "published",
    "archived",
]);

/*
|--------------------------------------------------------------------------
| World Schema
|--------------------------------------------------------------------------
*/

export const worldSchema = z.object({
    id: contentIdSchema,

    slug: slugSchema,

    title: z
        .string()
        .trim()
        .min(1, "World title cannot be empty."),

    description: z
        .string()
        .trim()
        .min(1, "World description cannot be empty."),

    order: z
        .number()
        .int()
        .positive("World order must be a positive integer."),

    imageRef: z
        .string()
        .trim()
        .min(1, "Image reference cannot be empty.")
        .optional(),

    status: worldStatusSchema,

    prerequisiteWorldIds: z.array(contentIdSchema),
}).strict();

/*
|--------------------------------------------------------------------------
| Inferred Type
|--------------------------------------------------------------------------
*/

export type World = z.infer<typeof worldSchema>;