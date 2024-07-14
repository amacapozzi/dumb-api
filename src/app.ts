import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { AuthRouter } from "./routes/auth.route";
import { ResourceRouter } from "./routes/resource.route";
import { UserRouter } from "./routes/user.route";
export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "Infinity" }));
app.use(bodyParser.urlencoded({ limit: "Infinity", extended: true }));

app.use("/auth", AuthRouter);
app.use("/resource", ResourceRouter);
app.use("/user", UserRouter);
