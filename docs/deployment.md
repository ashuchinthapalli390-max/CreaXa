# CreaXa — Production Deployment & Cloudflare Workers Architecture

## 1. Overview

CreaXa is built to deploy on **Cloudflare Workers** utilizing **Vinext** (the Cloudflare edge adapter for Next.js App Router). It incorporates:
- **Firebase Authentication** for user identity (Email/Password, Google OAuth)
- **Supabase PostgreSQL** as the primary application database with Row Level Security (RLS)
- **Cloudflare R2** for media asset hosting (`BUCKET` binding)
- **OpenAI API** for the server-side AI Brief Builder

---

## 2. Environment Configuration

### 2.1 Public Variables (`wrangler.toml` or Cloudflare Dashboard)
```toml
name = "creaxa"
main = "./build/sites-worker.ts"
compatibility_date = "2026-10-13"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".vinext/client"
binding = "ASSETS"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "creaxa-assets"

[vars]
APP_BASE_URL = "https://creaxa.com"
NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyBjfKTxCM8rts9srwXSvWluomgIRUPrhRs"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "creaxa-6e7bc.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID = "creaxa-6e7bc"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "creaxa-6e7bc.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "641625441345"
NEXT_PUBLIC_FIREBASE_APP_ID = "1:641625441345:web:8f922b61d009c6df25f2c0"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-F82JG95L1J"
NEXT_PUBLIC_SUPABASE_URL = "https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2.2 Secure Secrets
Set sensitive keys via Cloudflare Wrangler secrets:
```bash
# Supabase Service Role Key (for backend maintenance & migrations)
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# OpenAI API Key (for server-side AI Brief Builder extraction)
wrangler secret put OPENAI_API_KEY

# Platform Administrators (Comma-separated Firebase UIDs)
wrangler secret put ADMIN_USER_IDS
```

---

## 3. Pre-Deployment Validation & Build Steps

Run the verified test suites prior to initiating deployment:
```bash
# 1. Validate TypeScript strict types (0 errors)
node node_modules/typescript/bin/tsc --noEmit --incremental false

# 2. Run multi-currency budget comparisons (12 tests)
node scripts/verify-currency.mjs

# 3. Verify API and authorization matrix (113 assertions)
node scripts/verify-marketplace.mjs

# 4. Verify 3D Catmull-Rom camera and 5,600 particles
node scripts/verify-intro.mjs

# 5. Verify full collaboration lifecycle (18 steps)
node scripts/verify-live-flow.mjs

# 6. Execute Playwright Chrome E2E browser tests
node scripts/test-e2e-browser.mjs

# 7. Compile production bundle via Vinext
pnpm run build

# 8. Deploy to Cloudflare Workers
wrangler deploy
```

---

## 4. Live Domain Smoke Test

After deployment, verify that:
1. The public URL serves the HTML document with proper SEO metadata and favicon.
2. The 3D WebGL scene renders with 5,600 particles and smooth camera damping.
3. Clicking **Get Started** displays the Firebase authentication modal with **Google** and **Email/Password** options (no Microsoft buttons).
4. Creator profiles load media streamed from Cloudflare R2 with correct `Content-Type` headers.
5. All 10 themes persist in `localStorage` and cycle without DOM flicker.
