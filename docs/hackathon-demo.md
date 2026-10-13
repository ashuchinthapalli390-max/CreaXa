# CreaXa — Hackathon Evaluation & Live Demo Walkthrough

## 1. Quick Overview for Judges

**CreaXa** is an independent, AI-native creator marketplace connecting AI filmmakers, animators, and generative artists with commercial brands and creative agencies. It features:
- **Authentication**: Firebase Authentication (Email/Password & Google OAuth). *Microsoft login has been intentionally removed from scope.*
- **Database**: Supabase PostgreSQL with Row Level Security (RLS). *Cloudflare D1 is no longer the active application database.*
- **Media**: Cloudflare R2 object storage with streaming video support.
- **AI**: Server-side OpenAI brief structure assistant.
- **Visuals**: 10 hand-curated editorial themes and a 7-scene cinematic Three.js WebGL scroll story.

---

## 2. 5-Minute Evaluation Walkthrough

### Step 1: 3D Storytelling & Theme Switching
1. Open the homepage at `http://127.0.0.1:5173/` (or the deployed URL).
2. Observe the persistent Three.js WebGL canvas: 5,600 ambient particles framing an interactive central sculpture.
3. Scroll through the **7-Scene Narrative**:
   - *Scene 1: Hero — A New Creative Economy*
   - *Scene 2: The Problem — Fragmented Discovery*
   - *Scene 3: The Brief — Idea to Structure*
   - *Scene 4: The Match — Creative Compatibility*
   - *Scene 5: Portfolio Gallery — Work That Speaks for Itself*
   - *Scene 6: Collaboration — From First Connection to Final Delivery*
   - *Scene 7: Final CTA — Make Something Extraordinary*
4. Click the **Palette Icon** in the top navigation bar. Select any of the **10 Curated Themes** (e.g. *Paper & Ink*, *Carbon Acid*, *Midnight Cobalt*, *Terracotta Atelier*). Notice the instant token transition without page reload.

---

### Step 2: Creator Registration & Portfolio Publishing
1. Click **Get Started** (`/signup`).
2. Notice the clean authentication modal featuring **Google OAuth** and **Email/Password** options.
3. Sign up using Email or Google.
4. On the `/onboarding` screen, select **"I'm an AI Creator"**.
5. Input your credentials:
   - Specialization: `AI Filmmaking`
   - AI Tools: `Runway Gen-3`, `Midjourney v6`, `Flux.1`
   - Content Formats: `AI Video`, `9:16 vertical`
   - Starting Rate: `$600 USD`
6. Upload real video/image media from your local disk. Save and publish your project.
7. Observe that media is immediately stored in Cloudflare R2 and indexed into the discovery catalog.

---

### Step 3: Brand Brief & AI Brief Builder
1. Sign in as a Brand (or open an incognito window and select **"I'm a Brand / Agency"**).
2. Go to **Workspace** > **Campaigns** > **New Campaign** (`/app/brand/campaigns/new`).
3. Click **AI Brief Builder**:
   - Prompt: *"Three cinematic sci-fi sneaker teasers for Instagram Reels in 9:16 vertical, with full paid commercial advertising rights."*
   - Watch the server-side model extract structured fields: Style, Platform, Aspect Ratio, Deliverables, and Commercial Terms.
4. Complete budget (`$500 USD`) and deadline, then publish the campaign.

---

### Step 4: Creator Discovery & Explainable Matching
1. Navigate to **Discover** (`/discover`).
2. Search by tool (`Runway`), aspect ratio (`9:16`), or budget.
3. Notice that currency filtering is decimal-safe (INR, USD, EUR are compared accurately in minor units without false conversions).
4. Click **View Match** on eligible creators:
   - Observe the 100% compatibility score broken down by:
     - Style & Specialization: 30 pts
     - Tool Stack: 20 pts
     - Content Format: 20 pts
     - Industry: 15 pts
     - Budget & Availability: 15 pts

---

### Step 5: Full Collaboration Lifecycle (Invite $\to$ Delivery)
1. From the campaign match view, click **Invite Creator**.
2. Switch to the creator account:
   - Accept the pending invitation.
   - An active **Project Workspace** is automatically created.
3. **Submission v1**: Creator uploads deliverable v1 (video file in R2).
4. **Revision Request**: Brand reviews the video and clicks *Request Revision* with specific notes.
5. **Submission v2**: Creator uploads revised deliverable v2.
6. **Approval & Delivery**: Brand clicks *Approve*. Creator marks *Final Delivery*. Brand downloads the completed media asset.
7. **5-Star Review**: Brand posts a 5-star review that appears immediately on the creator's public profile.

---

## 3. Automated Test Verification Commands

You can run the complete automated test suite locally at any time:

```bash
# 1. Strict TypeScript validation (0 errors)
node node_modules/typescript/bin/tsc --noEmit --incremental false

# 2. Currency comparison unit & SQL tests (12 tests pass)
node scripts/verify-currency.mjs

# 3. Marketplace API & authorization matrix (113 assertions pass)
node scripts/verify-marketplace.mjs

# 4. 3D WebGL Catmull-Rom camera & particle tests (201 samples pass)
node scripts/verify-intro.mjs

# 5. Full 18-step live integration workflow (All 18 steps pass)
node scripts/verify-live-flow.mjs

# 6. Playwright Chrome E2E browser tests (All 10 scenarios pass)
node scripts/test-e2e-browser.mjs
```
