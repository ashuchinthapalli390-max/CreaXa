-- ==============================================================================
-- CREAXA: CONSOLIDATED PRODUCTION DATABASE SCHEMA & INITIAL SEED
-- ==============================================================================
-- Target: Supabase PostgreSQL (17 Tables + Indexes + RLS Policies + Seed Data)
-- Instructions: Run this entire script in your Supabase Project SQL Editor:
--   Dashboard -> SQL Editor -> "+ New query" -> Paste this file -> "Run" (Ctrl+Enter)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ACCOUNTS (Firebase Auth UID Primary Identity)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, -- Firebase UID
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'agency', 'admin')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. PROFILES (AI Creator Public Profiles)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. PORTFOLIOS (Creator Showcase Projects)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 4. CAMPAIGNS (Brand Creative Briefs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner_updated ON campaigns (owner, updated);

-- ------------------------------------------------------------------------------
-- 5. INVITATIONS (Brand Collaboration Proposals)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. ENGAGEMENTS (Project Workspaces)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 7. EVENTS (Deliverables, Revisions, Messages)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  engagement TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_engagement_created ON events (engagement, created);

-- ------------------------------------------------------------------------------
-- 8. FILES (Cloudflare R2 Asset Catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size BIGINT NOT NULL,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_files_owner ON files (owner);

-- ------------------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_owner_created ON notifications (owner, created);

-- ------------------------------------------------------------------------------
-- 10. REVIEWS (Ratings & Testimonials)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 11. SAVED_SEARCHES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_searches (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated BIGINT NOT NULL,
  CONSTRAINT uq_saved_search_name UNIQUE (owner, name)
);
CREATE INDEX IF NOT EXISTS idx_saved_searches_owner ON saved_searches (owner);

-- ------------------------------------------------------------------------------
-- 12. PROJECT_TASKS
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 13. FAVORITES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  creator TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT uq_favorite_pair UNIQUE (owner, creator)
);
CREATE INDEX IF NOT EXISTS idx_favorites_owner ON favorites (owner);

-- ------------------------------------------------------------------------------
-- 14. EVIDENCE (Verification Documents)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'evidence submitted',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL,
  updated BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evidence_owner ON evidence (owner);

-- ------------------------------------------------------------------------------
-- 15. SUPPORT (Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created BIGINT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 16. AUDIT (Governance Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  subject TEXT NOT NULL,
  created BIGINT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 17. LIMITS (Rate Limiting)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS limits (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  expires BIGINT NOT NULL
);

-- ------------------------------------------------------------------------------
-- HELPER: CURRENT AUTHENTICATED USER CLAIM EXTRACTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt()->>'sub',
    auth.jwt()->>'user_id',
    (current_setting('request.jwt.claims', true)::jsonb)->>'sub',
    (current_setting('request.jwt.claims', true)::jsonb)->>'user_id',
    auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "accounts_select_own" ON accounts;
DROP POLICY IF EXISTS "accounts_insert_own" ON accounts;
DROP POLICY IF EXISTS "accounts_update_own" ON accounts;
DROP POLICY IF EXISTS "accounts_delete_own" ON accounts;
CREATE POLICY "accounts_select_own" ON accounts FOR SELECT USING (id = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));
CREATE POLICY "accounts_insert_own" ON accounts FOR INSERT WITH CHECK (id = current_app_user_id());
CREATE POLICY "accounts_update_own" ON accounts FOR UPDATE USING (id = current_app_user_id()) WITH CHECK (id = current_app_user_id());
CREATE POLICY "accounts_delete_own" ON accounts FOR DELETE USING (id = current_app_user_id());

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_public_or_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_select_public_or_own" ON profiles FOR SELECT USING (published = 1 OR id = current_app_user_id());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (id = current_app_user_id());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = current_app_user_id()) WITH CHECK (id = current_app_user_id());
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (id = current_app_user_id());

-- portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolios_select_public_or_own" ON portfolios;
DROP POLICY IF EXISTS "portfolios_insert_own" ON portfolios;
DROP POLICY IF EXISTS "portfolios_update_own" ON portfolios;
DROP POLICY IF EXISTS "portfolios_delete_own" ON portfolios;
CREATE POLICY "portfolios_select_public_or_own" ON portfolios FOR SELECT USING (published = 1 OR owner = current_app_user_id());
CREATE POLICY "portfolios_insert_own" ON portfolios FOR INSERT WITH CHECK (owner = current_app_user_id());
CREATE POLICY "portfolios_update_own" ON portfolios FOR UPDATE USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());
CREATE POLICY "portfolios_delete_own" ON portfolios FOR DELETE USING (owner = current_app_user_id());

-- campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "campaigns_select_owner_or_invited" ON campaigns;
DROP POLICY IF EXISTS "campaigns_insert_owner" ON campaigns;
DROP POLICY IF EXISTS "campaigns_update_owner" ON campaigns;
DROP POLICY IF EXISTS "campaigns_delete_owner" ON campaigns;
CREATE POLICY "campaigns_select_owner_or_invited" ON campaigns FOR SELECT USING (owner = current_app_user_id() OR id IN (SELECT campaign FROM invitations WHERE creator = current_app_user_id()));
CREATE POLICY "campaigns_insert_owner" ON campaigns FOR INSERT WITH CHECK (owner = current_app_user_id());
CREATE POLICY "campaigns_update_owner" ON campaigns FOR UPDATE USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());
CREATE POLICY "campaigns_delete_owner" ON campaigns FOR DELETE USING (owner = current_app_user_id());

-- invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invitations_select_participants" ON invitations;
DROP POLICY IF EXISTS "invitations_insert_brand" ON invitations;
DROP POLICY IF EXISTS "invitations_update_participants" ON invitations;
CREATE POLICY "invitations_select_participants" ON invitations FOR SELECT USING (brand = current_app_user_id() OR creator = current_app_user_id());
CREATE POLICY "invitations_insert_brand" ON invitations FOR INSERT WITH CHECK (brand = current_app_user_id());
CREATE POLICY "invitations_update_participants" ON invitations FOR UPDATE USING (brand = current_app_user_id() OR creator = current_app_user_id());

-- engagements
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "engagements_select_participants" ON engagements;
DROP POLICY IF EXISTS "engagements_update_participants" ON engagements;
CREATE POLICY "engagements_select_participants" ON engagements FOR SELECT USING (brand = current_app_user_id() OR creator = current_app_user_id());
CREATE POLICY "engagements_update_participants" ON engagements FOR UPDATE USING (brand = current_app_user_id() OR creator = current_app_user_id());

-- events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_select_participants" ON events;
DROP POLICY IF EXISTS "events_insert_participants" ON events;
CREATE POLICY "events_select_participants" ON events FOR SELECT USING (engagement IN (SELECT id FROM engagements WHERE brand = current_app_user_id() OR creator = current_app_user_id()));
CREATE POLICY "events_insert_participants" ON events FOR INSERT WITH CHECK (author = current_app_user_id());

-- files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "files_select_access" ON files;
DROP POLICY IF EXISTS "files_insert_owner" ON files;
DROP POLICY IF EXISTS "files_delete_owner" ON files;
CREATE POLICY "files_select_access" ON files FOR SELECT USING (true);
CREATE POLICY "files_insert_owner" ON files FOR INSERT WITH CHECK (owner = current_app_user_id());
CREATE POLICY "files_delete_owner" ON files FOR DELETE USING (owner = current_app_user_id());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_owner_all" ON notifications;
CREATE POLICY "notifications_owner_all" ON notifications FOR ALL USING (owner = current_app_user_id());

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_select_all" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_brand" ON reviews;
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_brand" ON reviews FOR INSERT WITH CHECK (author = current_app_user_id());

-- saved_searches
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_searches_owner" ON saved_searches;
CREATE POLICY "saved_searches_owner" ON saved_searches FOR ALL USING (owner = current_app_user_id());

-- project_tasks
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "project_tasks_participants" ON project_tasks;
CREATE POLICY "project_tasks_participants" ON project_tasks FOR ALL USING (engagement IN (SELECT id FROM engagements WHERE brand = current_app_user_id() OR creator = current_app_user_id()));

-- favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "favorites_owner" ON favorites;
CREATE POLICY "favorites_owner" ON favorites FOR ALL USING (owner = current_app_user_id());

-- evidence
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "evidence_owner_or_admin" ON evidence;
CREATE POLICY "evidence_owner_or_admin" ON evidence FOR ALL USING (owner = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));

