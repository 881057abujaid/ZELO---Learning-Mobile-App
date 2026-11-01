import express from "express";
import request from "supertest";
import {
    afterEach,
    describe,
    expect,
    it,
} from "vitest";
import { SignJWT } from "jose";

import { requireAccessToken } from "../../src/middleware/require-access-token.js";
import { errorHandler } from "../../src/middleware/error-handler.js";
import {
    ACCESS_TOKEN_AUDIENCE,
    ACCESS_TOKEN_ISSUER,
} from "../../src/modules/auth/access-token.service.js";

const TEST_SECRET = "test-secret-for-access-token-tests-32";
const WRONG_SECRET = "another-test-secret-that-is-also-32";

const originalSecret = process.env.ACCESS_TOKEN_SECRET;

interface TokenOptions {
    secret?: string;
    issuer?: string;
    audience?: string;
    algorithm?: "HS256" | "HS384";
    subject?: string;
    expiration?: string | number;
}

async function createTestToken(
    options: TokenOptions = {},
): Promise<string> {
    const secret = options.secret ?? TEST_SECRET;
    const algorithm = options.algorithm ?? "HS256";

    let token = new SignJWT({})
        .setProtectedHeader({
            alg: algorithm,
            typ: "JWT",
        })
        .setIssuer(options.issuer ?? ACCESS_TOKEN_ISSUER)
        .setAudience(options.audience ?? ACCESS_TOKEN_AUDIENCE)
        .setIssuedAt();

    if (options.subject !== undefined) {
        token = token.setSubject(options.subject);
    }

    token = token.setExpirationTime(
        options.expiration ?? "5m",
    );

    return token.sign(new TextEncoder().encode(secret));
}

function createTestApp() {
    const app = express();

    app.get("/protected", requireAccessToken, (_req, res) => {
        res.status(200).json({
            success: true,
            data: {
                userId: res.locals.auth.userId,
            },
        });
    });

    app.use(errorHandler);

    return app;

}

afterEach(() => {
    if (originalSecret === undefined) {
        delete process.env.ACCESS_TOKEN_SECRET;
    } else {
        process.env.ACCESS_TOKEN_SECRET = originalSecret;
    }
});

describe("requireAccessToken", () => {
    it("allows a valid token and exposes the verified user ID", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            subject: "user-123",
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                userId: "user-123",
            },
        });
    });

    it("rejects a missing Authorization header", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const response = await request(createTestApp())
            .get("/protected");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: {
                code: "UNAUTHENTICATED",
                message: "Please sign in to continue.",
            },
        });
    });

    it("rejects a malformed Bearer header", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", "Bearer");

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects an invalid signature", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            secret: WRONG_SECRET,
            subject: "user-123",
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects an expired token", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            subject: "user-123",
            expiration: Math.floor(Date.now() / 1000) - 60,
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects an incorrect issuer", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            issuer: "another-api",
            subject: "user-123",
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects an incorrect audience", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            audience: "another-client",
            subject: "user-123",
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects an unsupported signing algorithm", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken({
            algorithm: "HS384",
            subject: "user-123",
        });

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("rejects a token without a subject", async () => {
        process.env.ACCESS_TOKEN_SECRET = TEST_SECRET;

        const token = await createTestToken();

        const response = await request(createTestApp())
            .get("/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("UNAUTHENTICATED");
    });
});
