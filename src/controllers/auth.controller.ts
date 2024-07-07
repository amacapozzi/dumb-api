import { type Request, Response } from "express";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/mongodb/user";
import { authUserShcema } from "../schemas/UserSchema";
import { appConfig } from "../config/app.config";

export class AuthController {
  static async WebLogin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const isValidUsername = await UserModel.findOne({ username });

      if (!isValidUsername) {
        return res.status(400).json({ message: "Invalid username" });
      }

      const isValidHashedPassword = await bcrypt.compare(
        password,
        isValidUsername.password
      );

      if (!isValidHashedPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = await jwt.sign(
        {
          id: isValidUsername.id,
          username: isValidUsername.username,
        },
        appConfig.AUTH_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("auth-session", token, {
        httpOnly: true,
        secure: process.env.PRODUCTION === "PRODUCTION",
        maxAge: 3600000,
      });

      return res
        .status(200)
        .json({ message: "User logged successfully", token });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async LoaderLogin(req: Request, res: Response) {
    const { username, password, hwid } = req.body;

    const isValidObj = await authUserShcema.safeParse(req.body);

    if (!isValidObj.success) {
      const { errors } = isValidObj.error;
      return res.status(400).json({ message: errors });
    }

    const isValidUsername = await UserModel.findOne({ username });

    const hwidBanned = await UserModel.findOne({ hwid: hwid, isBanned: true });

    if (!isValidUsername) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isValidHashedPassword = bcrypt.compareSync(
      password,
      isValidUsername.password
    );

    if (!isValidHashedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (hwidBanned) {
      return res.status(400).json({ message: "Your hadware is banned" });
    }

    if (isValidUsername.isBanned) {
      return res.status(400).json({ message: "You are banned" });
    }

    if (!isValidUsername.hwid) {
      await isValidUsername.updateOne({ username: username, hwid: hwid });
    }

    if (isValidUsername.hwid && isValidUsername.hwid !== hwid) {
      await isValidUsername.updateOne({ username: username, isBanned: true });
      return res.status(400).json({ message: "HWID Mismatch" });
    }

    return res.status(200).json({ message: "User logged successfully" });
  }

  static async Register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const isAlreadyUsedUsername = await UserModel.findOne({
        username: username,
      });

      if (isAlreadyUsedUsername) {
        return res.status(400).json({ message: "Username is already used" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      await UserModel.create({
        username,
        password: hashedPassword,
      });

      return res.status(200).json({ message: "Account created successfully" });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
