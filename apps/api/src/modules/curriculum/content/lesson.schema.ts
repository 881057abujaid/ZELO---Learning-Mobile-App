import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Shared primitives
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

const contentVersionSchema = z
    .string()
    .regex(
        /^\d+\.\d+\.\d+$/,
        "Content version must follow semantic versioning.",
    );

const difficultySchema = z.enum([
    "beginner",
    "intermediate",
    "advanced",
]);

const lessonStatusSchema = z.enum([
    "draft",
    "review",
    "published",
    "archived",
]);

/*
|--------------------------------------------------------------------------
| Content blocks
|--------------------------------------------------------------------------
*/

const paragraphBlockSchema = z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1),
}).strict();

const headingBlockSchema = z.object({
    type: z.literal("heading"),
    text: z.string().min(1),
    level: z.enum(["h2", "h3", "h4"]),
}).strict();

const codeBlockSchema = z.object({
    type: z.literal("code"),
    language: z.string().min(1),
    source: z.string(),
}).strict();

const imageBlockSchema = z.object({
    type: z.literal("image"),
    assetRef: z.string().min(1),
    alt: z.string().min(1),
}).strict();

const calloutBlockSchema = z.object({
    type: z.literal("callout"),
    variant: z.enum([
        "info",
        "tip",
        "warning",
        "success",
    ]),
    text: z.string().min(1),
}).strict();

export const contentBlockSchema = z.discriminatedUnion(
    "type",
    [
        paragraphBlockSchema,
        headingBlockSchema,
        codeBlockSchema,
        imageBlockSchema,
        calloutBlockSchema,
    ],
);

/*
|--------------------------------------------------------------------------
| Step completion
|--------------------------------------------------------------------------
*/

const continueCompletionSchema = z.object({
    mode: z.literal("continue"),
}).strict();

const correctAnswerCompletionSchema = z.object({
    mode: z.literal("correct_answer"),
}).strict();

const challengePassedCompletionSchema = z.object({
    mode: z.literal("challenge_passed"),
}).strict();

const stepCompletionSchema = z.discriminatedUnion(
    "mode",
    [
        continueCompletionSchema,
        correctAnswerCompletionSchema,
        challengePassedCompletionSchema,
    ],
);

/*
|--------------------------------------------------------------------------
| Common lesson step fields
|--------------------------------------------------------------------------
*/

const baseStepSchema = z.object({
    id: contentIdSchema,
    title: z.string().min(1).optional(),
    completion: stepCompletionSchema,
});

/*
|--------------------------------------------------------------------------
| Intro
|--------------------------------------------------------------------------
*/

