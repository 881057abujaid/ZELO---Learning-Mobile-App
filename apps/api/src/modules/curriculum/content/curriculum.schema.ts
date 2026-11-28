import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Curriculum Schema
|--------------------------------------------------------------------------
*/

const contentIdSchema = z
    .string()
    .trim()
    .min(1, "ID cannot be empty.");

export const curriculumSchema = z.object({
    id: contentIdSchema,

    title: z
        .string()
        .trim()
        .min(1, "Curriculum title cannot be empty."),

    description: z
        .string()
        .trim()
        .min(1, "Curriculum description cannot be empty."),

    version: z
        .string()
        .trim()
        .min(1, "Curriculum version cannot be empty."),
}).strict();

/*
|--------------------------------------------------------------------------
| Inferred Type
|--------------------------------------------------------------------------
*/

export type Curriculum = z.infer<typeof curriculumSchema>;