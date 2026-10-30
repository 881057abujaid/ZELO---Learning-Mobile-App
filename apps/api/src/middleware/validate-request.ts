import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../common/errors/app-error.js";

export function validateRequest(
    schema: ZodType,
): RequestHandler {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            next(
                new AppError(
                    400,
                    "VALIDATION_ERROR",
                    "Please check the submitted information.",
                    result.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                ),
            );

            return;
        }

        req.body = result.data;
        next();
    };
}