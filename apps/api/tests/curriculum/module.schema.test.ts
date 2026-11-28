import { describe, expect, it } from "vitest";
import { moduleSchema } from "../../src/modules/curriculum/content/module.schema";

const validModule = {
    id: "html-module-001",
    worldId: "html-world-001",
    title: "Introduction to HTML",
    description: "Learn the basics of HTML and webpage structure.",
    order: 1,
    status: "published",
};

describe("Module Schema", () => {
    describe("Valid Module Data", () => {
        it("should accept valid module data", () => {
            const result = moduleSchema.safeParse(validModule);

            expect(result.success).toBe(true);
        });

        it("should accept valid draft module", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                status: "draft",
            });

            expect(result.success).toBe(true);
        });

        it("should accept valid review module", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                status: "review",
            });

            expect(result.success).toBe(true);
        });

        it("should accept valid archived module", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                status: "archived",
            });

            expect(result.success).toBe(true);
        });
    });

    describe("Invalid Module Data", () => {
        it("should reject empty module ID", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                id: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty world ID", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                worldId: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty title", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                title: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject empty description", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                description: "",
            });

            expect(result.success).toBe(false);
        });

        it("should reject zero order", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                order: 0,
            });

            expect(result.success).toBe(false);
        });

        it("should reject negative order", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                order: -1,
            });

            expect(result.success).toBe(false);
        });

        it("should reject decimal order", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                order: 1.5,
            });

            expect(result.success).toBe(false);
        });

        it("should reject invalid status", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                status: "active",
            });

            expect(result.success).toBe(false);
        });

        it("should reject unknown properties", () => {
            const result = moduleSchema.safeParse({
                ...validModule,
                unexpectedProperty: true,
            });

            expect(result.success).toBe(false);
        });
    });
});