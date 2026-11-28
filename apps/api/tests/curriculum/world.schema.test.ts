import { describe, expect, it } from "vitest";
import { worldSchema } from "../../src/modules/curriculum/content/world.schema";

const validWorld = {
    id: "html-world-001",
    slug: "html-foundations",
    title: "HTML Foundations",
    description: "Learn how to structure web pages using HTML.",
    order: 1,
    imageRef: "worlds/html-world-cover",
    status: "published",
    prerequisiteWorldIds: [],
};

describe("World Schema", () => {
    describe("Valid World Data", () => {
        it("should accept valid world data", () => {
            const result = worldSchema.safeParse(validWorld);

            expect(result.success).toBe(true);
        });

        it("should accept world without optional imageRef", () => {
            const { imageRef, ...worldWithoutImage } = validWorld;

            const result = worldSchema.safeParse(worldWithoutImage);

            expect(result.success).toBe(true);
        });

        it("should accept multiple prerequisite world IDs", () => {
            const world = {
                ...validWorld,
                prerequisiteWorldIds: [
                    "world-001",
                    "world-002",
                ],
            };

            const result = worldSchema.safeParse(world);

            expect(result.success).toBe(true);
        });
    });

    describe("Invalid World Data", () => {
        it("should reject empty ID", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                id: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty slug", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                slug: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject invalid slug format", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                slug: "HTML Foundations",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty title", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                title: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty description", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                description: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject zero order", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                order: 0,
            });

            expect(result.success).toBe(false);
        });

        it("should reject negative order", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                order: -1,
            });

            expect(result.success).toBe(false);
        });

        it("should reject decimal order", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                order: 1.5,
            });

            expect(result.success).toBe(false);
        });

        it("should reject invalid status", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                status: "active",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty prerequisite ID", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                prerequisiteWorldIds: [""],
            });

            expect(result.success).toBe(false);
        });

        it("should reject unknown properties", () => {
            const result = worldSchema.safeParse({
                ...validWorld,
                unexpectedProperty: true,
            });

            expect(result.success).toBe(false);
        });
    });
});