import express from "express";
import { ResourceController } from "../controllers/resource.controller";
import { defaultMiddleware } from "../middlewares/defaultMiddleware";
import multer from "multer";
import { FileType, getFileName } from "../utils/FileHelper";

const storage = multer.diskStorage({
  destination: "src/resources",
  filename: function (req, file, callback) {
    const { type } = req.query;
    const name = getFileName(
      type?.toString().toUpperCase() as FileType,
      file.originalname
    );
    callback(null, name?.toString() as string);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: Infinity, fieldSize: Infinity },
});

export const ResourceRouter = express.Router();

ResourceRouter.route("/").get(
  defaultMiddleware,
  ResourceController.getResourceByName
);
ResourceRouter.route("/info").get(
  defaultMiddleware,
  ResourceController.getLoaderStatus
);

ResourceRouter.route("/upload").post(
  defaultMiddleware,
  upload.single("file"),
  ResourceController.updateLoader
);
