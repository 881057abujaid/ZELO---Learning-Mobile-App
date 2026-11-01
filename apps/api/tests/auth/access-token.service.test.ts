import { afterEach, describe, expect, it } from "vitest";
import { jwtVerify } from "jose";

import {
    ACCESS_TOKEN_AUDIENCE,
    ACCESS_TOKEN_ISSUER,
    ACCESS_TOKEN_TTL_SECONDS,
    createAccessToken,
} from "../../src/modules/auth/access-token.service.js";

const TEST_SECRET = "test-secret-for-access-token-tests-32";

afterEach(() => {
    delete process.env.ACCESS_TOKEN_SECRET;
});

describe("createAccessToken", () => {
    it("creates a verifiable JWT with the expected claims", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const userId = "user-123";
        const token = await createAccessToken(userId);

        const signingKey = new TextEncoder().encode(TEST_SECRET);

        const { payload, protectedHeader } = await jwtVerify(
            token,
            signingKey,
            {
                algorithms: ["HS256"],
                issuer: ACCESS_TOKEN_ISSUER,
                audience: ACCESS_TOKEN_AUDIENCE,
            },
        );

        expect(protectedHeader.alg).toBe("HS256");
        expect(protectedHeader.typ).toBe("JWT");

        expect(payload.sub).toBe(userId);
        expect(payload.iss).toBe(ACCESS_TOKEN_ISSUER);
        expect(payload.aud).toBe(ACCESS_TOKEN_AUDIENCE);

        expect(typeof payload.iat).toBe("number");
        expect(typeof payload.exp).toBe("number");

        expect(payload.exp! - payload.iat!).toBe(
            ACCESS_TOKEN_TTL_SECONDS,
        );
    });

    it("rejects an empty user ID", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        await expect(createAccessToken("")).rejects.toThrow(
            /user ID is required/,
        );

        await expect(createAccessToken("   ")).rejects.toThrow(
            /user ID is required/,
        );
    });

    it("rejects a missing signing secret", async () => {
        delete process.env.ACCESS_TOKEN_SECRET;

        await expect(createAccessToken("user-123")).rejects.toThrow(
            /Invalid authentication configuration/,
        );
    });
});