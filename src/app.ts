import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AuthRouter } from "./routes/auth.route";
export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", AuthRouter);
