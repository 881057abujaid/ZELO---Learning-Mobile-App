import { describe, expect, it } from "vitest";
import { getAuthConfig } from "./auth-config.js";

describe("getAuthConfig", () => {
    it("accepts a valid access-token secret", () => {
        const secret = "a".repeat(32);

        expect(
            getAuthConfig({
                ACCESS_TOKEN_SECRET: secret,
            }),
        ).toEqual({
            accessTokenSecret: secret,
        });
    });

    it("rejects a missing secret", () => {
        expect(() => getAuthConfig({})).toThrow(
            /Invalid authentication configuration/,
        );
    });

    it("rejects a secret shorter than 32 characters", () => {
        expect(() =>
            getAuthConfig({
                ACCESS_TOKEN_SECRET: "too-short",
            }),
        ).toThrow(/at least 32 characters/);
    });
});