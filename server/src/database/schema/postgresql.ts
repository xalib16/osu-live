import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { integer, text, real, index } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: integer("id").notNull().primaryKey(),
    username: text("username").notNull().unique(),
    created_at: integer("created_at").notNull().default(sql`extract(epoch from now())`)
}, (user) => [
    index("username_idx").on(user.username),
    index("user_created_at_idx").on(user.created_at)
]);

export const beatmapSetTable = pgTable("beatmap_set", {
    id: integer("id").primaryKey().notNull(),
    title: text("title").notNull(),
    status: text("status").notNull(),
    artist: text("artist").notNull(),
    user_id: integer("user_id").references(() => userTable.id).notNull(),
    updated_at: integer("updated_at").notNull().default(sql`extract(epoch from now())`)
});

export const beatmapTable = pgTable("beatmap", {
    id: integer("id").primaryKey().notNull(),
    beatmapset_id: integer("beatmapset_id").references(() => beatmapSetTable.id, { "onDelete": "cascade" }).notNull(),
    difficulty_rating: real("difficulty_rating").notNull(),
    mode: text("mode").notNull(),
    status: text("status").notNull(),
    version: text("version").notNull(),
    ranked: integer("ranked").notNull()
}, (beatmap) => [
    index("beatmapset_id_idx").on(beatmap.beatmapset_id)
]);

export const scoreTable = pgTable("score", {
    id: integer("id").primaryKey().notNull(),
    accuracy: real("accuracy").notNull(),
    mods: text("mods").notNull().default("[]"),
    pp: real("pp").notNull().default(0),
    ruleset_id: integer("ruleset_id").notNull(),
    rank: text("rank").notNull(),
    user_id: integer("user_id").references(() => userTable.id, { "onDelete": "cascade" }).notNull(),
    beatmap_id: integer("beatmap_id").references(() => beatmapTable.id, { "onDelete": "cascade" }).notNull(),
    ended_at: integer("ended_at").notNull().default(sql`extract(epoch from now())`)
}, (score) => [
    index("user_id_idx").on(score.user_id),
    index("beatmap_id_idx").on(score.beatmap_id),
    index("user_beatmap_idx").on(score.user_id, score.beatmap_id),
    index("beatmap_ended_at_idx").on(score.ended_at)
]);

export const beatmapSetRelations = relations(beatmapSetTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [beatmapSetTable.user_id],
        references: [userTable.id]
    }),
    beatmaps: many(beatmapTable)
}));

export const beatmapRelations = relations(beatmapTable, ({ one, many }) => ({
    beatmapSet: one(beatmapSetTable, {
        fields: [beatmapTable.beatmapset_id],
        references: [beatmapSetTable.id]
    }),
    scores: many(scoreTable)
}));

export const scoreRelations = relations(scoreTable, ({ one }) => ({
    beatmap: one(beatmapTable, {
        fields: [scoreTable.beatmap_id],
        references: [beatmapTable.id]
    }),
    user: one(userTable, {
        fields: [scoreTable.user_id],
        references: [userTable.id]
    })
}));

export const userRelations = relations(userTable, ({ many }) => ({
    scores: many(scoreTable),
    ownedBeatmaps: many(beatmapSetTable)
}));