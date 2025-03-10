import { DatabaseBeatmap, DatabaseBeatmapSet, DatabaseScore, DatabaseUser, UserRelations } from "@/types/database";
import { beatmapSetTable, beatmapTable, scoreTable, userTable } from "@/database/schema";
import { eq, SQL } from "drizzle-orm";
import db from "@/database";
import { databaseQueue } from "./helpers/JobQueueHelper";

export class DatabaseAPI {
    private readonly dbContext: any;

    constructor(context?: any) {
        this.dbContext = context ?? db;
    }

    public async transaction<T>(operation: (tx: any) => Promise<T>): Promise<any> {
        return await databaseQueue.addJob(async () => {
            return await db.transaction(async (tx) => {
                return await operation(tx);
            });
        })
    }

    public getUsers(filter?: (fields: any) => SQL<unknown> | undefined, relations?: UserRelations): Promise<DatabaseUser[]> {
        return this.dbContext.query.userTable.findMany({
            where: filter || undefined,
            with: relations || undefined
        });
    }

    public getUser(filter?: (fields: any) => SQL<unknown> | undefined, relations?: UserRelations): Promise<DatabaseUser | undefined> {
        return this.dbContext.query.userTable.findFirst({
            where: filter || undefined,
            with: relations || undefined
        });
    }

    public getAllUsers(relations?: UserRelations): Promise<DatabaseUser[]> {
        return this.getUsers(undefined, relations);
    }

    public getUserById(id: number, relations?: UserRelations): Promise<DatabaseUser | undefined> {
        return this.getUser((users: typeof userTable) => eq(users.id, id), relations);
    }

    public getUserByName(username: string, relations?: UserRelations): Promise<DatabaseUser | undefined> {
        return this.getUser((users: typeof userTable) => eq(users.username, username), relations);
    }

    public createUser({id, username}: Partial<DatabaseUser>) {
        return this.dbContext.insert(userTable).values({ id, username }).returning();
    }

    public updateUser(id: number, newUserData: Partial<DatabaseUser>) {
        return this.dbContext.update(userTable).set(newUserData).where(eq(userTable.id, id)).returning();
    }

    public deleteUser(id: number) {
        return this.dbContext.delete(userTable).where(eq(userTable.id, id));
    }

    public getBeatmapSet(filter?: (fields: any) => SQL<unknown> | undefined, relations?: UserRelations): Promise<DatabaseBeatmapSet | undefined> {
        return this.dbContext.query.beatmapSetTable.findFirst({
            where: filter || undefined,
            with: relations || undefined
        });
    }

    public getBeatmapSetById(id: number, relations?: any): Promise<DatabaseBeatmapSet | undefined> {
        return this.getBeatmapSet((beatmapsets: typeof beatmapSetTable) => eq(beatmapsets.id, id), relations);
    }

    public createBeatmapSet({id, title, status, artist, user_id}: DatabaseBeatmapSet) {
        return this.dbContext.insert(beatmapSetTable).values({ id, title, status, artist, user_id }).returning();
    }

    public getBeatmap(filter?: (fields: any) => SQL<unknown> | undefined, relations?: UserRelations): Promise<DatabaseBeatmap | undefined> {
        return this.dbContext.query.beatmapTable.findFirst({
            where: filter || undefined,
            with: relations || undefined
        });
    }

    public getBeatmapById(id: number, relations?: any): Promise<DatabaseBeatmap | undefined> {
        return this.getBeatmap((beatmaps: typeof beatmapTable) => eq(beatmaps.id, id), relations);
    }

    public createBeatmap({id, beatmapset_id, difficulty_rating, mode, version, ranked, status}: DatabaseBeatmap) {
        return this.dbContext.insert(beatmapTable).values({ id, beatmapset_id, difficulty_rating, mode, version, ranked, status }).returning();
    }

    public createScore({id, accuracy, mods, pp, ruleset_id, rank, user_id, beatmap_id, ended_at}: DatabaseScore) {
        return this.dbContext.insert(scoreTable).values({ id, accuracy, mods, pp, ruleset_id, rank, user_id, beatmap_id, ended_at }).returning();
    }
}