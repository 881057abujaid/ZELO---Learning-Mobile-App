import { readFile } from "node:fs/promises";

import {
    lessonSchema,
    type Lesson,
} from "./lesson.schema.js";

export class LessonContentError extends Error {
    constructor(
        message: string,
        public readonly filePath: string,
        public readonly cause?: unknown,
    ) {
        super(message);

        this.name = "LessonContentError";
    }
}

export async function loadLessonFromFile(
    filePath: string,
): Promise<Lesson> {
    let fileContent: string;

    // 1. Read file
    try {
        fileContent = await readFile(filePath, "utf-8");
    } catch (error) {
        throw new LessonContentError(
            `Unable to read lesson file: ${filePath}`,
            filePath,
            error,
        );
    }

    // 2. Parse JSON
    let parsedContent: unknown;

    try {
        parsedContent = JSON.parse(fileContent);
    } catch (error) {
        throw new LessonContentError(
            `Invalid JSON in lesson file: ${filePath}`,
            filePath,
            error,
        );
    }

    // 3. Validate lesson schema
    const result = lessonSchema.safeParse(parsedContent);

    if (!result.success) {
        throw new LessonContentError(
            `Lesson validation failed for file: ${filePath}\n${result.error.message}`,
            filePath,
            result.error,
        );
    }

    // 4. Return validated lesson
    return result.data;
}