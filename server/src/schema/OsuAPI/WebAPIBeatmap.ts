import z from "zod";
import { WebAPIBeatmapSet } from "./WebAPIBeatmapSet";

export const WebAPIBeatmap = z.object({
  beatmapset_id: z.number(),
  difficulty_rating: z.number(),
  id: z.number(),
  mode: z.string(),
  status: z.string(),
  user_id: z.number(),
  //   convert: z.boolean(),
  version: z.string(),
  beatmapset: WebAPIBeatmapSet,
  //   owners: z.array(WebAPIBeatmapOwner),
  ranked: z.number(),
});
