# CreaXa source handoff

This package reproduces the tracked source of deployed commit `ca1842791b2046558a60781f06b78f661edf515b`. App files, configuration, schema, migrations and dependency lockfile are preserved. Handoff documents are additional files; the new full-screen opening has not been implemented in this version.

## Start locally

Use Node.js 24 or later for the verification script. Install the version of pnpm declared in `package.json` through your usual trusted package manager, then use the locked dependencies:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

The clean checkout selects its portable execution profile. The original `install:ci` script is managed-Linux specific and requires Bash/Linux utilities; on a Windows Antigravity workspace use the direct pnpm installation command above. The original README's absolute `/root/.codex/...` build helper path exists only in the authoring environment. For this exported checkout use `pnpm build`.

## Local database

Build first to emit `dist/server/wrangler.json`. Apply migrations to the local D1 database before checking database-backed pages:

```sh
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_bouncy_captain_cross.sql
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_melted_stryfe.sql
```

Local and hosted data are separate. Apply each local migration once and keep migration order. Do not insert placeholder data.

## Verification

```sh
pnpm exec tsc --noEmit
node scripts/verify-marketplace.mjs
pnpm build
```

The verification script uses isolated fixture records and never seeds the hosted database. The supplied revision passed 62 API assertions and its hosted homepage, discovery, database read and sign-in redirect were checked. Browser visuals and full hosted user journeys were not verified.

## Services and current limits

Production hosting provides D1 `DB`, R2 `BUCKET` and trusted ChatGPT identity headers. The clean portable starter contains a development-only sign-in simulation; this is not production authentication and must not be exposed publicly. Deploy through Sites for the original hosted authentication boundary, or configure a genuine secure identity adapter before hosting elsewhere. Never accept arbitrary identity headers on a new public host.

`OPENAI_API_KEY` and `ADMIN_USER_IDS` are optional configuration keys; their actual values are not included. AI assistance and moderator access remain unconfigured until supplied securely. Email, payments and escrow are not implemented. Uploads are capped at 25 MB; supported types are JPG, PNG, WebP, MP4 and PDF. No hosted records, user media, sessions, service tokens or API keys are bundled.

The recording you add under `reference` must be supplied separately to Antigravity. The attached `CreaXa_Antigravity_Prompt.md` specifies how to inspect it and build the new entry experience while preserving this application.
