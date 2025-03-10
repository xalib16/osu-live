import z from "zod";

import { WebAPIBeatmap } from "../schema/OsuAPI/WebAPIBeatmap";

export type TransformedAPIData = {
  beatmap_id: number;
  ended_at: number;
  mods: { acronym: string }[];
  pp: number | null;
  user: {
    id: number;
    username: string | null;
  };
  id: number;
  accuracy: number;
  rank: string;
  beatmap: z.infer<typeof WebAPIBeatmap> | null;
  rulesetId: number;
};
