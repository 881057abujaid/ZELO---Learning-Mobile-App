import { describe, expect, it } from "vitest";
import { lessonSchema } from "../../src/modules/curriculum/content/lesson.schema";

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
        "Understand the structure of an HTML document",
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
        {
            id: "step-002",
            type: "single_choice",
            title: "Quick Check",
            prompt: "What does HTML stand for?",
            options: [
                {
                    id: "option-001",
                    label: "HyperText Markup Language",
                },
                {
                    id: "option-002",
                    label: "HighText Machine Language",
                },
            ],
            answerKey: "option-001",
            feedback: {
                correct: "Correct!",
                incorrect: "Try again.",
            },
            retryPolicy: {
                allowed: true,
            },
            completion: {
                mode: "correct_answer",
            },
        },
    ],
    completionRequirements: {
        requiredStepIds: ["step-001", "step-002"],
        codingChallengeMustPass: false,
    },
};

describe("lessonSchema", () => {
    it("accepts a valid lesson", () => {
        const result = lessonSchema.safeParse(validLesson);

        expect(result.success).toBe(true);
    });

    it("rejects a lesson that depends on itself", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            prerequisiteLessonIds: ["html-lesson-001"],
        });

        expect(result.success).toBe(false);
    });

    it("rejects duplicate required step IDs", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            completionRequirements: {
                requiredStepIds: ["step-001", "step-001"],
                codingChallengeMustPass: false,
            },
        });

        expect(result.success).toBe(false);
    });

    it("rejects codingChallengeMustPass when no challenge exists", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            completionRequirements: {
                requiredStepIds: ["step-001"],
                codingChallengeMustPass: true,
            },
        });

        expect(result.success).toBe(false);
    });

    it("rejects multiple-select answers referencing unknown options", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [
                validLesson.steps[0],
                {
                    id: "step-002",
                    type: "multiple_select",
                    title: "Select answers",
                    prompt: "Select correct options",
                    options: [
                        { id: "option-001", label: "A" },
                        { id: "option-002", label: "B" },
                    ],
                    answerKey: ["option-001", "unknown-option"],
                    feedback: {
                        correct: "Correct!",
                        incorrect: "Try again.",
                    },
                    retryPolicy: {
                        allowed: true,
                    },
                    completion: {
                        mode: "correct_answer",
                    },
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects duplicate multiple-select answer IDs", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [
                validLesson.steps[0],
                {
                    id: "step-002",
                    type: "multiple_select",
                    title: "Select answers",
                    prompt: "Select correct options",
                    options: [
                        { id: "option-001", label: "A" },
                        { id: "option-002", label: "B" },
                    ],
                    answerKey: ["option-001", "option-001"],
                    feedback: {
                        correct: "Correct!",
                        incorrect: "Try again.",
                    },
                    retryPolicy: {
                        allowed: true,
                    },
                    completion: {
                        mode: "correct_answer",
                    },
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid slug", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            slug: "Introduction To HTML",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid content version", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            contentVersion: "1.0",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid difficulty", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            difficulty: "expert",
        });

        expect(result.success).toBe(false);
    });

    it("rejects duplicate step IDs", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [
                validLesson.steps[0],
                {
                    ...validLesson.steps[1],
                    id: "step-001",
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects completion requirements referencing unknown steps", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            completionRequirements: {
                requiredStepIds: ["unknown-step"],
                codingChallengeMustPass: false,
            },
        });

        expect(result.success).toBe(false);
    });

    it("rejects a single-choice answer referencing an unknown option", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [
                validLesson.steps[0],
                {
                    ...validLesson.steps[1],
                    answerKey: "unknown-option",
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects duplicate option IDs", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [
                validLesson.steps[0],
                {
                    ...validLesson.steps[1],
                    options: [
                        {
                            id: "same-id",
                            label: "Option A",
                        },
                        {
                            id: "same-id",
                            label: "Option B",
                        },
                    ],
                },
            ],
        });

        expect(result.success).toBe(false);
    });

    it("rejects a lesson with no steps", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            steps: [],
        });

        expect(result.success).toBe(false);
    });

    it("rejects unknown fields", () => {
        const result = lessonSchema.safeParse({
            ...validLesson,
            unexpectedField: "This should not be allowed",
        });

        expect(result.success).toBe(false);
    });
});
