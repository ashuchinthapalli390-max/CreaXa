CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`subject` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `engagements` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation` text NOT NULL,
	`campaign` text NOT NULL,
	`brand` text NOT NULL,
	`creator` text NOT NULL,
	`status` text DEFAULT 'accepted' NOT NULL,
	`revisions` integer DEFAULT 0 NOT NULL,
	`data` text NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`invitation`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `engagements_invitation_unique` ON `engagements` (`invitation`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`engagement` text NOT NULL,
	`author` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`engagement`) REFERENCES `engagements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`status` text DEFAULT 'evidence submitted' NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`creator` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorite_pair` ON `favorites` (`owner`,`creator`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign` text NOT NULL,
	`brand` text NOT NULL,
	`creator` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`campaign`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`creator`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitation_pair` ON `invitations` (`campaign`,`creator`);--> statement-breakpoint
CREATE TABLE `limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`href` text NOT NULL,
	`read` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`slug` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`data` text NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolios_slug_unique` ON `portfolios` (`slug`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`verification` text DEFAULT 'self-declared' NOT NULL,
	`data` text NOT NULL,
	`updated` integer NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_slug_unique` ON `profiles` (`slug`);--> statement-breakpoint
CREATE TABLE `support` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL
);
