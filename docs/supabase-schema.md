# CreaXa: Supabase PostgreSQL Schema & Data Dictionary

## 1. Overview

CreaXa uses **Supabase PostgreSQL** as its primary production relational database.
The schema features 17 fully normalized tables managing multi-role accounts (creators, brands, agencies, admins), rich AI creator profiles, showcase portfolios, campaign briefs, collaboration invitations, transactional workspaces, submissions, revision history, reviews, notifications, and media catalogs.

All schema definitions are managed via versioned migrations in `supabase/migrations/`:
- `20261013000000_init_supabase_schema.sql`: Core 17 PostgreSQL tables & indexes.
- `20261013000001_enable_rls_policies.sql`: Row-Level Security (RLS) policies for least-privilege data protection.

---

## 2. Firebase Identity Mapping

Firebase user IDs are arbitrary string identifiers (e.g. `pL8km9Xq...`), not UUIDs.
- In Supabase PostgreSQL, `accounts.id` is defined as `TEXT PRIMARY KEY`.
- When a user signs in via Firebase, the verified JWT subject (`sub` claim) is stored directly as `accounts.id`.
- All dependent tables reference `accounts(id)` with `ON DELETE CASCADE`.
- This ensures seamless, zero-overhead mapping without fragile synthetic foreign keys.

---

## 3. Data Dictionary & Table Definitions

### 3.1 `accounts`
Stores primary identity and role data.
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,               -- Firebase UID
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'agency', 'admin')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Bio, preferences, organization details
  created BIGINT NOT NULL,          -- Unix timestamp (ms)
  updated BIGINT NOT NULL           -- Unix timestamp (ms)
);
```

### 3.2 `profiles`
AI creator public profiles, toolstacks, and commercial capabilities.
```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,        -- URL identifier (e.g. 'alice-wonder')
  published INTEGER NOT NULL DEFAULT 0, -- 0 = draft, 1 = public discovery
  verification TEXT NOT NULL DEFAULT 'self-declared',
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- headline, tools, skills, rate, currency, etc.
  updated BIGINT NOT NULL
);
CREATE INDEX idx_profiles_published_updated ON profiles (published, updated);
CREATE INDEX idx_profiles_slug ON profiles (slug);
```

### 3.3 `portfolios`
Creator showcase projects with tool metadata and commercial declarations.
```sql
CREATE TABLE portfolios (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  published INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- title, description, cover, media, workflow, rights
  updated BIGINT NOT NULL
);
CREATE INDEX idx_portfolios_owner_published ON portfolios (owner, published);
CREATE INDEX idx_portfolios_slug ON portfolios (slug);
```

### 3.4 `campaigns`
Brand creative briefs, aspect ratios, target channels, and budgets.
```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'closed', 'archived'
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- budget, currency, deadline, aspect ratio, deliverables
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX idx_campaigns_owner_updated ON campaigns (owner, updated);
```

### 3.5 `invitations`
Brand-to-creator collaboration proposals.
```sql
CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  campaign TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  brand TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  CONSTRAINT uq_invitation_pair UNIQUE (campaign, creator)
);
CREATE INDEX idx_invitations_brand ON invitations (brand);
CREATE INDEX idx_invitations_creator ON invitations (creator);
```

### 3.6 `engagements`
Transactional project workspaces created upon invitation acceptance.
```sql
CREATE TABLE engagements (
  id TEXT PRIMARY KEY,
  invitation TEXT NOT NULL UNIQUE REFERENCES invitations(id) ON DELETE CASCADE,
  campaign TEXT NOT NULL,
  brand TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'accepted', -- 'accepted', 'submitted', 'approved', 'delivered', 'completed'
  revisions INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL
);
CREATE INDEX idx_engagements_brand ON engagements (brand);
CREATE INDEX idx_engagements_creator ON engagements (creator);
```

### 3.7 `events`
Submissions, revision requests, approvals, and messages within an engagement.
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,               -- 'submit', 'revise', 'approve', 'deliver', 'message'
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- file IDs, message, deliverable name
  created BIGINT NOT NULL
);
CREATE INDEX idx_events_engagement_created ON events (engagement, created);
```

### 3.8 `files`
Metadata catalog for media assets stored in Cloudflare R2.
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size BIGINT NOT NULL,
  created BIGINT NOT NULL
);
CREATE INDEX idx_files_owner ON files (owner);
```

### 3.9 `notifications`
User alerts and collaboration updates.
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created BIGINT NOT NULL
);
CREATE INDEX idx_notifications_owner_created ON notifications (owner, created);
```

### 3.10 `reviews`
Post-completion 5-star ratings and written reviews.
```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL UNIQUE REFERENCES engagements(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX idx_reviews_creator ON reviews (creator);
```

### 3.11 Auxiliary Tables
- **`saved_searches`**: Brand search query presets (`owner`, `name`, `data`, `updated`).
- **`project_tasks`**: Milestone checklists inside engagement workspaces.
- **`favorites`**: Creator bookmarks saved by brands (`owner`, `creator`).
- **`evidence`**: Verification evidence files uploaded by creators for identity badge review.
- **`support`**: Helpdesk enquiry tickets.
- **`audit`**: Global compliance logs (`actor`, `action`, `subject`).
- **`limits`**: Rate-limiting records.
