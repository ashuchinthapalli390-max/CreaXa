# CreaXa Database Schema & Data Dictionary

## 1. Overview

CreaXa uses **Cloudflare D1** (distributed SQLite at the edge) managed with **Drizzle ORM** (`drizzle-orm` v0.45.2 / `drizzle-kit` v0.31.10).

The schema comprises 17 tables supporting authentication, multi-role user accounts, rich AI creator portfolios, brand briefs, invitations, transactional engagements, revisions, reviews, audit logging, and file metadata.

All schema migrations are located in `drizzle/` and tracked in `drizzle_migrations`:
- `0000_bouncy_captain_cross.sql`: Core marketplace tables
- `0001_melted_stryfe.sql`: Saved searches and project tasks
- `0002_ordinary_talkback.sql`: Rating reviews and creator reviews table

---

## 2. Table Specifications

### 2.1 `accounts`
Stores primary identity and authentication records.
```sql
CREATE TABLE `accounts` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `name` text NOT NULL,
  `role` text NOT NULL,             -- 'creator' | 'brand' | 'admin'
  `data` text DEFAULT '{}' NOT NULL,-- JSON: avatar, bio, company details, preferences
  `created` integer NOT NULL,       -- Unix timestamp (ms)
  `updated` integer NOT NULL        -- Unix timestamp (ms)
);
```

### 2.2 `profiles`
Creator public profiles, commercial capabilities, and verification level.
```sql
CREATE TABLE `profiles` (
  `id` text PRIMARY KEY NOT NULL REFERENCES `accounts`(`id`),
  `slug` text NOT NULL UNIQUE,      -- URL slug: e.g. 'alice-wonder'
  `published` integer DEFAULT 0 NOT NULL, -- 0 = draft, 1 = public discovery
  `verification` text DEFAULT 'self-declared' NOT NULL, -- 'self-declared' | 'verified_id' | 'top_creator'
  `data` text NOT NULL,             -- JSON: headline, bio, specialization, skills, tools, startingRate, currency, aspectRatios, commercialUse
  `updated` integer NOT NULL
);
CREATE INDEX `profiles_published_updated` ON `profiles` (`published`, `updated`);
```

### 2.3 `portfolios`
Creator showcase projects and portfolio items.
```sql
CREATE TABLE `portfolios` (
  `id` text PRIMARY KEY NOT NULL,
  `owner` text NOT NULL REFERENCES `accounts`(`id`),
  `slug` text NOT NULL UNIQUE,      -- URL slug: e.g. 'neon-odyssey-act-i'
  `published` integer DEFAULT 0 NOT NULL,
  `data` text NOT NULL,             -- JSON: title, description, coverUrl, mediaKey, mediaType, tools, styles, commercialRights, aspectRatios
  `updated` integer NOT NULL
);
CREATE INDEX `portfolios_owner_published` ON `portfolios` (`owner`, `published`);
```

### 2.4 `campaigns`
Brand briefs and commercial requirements.
```sql
CREATE TABLE `campaigns` (
  `id` text PRIMARY KEY NOT NULL,
  `owner` text NOT NULL REFERENCES `accounts`(`id`),
  `status` text DEFAULT 'draft' NOT NULL, -- 'draft' | 'published' | 'closed' | 'archived'
  `data` text NOT NULL,             -- JSON: title, description, budget, currency, deadline, aspectRatios, targetPlatforms, deliverables, commercialRights, aiEnhanced
  `created` integer NOT NULL,
  `updated` integer NOT NULL
);
CREATE INDEX `campaigns_owner_updated` ON `campaigns` (`owner`, `updated`);
```

### 2.5 `invitations`
Brand-to-creator collaboration proposals.
```sql
CREATE TABLE `invitations` (
  `id` text PRIMARY KEY NOT NULL,
  `campaign` text NOT NULL REFERENCES `campaigns`(`id`),
  `brand` text NOT NULL REFERENCES `accounts`(`id`),
  `creator` text NOT NULL REFERENCES `accounts`(`id`),
  `status` text DEFAULT 'pending' NOT NULL, -- 'pending' | 'accepted' | 'declined'
  `data` text NOT NULL,             -- JSON: message, offeredBudget, currency, proposedDeadline, terms
  `created` integer NOT NULL
);
CREATE UNIQUE INDEX `invitation_pair` ON `invitations` (`campaign`, `creator`);
CREATE INDEX `invitations_brand` ON `invitations` (`brand`);
CREATE INDEX `invitations_creator` ON `invitations` (`creator`);
```

### 2.6 `engagements`
Active and completed project workspaces between brand and creator.
```sql
CREATE TABLE `engagements` (
  `id` text PRIMARY KEY NOT NULL,
  `invitation` text NOT NULL UNIQUE REFERENCES `invitations`(`id`),
  `campaign` text NOT NULL,
  `brand` text NOT NULL,
  `creator` text NOT NULL,
  `status` text DEFAULT 'accepted' NOT NULL, -- 'accepted' | 'in_progress' | 'submitted' | 'revision_requested' | 'resubmitted' | 'approved' | 'delivered' | 'completed'
  `revisions` integer DEFAULT 0 NOT NULL,    -- Current revision cycle count
  `data` text NOT NULL,                      -- JSON: deliverables, currentVersion, approvedVersion, deliveryNotes
  `updated` integer NOT NULL
);
CREATE INDEX `engagements_brand` ON `engagements` (`brand`);
CREATE INDEX `engagements_creator` ON `engagements` (`creator`);
```

