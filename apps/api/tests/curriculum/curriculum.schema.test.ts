import { describe, expect, it } from "vitest";
import { curriculumSchema } from "../../src/modules/curriculum/content/curriculum.schema";

const validCurriculum = {
    id: "web-development-foundations",
    title: "Complete Web Development Path",
    description: "Learn HTML, CSS, JavaScript and React from beginner level.",
    version: "1.0.0",
};

describe("Curriculum Schema", () => {
    describe("Valid Curriculum Data", () => {
        it("should accept valid curriculum data", () => {
            const result = curriculumSchema.safeParse(validCurriculum);

            expect(result.success).toBe(true);
        });

        it("should accept a valid version string", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                version: "2.0.0",
            });

            expect(result.success).toBe(true);
        });

        it("should accept curriculum data with whitespace around strings", () => {
            const result = curriculumSchema.safeParse({
                id: "  web-development-foundations  ",
                title: "  Complete Web Development Path  ",
                description: "  Learn web development.  ",
                version: "  1.0.0  ",
            });

            expect(result.success).toBe(true);
        });
    });

    describe("Invalid Curriculum Data", () => {
        it("should reject empty ID", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                id: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty title", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                title: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty description", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                description: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty version", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                version: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject missing ID", () => {
            const { id, ...curriculumWithoutId } = validCurriculum;

            const result = curriculumSchema.safeParse(curriculumWithoutId);

            expect(result.success).toBe(false);
        });

        it("should reject missing title", () => {
            const { title, ...curriculumWithoutTitle } = validCurriculum;

            const result = curriculumSchema.safeParse(curriculumWithoutTitle);

            expect(result.success).toBe(false);
        });

        it("should reject missing description", () => {
            const { description, ...curriculumWithoutDescription } =
                validCurriculum;

            const result = curriculumSchema.safeParse(
                curriculumWithoutDescription,
            );

            expect(result.success).toBe(false);
        });

        it("should reject missing version", () => {
            const { version, ...curriculumWithoutVersion } = validCurriculum;

            const result = curriculumSchema.safeParse(curriculumWithoutVersion);

            expect(result.success).toBe(false);
        });

        it("should reject unknown properties", () => {
            const result = curriculumSchema.safeParse({
                ...validCurriculum,
                unexpectedProperty: true,
            });

            expect(result.success).toBe(false);
        });
    });
});