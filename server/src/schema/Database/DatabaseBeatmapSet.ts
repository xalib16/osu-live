import z from "zod";

export const DatabaseBeatmapSetSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.string(),
    artist: z.string(),
    user_id: z.number(),
}).passthrough();