-- support
ALTER TABLE support ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "support_owner_or_admin" ON support;
CREATE POLICY "support_owner_or_admin" ON support FOR ALL USING (owner = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA (Demo Creator, Brand, Profile & Portfolios)
-- ------------------------------------------------------------------------------

-- Seed Accounts
INSERT INTO accounts (id, email, name, role, data, created, updated) VALUES
('creator_alice', 'creator_alice@sites.test', 'Alice Wonder', 'creator', '{"name":"Alice Wonder","role":"creator","terms":true}'::jsonb, 1791870377464, 1791875643372),
('brand_acme', 'brand_acme@sites.test', 'Acme Studios', 'brand', '{"name":"Acme Studios","role":"brand","organization":"Acme Corp","industry":"Entertainment","website":"https://acme.example.com","goals":"Produce high-quality AI cinematics","description":"A global storytelling brand","contactEmail":"producer@acme.example.com","country":"United States","currency":"USD","terms":true}'::jsonb, 1791870377422, 1791875643313)
ON CONFLICT (id) DO NOTHING;

-- Seed Creator Profile
INSERT INTO profiles (id, slug, published, verification, data, updated) VALUES
('creator_alice', 'alice-wonder', 1, 'self-declared', '{"name":"Alice Wonder","slug":"alice-wonder","headline":"Senior AI Filmmaker & Generative Visual Artist","bio":"Crafting award-winning speculative sci-fi and commercial narrative films using Runway Gen-3 and Kling.","location":"Los Angeles, CA","contactPreference":"Platform messages","specializations":["AI Filmmaking","Generative Art"],"tools":["Runway","Midjourney","Kling"],"styles":["Cinematic","Hyperrealism"],"contentTypes":["AI Video","AI Image"],"aspectRatios":["9:16","16:9"],"industries":["Entertainment","Fashion"],"platforms":["Instagram","YouTube"],"formats":["MP4","ProRes"],"rate":600,"maxRate":1500,"currency":"USD","turnaround":7,"availability":"Available","commercial":true,"revisions":2,"avatar":"6a047971-f116-4c5f-b012-2a99a30a1503","cover":"61de8931-f117-4172-a56b-8851f3ca2237","published":true}'::jsonb, 1791875643657)
ON CONFLICT (id) DO NOTHING;

-- Seed Portfolio Projects
INSERT INTO portfolios (id, owner, slug, published, data, updated) VALUES
('4c6e8224-d0f8-4228-af74-7572975bada4', 'creator_alice', 'neon-odyssey-act-i-4c6e8224', 1, '{"title":"Neon Odyssey: Act I","description":"Speculative architectural visualizer exploring neon-lit cybernetic megalopolises with cinematic generative camera paths.","contentType":"AI Video","tools":["Runway","Midjourney","ComfyUI"],"skills":["Generative Cinematography","Style LoRA Training"],"styles":["Cinematic","Sci-Fi","Cyberpunk"],"workflow":"Rendered using Runway Gen-3 with custom LoRAs trained on brutalist glass architectures.","contribution":"Direction, prompt engineering, audio spatialization.","aspectRatio":"16:9","resolution":"4K","duration":45,"commercialUse":"Commercial rights cleared.","permission":true,"cover":"61de8931-f117-4172-a56b-8851f3ca2237","media":["61de8931-f117-4172-a56b-8851f3ca2237"],"published":true}'::jsonb, 1791875643660),
('bb8a4289-0a79-46b3-b5ff-cc2851f41b8c', 'creator_alice', 'solar-chronicles-bb8a4289', 1, '{"title":"Solar Chronicles","description":"Photorealistic solar storm sequences constructed with multi-layered latent diffusion.","contentType":"AI Video","tools":["Kling","Midjourney"],"skills":["Particle Simulation","Diffusion Control"],"styles":["Hyperrealism","Documentary"],"workflow":"Multi-stage Kling video synthesis with deep chromatic color grading in DaVinci.","contribution":"Creative Director, prompt architect.","aspectRatio":"16:9","resolution":"4K","duration":60,"commercialUse":"Cleared for broadcast.","permission":true,"cover":"61de8931-f117-4172-a56b-8851f3ca2237","media":["61de8931-f117-4172-a56b-8851f3ca2237"],"published":true}'::jsonb, 1791875643665)
ON CONFLICT (id) DO NOTHING;

-- Seed Brand Campaigns
INSERT INTO campaigns (id, owner, status, data, created, updated) VALUES
('c101-ai-launch', 'brand_acme', 'published', '{"title":"Next-Gen Brand Launch Video","description":"Seeking visionary AI filmmakers to produce an immersive 30s teaser celebrating synthetic creativity.","industry":"Entertainment","contentType":"AI Video","platform":"YouTube","aspectRatio":"16:9","budget":2500,"currency":"USD","deadline":"2026-11-30","revisions":2,"commercialUse":"Worldwide Digital & Streaming","rights":"Full buyout","territory":"Worldwide","usageDuration":"Perpetual","quantity":1,"status":"published"}'::jsonb, 1791870377430, 1791875643320)
ON CONFLICT (id) DO NOTHING;
