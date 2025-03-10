import z from "zod";
import { WebAPIUser } from "./WebAPIUser";

export const WebAPIBeatmapSet = z.object({
  artist: z.string(),
  id: z.number(),
  status: z.string(),
  title: z.string(),
  user_id: z.number(),
  user: WebAPIUser.optional()
});
