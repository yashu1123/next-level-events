CREATE TABLE `video_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`object_key` text,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL
);
