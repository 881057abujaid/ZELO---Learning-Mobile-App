import type { RequestHandler } from "express";
import { getMyProfile, updateMyProfile } from "./users.service.js";
import type { UpdateMyProfileInput } from "./users.schemas.js";

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

export const updateMyProfileController: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const auth = res.locals.auth as {
            userId: string;
        };

        const profile = await updateMyProfile(
            auth.userId,
            req.body as UpdateMyProfileInput,
        );

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error: unknown) {
        next(error);
    }
};
