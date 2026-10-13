# CreaXa: Pre-Migration Architectural & Security Audit

## 1. Executive Summary

This pre-migration audit documents the baseline architecture of the CreaXa repository prior to executing the comprehensive migration to **Firebase Authentication** and **Supabase PostgreSQL**, alongside complete removal of unwanted platform-generated ChatGPT / OpenAI promotional branding.

---

## 2. Inventory of Current Architecture & Dependencies

| Subsystem | Baseline State (Pre-Migration) | Target Architecture |
|---|---|---|
| **Primary Identity** | Sites-managed / ChatGPT header identity (`oai-authenticated-user-*`) & `/signin-with-chatgpt` redirect | **Firebase Authentication** (Email/Password, Google OAuth, Microsoft OAuth) |
| **Auth Pages** | Generic auth placeholder with "Continue with ChatGPT" | Dedicated `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding` |
| **Primary Database** | Cloudflare D1 (Distributed SQLite via Drizzle ORM) | **Supabase PostgreSQL** with Row-Level Security (RLS) |
| **Object Storage** | Cloudflare R2 (`STORAGE` / `BUCKET` binding) | **Cloudflare R2** (Preserved as primary media storage) |
| **Edge Runtime** | Vinext / Next.js 16 on Cloudflare Workers | **Vinext / Cloudflare Workers** (Preserved) |
| **AI Brief Assistant** | Server-side OpenAI API (`/api/ai`) | **Server-side AI Integration** (Preserved internally, relabeled in UI) |
| **3D / Visuals** | Three.js WebGL hero sculpture & 10 themes | **Three.js & 10 Editorial Themes** (Preserved) |

---

## 3. Branding Audit: Unwanted ChatGPT / OpenAI References

A repository-wide inspection identified the following user-facing and code references:

### A. Visible User-Facing Interface Copy
1. **`app/marketplace.tsx` (Lines 200–205):**
   - *"Your sign-in is managed by ChatGPT. Account recovery and passwords are handled through your ChatGPT account."*
   - *"Sign in securely with your ChatGPT account."*
   - Button: *"Continue with ChatGPT"* (`/signin-with-chatgpt`)
2. **`app/marketplace.tsx` (Line 576, Account Settings):**
   - *"Authentication is managed by ChatGPT. Manage your password and account security in your ChatGPT settings."*
   - *"Deleting your CreaXa account removes your marketplace profile... Your ChatGPT account is unaffected."*
3. **`app/marketplace.tsx` (Line 638, Privacy Policy):**
   - *"CreaXa receives a Site-specific identity ID, email and optional display name through ChatGPT sign-in."*
   - *"ChatGPT/Sites handles authentication and hosting access."*
4. **`app/marketplace.tsx` (Line 639, Terms of Service):**
   - *"Sign-in is managed by ChatGPT. Keep your identity account secure."*
5. **`app/[...path]/page.tsx`:**
   - Import of `requireChatGPTUser` from `../chatgpt-auth`
6. **`app/chatgpt-auth.ts`:**
   - Complete module with headers `oai-authenticated-user-id`, `oai-authenticated-user-email`, `SIGN_IN_PATH = "/signin-with-chatgpt"`

### B. Functional Internal References (To Be Preserved)
- `OPENAI_API_KEY`: Server-side secret for the AI Brief Builder.
- `https://api.openai.com/v1/chat/completions`: Server-side endpoint in `lib/server.ts` (`/api/ai`).
- Internal OpenAI model parameters (`gpt-4.1-mini`).

---

## 4. Database Inventory & D1-to-PostgreSQL Mapping

The existing Cloudflare D1 SQLite database consists of 17 tables defined in `db/schema.ts` and `drizzle/*.sql`:

