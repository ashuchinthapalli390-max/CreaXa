-- CreaXa: Supabase PostgreSQL Core Schema & Initial Migration
-- Migration: 20261013000000_init_supabase_schema.sql

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. accounts
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, -- Firebase UID
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'agency', 'admin')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);

-- 2. profiles (Creator Profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  published INTEGER NOT NULL DEFAULT 0,
  verification TEXT NOT NULL DEFAULT 'self-declared',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_published_updated ON profiles (published, updated);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles (slug);

-- 3. portfolios (Creator Showcase Projects)
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  published INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_portfolios_owner_published ON portfolios (owner, published);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios (slug);

-- 4. campaigns (Brand Creative Briefs)
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner_updated ON campaigns (owner, updated);

-- 5. invitations (Brand Collaboration Proposals)
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  campaign TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  brand TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  CONSTRAINT uq_invitation_pair UNIQUE (campaign, creator)
);
CREATE INDEX IF NOT EXISTS idx_invitations_brand ON invitations (brand);
CREATE INDEX IF NOT EXISTS idx_invitations_creator ON invitations (creator);

-- 6. engagements (Project Workspaces)
CREATE TABLE IF NOT EXISTS engagements (
  id TEXT PRIMARY KEY,
  invitation TEXT NOT NULL UNIQUE REFERENCES invitations(id) ON DELETE CASCADE,
  campaign TEXT NOT NULL,
  brand TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'accepted',
  revisions INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_engagements_brand ON engagements (brand);
CREATE INDEX IF NOT EXISTS idx_engagements_creator ON engagements (creator);

-- 7. events (Deliverables, Revisions, Messages)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_engagement_created ON events (engagement, created);

-- 8. files (Metadata catalog for Cloudflare R2 assets)
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size BIGINT NOT NULL,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_files_owner ON files (owner);

-- 9. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_owner_created ON notifications (owner, created);

-- 10. reviews (Client Ratings & Testimonials)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL UNIQUE REFERENCES engagements(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_creator ON reviews (creator);

-- 11. saved_searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL,
  CONSTRAINT uq_saved_search_name UNIQUE (owner, name)
);
CREATE INDEX IF NOT EXISTS idx_saved_searches_owner ON saved_searches (owner);

-- 12. project_tasks
CREATE TABLE IF NOT EXISTS project_tasks (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_project_tasks_engagement ON project_tasks (engagement);

-- 13. favorites
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT uq_favorite_pair UNIQUE (owner, creator)
);
CREATE INDEX IF NOT EXISTS idx_favorites_owner ON favorites (owner);

-- 14. evidence (Verification documents)
CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'evidence submitted',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evidence_owner ON evidence (owner);

-- 15. support (Enquiry messages)
CREATE TABLE IF NOT EXISTS support (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL
);

-- 16. audit (Audit trail)
CREATE TABLE IF NOT EXISTS audit (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  subject TEXT NOT NULL,
  created BIGINT NOT NULL
);

-- 17. limits (Rate limiting)
CREATE TABLE IF NOT EXISTS limits (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  expires BIGINT NOT NULL
);
