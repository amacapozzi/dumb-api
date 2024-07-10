import "dotenv/config";

export const appConfig = {
  PORT: process.env.PORT ?? "",
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY ?? "",
  AUTH_TOKEN: process.env.AUTH_TOKEN ?? "",
  REFRESH_TOKEN: process.env.REFRESH_TOKEN ?? "",
};
