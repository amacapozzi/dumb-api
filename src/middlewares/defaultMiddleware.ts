import { NextFunction, Request, Response } from "express";
import { appConfig } from "../config/app.config";

export const defaultMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = await req.headers.authorization?.split(" ")[1];

  if (authToken !== appConfig.AUTH_TOKEN || !authToken) {
    return res.status(400).send("Unauthorized");
  }

  return next();
};
