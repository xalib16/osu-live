CREATE TABLE `beatmap_set` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`artist` text NOT NULL,
	`user_id` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `beatmap` (
	`id` integer PRIMARY KEY NOT NULL,
	`beatmapset_id` integer NOT NULL,
	`difficulty_rating` real NOT NULL,
	`mode` text NOT NULL,
	`status` text NOT NULL,
	`version` text NOT NULL,
	`ranked` integer NOT NULL,
	FOREIGN KEY (`beatmapset_id`) REFERENCES `beatmap_set`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `beatmapset_id_index` ON `beatmap` (`beatmapset_id`);--> statement-breakpoint
CREATE TABLE `score` (
	`id` integer PRIMARY KEY NOT NULL,
	`accuracy` real NOT NULL,
	`mods` text DEFAULT '[]' NOT NULL,
	`pp` real DEFAULT 0 NOT NULL,
	`ruleset_id` integer NOT NULL,
	`rank` text NOT NULL,
	`user_id` integer NOT NULL,
	`beatmap_id` integer NOT NULL,
	`ended_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`beatmap_id`) REFERENCES `beatmap`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_id_index` ON `score` (`user_id`);--> statement-breakpoint
CREATE INDEX `beatmap_id_index` ON `score` (`beatmap_id`);--> statement-breakpoint
CREATE INDEX `user_beatmap_index` ON `score` (`user_id`,`beatmap_id`);--> statement-breakpoint
CREATE INDEX `beatmap_ended_at_idx` ON `score` (`ended_at`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE INDEX `username_index` ON `user` (`username`);--> statement-breakpoint
CREATE INDEX `user_created_at_idx` ON `user` (`created_at`);