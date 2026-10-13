# CreaXa — D1 to Supabase PostgreSQL Database Migration Plan

## 1. Executive Summary

This document specifies the exact database migration process transitioning CreaXa from its initial Cloudflare D1 (SQLite-based edge database) to **Supabase PostgreSQL** as the single primary application database, secured via **PostgreSQL Row Level Security (RLS)** and authenticated using **Firebase Authentication Third-Party Auth**.

---

## 2. Entity Model & PostgreSQL Translation Matrix

All 17 application entities have been translated from SQLite syntax to idiomatic PostgreSQL 15+ schemas located in `supabase/migrations/20261013000000_init_supabase_schema.sql`:

| D1 / SQLite Table | Target PostgreSQL Table | Identity & Keys | SQLite Type $\to$ PostgreSQL Type | Notes & Integrity Constraints |
|---|---|---|---|---|
| `accounts` | `public.accounts` | `id TEXT PRIMARY KEY` | `TEXT`, `INTEGER` $\to$ `BIGINT`, `JSON` $\to$ `JSONB` | Stores Firebase UID (`sub`) as `id`. Role check: `brand`, `creator`. |
| `profiles` | `public.profiles` | `id TEXT PRIMARY KEY REFERENCES accounts(id)` | `INTEGER` $\to$ `BOOLEAN` / `BIGINT`, `JSON` $\to$ `JSONB` | `slug TEXT UNIQUE`, `published BOOLEAN DEFAULT false`, `verification` check. |
| `portfolios` | `public.portfolios` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `TEXT` $\to$ `UUID`, `JSON` $\to$ `JSONB` | Creator portfolio projects. Public view omits private verification evidence. |
| `campaigns` | `public.campaigns` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `TEXT` $\to$ `UUID`, `JSON` $\to$ `JSONB` | Brand campaign briefs with commercial terms and budget/deadline metadata. |
| `invitations` | `public.invitations` | `id UUID PRIMARY KEY`, `brand/creator REFERENCES accounts(id)` | `TEXT` $\to$ `UUID`, `status TEXT` | Status check: `pending`, `accepted`, `declined`, `withdrawn`, `expired`. |
| `engagements` | `public.engagements` | `id UUID PRIMARY KEY`, `campaign REFERENCES campaigns(id)` | `TEXT` $\to$ `UUID`, `status TEXT` | Active project workspaces (`active`, `submitted`, `revised`, `approved`, `delivered`, `completed`, `cancelled`). |
| `events` | `public.events` | `id UUID PRIMARY KEY`, `engagement REFERENCES engagements(id)` | `TEXT` $\to$ `UUID`, `JSON` $\to$ `JSONB` | Workspace lifecycle timeline events (`message`, `submit`, `revise`, `approve`, `deliver`, `complete`). |
| `files` | `public.files` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `TEXT` $\to$ `UUID`, `size BIGINT` | Cloudflare R2 object metadata, MIME validation, access ownership. |
| `reviews` | `public.reviews` | `id UUID PRIMARY KEY`, `creator/brand REFERENCES accounts(id)` | `rating INTEGER CHECK (1..5)` | Post-completion commercial ratings and verified feedback. |
| `tasks` | `public.tasks` | `id UUID PRIMARY KEY`, `engagement REFERENCES engagements(id)` | `completed BOOLEAN` | Workspace actionable checklist items with deadlines. |
| `saved_searches`| `public.saved_searches` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `filters JSONB` | Brand creator discovery presets and saved query filters. |
| `favorites` | `public.favorites` | `(owner, creator) PRIMARY KEY` | Foreign keys to `accounts(id)` | Bookmarked creators. |
| `evidence` | `public.evidence` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `JSON` $\to$ `JSONB` | Creator tooling claims and workflow evidence for moderator review. |
| `notifications` | `public.notifications` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `read BOOLEAN` | Real-time platform notifications for invites, reviews, and submissions. |
| `support` | `public.support` | `id UUID PRIMARY KEY`, `owner REFERENCES accounts(id)` | `JSON` $\to$ `JSONB` | Authenticated user help and platform enquiries. |
| `limits` | `public.limits` | `id TEXT PRIMARY KEY` | `count INTEGER`, `expires BIGINT` | Sliding window rate limiter cache. |
| `audit_logs` | `public.audit_logs` | `id UUID PRIMARY KEY`, `actor REFERENCES accounts(id)` | `payload JSONB` | Security audit trail for administrative and sensitive mutations. |

