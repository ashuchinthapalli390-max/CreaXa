CREATE INDEX `campaigns_owner_updated` ON `campaigns` (`owner`,`updated`);--> statement-breakpoint
CREATE INDEX `engagements_brand` ON `engagements` (`brand`);--> statement-breakpoint
CREATE INDEX `engagements_creator` ON `engagements` (`creator`);--> statement-breakpoint
CREATE INDEX `events_engagement_created` ON `events` (`engagement`,`created`);--> statement-breakpoint
CREATE INDEX `invitations_brand` ON `invitations` (`brand`);--> statement-breakpoint
CREATE INDEX `invitations_creator` ON `invitations` (`creator`);--> statement-breakpoint
CREATE INDEX `notifications_owner_created` ON `notifications` (`owner`,`created`);--> statement-breakpoint
CREATE INDEX `portfolios_owner_published` ON `portfolios` (`owner`,`published`);--> statement-breakpoint
CREATE INDEX `profiles_published_updated` ON `profiles` (`published`,`updated`);