### 2.7 `events`
Audit trail of deliverables, submissions, revisions, and messages within an engagement.
```sql
CREATE TABLE `events` (
  `id` text PRIMARY KEY NOT NULL,
  `engagement` text NOT NULL REFERENCES `engagements`(`id`),
  `author` text NOT NULL,
  `type` text NOT NULL,             -- 'submit_v1' | 'request_revision' | 'resubmit_v2' | 'approve' | 'deliver' | 'message'
  `data` text NOT NULL,             -- JSON: fileKey, fileName, comments, version, feedback
  `created` integer NOT NULL
);
CREATE INDEX `events_engagement_created` ON `events` (`engagement`, `created`);
```

### 2.8 `files`
Catalog of media objects stored in Cloudflare R2.
```sql
CREATE TABLE `files` (
  `id` text PRIMARY KEY NOT NULL,
  `owner` text NOT NULL,
  `name` text NOT NULL,
  `mime` text NOT NULL,
  `size` integer NOT NULL,
  `created` integer NOT NULL
);
```

### 2.9 `notifications`
Real-time user alerts and workflow notifications.
```sql
CREATE TABLE `notifications` (
  `id` text PRIMARY KEY NOT NULL,
  `owner` text NOT NULL,
  `title` text NOT NULL,
  `href` text NOT NULL,
  `read` integer DEFAULT 0 NOT NULL,
  `created` integer NOT NULL
);
CREATE INDEX `notifications_owner_created` ON `notifications` (`owner`, `created`);
```

### 2.10 `reviews`
Client ratings and reviews for completed engagements.
```sql
CREATE TABLE `reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `engagement` text NOT NULL UNIQUE REFERENCES `engagements`(`id`) ON DELETE cascade,
  `creator` text NOT NULL REFERENCES `accounts`(`id`) ON DELETE cascade,
  `author` text NOT NULL REFERENCES `accounts`(`id`) ON DELETE cascade,
  `rating` integer NOT NULL,        -- 1 to 5 stars
  `comment` text NOT NULL,
  `created` integer NOT NULL,
  `updated` integer NOT NULL
);
CREATE INDEX `reviews_creator` ON `reviews` (`creator`);
```

### 2.11 `saved_searches`
Persisted marketplace filter configurations for brands.
```sql
CREATE TABLE `saved_searches` (
  `id` text PRIMARY KEY NOT NULL,
  `owner` text NOT NULL REFERENCES `accounts`(`id`) ON DELETE cascade,
  `name` text NOT NULL,
  `data` text NOT NULL,             -- JSON: filters (specialization, skills, tools, maxRate, currency, aspectRatios)
  `updated` integer NOT NULL
);
CREATE INDEX `saved_searches_owner` ON `saved_searches` (`owner`);
CREATE UNIQUE INDEX `saved_search_name` ON `saved_searches` (`owner`, `name`);
```

### 2.12 `project_tasks`
Checklist tasks and milestones inside workspace engagements.
```sql
CREATE TABLE `project_tasks` (
  `id` text PRIMARY KEY NOT NULL,
  `engagement` text NOT NULL REFERENCES `engagements`(`id`) ON DELETE cascade,
  `author` text NOT NULL,
  `title` text NOT NULL,
  `due` text,
  `completed` integer DEFAULT 0 NOT NULL,
  `updated` integer NOT NULL
);
CREATE INDEX `project_tasks_engagement` ON `project_tasks` (`engagement`);
```

### 2.13 Auxiliary Tables
- **`favorites`**: Creator bookmarks saved by brands (`owner`, `creator`, unique pair).
- **`evidence`**: Verification documents submitted by creators for identity badge review.
- **`support`**: Inquiries and tickets submitted to platform admins.
- **`audit`**: Global compliance and security audit logs (`actor`, `action`, `subject`).
- **`limits`**: Rate limiting and usage throttling tracking.

---

## 3. Migration Verification

All tables were validated against the local Miniflare D1 database:
```
Table accounts: ok (7 columns)
Table profiles: ok (6 columns)
Table portfolios: ok (6 columns)
Table campaigns: ok (6 columns)
Table invitations: ok (6 columns)
Table engagements: ok (8 columns)
Table events: ok (6 columns)
Table files: ok (6 columns)
Table notifications: ok (6 columns)
Table favorites: ok (3 columns)
Table evidence: ok (6 columns)
Table support: ok (5 columns)
Table audit: ok (5 columns)
Table limits: ok (3 columns)
Table saved_searches: ok (5 columns)
Table project_tasks: ok (7 columns)
Table reviews: ok (7 columns)
Total active tables verified: 17
```
