import type { RequestHandler } from "express";
import type { RegistrationInput } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";

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