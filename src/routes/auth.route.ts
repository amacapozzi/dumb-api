import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { defaultMiddleware } from "../middlewares/defaultMiddleware";
export const AuthRouter = express.Router();

AuthRouter.route("/register").post(AuthController.Register);
AuthRouter.route("/login").post(AuthController.WebLogin);
AuthRouter.route("/loader/auth").post(AuthController.LoaderLogin);
