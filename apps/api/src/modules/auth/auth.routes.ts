import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
} from "./auth.controller.js";
import {
    registrationSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "./auth.validation.js";
import { validateRequest } from "../../middleware/validate-request.js";

const authRouter = Router();

const registrationRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "RATE_LIMITED",
            message: "Too many registration attempts. Please try again later.",
        },
    },
});

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "RATE_LIMITED",
            message: "Too many login attempts. Please try again later.",
        },
    },
});

// Provisional abuse protection; revisit the threshold before production.
const refreshRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "RATE_LIMITED",
            message: "Too many session refresh attempts. Please try again later.",
        },
    },
});

// Provisional abuse protection; revisit the threshold before production.
const logoutRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "RATE_LIMITED",
            message: "Too many logout attempts. Please try again later.",
        },
    },
});

const passwordRecoveryRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "RATE_LIMITED",
            message:
                "Too many password recovery attempts. Please try again later.",
        },
    },
});

authRouter.post(
    "/register",
    registrationRateLimit,
    validateRequest(registrationSchema),
    register,
);

authRouter.post(
    "/login",
    loginRateLimit,
    validateRequest(loginSchema),
    login,
);

authRouter.post(
    "/refresh",
    refreshRateLimit,
    validateRequest(refreshSchema),
    refresh,
);

authRouter.post(
    "/logout",
    logoutRateLimit,
    validateRequest(refreshSchema),
    logout,
);

authRouter.post(
    "/forgot-password",
    passwordRecoveryRateLimit,
    validateRequest(forgotPasswordSchema),
    forgotPassword,
);

authRouter.post(
    "/reset-password",
    passwordRecoveryRateLimit,
    validateRequest(resetPasswordSchema),
    resetPassword,
);

export default authRouter;
