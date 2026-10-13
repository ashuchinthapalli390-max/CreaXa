# CreaXa Known Limitations & Production Considerations

## 1. Multi-Currency Filtering (Same-Currency Baseline)

### Current Architecture:
- We implemented **Option A: Same-Currency Filtering Baseline** (`lib/currency.ts`).
- When a brand filters creators by max rate with a selected currency (e.g., `$1,000 USD`), only creators whose rates are denominated in USD are compared using exact minor unit arithmetic.
- Creators whose rates are listed in other currencies (e.g., INR or EUR) are not falsely included or excluded based on raw numerical comparison.

### Upgrade Path to Option B (Dynamic FX Conversion):
- To support cross-currency comparisons (e.g. converting ₹80,000 INR to ~$950 USD on the fly), integrate a server-side exchange rate provider (e.g. Open Exchange Rates, Frankfurter, or ECB daily feeds).
- Stored rates should be cached with timestamping to avoid redundant external network roundtrips.

---

## 2. AI Brief Builder Service Availability

### Current Architecture:
- The AI Brief Builder (`/api/ai`) utilizes OpenAI's API with strict Zod structured JSON schemas.
- If `OPENAI_API_KEY` is not present in the environment secrets, the server responds with a transparent HTTP `503 Service Unavailable` (`AI_UNAVAILABLE`).
- The frontend preserves all entered brief text and enables the user to proceed with manual campaign publishing without data loss.

### Production Setup:
- Add a valid key via `wrangler secret put OPENAI_API_KEY`.
- Rate limiting is tracked per user/IP in the `limits` table.

---

## 3. WebGL & 3D Hardware Compatibility

### Current Architecture:
- The hero section renders a Three.js scene featuring 5,600 animated particles and a central holographic geometry.
- The canvas has been verified on Google Chrome with WebGL enabled.

### Fallback Behavior:
- If a client device has WebGL disabled, lacks GPU hardware acceleration, or is in battery-saver mode, the canvas detects context creation failure and gracefully hides the canvas while preserving full visibility and interactivity of the hero typography, CTAs, and navigation controls.

---

## 4. Cloudflare R2 Object Storage

### Current Architecture:
- In local development (`pnpm run dev`), R2 object storage is emulated by Miniflare.
- In production, it binds directly to the global Cloudflare R2 bucket (`BUCKET`).
- Media files are served through `/api/files/:id` with ownership checks and range streaming.

### Production Recommendation:
- For high-volume public video streaming, configure a custom domain (e.g., `media.creaxa.com`) on the R2 bucket with Cloudflare CDN edge caching rules.

---

## 5. Firebase Authentication & External Provider Setup

### Current Status:
- Primary user identity is managed exclusively by **Firebase Authentication** (Email/Password, Google OAuth, Microsoft OAuth via `microsoft.com`).
- To activate production social logins, the project owner must configure:
  1. **Google OAuth**: Automatically enabled in Firebase Console for project `creaxa-6e7bc`.
  2. **Microsoft Entra**: Register an application in Microsoft Entra admin center with redirect URI `https://creaxa-6e7bc.firebaseapp.com/__/auth/handler` and supply Client ID & Secret to Firebase Console.
  3. **Authorized Domains**: Add production hostnames (`creaxa.com`, `*.workers.dev`) under Firebase Authentication > Settings > Authorized domains.

---

## 6. Supabase Remote Database & RLS

### Current Status:
- Target schemas and RLS policies are authored in `supabase/migrations/`.
- `lib/database.ts` routes queries to Supabase PostgreSQL when `NEXT_PUBLIC_SUPABASE_URL` is set, and falls back to local SQLite/D1 in offline or test environments.
- To connect a live Supabase instance:
  1. Apply `supabase/migrations/20261013000000_init_supabase_schema.sql` and `supabase/migrations/20261013000001_enable_rls_policies.sql`.
  2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to environment variables.
  3. In Supabase Dashboard, configure Third-Party Auth pointing to Firebase project `creaxa-6e7bc`.