1. `accounts`: `id` (text PK), `email`, `name`, `role`, `data` (JSON text), `created`, `updated`
2. `profiles`: `id` (text PK FK accounts.id), `slug` (text UNIQUE), `published` (int), `verification` (text), `data` (JSON text), `updated`
3. `portfolios`: `id` (text PK), `owner` (text FK accounts.id), `slug` (text UNIQUE), `published` (int), `data` (JSON text), `updated`
4. `campaigns`: `id` (text PK), `owner` (text FK accounts.id), `status` (text), `data` (JSON text), `created`, `updated`
5. `invitations`: `id` (text PK), `campaign` (text FK campaigns.id), `brand` (text FK accounts.id), `creator` (text FK accounts.id), `status`, `data`, `created`
6. `engagements`: `id` (text PK), `invitation` (text FK invitations.id), `campaign`, `brand`, `creator`, `status`, `revisions`, `data`, `updated`
7. `events`: `id` (text PK), `engagement` (text FK engagements.id), `author`, `type`, `data`, `created`
8. `files`: `id` (text PK), `owner`, `name`, `mime`, `size`, `created`
9. `notifications`: `id` (text PK), `owner`, `title`, `href`, `read`, `created`
10. `reviews`: `id` (text PK), `engagement` (text FK), `creator` (text FK), `author` (text FK), `rating` (int), `comment`, `created`, `updated`
11. `saved_searches`: `id` (text PK), `owner` (text FK), `name`, `data`, `updated`
12. `project_tasks`: `id` (text PK), `engagement` (text FK), `author`, `title`, `due`, `completed`, `updated`
13. `favorites`: `id` (text PK), `owner`, `creator`
14. `evidence`: `id` (text PK), `owner`, `status`, `data`, `created`, `updated`
15. `support`: `id` (text PK), `owner`, `data`, `created`
16. `audit`: `id` (text PK), `actor`, `action`, `subject`, `created`
17. `limits`: `id` (text PK), `count`, `expires`

### PostgreSQL Translation Strategy:
- Replace SQLite integer timestamps with `BIGINT` or PostgreSQL `TIMESTAMPTZ`.
- SQLite `data text` fields containing JSON will be mapped to `jsonb` or compatible `text`/`json` types.
- Primary key strings: Firebase UIDs are arbitrary strings (e.g. `k9Jm8WvP...`), not UUIDs. Account `id` will remain `TEXT PRIMARY KEY` mapped directly to Firebase UID, or an explicit `firebase_uid TEXT UNIQUE` column will be established.
- SQLite JSON extraction syntax (`json_extract(p.data, '$.currency')`) will be mapped to PostgreSQL JSONB operators (`p.data->>'currency'`) or translated via a normalized Supabase query builder layer.

---

## 5. Potential Migration Risks & Mitigation Controls

| Risk | Impact | Mitigation Control |
|---|---|---|
| **Breaking Edge Runtime on Cloudflare Workers** | Incompatibility with Node-only Firebase Admin SDK in Worker isolates | Use lightweight Firebase REST / JWT public keys verification (`jose` or Web Crypto API) compatible with Cloudflare Workers isolates. |
| **Breaking Multi-Currency Budget Filters** | Currency comparison errors reintroduced | Retain the verified `lib/currency.ts` logic and translate the database extraction to PostgreSQL JSONB operators. |
| **Breaking R2 Media Uploads** | Loss of video / image streaming in portfolios | Cloudflare R2 `STORAGE` binding remains completely intact; only file metadata is stored in Supabase PostgreSQL. |
| **Breaking Ten Editorial Themes & Three.js** | Visual regressions on theme switch | Keep CSS variables and WebGL uniform updates untouched while enhancing the auth pages to support all 10 themes. |
| **Accidental AI Key Exposure** | Security vulnerability | `OPENAI_API_KEY` remains strictly a server-side Worker secret. UI labels will refer to "Creative Brief Assistant" or "AI Brief Builder" without exposing vendor details. |

---

## 6. Implementation Plan & Execution Sequence

1. **Phase 1: Branding Cleanup**
   - Remove ChatGPT / OpenAI promotional text from UI, settings, auth components, terms, privacy, and notifications.
   - Rename `chatgpt-auth.ts` to `auth.ts` and sanitize route names (`/login`, `/signup`).
2. **Phase 2: Firebase Authentication Integration**
   - Install `firebase` client SDK.
   - Create `lib/firebase.ts` with user-supplied configuration.
   - Build complete authentication UI (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`) supporting Email/Password, Google OAuth, and Microsoft OAuth.
   - Implement role onboarding (`I'm an AI Creator` vs `I'm a Brand / Agency`).
   - Implement Edge-compatible Firebase token verification on server API routes.
3. **Phase 3 & 4: Supabase PostgreSQL Database Setup & Migrations**
   - Install `@supabase/supabase-js`.
   - Create `lib/supabase.ts` for edge server and client contexts.
   - Author complete PostgreSQL DDL migrations with RLS policies in `supabase/migrations/`.
   - Refactor `lib/server.ts` to query Supabase PostgreSQL instead of Cloudflare D1.
4. **Phase 5 & 6: Reconnect Features & Verification**
   - Verify creator profile, R2 portfolio upload, brand campaign brief, currency-aware filters, AI brief builder, and end-to-end collaboration.
5. **Phase 7 & 8: E2E Browser Testing, Themes, & Documentation**
   - Test all 10 themes and mobile responsive layouts in real Chrome via Playwright.
   - Generate complete documentation suite.
