# CreaXa: Supabase Row-Level Security (RLS) Policies

## 1. Security Architecture & Identity Resolution

CreaXa integrates Firebase Authentication with **Supabase PostgreSQL Row-Level Security (RLS)**.

When an authenticated client makes requests to Supabase with their Firebase ID Token in the `Authorization: Bearer <token>` header, PostgreSQL inspects the verified JWT claims.

The helper function `current_app_user_id()` resolves the active user's identity string:
```sql
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
```

---

## 2. Table-by-Table RLS Policy Matrix

| Table | Operation | Policy Rule | Justification / Protection |
|---|---|---|---|
| **`accounts`** | `SELECT` | `id = current_app_user_id() OR role = 'admin'` | Users can only inspect their own account or admin oversight |
| **`accounts`** | `INSERT` / `UPDATE` | `id = current_app_user_id()` | Users cannot modify another account's identity |
| **`profiles`** | `SELECT` | `published = 1 OR id = current_app_user_id()` | Published creator profiles are public; drafts are private |
| **`profiles`** | `INSERT` / `UPDATE` / `DELETE` | `id = current_app_user_id()` | Creators can only manage their own profile record |
| **`portfolios`** | `SELECT` | `published = 1 OR owner = current_app_user_id()` | Published work is discoverable; unpublished drafts remain private |
| **`portfolios`** | `INSERT` / `UPDATE` / `DELETE` | `owner = current_app_user_id()` | Creators cannot modify another creator's showcase projects |
| **`campaigns`** | `SELECT` | `owner = current_app_user_id() OR id IN (SELECT campaign FROM invitations WHERE creator = current_app_user_id())` | Brands own their campaigns; invited creators can inspect their brief |
| **`campaigns`** | `INSERT` / `UPDATE` / `DELETE` | `owner = current_app_user_id()` | Only the brand owner can modify or delete their campaign brief |
| **`invitations`** | `SELECT` | `brand = current_app_user_id() OR creator = current_app_user_id()` | Only the inviting brand and invited creator can access proposal |
| **`invitations`** | `INSERT` | `brand = current_app_user_id()` | Only brands can initiate invitations |
| **`invitations`** | `UPDATE` | `brand = current_app_user_id() OR creator = current_app_user_id()` | Both parties can update state (accept, decline, withdraw) |
| **`engagements`** | `SELECT` / `UPDATE` | `brand = current_app_user_id() OR creator = current_app_user_id()` | Project workspaces are restricted exclusively to active participants |
| **`events`** | `SELECT` | `engagement IN (SELECT id FROM engagements WHERE brand = current_app_user_id() OR creator = current_app_user_id())` | Deliverables and revision comments restricted to participants |
| **`events`** | `INSERT` | `author = current_app_user_id()` | Participant must author their own submissions and messages |
| **`files`** | `SELECT` | `true` (public metadata; R2 handles actual media binary streaming) | Metadata catalog |
| **`files`** | `INSERT` / `DELETE` | `owner = current_app_user_id()` | File records can only be created/deleted by their owner |
| **`reviews`** | `SELECT` | `true` (public creator testimonials) | Community trust and transparency |
| **`reviews`** | `INSERT` / `UPDATE` | `author = current_app_user_id()` | Reviews can only be written by the hiring brand |
| **`saved_searches`** | `ALL` | `owner = current_app_user_id()` | Private search presets restricted to brand owner |
| **`favorites`** | `ALL` | `owner = current_app_user_id()` | Bookmarks restricted to brand owner |
| **`evidence`** | `SELECT` / `INSERT` | `owner = current_app_user_id() OR role = 'admin'` | Verification evidence is strictly private to owner and moderators |
| **`support`** | `SELECT` / `INSERT` | `owner = current_app_user_id() OR role = 'admin'` | Enquiry messages are strictly private |

---

## 3. Server-Side Enforcement (Defense in Depth)

Even with database RLS active, CreaXa enforces explicit server-side role validation via `requireRole(['creator'])` or `requireRole(['brand', 'agency'])` in `lib/server.ts`.

This defense-in-depth model prevents:
1. Brand accounts masquerading as creators to publish portfolios.
2. Creators creating unauthorized brand campaigns.
3. Unauthenticated public visitors mutating workspace engagements.
