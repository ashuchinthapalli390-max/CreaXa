# CreaXa — Supabase PostgreSQL & Third-Party Auth Setup Guide

## 1. Executive Summary

CreaXa utilizes **Supabase PostgreSQL** as its primary application database. Cloudflare D1 has been migrated out of primary persistence. All database tables are secured via **Row Level Security (RLS)**, and authorization is directly tied to verified **Firebase Authentication** tokens.

---

## 2. Supabase Project Setup

1. Sign in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g., `creaxa-production`).
3. Note your project connection values:
   - **Project URL**: `https://<your-project-ref>.supabase.co`
   - **Anon / Publishable Key**: Under **Project Settings** > **API**
   - **Service Role Secret**: (Keep private; never expose to frontend clients)

---

## 3. Configuring Firebase Third-Party Authentication in Supabase

Supabase natively supports external OIDC/JWT providers. Configure Firebase token trust:

1. In Supabase Dashboard, navigate to **Authentication** > **Providers** > **Third-Party Auth**.
2. Add **Firebase**:
   - **Project ID**: `creaxa-6e7bc`
3. Supabase will now accept Firebase-minted ID tokens in the `Authorization: Bearer <FIREBASE_ID_TOKEN>` header or via the client SDK's `accessToken` hook.
4. When verified, Supabase decodes the JWT and exposes claims inside SQL:
   - `auth.jwt() ->> 'sub'` contains the verified Firebase UID.

---

## 4. Applying Schema & Row Level Security

Execute the migration scripts in sequential order via Supabase CLI or SQL Editor:

### Step 1: Base Table Definitions
Execute `supabase/migrations/20261013000000_init_supabase_schema.sql`. This creates all 17 marketplace tables:
- `accounts`: User identity record with `id TEXT PRIMARY KEY` storing the Firebase UID string.
- `profiles`: Creator credentials, rates, currencies, tools, aspect ratios.
- `portfolios`: Showcase video/image projects and commercial rights declarations.
- `campaigns`: Brand campaign briefs, target platforms, aspect ratios, budgets.
- `invitations`: Project invitations and status transitions.
- `engagements`: Collaboration workspaces and version tracking.
- `events`: Versioned submissions, revisions, approvals, and messages.
- `files`: Cloudflare R2 object catalog with MIME types and sizes.
- `reviews`: Post-project ratings and commercial feedback.
- `tasks`: Actionable project checklists with deadlines.
- `saved_searches`, `favorites`, `evidence`, `notifications`, `support`, `limits`, `audit_logs`.

### Step 2: Row Level Security Matrix
Execute `supabase/migrations/20261013000001_enable_rls_policies.sql`. This defines the `current_app_user_id()` function:
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
and enforces least-privilege security policies across all tables.

---

## 5. Client Configuration (`lib/supabase.ts`)

The application integrates with Supabase via `@supabase/supabase-js`:
```typescript
import { createClient } from "@supabase/supabase-js";
import { getFirebaseAuth, getIdToken } from "./firebase";

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      accessToken: async () => {
        const user = getFirebaseAuth().currentUser;
        if (!user) return null;
        return await getIdToken(user);
      }
    }
  );
}
```

This guarantees all database requests made by the frontend automatically carry the active user's Firebase identity and satisfy PostgreSQL RLS policies.
