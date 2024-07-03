import { type Request, Response } from "express";
import fs from "fs";
import path from "path";

const BASE_RESOURCE_PATH = path.join(process.cwd(), "src", "resources");

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
}
