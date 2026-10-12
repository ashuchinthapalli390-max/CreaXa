# CreaXa

AI creative marketplace built with React, TypeScript, Vinext and Sites. The application stores real user records in Cloudflare D1 and files in Cloudflare R2. No accounts, profiles, portfolios, campaigns or reviews are seeded.

## Included workflows

- Responsive editorial public site with a native WebGL sculpture, pointer interaction, scroll response and reduced-motion support.
- Ten appearance themes with persistent device preferences.
- Sites-managed ChatGPT sign-in and server-authorized creator, brand and agency accounts.
- Creator profiles, declared tools and capabilities, rates, availability, public visibility, and original portfolio publishing.
- Database-backed search, grouped filters, exact result counts, sorting, saved creators and pagination.
- Five-step campaign briefs with persistent drafts, commercial-use terms and private reference assets.
- Explained compatibility matching with required format, availability, currency and budget checks.
- Invitations with pending, accepted, declined, withdrawn and expired states. Acceptance is idempotent and creates one engagement.
- Shared project agreements, messages, named deliverable submissions, version history, revision limits, approval, final delivery, completion and cancellation with partner confirmation.
- Participant-authorized downloads, upload validation, private evidence, notifications, settings and account removal.
- Configurable moderator review with audit records and a signed-in support inbox.

## Runtime configuration

Sites provisions `DB` and `BUCKET` from `.openai/hosting.json`. Authentication is supplied by the hosting platform. Application identity uses the Site-specific user ID, not email. The initial Site is owner-private.

Optional hosted secrets:

- `OPENAI_API_KEY`: enables the server-side structured brief assistant. Without it, the complete manual campaign builder remains available and the assistant reports its configuration state.
- `ADMIN_USER_IDS`: comma-separated Site-specific account IDs authorized for evidence review and support access. No user receives moderator privileges automatically.

These values must be configured through the Sites environment-variable operation, never embedded in source or the hosting manifest. Email delivery, payment processing and escrow are not integrated. Authentication recovery is managed through ChatGPT, not a separate marketplace password. File uploads are limited to 25 MB and support JPG, PNG, WebP, MP4 and PDF; public portfolio media supports image and MP4 content. Evidence PDFs are downloaded as attachments. Broader commercial operation requires the operator’s business identity, support arrangements and applicable legal terms to be finalized.

## Development

Use Node 24+ for the included in-process verification script. The app runtime uses the Sites Worker bundle. Install dependencies with the Sites installer, then:

```sh
node node_modules/typescript/bin/tsc --noEmit
node scripts/verify-marketplace.mjs
node /root/.codex/plugins/cache/openai-curated-remote/sites/1.0.1/scripts/build-site.mjs
```

The verification script runs the real API handler against an isolated SQLite/R2 adapter. It never inserts fixtures into the hosted database. It covers identity requirements, role authorization, draft/publish validation, search filters, compatibility, invitation duplication, project transitions, revision allowance, private files, notifications, evidence and account deletion. Browser interaction and hosted sign-in must additionally be checked in an authenticated browser when that capability is available.

Application entry points: `app/marketplace.tsx`, `app/scene.tsx`, `app/globals.css`, `lib/server.ts`, `lib/matching.ts`, `db/schema.ts`. All source is stored in the Site’s Git repository. Drizzle migrations are schema-only, with no seed records.
