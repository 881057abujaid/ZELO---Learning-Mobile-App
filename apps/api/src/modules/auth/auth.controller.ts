import type { RequestHandler } from "express";
import type {
    LoginInput,
    RefreshInput,
    RegistrationInput,
    ForgotPasswordInput,
    ResetPasswordInput,
} from "./auth.validation.js";
import {
    loginUser,
    logoutUser,
    refreshUserSession,
    registerUser,
    requestPasswordReset,
    resetPassword as resetPasswordService,
} from "./auth.service.js";

export const register: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as RegistrationInput;
        const user = await registerUser(input);

        res.status(201).json({
            success: true,
            data: {
                user,
            },
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const login: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as LoginInput;
        const result = await loginUser(input);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const refresh: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as RefreshInput;
        const result = await refreshUserSession(input);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const logout: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as RefreshInput;

        await logoutUser(input);

        res.status(200).json({
            success: true,
            data: {
                message: "Logged out successfully.",
            },
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const forgotPassword: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as ForgotPasswordInput;

        await requestPasswordReset(input);

        res.status(200).json({
            success: true,
            data: {
                message:
                    "If an account exists for that email, password reset instructions have been sent.",
            },
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const resetPassword: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const input = req.body as ResetPasswordInput;

        await resetPasswordService(input);

        res.status(200).json({
            success: true,
            data: {
                message: "Password has been reset successfully.",
            },
        });
    } catch (error: unknown) {
        next(error);
    }
};
