import z from "zod";

export const DatabaseScoreSchema = z.object({
  id: z.number(),
  accuracy: z.number(),
  mods: z.array(z.string()),
  pp: z.number(),
  ruleset_id: z.number(),
  rank: z.string(),
  user_id: z.number(),
  beatmap_id: z.number(),
  ended_at: z.string(),
}).passthrough();
