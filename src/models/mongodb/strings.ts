import mongoose from "mongoose";
import { appConfig } from "../../config/app.config";
import { IString, type Loader } from "../../types/User";

mongoose
  .connect(appConfig.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(`Error to connect to MongoDB ${err}`);
  });

const stringSchema = new mongoose.Schema<IString>(
  {
    clientName: { type: String },
    addedBy: { type: String },
    cheatType: { type: String },
    processName: { type: String },
    clientHash: { type: String },
  },
  {
    versionKey: false,
  }
);

export const StringModel = mongoose.model<IString>("strings", stringSchema);
