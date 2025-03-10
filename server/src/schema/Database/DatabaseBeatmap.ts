import z from "zod";

export const DatabaseBeatmapSchema = z.object({
    id: z.number(),
    beatmapset_id: z.number(),
    difficulty_rating: z.number(),
    status: z.string(),
    mode: z.string(),
    version: z.string(),
    ranked: z.number()
}).passthrough();