import { describe, expect, it } from "vitest";

import { validateCurriculumIntegrity } from "../../src/modules/curriculum/content/curriculum.integrity.validator";

import type { Curriculum } from "../../src/modules/curriculum/content/curriculum.schema";
import type { World } from "../../src/modules/curriculum/content/world.schema";
import type { CurriculumModule } from "../../src/modules/curriculum/content/module.schema";
import type { Lesson } from "../../src/modules/curriculum/content/lesson.schema";

const validCurriculum: Curriculum = {
    id: "web-development",
    title: "Web Development",
    description: "Learn web development fundamentals.",
    version: "1.0.0",
};

const validWorlds: World[] = [
    {
        id: "world-html",
        slug: "html",
        title: "HTML",
        description: "Learn HTML fundamentals.",
        order: 1,
        status: "published",
        prerequisiteWorldIds: [],
    },
];

const validModules: CurriculumModule[] = [
    {
        id: "module-html-basics",
        worldId: "world-html",
        title: "HTML Basics",
        description: "Learn HTML basics.",
        order: 1,
        status: "published",
    },
];

const validLessons: Lesson[] = [
    {
        id: "lesson-html-intro",
        slug: "html-introduction",
        title: "HTML Introduction",
        summary: "Introduction to HTML.",
        order: 1,
        worldId: "world-html",
        moduleId: "module-html-basics",
        contentVersion: "1.0.0",
        difficulty: "beginner",
        learningObjectives: [
            "Understand HTML",
        ],
        prerequisiteLessonIds: [],
        status: "published",
        steps: [
            {
                id: "step-intro",
                type: "intro",
                title: "Introduction",
                content: [
                    {
                        type: "paragraph",
                        text: "Welcome to HTML.",
                    },
                ],
                completion: {
                    mode: "continue",
                },
            },
        ],
        completionRequirements: {
            requiredStepIds: ["step-intro"],
            codingChallengeMustPass: false,
        },
    },
];

function createValidContent() {
    return structuredClone({
        curriculum: validCurriculum,
        worlds: validWorlds,
        modules: validModules,
        lessons: validLessons,
    });
}

