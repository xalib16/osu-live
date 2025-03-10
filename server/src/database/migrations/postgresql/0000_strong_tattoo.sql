CREATE TABLE "beatmap_set" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" text NOT NULL,
	"artist" text NOT NULL,
	"user_id" integer NOT NULL,
	"updated_at" integer DEFAULT extract(epoch from now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beatmap" (
	"id" integer PRIMARY KEY NOT NULL,
	"beatmapset_id" integer NOT NULL,
	"difficulty_rating" real NOT NULL,
	"mode" text NOT NULL,
	"status" text NOT NULL,
	"version" text NOT NULL,
	"ranked" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score" (
	"id" integer PRIMARY KEY NOT NULL,
	"accuracy" real NOT NULL,
	"mods" integer DEFAULT 0 NOT NULL,
	"pp" real DEFAULT 0 NOT NULL,
	"ruleset_id" integer NOT NULL,
	"rank" text NOT NULL,
	"user_id" integer NOT NULL,
	"beatmap_id" integer NOT NULL,
	"ended_at" integer DEFAULT extract(epoch from now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" integer DEFAULT extract(epoch from now()) NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "beatmap_set" ADD CONSTRAINT "beatmap_set_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beatmap" ADD CONSTRAINT "beatmap_beatmapset_id_beatmap_set_id_fk" FOREIGN KEY ("beatmapset_id") REFERENCES "public"."beatmap_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score" ADD CONSTRAINT "score_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score" ADD CONSTRAINT "score_beatmap_id_beatmap_id_fk" FOREIGN KEY ("beatmap_id") REFERENCES "public"."beatmap"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "beatmapset_id_idx" ON "beatmap" USING btree ("beatmapset_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "score" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "beatmap_id_idx" ON "score" USING btree ("beatmap_id");--> statement-breakpoint
CREATE INDEX "user_beatmap_idx" ON "score" USING btree ("user_id","beatmap_id");--> statement-breakpoint
CREATE INDEX "beatmap_ended_at_idx" ON "score" USING btree ("ended_at");--> statement-breakpoint
CREATE INDEX "username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");