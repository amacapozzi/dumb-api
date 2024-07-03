import express from "express";
import { AuthController } from "../controllers/auth.controller";
export const AuthRouter = express.Router();

AuthRouter.route("/register").post(AuthController.Register);
AuthRouter.route("/login").post(AuthController.WebLogin);
