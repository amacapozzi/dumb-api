import { type Request, Response } from "express";
import fs from "fs";
import path from "path";
import { LoaderModel } from "../models/mongodb/loader";
import { DiscordHelper } from "../utils/DiscordHelper";
import { appConfig } from "../config/app.config";
import { StringModel } from "../models/mongodb/strings";
export const BASE_RESOURCE_PATH = path.join(process.cwd(), "src", "resources");

export class ResourceController {
  static async getResourceByName(req: Request, res: Response) {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please enter a valid resource." });
    }
    try {
      const resourceFilePath = path.join(BASE_RESOURCE_PATH, `${name}`);

      if (!fs.existsSync(resourceFilePath)) {
        return res.status(404).json({ message: "Resource not found." });
      }

      return res.download(resourceFilePath);
    } catch {
      return res.status(404).json({ message: "Resource not found." });
    }
  }

  static async getLoaderStatus(_req: Request, res: Response) {
    const loaderInfo = await LoaderModel.find();

    return res.status(200).json({
      version: loaderInfo[0].version,
      isEnabled: loaderInfo[0].isEnabled,
    });
  }

  static async getAllHashs(_req: Request, res: Response) {
    const hashs = await StringModel.find();
    console.log(hashs);

    return res.status(200).json(hashs);
  }

  static async updateLoader(req: Request, res: Response) {
    try {
      const author = {
        name: "Saturn.lat - update",

        icon_url:
          "https://media.discordapp.net/attachments/1266911238848385136/1268018412836229160/image.png?ex=66ab8e6c&is=66aa3cec&hm=559c3559b4198203d316a2eb995bdccd86d003d63e4b7ca6a3bcc76ac5a42af6&=&format=webp&quality=lossless&width=685&height=676",
      };

      const discordLogCreate = new DiscordHelper(appConfig.WEBHOOK_URL);

      discordLogCreate.createLog({
        author: author,
        description: `The loader is updated!\nThe resource with the name **${
          req.file?.originalname
        }** - \`(${
          req.query.type
        })\` has been updated\n⏲${new Date().toLocaleDateString()}`,
        title: "Saturn.lat - Logs",
      });

      return res.status(200).json({
        message: `Loader of type ${req.query.type} has been updated`,
      });
    } catch {
      return res
        .status(500)
        .json({ message: "Error trying uploading the loader" });
    }
  }
}
