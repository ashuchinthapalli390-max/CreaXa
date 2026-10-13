-- CreaXa: Row-Level Security (RLS) Policies for Supabase PostgreSQL
-- Migration: 20261013000001_enable_rls_policies.sql

-- Helper function to extract current authenticated Firebase UID / user ID
-- When Supabase Third-Party Firebase Auth is configured, auth.jwt()->>'sub' contains the Firebase UID.
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

-- 1. accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts_select_own" ON accounts
  FOR SELECT USING (id = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));

CREATE POLICY "accounts_insert_own" ON accounts
  FOR INSERT WITH CHECK (id = current_app_user_id());

CREATE POLICY "accounts_update_own" ON accounts
  FOR UPDATE USING (id = current_app_user_id()) WITH CHECK (id = current_app_user_id());

CREATE POLICY "accounts_delete_own" ON accounts
  FOR DELETE USING (id = current_app_user_id());

-- 2. profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_public_or_own" ON profiles
  FOR SELECT USING (published = 1 OR id = current_app_user_id());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = current_app_user_id());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = current_app_user_id()) WITH CHECK (id = current_app_user_id());

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (id = current_app_user_id());

-- 3. portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolios_select_public_or_own" ON portfolios
  FOR SELECT USING (published = 1 OR owner = current_app_user_id());

CREATE POLICY "portfolios_insert_own" ON portfolios
  FOR INSERT WITH CHECK (owner = current_app_user_id());

CREATE POLICY "portfolios_update_own" ON portfolios
  FOR UPDATE USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());

CREATE POLICY "portfolios_delete_own" ON portfolios
  FOR DELETE USING (owner = current_app_user_id());

-- 4. campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_select_owner_or_invited" ON campaigns
  FOR SELECT USING (
    owner = current_app_user_id() OR
    id IN (SELECT campaign FROM invitations WHERE creator = current_app_user_id())
  );

CREATE POLICY "campaigns_insert_owner" ON campaigns
  FOR INSERT WITH CHECK (owner = current_app_user_id());

CREATE POLICY "campaigns_update_owner" ON campaigns
  FOR UPDATE USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());

CREATE POLICY "campaigns_delete_owner" ON campaigns
  FOR DELETE USING (owner = current_app_user_id());

-- 5. invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invitations_select_participants" ON invitations
  FOR SELECT USING (brand = current_app_user_id() OR creator = current_app_user_id());

CREATE POLICY "invitations_insert_brand" ON invitations
  FOR INSERT WITH CHECK (brand = current_app_user_id());

CREATE POLICY "invitations_update_participants" ON invitations
  FOR UPDATE USING (brand = current_app_user_id() OR creator = current_app_user_id());

-- 6. engagements
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "engagements_select_participants" ON engagements
  FOR SELECT USING (brand = current_app_user_id() OR creator = current_app_user_id());

CREATE POLICY "engagements_update_participants" ON engagements
  FOR UPDATE USING (brand = current_app_user_id() OR creator = current_app_user_id());

-- 7. events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_participants" ON events
  FOR SELECT USING (
    engagement IN (SELECT id FROM engagements WHERE brand = current_app_user_id() OR creator = current_app_user_id())
  );

CREATE POLICY "events_insert_participant" ON events
  FOR INSERT WITH CHECK (author = current_app_user_id());

-- 8. files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "files_select_all" ON files
  FOR SELECT USING (true);

CREATE POLICY "files_insert_owner" ON files
  FOR INSERT WITH CHECK (owner = current_app_user_id());

CREATE POLICY "files_delete_owner" ON files
  FOR DELETE USING (owner = current_app_user_id());

-- 9. notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (owner = current_app_user_id());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (owner = current_app_user_id());

-- 10. reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_author" ON reviews
  FOR INSERT WITH CHECK (author = current_app_user_id());

CREATE POLICY "reviews_update_author" ON reviews
  FOR UPDATE USING (author = current_app_user_id());

-- 11. saved_searches
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_searches_all_own" ON saved_searches
  FOR ALL USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());

-- 12. project_tasks
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_tasks_participants" ON project_tasks
  FOR ALL USING (
    engagement IN (SELECT id FROM engagements WHERE brand = current_app_user_id() OR creator = current_app_user_id())
  );

-- 13. favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_all_own" ON favorites
  FOR ALL USING (owner = current_app_user_id()) WITH CHECK (owner = current_app_user_id());

-- 14. evidence
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evidence_select_own_or_admin" ON evidence
  FOR SELECT USING (owner = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));

CREATE POLICY "evidence_insert_own" ON evidence
  FOR INSERT WITH CHECK (owner = current_app_user_id());

-- 15. support
ALTER TABLE support ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_select_own_or_admin" ON support
  FOR SELECT USING (owner = current_app_user_id() OR current_app_user_id() IN (SELECT id FROM accounts WHERE role = 'admin'));

CREATE POLICY "support_insert_own" ON support
  FOR INSERT WITH CHECK (owner = current_app_user_id());
