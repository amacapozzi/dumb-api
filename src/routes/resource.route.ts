import express from "express";
import { ResourceController } from "../controllers/resource.controller";
export const ResourceRouter = express.Router();

ResourceRouter.route("/").get(ResourceController.getResourceByName);