describe("Curriculum Integrity Validator", () => {
    describe("Valid Curriculum", () => {
        it("should accept valid curriculum content", () => {
            const result = validateCurriculumIntegrity(
                createValidContent(),
            );

            expect(result.valid).toBe(true);
            expect(result.issues).toHaveLength(0);
        });

        it("should accept multiple worlds with unique IDs", () => {
            const content = createValidContent();

            content.worlds.push({
                id: "world-css",
                slug: "css",
                title: "CSS",
                description: "Learn CSS fundamentals.",
                order: 2,
                status: "published",
                prerequisiteWorldIds: ["world-html"],
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(true);
        });

        it("should accept modules belonging to different worlds", () => {
            const content = createValidContent();

            content.worlds.push({
                id: "world-css",
                slug: "css",
                title: "CSS",
                description: "Learn CSS fundamentals.",
                order: 2,
                status: "published",
                prerequisiteWorldIds: [],
            });

            content.modules.push({
                id: "module-css-basics",
                worldId: "world-css",
                title: "CSS Basics",
                description: "Learn CSS basics.",
                order: 1,
                status: "published",
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(true);
        });

        it("should allow the same module order in different worlds", () => {
            const content = createValidContent();

            content.worlds.push({
                id: "world-css",
                slug: "css",
                title: "CSS",
                description: "Learn CSS fundamentals.",
                order: 2,
                status: "published",
                prerequisiteWorldIds: [],
            });

            content.modules.push({
                id: "module-css-basics",
                worldId: "world-css",
                title: "CSS Basics",
                description: "Learn CSS basics.",
                order: 1,
                status: "published",
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(true);
        });
    });

    describe("Duplicate IDs", () => {
        it("should detect duplicate world IDs", () => {
            const content = createValidContent();

            content.worlds.push({
                ...validWorlds[0],
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "DUPLICATE_WORLD_ID",
                }),
            );
        });

        it("should detect duplicate module IDs", () => {
            const content = createValidContent();

            content.modules.push({
                ...validModules[0],
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "DUPLICATE_MODULE_ID",
                }),
            );
        });

        it("should detect duplicate lesson IDs", () => {
            const content = createValidContent();

            content.lessons.push({
                ...validLessons[0],
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "DUPLICATE_LESSON_ID",
                }),
            );
        });
    });

    describe("World Prerequisites", () => {
        it("should detect unknown world prerequisites", () => {
            const content = createValidContent();

            content.worlds[0].prerequisiteWorldIds = [
                "unknown-world",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "INVALID_WORLD_PREREQUISITE",
                }),
            );
        });

        it("should detect self world prerequisites", () => {
            const content = createValidContent();

            content.worlds[0].prerequisiteWorldIds = [
                "world-html",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "SELF_WORLD_PREREQUISITE",
                }),
            );
        });

        it("should detect circular world prerequisites", () => {
            const content = createValidContent();

            content.worlds.push({
                id: "world-css",
                slug: "css",
                title: "CSS",
                description: "Learn CSS.",
                order: 2,
                status: "published",
                prerequisiteWorldIds: ["world-html"],
            });

            content.worlds[0].prerequisiteWorldIds = [
                "world-css",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "CIRCULAR_WORLD_PREREQUISITE",
                }),
            );
        });
    });

    describe("Module References", () => {
        it("should detect modules referencing unknown worlds", () => {
            const content = createValidContent();

            content.modules[0].worldId = "unknown-world";

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "INVALID_MODULE_WORLD_REFERENCE",
                }),
            );
        });

        it("should detect duplicate module orders within the same world", () => {
            const content = createValidContent();

            content.modules = [
                {
                    ...validModules[0],
                    id: "module-html-basics",
                    order: 1,
                },
                {
                    ...validModules[0],
                    id: "module-html-advanced",
                    order: 1,
                },
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "DUPLICATE_MODULE_ORDER",
                }),
            );
        });
    });

    describe("Lesson References", () => {
        it("should detect lessons referencing unknown worlds", () => {
            const content = createValidContent();

            content.lessons[0].worldId = "unknown-world";

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "INVALID_LESSON_WORLD_REFERENCE",
                }),
            );
        });

        it("should detect lessons referencing unknown modules", () => {
            const content = createValidContent();

            content.lessons[0].moduleId = "unknown-module";

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "INVALID_LESSON_MODULE_REFERENCE",
                }),
            );
        });

        it("should detect lesson-module world mismatch", () => {
            const content = createValidContent();

            content.worlds.push({
                id: "world-css",
                slug: "css",
                title: "CSS",
                description: "Learn CSS.",
                order: 2,
                status: "published",
                prerequisiteWorldIds: [],
            });

            content.modules.push({
                id: "module-css",
                worldId: "world-css",
                title: "CSS Basics",
                description: "Learn CSS.",
                order: 1,
                status: "published",
            });

            content.lessons[0].moduleId = "module-css";

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "LESSON_MODULE_WORLD_MISMATCH",
                }),
            );
        });
    });

    describe("Lesson Ordering", () => {
        it("should detect duplicate lesson orders within the same module", () => {
            const content = createValidContent();

            content.lessons.push({
                ...validLessons[0],
                id: "lesson-html-second",
                slug: "html-second",
                order: 1,
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "DUPLICATE_LESSON_ORDER",
                }),
            );
        });

        it("should allow the same lesson order in different modules", () => {
            const content = createValidContent();

            content.modules.push({
                id: "module-html-advanced",
                worldId: "world-html",
                title: "HTML Advanced",
                description: "Advanced HTML topics.",
                order: 2,
                status: "published",
            });

            content.lessons.push({
                ...validLessons[0],
                id: "lesson-html-advanced",
                slug: "html-advanced",
                moduleId: "module-html-advanced",
                order: 1,
            });

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(true);
            expect(result.issues).toHaveLength(0);
        });
    });

    describe("Lesson Prerequisites", () => {
        it("should detect unknown lesson prerequisites", () => {
            const content = createValidContent();

            content.lessons[0].prerequisiteLessonIds = [
                "unknown-lesson",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "INVALID_LESSON_PREREQUISITE",
                }),
            );
        });

        it("should detect self lesson prerequisites", () => {
            const content = createValidContent();

            content.lessons[0].prerequisiteLessonIds = [
                "lesson-html-intro",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "SELF_LESSON_PREREQUISITE",
                }),
            );
        });

        it("should detect circular lesson prerequisites", () => {
            const content = createValidContent();

            content.lessons.push({
                ...validLessons[0],
                id: "lesson-html-advanced",
                slug: "html-advanced",
                prerequisiteLessonIds: [
                    "lesson-html-intro",
                ],
            });

            content.lessons[0].prerequisiteLessonIds = [
                "lesson-html-advanced",
            ];

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues).toContainEqual(
                expect.objectContaining({
                    code: "CIRCULAR_LESSON_PREREQUISITE",
                }),
            );
        });
    });

    describe("Multiple Integrity Issues", () => {
        it("should report multiple issues in the same validation run", () => {
            const content = createValidContent();

            content.worlds[0].prerequisiteWorldIds = [
                "unknown-world",
            ];

            content.modules[0].worldId = "unknown-world";

            content.lessons[0].moduleId = "unknown-module";

            const result = validateCurriculumIntegrity(content);

            expect(result.valid).toBe(false);

            expect(result.issues.length).toBeGreaterThanOrEqual(3);
        });
    });
});