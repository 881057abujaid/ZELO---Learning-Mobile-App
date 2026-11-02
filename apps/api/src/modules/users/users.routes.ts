import { Router } from "express";
import { requireAccessToken } from "../../middleware/require-access-token.js";
import { getMyProfileController } from "./users.controller.js";

const usersRouter = Router();

usersRouter.get(
    "/me",
    requireAccessToken,
    getMyProfileController,
);

export default usersRouter;