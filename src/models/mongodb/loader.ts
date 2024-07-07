import mongoose, { mongo, version } from "mongoose";
import { appConfig } from "../../config/app.config";
import { type Loader } from "../../types/User";

mongoose
  .connect(appConfig.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(`Error to connect to MongoDB ${err}`);
  });

const loaderSchema = new mongoose.Schema<Loader>(
  {
    isEnabled: { type: Boolean, default: true },
    version: { type: Number },
  },
  {
    versionKey: false,
  }
);

export const LoaderModel = mongoose.model<Loader>("Loader", loaderSchema);
