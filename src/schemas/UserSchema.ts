import { z } from "zod";

export const authUserShcema = z.object({
  username: z.string({ required_error: "User is required" }),
  password: z.string({ required_error: "Password is required" }),
  hwid: z.string(),
});
