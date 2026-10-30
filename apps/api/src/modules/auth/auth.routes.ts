import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { register } from "./auth.controller.js";
import { registrationSchema } from "./auth.validation.js";
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

authRouter.post(
    "/register",
    registrationRateLimit,
    validateRequest(registrationSchema),
    register,
);

export default authRouter;