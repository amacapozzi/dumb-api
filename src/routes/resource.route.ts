import express from "express";
import { ResourceController } from "../controllers/resource.controller";
import { defaultMiddleware } from "../middlewares/defaultMiddleware";
export const ResourceRouter = express.Router();

ResourceRouter.route("/").get(
  defaultMiddleware,
  ResourceController.getResourceByName
);
ResourceRouter.route("/info").get(
  defaultMiddleware,
  ResourceController.getLoaderStatus
);
