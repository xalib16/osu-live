import "dotenv/config";
import express from "express";
import expressWs from "express-ws";
import Redis from "ioredis";
import EventEmitter from "node:events";
import { OsuAPI } from "./struct/OsuAPI";
import { TransformedAPIData } from "./types/index";
import { DatabaseAPI } from "./struct/DatabaseAPI";
import { databaseQueue } from "./struct/helpers/JobQueueHelper";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is unset!");
}

const db = new DatabaseAPI();
const osu = new OsuAPI();
export const redis = new Redis(redisUrl);

const initialApp = express();
const wsApp = expressWs(initialApp);
const app = wsApp.app;

const chunkEmitter = new EventEmitter<{ emit: [TransformedAPIData[]] }>();
let connections = 0;

let handledInitialChunk = false;

setInterval(async () => {
  try {
    const scores = await osu.getScores();

    if (!handledInitialChunk) {
      handledInitialChunk = true;
      chunkEmitter.emit("emit", scores.slice(-50));
    } else {
      chunkEmitter.emit("emit", scores);
    }
  } catch (e) {
    console.error(`Failed to retrieve scores:`, e);
    chunkEmitter.emit("emit", []);
  }
}, parseInt(process.env.OSU_SCORES_POLL_INTERVAL || "5000"));

setInterval(async () => {
  const usersToFetch = (await redis.zpopmin("user-queue", 50)).filter(
    // removes timestamps from the array
    (_, index) => index % 2 === 0
  );

  if (usersToFetch.length === 0) {
    return;
  }

  try {
    const { users } = await osu.getUsers(usersToFetch);

    for (const user of users) {
      console.log(`Found user ${user.username} for ID ${user.id}`);
      redis.set(`user:${user.id}`, user.username);
      databaseQueue.addJob(() => {
        return db.updateUser(user.id, {
          username: user.username
        });
      });
    }
  } catch (e) {
    console.error(`Failed to retrieve users:`, e);
  }
}, parseInt(process.env.OSU_DATA_FETCH_INTERVAL || "15000"));

setInterval(async () => {
  const mapsToFetch = (await redis.zpopmin("beatmap-queue", 50)).filter(
    // removes timestamps from the array
    (_, index) => index % 2 === 0
  );

  if (mapsToFetch.length === 0) {
    return;
  }

  try {
    const { beatmaps } = await osu.getBeatmaps(mapsToFetch);

    for (let beatmap of beatmaps) {
      console.log(
        `Found map ${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} [${beatmap.version}] for ID ${beatmap.id}`
      );
      redis.set(`beatmap:${beatmap.id}`, JSON.stringify(beatmap));
      redis.zadd(`user-queue`, "LT", Date.now(), beatmap.beatmapset.user_id);
    }
  } catch (e) {
    console.error(`Failed to retrieve beatmaps:`, e);
  }
}, parseInt(process.env.OSU_DATA_FETCH_INTERVAL || "15000"));

app.ws("/", async (ws) => {
  console.log("Client connection opened");
  connections++;

  ws.send(
    JSON.stringify({ connections, healthy: osu.isApiHealthy, scores: [] })
  );

  const emit = (data: TransformedAPIData[]) => {
    ws.send(
      JSON.stringify({ connections, healthy: osu.isApiHealthy, scores: data })
    );
  };

  chunkEmitter.addListener("emit", emit);

  ws.on("close", () => {
    chunkEmitter.removeListener("emit", emit);
    connections--;
    console.log("Client connection closed");
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3727;
app.listen(port, '0.0.0.0', () => console.log(`Listening on ${port}`));
