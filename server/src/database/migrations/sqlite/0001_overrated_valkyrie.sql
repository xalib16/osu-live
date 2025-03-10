PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_beatmap_set` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`artist` text NOT NULL,
	`user_id` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_beatmap_set`("id", "title", "status", "artist", "user_id", "updated_at") SELECT "id", "title", "status", "artist", "user_id", "updated_at" FROM `beatmap_set`;--> statement-breakpoint
DROP TABLE `beatmap_set`;--> statement-breakpoint
ALTER TABLE `__new_beatmap_set` RENAME TO `beatmap_set`;--> statement-breakpoint
PRAGMA foreign_keys=ON;