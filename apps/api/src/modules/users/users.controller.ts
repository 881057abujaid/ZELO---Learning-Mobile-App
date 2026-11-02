import type { RequestHandler } from "express";
import { getMyProfile } from "./users.service.js";

export const getMyProfileController: RequestHandler = async (
    _req,
    res,
    next,
) => {
    try {
        const auth = res.locals.auth as {
            userId: string;
        };

        const profile = await getMyProfile(auth.userId);

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error: unknown) {
        next(error);
    }
};