const introStepSchema = baseStepSchema.extend({
    type: z.literal("intro"),
    title: z.string().min(1),
    content: z.array(contentBlockSchema).min(1),
    completion: continueCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Explanation
|--------------------------------------------------------------------------
*/

const explanationStepSchema = baseStepSchema.extend({
    type: z.literal("explanation"),
    title: z.string().min(1),
    content: z.array(contentBlockSchema).min(1),
    completion: continueCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Code example
|--------------------------------------------------------------------------
*/

const codeExampleStepSchema = baseStepSchema.extend({
    type: z.literal("code_example"),
    title: z.string().min(1),
    content: z.array(contentBlockSchema).min(1),
    completion: continueCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Tip
|--------------------------------------------------------------------------
*/

const tipStepSchema = baseStepSchema.extend({
    type: z.literal("tip"),
    title: z.string().min(1),
    content: z.array(contentBlockSchema).min(1),
    completion: continueCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Single choice
|--------------------------------------------------------------------------
*/

const optionSchema = z.object({
    id: contentIdSchema,
    label: z.string().min(1),
}).strict();

const feedbackSchema = z.object({
    correct: z.string().min(1),
    incorrect: z.string().min(1),
}).strict();

const retryPolicySchema = z.object({
    allowed: z.boolean(),
}).strict();

const singleChoiceStepSchema = baseStepSchema.extend({
    type: z.literal("single_choice"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    options: z.array(optionSchema).min(2),
    answerKey: contentIdSchema,
    feedback: feedbackSchema,
    retryPolicy: retryPolicySchema,
    completion: correctAnswerCompletionSchema,
}).strict().superRefine((step, ctx) => {
    const optionIds = step.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Option IDs must be unique.",
            path: ["options"],
        });
    }

    if (!optionIds.includes(step.answerKey)) {
        ctx.addIssue({
            code: "custom",
            message: "Answer key must reference an existing option.",
            path: ["answerKey"],
        });
    }
});

/*
|--------------------------------------------------------------------------
| Multiple select
|--------------------------------------------------------------------------
*/

const multipleSelectStepSchema = baseStepSchema.extend({
    type: z.literal("multiple_select"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    options: z.array(optionSchema).min(2),
    answerKey: z.array(contentIdSchema).min(1),
    feedback: feedbackSchema,
    retryPolicy: retryPolicySchema,
    completion: correctAnswerCompletionSchema,
}).strict().superRefine((step, ctx) => {
    const optionIds = step.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Option IDs must be unique.",
            path: ["options"],
        });
    }

    if (new Set(step.answerKey).size !== step.answerKey.length) {
        ctx.addIssue({
            code: "custom",
            message: "Answer keys must be unique.",
            path: ["answerKey"],
        });
    }

    for (const answerId of step.answerKey) {
        if (!optionIds.includes(answerId)) {
            ctx.addIssue({
                code: "custom",
                message: `Answer "${answerId}" does not reference an existing option.`,
                path: ["answerKey"],
            });
        }
    }
});

/*
|--------------------------------------------------------------------------
| Reorder
|--------------------------------------------------------------------------
*/

const reorderItemSchema = z.object({
    id: contentIdSchema,
    label: z.string().min(1),
}).strict();

const reorderStepSchema = baseStepSchema.extend({
    type: z.literal("reorder"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    items: z.array(reorderItemSchema).min(2),
    correctOrder: z.array(contentIdSchema).min(2),
    feedback: feedbackSchema,
    completion: correctAnswerCompletionSchema,
}).strict().superRefine((step, ctx) => {
    const itemIds = step.items.map((item) => item.id);

    if (new Set(itemIds).size !== itemIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Reorder item IDs must be unique.",
            path: ["items"],
        });
    }

    if (new Set(step.correctOrder).size !== step.correctOrder.length) {
        ctx.addIssue({
            code: "custom",
            message: "Correct order IDs must be unique.",
            path: ["correctOrder"],
        });
    }

    if (
        itemIds.length !== step.correctOrder.length ||
        itemIds.some((id) => !step.correctOrder.includes(id))
    ) {
        ctx.addIssue({
            code: "custom",
            message: "Correct order must contain every item exactly once.",
            path: ["correctOrder"],
        });
    }
});

/*
|--------------------------------------------------------------------------
| Fill blank - options
|--------------------------------------------------------------------------
*/

const fillBlankOptionsStepSchema = baseStepSchema.extend({
    type: z.literal("fill_blank_options"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    options: z.array(optionSchema).min(2),
    answerKey: contentIdSchema,
    feedback: feedbackSchema,
    completion: correctAnswerCompletionSchema,
}).strict().superRefine((step, ctx) => {
    const optionIds = step.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Option IDs must be unique.",
            path: ["options"],
        });
    }

    if (!optionIds.includes(step.answerKey)) {
        ctx.addIssue({
            code: "custom",
            message: "Answer key must reference an existing option.",
            path: ["answerKey"],
        });
    }
});

/*
|--------------------------------------------------------------------------
| Fill blank - typed answer
|--------------------------------------------------------------------------
*/

const fillBlankTypedStepSchema = baseStepSchema.extend({
    type: z.literal("fill_blank_typed"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    acceptedAnswers: z.array(z.string().min(1)).min(1),
    caseSensitive: z.boolean(),
    trimWhitespace: z.boolean(),
    feedback: feedbackSchema,
    completion: correctAnswerCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Coding challenge
|--------------------------------------------------------------------------
*/

const codingChallengeStepSchema = baseStepSchema.extend({
    type: z.literal("coding_challenge"),
    title: z.string().min(1),
    challengeId: contentIdSchema,
    prompt: z.string().min(1),
    completion: challengePassedCompletionSchema,
}).strict();

/*
|--------------------------------------------------------------------------
| Lesson step union
|--------------------------------------------------------------------------
*/

export const lessonStepSchema = z.discriminatedUnion(
    "type",
    [
        introStepSchema,
        explanationStepSchema,
        codeExampleStepSchema,
        tipStepSchema,
        singleChoiceStepSchema,
        multipleSelectStepSchema,
        reorderStepSchema,
        fillBlankOptionsStepSchema,
        fillBlankTypedStepSchema,
        codingChallengeStepSchema,
    ],
);

/*
|--------------------------------------------------------------------------
| Lesson completion requirements
|--------------------------------------------------------------------------
*/

const completionRequirementsSchema = z.object({
    requiredStepIds: z.array(contentIdSchema),
    codingChallengeMustPass: z.boolean(),
}).strict();

/*
|--------------------------------------------------------------------------
| Lesson schema
|--------------------------------------------------------------------------
*/

export const lessonSchema = z.object({
    id: contentIdSchema,
    slug: slugSchema,
    title: z.string().min(1),
    summary: z.string().min(1),

    worldId: contentIdSchema,
    moduleId: contentIdSchema,

    contentVersion: contentVersionSchema,
    difficulty: difficultySchema,

    estimatedMinutes: z
        .number()
        .int()
        .positive()
        .optional(),

    learningObjectives: z
        .array(z.string().min(1))
        .min(1),

    prerequisiteLessonIds: z.array(contentIdSchema),

    status: lessonStatusSchema,

    steps: z.array(lessonStepSchema).min(1),

    completionRequirements: completionRequirementsSchema,
}).strict().superRefine((lesson, ctx) => {
    const stepIds = lesson.steps.map((step) => step.id);

    if (new Set(stepIds).size !== stepIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Lesson step IDs must be unique.",
            path: ["steps"],
        });
    }

    const requiredStepIds =
        lesson.completionRequirements.requiredStepIds;

    if (new Set(requiredStepIds).size !== requiredStepIds.length) {
        ctx.addIssue({
            code: "custom",
            message: "Required step IDs must be unique.",
            path: ["completionRequirements", "requiredStepIds"],
        });
    }

    for (const requiredStepId of requiredStepIds) {
        if (!stepIds.includes(requiredStepId)) {
            ctx.addIssue({
                code: "custom",
                message: `Required step "${requiredStepId}" does not exist.`,
                path: ["completionRequirements", "requiredStepIds"],
            });
        }
    }

    for (const prerequisiteId of lesson.prerequisiteLessonIds) {
        if (prerequisiteId === lesson.id) {
            ctx.addIssue({
                code: "custom",
                message: "A lesson cannot depend on itself.",
                path: ["prerequisiteLessonIds"],
            });
        }
    }

    const challengeSteps = lesson.steps.filter(
        (step) => step.type === "coding_challenge",
    );

    if (
        lesson.completionRequirements.codingChallengeMustPass &&
        challengeSteps.length === 0
    ) {
        ctx.addIssue({
            code: "custom",
            message:
                "codingChallengeMustPass is true, but the lesson has no coding challenge.",
            path: ["completionRequirements", "codingChallengeMustPass"],
        });
    }
});

/*
|--------------------------------------------------------------------------
| Inferred type
|--------------------------------------------------------------------------
*/

export type Lesson = z.infer<typeof lessonSchema>;