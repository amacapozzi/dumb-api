import { type Request, Response } from "express";
import { KeyModel, UserModel } from "../models/mongodb/user";
import { activeKeySchema, createKeySchema } from "../schemas/UserSchema";

export class UserController {
  static async claimKey(req: Request, res: Response) {
    const { userId, key } = req.body;

    const validQuery = await activeKeySchema.safeParse(req.body);

    if (!validQuery.success) {
      const { error } = validQuery;
      return res.status(400).json({ message: "Bad request", error });
    }

    const isValidUser = await UserModel.findOne({ _id: userId });

    const isValidKey = await KeyModel.findOne({ key: key });

    if (!isValidUser) {
      return res.status(400).json({ message: "User not found" });
    } else if (!isValidKey) {
      return res.status(400).json({ message: "Invalid key" });
    } else if (isValidKey.used) {
      return res.status(400).json({ message: "This key is already used" });
    }

    await KeyModel.updateOne(
      { _id: isValidKey.id },
      { $set: { used: true, usedBy: isValidUser.username } }
    );

    await UserModel.updateOne(
      { _id: userId },
      { $set: { customer: true, expire: isValidKey.expire } }
    );

    return res.status(200).json({ message: "Key activated" });
  }

  static async createKey(req: Request, res: Response) {
    const { userId, expiration } = req.body;

    const validQuery = await createKeySchema.safeParse(req.body);

    if (!validQuery.success) {
      const { error } = validQuery;
      return res.status(400).json({ message: "Bad request", error });
    }

    const isValidUser = await UserModel.findOne({ _id: userId });

    const today = new Date();
    const expireDate = new Date(
      today.getTime() + expiration * 24 * 60 * 60 * 1000
    );

    if (!isValidUser) {
      return res.status(400).json({ message: "User not found" });
    } else if (!isValidUser.isAdmin) {
      return res.status(400).json({ message: "You cant create keys" });
    }

    const randomKey = crypto.randomUUID();

    await KeyModel.create({
      author: isValidUser.username,
      key: randomKey,
      used: false,
      expire: expireDate,
    });

    return res.status(200).json({ message: "Key created", randomKey });
  }
}
