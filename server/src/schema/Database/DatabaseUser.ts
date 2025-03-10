import z from "zod";

export const DatabaseUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  created_at: z.string(),
}).passthrough();
