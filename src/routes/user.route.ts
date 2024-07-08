import express from "express";
import { UserController } from "../controllers/user.controller";
import { defaultMiddleware } from "../middlewares/defaultMiddleware";
export const UserRouter = express.Router();

UserRouter.route("/create/key").post(UserController.createKey);

UserRouter.route("/claim/key").post(UserController.claimKey);
