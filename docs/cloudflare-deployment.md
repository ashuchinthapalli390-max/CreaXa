# CreaXa — Cloudflare Workers & Vinext Production Deployment Guide

## 1. Overview

CreaXa runs on **Cloudflare Workers** powered by **Vinext** (Vite + Next.js App Router for Cloudflare edge isolates). It integrates:
- **Firebase Authentication** for user identity (OAuth with Google & Microsoft, Email/Password)
- **Supabase PostgreSQL** as the primary application database with Row Level Security (RLS)
- **Cloudflare R2** for object storage (profile pictures, portfolio videos, deliverable files)
- **OpenAI API** for server-side AI Brief Builder extraction

---

## 2. Prerequisites

1. Cloudflare account with Workers Paid or Standard plan (required for R2 bindings).
2. Cloudflare Wrangler CLI installed (`npm install -g wrangler` or `pnpm add -D wrangler`).
3. An active Cloudflare R2 bucket named `creaxa-assets` (or as configured in `wrangler.toml`).
4. Supabase project provisioned with migrations applied from `supabase/migrations/`.
5. Firebase project (`creaxa-6e7bc`) with authorized domains configured.

---

## 3. Cloudflare Configuration (`wrangler.toml`)

Create or update your `wrangler.toml` in the repository root:

```toml
name = "creaxa"
main = "./build/sites-worker.ts"
compatibility_date = "2026-10-13"
compatibility_flags = ["nodejs_compat"]

# Static Assets
[assets]
directory = ".vinext/client"
binding = "ASSETS"

# Cloudflare R2 Object Storage Binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "creaxa-assets"

# Public Environment Variables (Non-sensitive)
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

---

## 4. Setting Secret Environment Variables

Sensitive secrets must never be committed to source code or `wrangler.toml`. Set them securely using Wrangler secrets:

```bash
# 1. Supabase Service Role Key (Backend migrations & maintenance)
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# 2. OpenAI API Key (AI Brief Builder structured generation)
wrangler secret put OPENAI_API_KEY

# 3. Platform Administrators (Comma-separated Firebase UIDs)
wrangler secret put ADMIN_USER_IDS
```

---

## 5. Firebase Authorized Domains

To ensure Google and Microsoft OAuth redirects function correctly in production:
1. Open the [Firebase Console](https://console.firebase.google.com/project/creaxa-6e7bc/authentication/settings).
2. Go to **Authentication** > **Settings** > **Authorized domains**.
3. Add your production domain(s):
   - `creaxa.com`
   - `www.creaxa.com`
   - `your-worker-subdomain.workers.dev`

---

## 6. Build and Deployment Commands

Execute the verified build script and deploy with Wrangler:

```bash
# Step 1: Install dependencies
pnpm install

# Step 2: Validate TypeScript types
node node_modules/typescript/bin/tsc --noEmit --incremental false

# Step 3: Run comprehensive test suites
node scripts/verify-currency.mjs
node scripts/verify-marketplace.mjs
node scripts/verify-live-flow.mjs

# Step 4: Build client assets and Worker bundle via Vinext
pnpm run build

# Step 5: Deploy to Cloudflare Workers
wrangler deploy
```

---

## 7. Post-Deployment Verification

After deployment, verify that:
1. The production URL resolves and loads the 3D WebGL ambient hero canvas.
2. Clicking **Sign In** displays the Firebase authentication modal with Google, Microsoft, and Email/Password options.
3. Creator portfolios load media from Cloudflare R2 with correct `Content-Type` headers.
4. Search and currency filtering query Supabase PostgreSQL.
5. All 10 visual themes persist across page reloads in `localStorage`.
