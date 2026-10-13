# CreaXa Production Deployment Guide

## 1. Prerequisites & Infrastructure Setup

CreaXa deploys to the **Cloudflare Edge Platform** via **Cloudflare Workers**, **Cloudflare D1**, and **Cloudflare R2**.

### Required Tools
- Node.js `>= 22.13.0` (Recommended: Node 24 LTS)
- pnpm `>= 10.0.0`
- Wrangler CLI (`npm install -g wrangler` or via project devDependencies)
- Cloudflare account with Workers Paid or Standard plan (for D1 & R2 bindings)

---

## 2. Cloudflare Resource Provisioning

### Step 2.1: Provision Cloudflare D1 Database
Execute in terminal:
```bash
wrangler d1 create creaxa-db
```
Record the resulting output:
```toml
[[d1_databases]]
binding = "DB"
database_name = "creaxa-db"
database_id = "<YOUR_D1_DATABASE_ID>"
```

### Step 2.2: Apply Production Database Migrations
Apply all 3 migration files to the remote Cloudflare D1 database:
```bash
# Preview pending migrations
wrangler d1 migrations list creaxa-db --remote

# Apply migrations sequentially
wrangler d1 migrations apply creaxa-db --remote
```
Verify the tables:
```bash
wrangler d1 execute creaxa-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### Step 2.3: Provision Cloudflare R2 Storage Bucket
Create the object storage bucket for creator media and campaign deliverables:
```bash
wrangler r2 bucket create creaxa-storage
```
Record the binding configuration:
```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "creaxa-storage"
```

---

## 3. Environment Variables & Secrets Configuration

### Step 3.1: Server-Side Secrets
Set confidential secrets in Cloudflare Workers environment using `wrangler secret put`:
```bash
# OpenAI API Key for AI Brief Builder & Creator Enhancement
wrangler secret put OPENAI_API_KEY

# Optional: Cloudflare API token if dynamic bucket operations are used
wrangler secret put CLOUDFLARE_API_TOKEN
```

### Step 3.2: `.env.production` Reference
Create or configure `.env.production` (do not commit actual secrets to version control):
```ini
# Cloudflare Worker Configuration
ENVIRONMENT=production
NODE_ENV=production

# OpenAI Configuration
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-proj-your-production-key-here

# Storage Public URL (if custom domain is attached to R2 bucket)
STORAGE_PUBLIC_URL=https://assets.creaxa.ai
```

---

## 4. Production Build & Deployment Pipeline

### Step 4.1: Clean Production Build
Compile the Vinext server, React Server Components, and client bundles:
```bash
pnpm install --frozen-lockfile
pnpm run build
```
The build executes 5 compilation stages:
1. `prepare`: Generates types and assets
2. `client`: Vite bundle for React 19 client components and Three.js WebGL canvas
3. `server`: Next.js Server Components and edge SSR entrypoint
4. `worker`: Bundles Cloudflare Worker script and D1/R2 bindings into `dist/server`
5. `assets`: Static asset optimization into `dist/client`

### Step 4.2: Deploy Worker to Cloudflare Edge
Deploy to the global Cloudflare network:
```bash
wrangler deploy --config dist/server/wrangler.json
```

Or deploy to a specific custom route/domain:
```bash
wrangler deploy --config dist/server/wrangler.json --routes "creaxa.ai/*"
```

---

## 5. Post-Deployment Verification & Health Checks

Once deployed, execute smoke tests against the production URL:

1. **Edge Root & 3D Hero:**
   ```bash
   curl -I https://creaxa.ai/
   # Expect: HTTP/2 200 OK, Content-Type: text/html
   ```

2. **Marketplace Discovery & Currency Stats:**
   ```bash
   curl https://creaxa.ai/api/marketplace/stats
   # Expect: JSON response with active creator counts
   ```

3. **Creator Search with Currency Filter:**
   ```bash
   curl "https://creaxa.ai/api/marketplace/creators?currency=USD&maxRate=2000"
   ```

4. **R2 Media Retrieval:**
   ```bash
   curl -I "https://creaxa.ai/api/storage/file?key=healthcheck"
   ```

---

## 6. Backup, Rollback & Disaster Recovery

### D1 Database Backups
Cloudflare D1 automatically captures time-stamped snapshots. You can also trigger manual point-in-time backups:
```bash
wrangler d1 backup create creaxa-db
```
To restore a snapshot:
```bash
wrangler d1 backup restore creaxa-db <BACKUP_ID>
```

### Worker Instant Rollback
Cloudflare Workers supports zero-downtime instant deployment rollbacks:
```bash
# List recent deployment versions
wrangler deployments list

# Roll back to previous deployment
wrangler rollback <DEPLOYMENT_ID>
```
