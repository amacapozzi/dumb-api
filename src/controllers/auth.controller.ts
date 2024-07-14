import e, { type Request, Response } from "express";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/mongodb/user";
import { authUserShcema } from "../schemas/UserSchema";
import { appConfig } from "../config/app.config";
import { KeyHelper } from "../utils/KeyHelper";

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

      const userObj = {
        id: isValidUsername.id,
        username: isValidUsername.username,
        isAdmin: isValidUsername.isAdmin,
        customer: isValidUsername.customer,
        hwid: isValidUsername.hwid,
        expire: isValidUsername.expire,
      };

      return res.status(200).json({
        message: "User logged successfully",

        user: userObj,
      });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async RefreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.query;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      const decoded = jwt.verify(
        refreshToken as any,
        appConfig.AUTH_SECRET_KEY
      ) as any;

      const decodedId = decoded.id;

      console.log(decodedId);

      const user = await UserModel.findOne({ _id: decodedId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          customer: user.customer,
          hwid: user.hwid,
          expire: user.expire,
        },
        appConfig.AUTH_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("auth-session", accessToken, {
        httpOnly: true,
        secure: process.env.PRODUCTION === "PRODUCTION",
        maxAge: 3600000,
      });

      return res.status(200).json({
        message: "Token refreshed successfully",
        accessToken,
      });
    } catch (error) {
      console.error("Error in RefreshToken:", error);
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

    if (!isValidUsername.customer) {
      return res.status(400).json({ message: "You are a not customer" });
    }

    if (hwidBanned) {
      return res.status(400).json({ message: "Your hadware is banned" });
    }

    if (isValidUsername.isBanned) {
      return res.status(400).json({ message: "You are banned" });
    }

    const keyService = new KeyHelper(isValidUsername.expire);

    if (!isValidUsername.hwid) {
      await isValidUsername.updateOne({ hwid: hwid });
    }

    const isExpired = await keyService.isExpired();

    console.log(keyService.getTimeLeft());

    if (isExpired) {
      await isValidUsername.updateOne({ customer: false });
      return res.status(400).json({ message: "Your subcription is expired" });
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

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password is required" });
      }

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
