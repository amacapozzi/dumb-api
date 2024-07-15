import mongoose from "mongoose";
import { appConfig } from "../../config/app.config";
import { type User, type Key } from "../../types/User";

mongoose
  .connect(appConfig.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(`Error to connect to MongoDB ${err}`);
  });

const userSchema = new mongoose.Schema<User>(
  {
    username: String,
    refreshToken: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    key: String,
    roles: [{ type: String }],
    customer: { type: Boolean, default: false },
    expire: Date,
    hwid: { type: String },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const keySchema = new mongoose.Schema<Key>(
  {
    key: String,
    used: { type: Boolean, default: false },
    expire: { type: Date, required: true },
    usedBy: String,
    author: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<User>("User", userSchema);
export const KeyModel = mongoose.model<Key>("Key", keySchema);
