import { describe, expect, it } from "vitest";
import { registrationSchema } from "../../src/modules/auth/auth.validation.js";

describe("registrationSchema", () => {
    it("accepts a valid registration request", () => {
        const result = registrationSchema.safeParse({
            email: "learner@example.com",
            password: "SecurePassword123",
        });

        expect(result.success).toBe(true);
    });

    it("trims surrounding whitespace from email", () => {
        const result = registrationSchema.safeParse({
            email: "  learner@example.com  ",
            password: "SecurePassword123",
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.email).toBe("learner@example.com");
        }
    });

    it("rejects an invalid email", () => {
        const result = registrationSchema.safeParse({
            email: "invalid-email",
            password: "SecurePassword123",
        });

        expect(result.success).toBe(false);
    });

    it("rejects a short password", () => {
        const result = registrationSchema.safeParse({
            email: "learner@example.com",
            password: "short",
        });

        expect(result.success).toBe(false);
    });

    it("rejects unexpected fields", () => {
        const result = registrationSchema.safeParse({
            email: "learner@example.com",
            password: "SecurePassword123",
            role: "ADMIN",
        });

        expect(result.success).toBe(false);
    });
});