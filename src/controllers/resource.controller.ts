import { type Request, Response } from "express";
import fs from "fs";
import path from "path";
import { LoaderModel } from "../models/mongodb/loader";
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

  static async updateLoader(_req: Request, res: Response) {
    try {
      return res
        .status(200)
        .json({ message: "Loader of type CLI has been updated" });
    } catch {
      return res
        .status(500)
        .json({ message: "Error trying uploading the loader" });
    }
  }
}
