CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`event` text NOT NULL,
	`rating` integer NOT NULL,
	`message` text NOT NULL,
	`created` integer NOT NULL
);
