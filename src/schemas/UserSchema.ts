import { z } from "zod";

export const authUserShcema = z.object({
  username: z.string({ required_error: "User is required" }),
  password: z.string({ required_error: "Password is required" }),
  hwid: z.string(),
});

export const activeKeySchema = z.object({
  key: z.string({ required_error: "Key is required" }),
  userId: z.string({ required_error: "UserID is required" }),
});

export const createKeySchema = z.object({
  userId: z.string({ required_error: "UserID is required" }),
  expiration: z.number({ required_error: "Expiration is required" }),
});
