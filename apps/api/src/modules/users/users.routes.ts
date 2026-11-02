import { Router } from "express";

import { requireAccessToken } from "../../middleware/require-access-token.js";
import { validateRequest } from "../../middleware/validate-request.js";

import {
    getMyProfileController,
    updateMyProfileController,
} from "./users.controller.js";

import { updateMyProfileSchema } from "./users.schemas.js";

const usersRouter = Router();

usersRouter.get(
    "/me",
    requireAccessToken,
    getMyProfileController,
);

usersRouter.patch(
    "/me",
    requireAccessToken,
    validateRequest(updateMyProfileSchema),
    updateMyProfileController,
);

export default usersRouter;