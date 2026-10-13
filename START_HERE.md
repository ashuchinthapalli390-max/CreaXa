# CreaXa: Independent AI Content Creator Marketplace

CreaXa is a high-performance marketplace connecting visionary brands with world-class generative AI creators, filmmakers, and digital visual artists.

---

## Architecture & Technology Stack

- **Frontend**: Next.js App Router & React 19 powered by Vinext on Cloudflare Workers edge isolates.
- **Visuals**: Three.js WebGL 7-scene interactive scroll experience with responsive particle field & 10 editorial themes.
- **Authentication**: Firebase Authentication (Email/Password & Google OAuth) with Web Crypto RS256 JWT edge token verification.
- **Primary Database**: Supabase PostgreSQL (17 normalized tables with Row-Level Security) with automatic local D1 SQLite fallback.
- **Media Storage**: Cloudflare R2 object storage with streaming video support and byte-range requests.
- **AI Integration**: AI Creative Brief Builder powered by server-side structured OpenAI JSON extraction (`gpt-4.1-mini`).

---

## Getting Started Locally

1. **Install Dependencies**:
   ```powershell
   pnpm install
   ```

2. **Configure Environment (`.env`)**:
   - `NEXT_PUBLIC_FIREBASE_*`: Configured for Firebase project `creaxa-6e7bc`.
   - `NEXT_PUBLIC_SUPABASE_*`: Configured for Supabase PostgreSQL project.
   - `OPENAI_API_KEY`: Server-side API key for structured creative brief builder.

3. **Database Migration**:
   - Apply `supabase/consolidated_schema.sql` in your Supabase SQL Editor.
   - Run verification: `node scripts/verify-supabase.mjs`
   - Run optional seeder: `node scripts/seed-supabase.mjs`

4. **Start Development Server**:
   ```powershell
   pnpm dev
   ```
   Open `http://localhost:5173`.

---

## Validation Suite

- `node scripts/verify-currency.mjs` — Multi-currency and budget filter validation (12/12)
- `node scripts/verify-marketplace.mjs` — Marketplace API assertions (113/113)
- `node scripts/verify-live-flow.mjs` — End-to-end user lifecycle validation (18/18)
- `node scripts/verify-intro.mjs` — Three.js camera timeline & particle simulation (201 samples)
- `node scripts/test-e2e-browser.mjs` — Chromium automated E2E browser tests (10 scenarios)
- `node scripts/verify-supabase.mjs` — Supabase PostgreSQL schema diagnostic (17 tables)
