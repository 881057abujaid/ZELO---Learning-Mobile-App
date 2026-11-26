import { describe, expect, it } from "vitest";
import { validateCurriculum } from "../../src/modules/curriculum/content/curriculum.validator";
import type { Lesson } from "../../src/modules/curriculum/content/lesson.schema";

const createLesson = (
    overrides: Partial<Lesson> = {},
): Lesson => ({
    id: "lesson-001",
    slug: "lesson-001",
    title: "Introduction",
    summary: "Introduction lesson",
    worldId: "world-001",
    moduleId: "module-001",
    contentVersion: "1.0.0",
    difficulty: "beginner",
    learningObjectives: ["Understand the basics"],
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
                    text: "Welcome!",
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
    ...overrides,
});

const references = {
    worldIds: ["world-001"],
    moduleIds: ["module-001"],
};

describe("validateCurriculum", () => {
    it("accepts a valid curriculum", () => {
        const result = validateCurriculum(
            [createLesson()],
            references,
        );

        expect(result.valid).toBe(true);
        expect(result.issues).toHaveLength(0);
    });

    it("detects duplicate lesson IDs", () => {
        const result = validateCurriculum(
            [
                createLesson({ id: "lesson-001" }),
                createLesson({ id: "lesson-001", slug: "lesson-002" }),
            ],
            references,
        );

        expect(result.valid).toBe(false);

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "DUPLICATE_LESSON_ID",
            }),
        );
    });

    it("detects an invalid world reference", () => {
        const result = validateCurriculum(
            [
                createLesson({
                    worldId: "unknown-world",
                }),
            ],
            references,
        );

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "INVALID_WORLD_REFERENCE",
            }),
        );
    });

    it("detects a two-lesson circular dependency", () => {
        const lesson1 = createLesson({
            id: "lesson-001",
            prerequisiteLessonIds: ["lesson-002"],
        });

        const lesson2 = createLesson({
            id: "lesson-002",
            slug: "lesson-002",
            prerequisiteLessonIds: ["lesson-001"],
        });

        const result = validateCurriculum(
            [lesson1, lesson2],
            references,
        );

        expect(result.valid).toBe(false);
        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "CIRCULAR_PREREQUISITE",
            }),
        );
    });

    it("detects an invalid module reference", () => {
        const result = validateCurriculum(
            [
                createLesson({
                    moduleId: "unknown-module",
                }),
            ],
            references,
        );

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "INVALID_MODULE_REFERENCE",
            }),
        );
    });

    it("detects missing prerequisite lessons", () => {
        const result = validateCurriculum(
            [
                createLesson({
                    prerequisiteLessonIds: ["missing-lesson"],
                }),
            ],
            references,
        );

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "INVALID_PREREQUISITE_REFERENCE",
            }),
        );
    });

    it("detects self prerequisites", () => {
        const result = validateCurriculum(
            [
                createLesson({
                    prerequisiteLessonIds: ["lesson-001"],
                }),
            ],
            references,
        );

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "SELF_PREREQUISITE",
            }),
        );
    });

    it("accepts valid prerequisite chains", () => {
        const lesson1 = createLesson({
            id: "lesson-001",
            prerequisiteLessonIds: [],
        });

        const lesson2 = createLesson({
            id: "lesson-002",
            slug: "lesson-002",
            prerequisiteLessonIds: ["lesson-001"],
        });

        const lesson3 = createLesson({
            id: "lesson-003",
            slug: "lesson-003",
            prerequisiteLessonIds: ["lesson-002"],
        });

        const result = validateCurriculum(
            [lesson1, lesson2, lesson3],
            references,
        );

        expect(result.valid).toBe(true);
        expect(result.issues).toHaveLength(0);
    });

    it("detects circular prerequisite dependencies", () => {
        const lesson1 = createLesson({
            id: "lesson-001",
            prerequisiteLessonIds: ["lesson-002"],
        });

        const lesson2 = createLesson({
            id: "lesson-002",
            slug: "lesson-002",
            prerequisiteLessonIds: ["lesson-003"],
        });

        const lesson3 = createLesson({
            id: "lesson-003",
            slug: "lesson-003",
            prerequisiteLessonIds: ["lesson-001"],
        });

        const result = validateCurriculum(
            [lesson1, lesson2, lesson3],
            references,
        );

        expect(result.valid).toBe(false);

        expect(result.issues).toContainEqual(
            expect.objectContaining({
                code: "CIRCULAR_PREREQUISITE",
            }),
        );
    });

    it("allows multiple lessons to share the same world and module", () => {
        const result = validateCurriculum(
            [
                createLesson({ id: "lesson-001" }),
                createLesson({
                    id: "lesson-002",
                    slug: "lesson-002",
                }),
                createLesson({
                    id: "lesson-003",
                    slug: "lesson-003",
                }),
            ],
            references,
        );

        expect(result.valid).toBe(true);
    });

    it("returns all reference issues instead of stopping at the first one", () => {
        const result = validateCurriculum(
            [
                createLesson({
                    worldId: "unknown-world",
                    moduleId: "unknown-module",
                    prerequisiteLessonIds: ["missing-lesson"],
                }),
            ],
            references,
        );

        expect(result.issues.length).toBeGreaterThanOrEqual(3);
    });
});