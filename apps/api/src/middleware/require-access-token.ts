import type { RequestHandler } from "express";
import { jwtVerify } from "jose";

import { getAuthConfig } from "../config/auth-config.js";
import { AppError } from "../common/errors/app-error.js";
import {
    ACCESS_TOKEN_AUDIENCE,
    ACCESS_TOKEN_ISSUER,
} from "../modules/auth/access-token.service.js";

function unauthenticatedError(): AppError {
    return new AppError(
        401,
        "UNAUTHENTICATED",
        "Please sign in to continue.",
    );
}

export const requireAccessToken: RequestHandler = async (
    req,
    res,
    next,
) => {
    const authorization = req.get("authorization");
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        next(unauthenticatedError());
        return;
    }

    // Configuration errors must not be disguised as invalid-token errors.
    const { accessTokenSecret } = getAuthConfig();
    const signingKey = new TextEncoder().encode(accessTokenSecret);

    let authenticatedUserId: string | undefined;

    try {
        const { payload } = await jwtVerify(match[1], signingKey, {
            algorithms: ["HS256"],
            issuer: ACCESS_TOKEN_ISSUER,
            audience: ACCESS_TOKEN_AUDIENCE,
        });

        if (
            typeof payload.sub === "string" &&
            payload.sub.trim().length > 0
        ) {
            authenticatedUserId = payload.sub;
        }
    } catch {
        // Do not expose JWT verification details to the client.
    }

    if (!authenticatedUserId) {
        next(unauthenticatedError());
        return;
    }

    res.locals.auth = {
        userId: authenticatedUserId,
    };

    next();
};
