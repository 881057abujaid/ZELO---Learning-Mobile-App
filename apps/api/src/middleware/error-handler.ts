import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../common/errors/app-error.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "The requested resource was not found.",
        },
    });
};

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    _next,
) => {
    if (error instanceof AppError) {
        const appError = error as Error & {
            statusCode: number;
            code: string;
            details?: unknown;
        };

        res.status(appError.statusCode).json({
            success: false,
            error: {
                code: appError.code,
                message: appError.message,
                ...(appError.details !== undefined
                    ? { details: appError.details }
                    : {}),
            },
        });
        return;
    }

    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
        },
    });
};