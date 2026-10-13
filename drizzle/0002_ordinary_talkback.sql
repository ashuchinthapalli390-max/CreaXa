CREATE TABLE `project_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`engagement` text NOT NULL,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`due` text,
	`completed` integer DEFAULT 0 NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`engagement`) REFERENCES `engagements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_tasks_engagement` ON `project_tasks` (`engagement`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`engagement` text NOT NULL,
	`creator` text NOT NULL,
	`author` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`engagement`) REFERENCES `engagements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`creator`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_engagement_unique` ON `reviews` (`engagement`);--> statement-breakpoint
CREATE INDEX `reviews_creator` ON `reviews` (`creator`);--> statement-breakpoint
CREATE TABLE `saved_searches` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`data` text NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `saved_searches_owner` ON `saved_searches` (`owner`);--> statement-breakpoint
CREATE UNIQUE INDEX `saved_search_name` ON `saved_searches` (`owner`,`name`);