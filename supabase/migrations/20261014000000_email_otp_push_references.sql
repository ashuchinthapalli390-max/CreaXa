-- ==============================================================================
-- CREAXA: Supabase Migration — Email OTP, FCM Push, Notifications & External References
-- Migration: 20261014000000_email_otp_push_references.sql
-- ==============================================================================

-- 1. email_otp_challenges
CREATE TABLE IF NOT EXISTS email_otp_challenges (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT,
  normalized_email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  code_digest TEXT NOT NULL,
  challenge_nonce TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  consumed_at BIGINT,
  invalidated_at BIGINT,
  last_sent_at BIGINT NOT NULL,
  resend_count INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_otp_email_purpose ON email_otp_challenges (normalized_email, purpose);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON email_otp_challenges (expires_at);

-- 2. push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_digest TEXT NOT NULL,
  device_label TEXT,
  platform TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  revoked_at BIGINT,
  last_success_at BIGINT,
  last_failure_at BIGINT
);
CREATE INDEX IF NOT EXISTS idx_push_sub_user ON push_subscriptions (firebase_uid);

-- 3. notification_events
CREATE TABLE IF NOT EXISTS notification_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_uid TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notif_events_type ON notification_events (event_type);

-- 4. notification_deliveries
CREATE TABLE IF NOT EXISTS notification_deliveries (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES notification_events(id) ON DELETE CASCADE,
  recipient_uid TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'in_app')),
  provider TEXT NOT NULL CHECK (provider IN ('resend', 'fcm', 'internal')),
  provider_message_id TEXT,
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'sent', 'delivered', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL,
  delivered_at BIGINT,
  last_error_code TEXT
);
CREATE INDEX IF NOT EXISTS idx_notif_deliv_recipient ON notification_deliveries (recipient_uid, channel);

-- 5. notification_preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_uid TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT false,
  project_updates_enabled BOOLEAN NOT NULL DEFAULT true,
  invitation_updates_enabled BOOLEAN NOT NULL DEFAULT true,
  reminders_enabled BOOLEAN NOT NULL DEFAULT true,
  marketing_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at BIGINT NOT NULL
);

-- 6. external_creator_references
CREATE TABLE IF NOT EXISTS external_creator_references (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT,
  specialization TEXT NOT NULL,
  bio_summary TEXT NOT NULL,
  official_website TEXT NOT NULL,
  portfolio_url TEXT NOT NULL,
  avatar_url TEXT,
  documented_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  creative_styles JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_works JSONB NOT NULL DEFAULT '[]'::jsonb,
  attribution_note TEXT NOT NULL,
  source_verified_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ext_creators_slug ON external_creator_references (slug);
