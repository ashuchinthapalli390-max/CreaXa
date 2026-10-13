-- ==============================================================================
-- CreaXa: Fix RLS Infinite Recursion (Postgres Error 42P17)
-- Migration: 20261013000002_fix_rls_recursion.sql
-- ==============================================================================
-- Solves the circular evaluation in accounts, evidence, and support policies
-- by checking the admin role inside a SECURITY DEFINER function.
-- ==============================================================================

-- 1. Create safe admin check function (bypasses RLS recursion)
CREATE OR REPLACE FUNCTION is_admin_user(uid TEXT) RETURNS BOOLEAN AS $$
BEGIN
  IF uid IS NULL OR uid = '' THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM accounts WHERE id = uid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Update accounts policy
DROP POLICY IF EXISTS "accounts_select_own" ON accounts;
CREATE POLICY "accounts_select_own" ON accounts
  FOR SELECT USING (id = current_app_user_id() OR is_admin_user(current_app_user_id()));

-- 3. Update evidence policy
DROP POLICY IF EXISTS "evidence_select_own_or_admin" ON evidence;
DROP POLICY IF EXISTS "evidence_owner_or_admin" ON evidence;
CREATE POLICY "evidence_owner_or_admin" ON evidence
  FOR ALL USING (owner = current_app_user_id() OR is_admin_user(current_app_user_id()));

-- 4. Update support policy
DROP POLICY IF EXISTS "support_select_own_or_admin" ON support;
DROP POLICY IF EXISTS "support_owner_or_admin" ON support;
CREATE POLICY "support_owner_or_admin" ON support
  FOR ALL USING (owner = current_app_user_id() OR is_admin_user(current_app_user_id()));
