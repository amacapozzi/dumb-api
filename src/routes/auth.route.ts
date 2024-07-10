import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { defaultMiddleware } from "../middlewares/defaultMiddleware";
export const AuthRouter = express.Router();

AuthRouter.route("/register").post(AuthController.Register);
AuthRouter.route("/login").post(AuthController.WebLogin);
AuthRouter.route("/refreshToken").post(AuthController.RefreshToken);
AuthRouter.route("/loader/auth").post(
  defaultMiddleware,
  AuthController.LoaderLogin
);
