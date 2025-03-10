export type DatabaseBeatmap = {
    id: number;
    beatmapset_id: number;
    difficulty_rating: number;
    mode: string;
    version: string;
    ranked: number;
    status: string;
    beatmapSet?: DatabaseBeatmapSet;
}

export type DatabaseBeatmapSet = {
    id: number;
    title: string;
    status: string;
    artist: string;
    user_id: number;
    beatmaps?: Array<DatabaseBeatmap>;
}

export type DatabaseUser = {
    id: number;
    username: string;
    created_at: string;
    scores?: Array<DatabaseScore>
    ownedBeatmaps?: Array<DatabaseBeatmapSet>
}

export type DatabaseScore = {
    id: number;
    accuracy: number;
    pp: number;
    ruleset_id: number;
    rank: string;
    mods: number;
    user_id: number;
    beatmap_id: number;
    ended_at: number;
    user?: DatabaseUser;
    beatmap?: DatabaseBeatmap;
}

export type UserRelations = {
    scores?: any;
    ownedBeatmaps?: any;
}

export type BeatmapSetRelations = {
    user?: DatabaseUser;
    beatmaps?: Array<DatabaseBeatmap>;
}

export type BeatmapRelations = {
    beatmapSet?: DatabaseBeatmapSet,
    scores?: Array<DatabaseScore>
}

export type ScoreRelations = {
    beatmap?: DatabaseBeatmap,
    user?: DatabaseUser
}