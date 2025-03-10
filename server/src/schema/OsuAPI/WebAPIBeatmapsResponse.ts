import z from "zod";
import { WebAPIBeatmap } from "./WebAPIBeatmap";

export const WebAPIBeatmapsResponse = z.object({
  beatmaps: z.array(WebAPIBeatmap),
});
