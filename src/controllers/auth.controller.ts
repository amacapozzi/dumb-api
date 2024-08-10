import e, { type Request, Response } from "express";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { RoleModel, UserModel } from "../models/mongodb/user";
import { authUserShcema } from "../schemas/UserSchema";
import { appConfig } from "../config/app.config";
import { KeyHelper } from "../utils/KeyHelper";
import { DiscordHelper } from "../utils/DiscordHelper";

export class AuthController {
  static async WebLogin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password is required" });
      }

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

      const discordHelper = new DiscordHelper(appConfig.WEBHOOK_URL);

      discordHelper.createLog({
        author: {
          name: `${isValidUsername.username}`,
          icon_url:
            "https://media.discordapp.net/attachments/1266911238848385136/1268018412836229160/image.png?ex=66ab8e6c&is=66aa3cec&hm=559c3559b4198203d316a2eb995bdccd86d003d63e4b7ca6a3bcc76ac5a42af6&=&format=webp&quality=lossless&width=685&height=676",
        },
        title: "HWID Mismatch",
        fields: [
          {
            name: "Old hwid",
            value: `${isValidUsername.hwid}`,
            inline: true,
          },
          {
            name: "New hwid",
            value: `${hwid}`,
            inline: false,
          },
        ],
      });

      return res.status(400).json({ message: "HWID Mismatch" });
    }

    return res.status(200).json({
      message: "User logged successfully",
      expire: new Date(isValidUsername.expire).toLocaleDateString(),
    });
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

      const defaultRole = await RoleModel.findOne({ roleName: "User" }).lean();

      const roleObj = {
        roleId: defaultRole?._id.toString(),
        roleName: defaultRole?.roleName,
      };

      await UserModel.create({
        username,
        roles: [roleObj],
        password: hashedPassword,
      });

      return res.status(200).json({ message: "Account created successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
