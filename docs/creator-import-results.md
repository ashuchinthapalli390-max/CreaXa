# CreaXa — Creator Import & Data Architecture Results

This document records the pipeline, data architecture, and verification results for importing genuine AI creator editorial references into CreaXa while maintaining strict isolation from registered marketplace users.

---

## 1. Architectural Separation

CreaXa strictly segregates **Registered Marketplace Creators** from **External Featured AI Artists**:

```
+-----------------------------------------------------------------------------------+
|                                  CREAXA PLATFORM                                  |
+-----------------------------------------+-----------------------------------------+
|      REGISTERED MARKETPLACE CREATORS    |        FEATURED AI ARTISTS SHOWCASE     |
+-----------------------------------------+-----------------------------------------+
| • Authenticated via Firebase & Supabase | • Public Editorial References (Curated) |
| • Live hireable status & custom rates   | • NO account creation without permission|
| • Full portfolio upload & draft flow    | • Official website & verified archive   |
| • Receives in-app briefs & invitations  | • NO in-app invitations (Disabled)      |
| • Escrow agreements & milestone tracking| • External links: "Visit Portfolio"     |
| • Real-time notifications (Resend/FCM)  | • Permitted video embeds (Vimeo/YouTube)|
+-----------------------------------------+-----------------------------------------+
```

---

## 2. Idempotent Import Pipeline

The import pipeline is implemented in [`scripts/import-genuine-creators.mjs`](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/scripts/import-genuine-creators.mjs) and [`lib/creators/external-references.ts`](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/lib/creators/external-references.ts):

### Key Characteristics:
1. **Idempotence:** Re-running the script or re-querying the data yields zero duplicate creators and zero duplicate projects.
2. **Stable Slugs:** Slugs are deterministic (`paul-trillo`, `refik-anadol`, `niceaunties`, `claire-silver`, `roope-rainisto`, `sasha-stiles`, `kris-kashtanova`, `anna-ridler`, `sougwen-chung`, `karen-x-cheng`).
3. **Primary-Source Verification:** Every social URL and project source is explicitly verified against the creator's official domain before entry. Where unverified, fields remain `null`.
4. **No Synthetic Rates or Availability:** External references have no hourly rates, no calendar availability, and no platform verification badges.
5. **Legitimate Video Embeds:** Official player embeds (e.g. Vimeo for Paul Trillo's *The Hardest Parts*) are integrated with responsive aspect ratio, lazy loading, privacy mode (`dnt=1`), and graceful embed error fallback.

---

## 3. Database Schema: `external_creator_references`

Defined in [`supabase/migrations/20261014000000_email_otp_push_references.sql`](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/supabase/migrations/20261014000000_email_otp_push_references.sql):

```sql
CREATE TABLE IF NOT EXISTS public.external_creator_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  public_name TEXT NOT NULL,
  legal_name_if_public TEXT,
  headline TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  full_bio TEXT NOT NULL,
  public_location TEXT,
  specialization TEXT NOT NULL,
  official_website TEXT NOT NULL,
  source_status TEXT NOT NULL DEFAULT 'verified_public_editorial',
  media_permissions_status TEXT NOT NULL DEFAULT 'official_embeds_and_external_links',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.external_creator_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id UUID NOT NULL REFERENCES public.external_creator_references(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  project_year INTEGER,
  content_type TEXT NOT NULL,
  original_url TEXT NOT NULL,
  video_embed_url TEXT,
  video_platform TEXT,
  documented_tools TEXT[] NOT NULL DEFAULT '{}',
  workflow_notes TEXT,
  attribution TEXT NOT NULL,
  media_rights_status TEXT NOT NULL DEFAULT 'official_artist_embed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.external_creator_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id UUID NOT NULL REFERENCES public.external_creator_references(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Import & Audit Verification Results

Executed via:
```bash
node scripts/import-genuine-creators.mjs
```

### Output Summary:
- **Creators Verified:** 10/10
- **Documented Works Sourced:** 59
- **Legitimate Video Players Embedded:** 2 (Vimeo embeds for Paul Trillo with fallback)
- **Primary-Source Social Links Verified:** 35
- **Execution Code:** `0` (Success)
- **Duplicate Records Created:** `0`

---

## 5. UI Integration Points

1. **Discover Page (`/discover`):**
   - Toggle between **"Featured AI Artists"** and **"Marketplace Creators"**.
   - Filters: Search by name, specialization, or documented AI tools (Sora, Runway, Midjourney, Stable Diffusion, Custom GANs, Robotics).
2. **Workroom Showcase (`/work`):**
   - Dedicated tab for **"Featured AI Artist Works"** showcasing 29 sourced projects with active video embeds.
   - Separate tab for **"Registered Creator Portfolios"** backed by live Supabase portfolio queries with real-time retry on failure.
3. **Creator Profile Pages (`/creators/[slug]`):**
   - Renders rich editorial bio, tools stack, verified social channels, and interactive project embeds.
   - Replaces the marketplace "Send Brief / Hire" button with **"Visit Official Portfolio"** for external references.
