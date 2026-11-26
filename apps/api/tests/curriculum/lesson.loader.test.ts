import { describe, expect, it } from "vitest";

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
    loadLessonFromFile,
    LessonContentError,
} from "../../src/modules/curriculum/content/lesson.loader";

const validLesson = {
    id: "html-lesson-001",
    slug: "introduction-to-html",
    title: "Introduction to HTML",
    summary: "Learn the basics of HTML.",
    worldId: "html-world",
    moduleId: "html-module-001",
    contentVersion: "1.0.0",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: [
        "Understand what HTML is",
    ],
    prerequisiteLessonIds: [],
    status: "published",
    steps: [
        {
            id: "step-001",
            type: "intro",
            title: "Welcome",
            content: [
                {
                    type: "paragraph",
                    text: "Welcome to your first HTML lesson!",
                },
            ],
            completion: {
                mode: "continue",
            },
        },
    ],
    completionRequirements: {
        requiredStepIds: ["step-001"],
        codingChallengeMustPass: false,
    },
};

describe("loadLessonFromFile", () => {
    const testDirectory = join(
        tmpdir(),
        "zelo-lesson-loader-tests",
    );

    async function setupFile(
        fileName: string,
        content: string,
    ): Promise<string> {
        await mkdir(testDirectory, { recursive: true });

        const filePath = join(testDirectory, fileName);

        await writeFile(filePath, content, "utf-8");

        return filePath;
    }

    it("loads and validates a valid lesson JSON file", async () => {
        const filePath = await setupFile(
            "valid-lesson.json",
            JSON.stringify(validLesson),
        );

        const lesson = await loadLessonFromFile(filePath);

        expect(lesson.id).toBe("html-lesson-001");
        expect(lesson.title).toBe("Introduction to HTML");
        expect(lesson.difficulty).toBe("beginner");
    });

    it("rejects a missing file", async () => {
        const filePath = join(
            testDirectory,
            "missing-lesson.json",
        );

        await expect(
            loadLessonFromFile(filePath),
        ).rejects.toThrow(LessonContentError);
    });

    it("rejects malformed JSON", async () => {
        const filePath = await setupFile(
            "malformed.json",
            "{ invalid json }",
        );

        await expect(
            loadLessonFromFile(filePath),
        ).rejects.toThrow("Invalid JSON");
    });

    it("rejects JSON that does not match the lesson schema", async () => {
        const invalidLesson = {
            ...validLesson,
            difficulty: "expert",
        };

        const filePath = await setupFile(
            "invalid-schema.json",
            JSON.stringify(invalidLesson),
        );

        await expect(
            loadLessonFromFile(filePath),
        ).rejects.toThrow("Lesson validation failed");
    });

    it("includes the file path in errors", async () => {
        const filePath = await setupFile(
            "invalid-content.json",
            JSON.stringify({
                id: "invalid",
            }),
        );

        const error = await loadLessonFromFile(filePath).catch(
            (caught: unknown) => caught,
        );

        expect(error).toBeInstanceOf(LessonContentError);

        expect(
            (error as LessonContentError).filePath,
        ).toBe(filePath);
    });

    it("returns validated lesson data", async () => {
        const filePath = await setupFile(
            "typed-lesson.json",
            JSON.stringify(validLesson),
        );

        const lesson = await loadLessonFromFile(filePath);

        expect(lesson).toMatchObject({
            id: "html-lesson-001",
            slug: "introduction-to-html",
            contentVersion: "1.0.0",
        });
    });
});