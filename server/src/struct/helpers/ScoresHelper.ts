import { TransformedAPIData } from "@/types";
import { DatabaseAPI } from "../DatabaseAPI";
import { encodeModBits } from "./ModsHelper";
//import { OsuAPI } from "../OsuAPI";

const db = new DatabaseAPI();

export async function createNewScore(data: TransformedAPIData) {
    await db.transaction(async (tx) => {
        const transactionContext = new DatabaseAPI(tx);
        const user = await transactionContext.getUserById(data.user.id);

        if (!user) {
            await transactionContext.createUser({
                id: data.user.id,
                username: data.user.username || ("OSULIVE_UNKNOWN_USER_ID:" + data.user.id)
            });
        } else if (data.user.username && data.user.username != user.username) {
            await transactionContext.updateUser(data.user.id, {
                username: data.user.username || ("OSULIVE_UNKNOWN_USER_ID:" + data.user.id)
            });
        };

        if (!data.beatmap) return;

        const beatmap = await transactionContext.getBeatmapById(data.beatmap.id);
        if (!beatmap) {
            if (data.beatmap.beatmapset.user_id != data.user.id) {
                let username = ("OSULIVE_UNKNOWN_USER_ID:" + data.beatmap.beatmapset.user_id);

                // Can't implement this for now due to rate limits, gotta find a workaround :(
                /*const osu = new OsuAPI();
                const usersResponse = await osu.getUsers([data.beatmap.beatmapset.user_id]);
                if (usersResponse?.users[0] && usersResponse?.users[0]?.username != "[deleted user]") {
                    username = usersResponse?.users[0]?.username;
                };*/

                const beatmapOwner = await transactionContext.getUserById(data.beatmap.beatmapset.user_id);
                if (!beatmapOwner) {
                    await transactionContext.createUser({
                        id: data.beatmap.beatmapset.user_id,
                        username: username
                    });
                } else if (username != beatmapOwner.username) {
                    await transactionContext.updateUser(data.beatmap.beatmapset.user_id, {
                        username: username
                    });
                };
            };

            const beatmapSet = await transactionContext.getBeatmapSetById(data.beatmap.beatmapset_id);
            if (!beatmapSet) {
                await transactionContext.createBeatmapSet({
                    id: data.beatmap.beatmapset.id,
                    title: data.beatmap.beatmapset.title,
                    artist: data.beatmap.beatmapset.artist,
                    user_id: data.beatmap.beatmapset.user_id,
                    status: data.beatmap.beatmapset.status
                });
            };

            await transactionContext.createBeatmap({
                id: data.beatmap.id,
                difficulty_rating: data.beatmap.difficulty_rating,
                mode: data.beatmap.mode,
                version: data.beatmap.version,
                ranked: data.beatmap.ranked,
                status: data.beatmap.status,
                beatmapset_id: data.beatmap.beatmapset_id,
            });
        };

        await transactionContext.createScore({
            id: data.id,
            accuracy: data.accuracy,
            mods: encodeModBits(data.mods),
            pp: data.pp || 0,
            ruleset_id: data.rulesetId,
            rank: data.rank,
            user_id: data.user.id,
            beatmap_id: data.beatmap_id,
            ended_at: data.ended_at/1000
        });
    });
};