---

## 3. Firebase Identity Mapping Model

1. **Firebase UID as Native Key**:
   Firebase UIDs are alphanumeric string identifiers (e.g., `4q8Z1bK9u8v7w6...`). To avoid fragile translation tables or synthetic UUID mapping errors, the `accounts` table uses `id TEXT PRIMARY KEY` directly storing the verified Firebase UID (`sub`).
2. **PostgreSQL RLS Identification**:
   Supabase Third-Party Authentication populates standard JWT claims. Our helper function:
   ```sql
   CREATE OR REPLACE FUNCTION public.current_app_user_id()
   RETURNS TEXT AS $$
     SELECT COALESCE(
       auth.jwt() ->> 'sub',
       current_setting('request.jwt.claims', true)::jsonb ->> 'sub',
       current_setting('app.current_user_id', true)
     );
   $$ LANGUAGE sql STABLE;
   ```
   resolves the calling Firebase user ID directly across both direct Supabase client SDK calls and Worker edge proxy calls.

---

## 4. Migration Execution Procedure

### Step 1: Target Database Initialization
Apply the migration scripts in numerical order using Supabase CLI or the SQL Editor:
```bash
# 1. Base tables, indexes, and constraints
supabase db execute --file supabase/migrations/20261013000000_init_supabase_schema.sql

# 2. Row Level Security policies and helper functions
supabase db execute --file supabase/migrations/20261013000001_enable_rls_policies.sql
```

### Step 2: D1 Extraction & JSON Serialization
If migrating pre-existing production records from Cloudflare D1:
```bash
# Export all tables from D1 to newline-delimited JSON
wrangler d1 execute creaxa-db --command "SELECT json_object('id', id, 'email', email, 'name', name, 'role', role, 'data', data, 'created', created, 'updated', updated) FROM accounts;" --json > accounts_export.json
```

### Step 3: Foreign Key Dependency Order Import
Load records into Supabase in strict relational dependency order:
1. `accounts`
2. `profiles`
3. `files`
4. `campaigns`
5. `portfolios`
6. `invitations`
7. `engagements`
8. `events`
9. `tasks`
10. `reviews`
11. `saved_searches`
12. `favorites`
13. `evidence`
14. `notifications`
15. `support`

### Step 4: Verification Queries
Run validation queries comparing row counts between D1 and Supabase:
```sql
SELECT 'accounts' AS tbl, count(*) FROM accounts
UNION ALL SELECT 'profiles', count(*) FROM profiles
UNION ALL SELECT 'campaigns', count(*) FROM campaigns
UNION ALL SELECT 'portfolios', count(*) FROM portfolios
UNION ALL SELECT 'engagements', count(*) FROM engagements
UNION ALL SELECT 'files', count(*) FROM files;
```

---

## 5. Application Cutover & Zero-Downtime Resilience

The application codebase uses `lib/database.ts` which encapsulates all data operations.
- When `NEXT_PUBLIC_SUPABASE_URL` is configured, all marketplace read/write traffic is automatically routed to **Supabase PostgreSQL**.
- If Supabase environment variables are omitted during local sandbox testing, the engine cleanly falls back to the local SQLite/D1 instance.

### Rollback Strategy
If any unforeseen issue occurs with the Supabase connection in production:
1. Unset `NEXT_PUBLIC_SUPABASE_URL` in Cloudflare Workers settings.
2. The runtime instantly resumes using the local D1 binding without code rebuilds.
3. No data loss occurs as operations are transactional and audited.
