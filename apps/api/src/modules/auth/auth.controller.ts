import type { RequestHandler } from "express";
import type {
    LoginInput,
    RegistrationInput,
} from "./auth.validation.js";
import {
    loginUser,
    registerUser,
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
