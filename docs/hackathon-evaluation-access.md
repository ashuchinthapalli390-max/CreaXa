# CreaXa — Hackathon Evaluation Access

**Live Platform:** [https://creaxa-pro.vercel.app/](https://creaxa-pro.vercel.app/)  
**Evaluation Scope:** Dedicated accounts for **Creator**, **Brand / Agency**, and **Limited Admin Reviewer** workflows.

---

## 🧭 Overview for Hackathon Judges & Reviewers

CreaXa is an AI-native content creator marketplace engineered for the next era of generative visual production. To allow judges and evaluators to test all authenticated capabilities end-to-end without manual onboarding hurdles, dedicated preconfigured evaluation accounts are provisioned across all core roles.

> [!NOTE]
> **Privacy & Credential Security:**  
> Evaluation account credentials (email and initial passwords) are shared **privately** with hackathon organizers/reviewers rather than published directly in the public source repository.

---

## 🎨 1. Creator Evaluation Workflow

### A. Authentication & Workspace Access
1. Open the live platform at [https://creaxa-pro.vercel.app/login](https://creaxa-pro.vercel.app/login).
2. Sign in using the **Creator credentials provided privately**.
3. Upon signing in, you will be automatically routed to the **Creator Workspace** (`/app/creator`).

### B. Preconfigured Profile & AI Portfolio
1. Navigate to **Profile** (`/app/creator/profile`) and **Portfolio** (`/app/creator/portfolio`).
2. Explore the preconfigured profile with declared AI specializations (e.g. *AI Filmmaking, Neural 3D, Generative Media Art*), documented tool stacks (*Runway Gen-3, Midjourney v6, OpenAI Sora, ComfyUI, Flux.1*), and commercial licensing rights.
3. Test **Portfolio Editing**: add new media, modify aspect ratios (9:16 vertical, 16:9 cinema), or edit technical workflow notes.

### C. Live Cryptographic Email OTP Verification (Resend)
Test the real-world notification and contact verification engine:
1. Open **Settings** (`/app/settings`) from the left sidebar or avatar menu.
2. Locate the **Email Settings** panel (`#email-settings`).
3. Enter an **email address you control** in the input field.
4. Select **"Send Verification Code"**.
5. Check your personal inbox for the 6-digit cryptographic verification code sent via **Resend** from verified domain `codxa-agency.online`.
6. Enter the 6-digit OTP into the verification box and click **"Verify Code"**.
7. Observe the immediate transition to the verified state featuring the **"Verified via Resend"** lime badge.

> [!IMPORTANT]
> **Identity Separation Note:**  
> The email added and verified in **Email Settings** serves as your active contact and campaign notification address for project briefs, revision requests, and client messages. It does **not** replace your underlying Firebase sign-in identity.

### D. Collaboration Lifecycle & Submissions
1. Navigate to **Invitations** (`/app/creator/invitations`).
2. Accept pending brief invitations from brand clients.
3. In the shared **Project Workspace**, test deliverable submissions (v1/v2), prompt audit notes, revision responses, and final handover status.

---

## 🏢 2. Brand / Agency Evaluation Workflow

### A. Authentication & Campaign Briefs
1. Sign in using the **Brand credentials provided privately** at [https://creaxa-pro.vercel.app/login](https://creaxa-pro.vercel.app/login).
2. Navigate to **Campaigns** (`/app/brand/campaigns`).
3. Explore the preconfigured creative campaign brief: inspect deliverables, aspect ratio declarations, rights requirements (digital commercial rights, territorial scope), and revision limits.

### B. AI Brief Builder (Dual OpenAI + Gemini Cascade)
1. Select **"New Campaign"** (`/app/brand/campaigns/new`).
2. Test the **AI Brief Builder**: enter a loose creative prompt (e.g. *"Cinematic luxury perfume teaser for vertical social formats"*).
3. Observe structured parameter extraction: industry, content type, platform, aspect ratio, budget recommendation, and commercial use clauses.

### C. Creator Discovery & Filtering
1. Open **Discover Creators** (`/discover`) or **Workroom** (`/work`).
2. Test multi-dimensional filters: specializations, tools (Runway, Sora, Midjourney), formats, and multi-currency budgets (INR, USD, EUR).
3. Inspect creator portfolio dossiers and native in-website project detail pages at `/creators/:artistSlug/works/:workSlug`.

### D. Collaboration & Approval Lifecycle
1. Send an **Invitation** with agreed budget and milestone timeline to the registered evaluation creator.
2. Monitor submission versions, request structured revisions within the agreed limit, approve completed deliverables, and post a verified 5-star review.

---

## 🛡️ 3. Limited Admin Reviewer Workflow

A dedicated, limited-permission reviewer account is available to inspect administrative oversight tools without exposing privileged production infrastructure keys:

1. Sign in with the **Admin Reviewer credentials provided privately**.
2. Navigate to `/admin` or access the **Admin Console** tab.
3. Inspect platform metrics:
   - System operational status and dual AI provider latency.
   - Verified creator directory catalog.
   - Moderation flags and evidence submissions.
   - Active campaigns and transactional volume.
4. Review access is strictly scoped: privileged database migration and secret key management remain protected behind environment access boundaries.

---

## ⚡ Quick Reference Matrix

| Role | Primary Target Route | Core Evaluation Actions | Key Validation Points |
| :--- | :--- | :--- | :--- |
| **Creator** | `/app/creator` <br/> `/app/settings` | Profile inspection, portfolio edit, **Resend OTP email verification**, invitation accept, deliverable upload | Verified OTP code received in real inbox; profile updates persist |
| **Brand** | `/app/brand/campaigns` <br/> `/discover` | Campaign brief creation, **Dual AI extraction**, creator discovery filters, invitation dispatch, deliverable approval | Structured JSON brief generated; explainable match scores calculated |
| **Reviewer** | `/admin` | Operational health inspection, platform activity metrics, capability verification review | Read-only administrative safety; high-level marketplace visibility |

---

## 📞 Support & Evaluation Queries

If you need credential assistance or have technical questions during your evaluation:
- Use the in-platform signed-in contact form at [https://creaxa-pro.vercel.app/contact](https://creaxa-pro.vercel.app/contact).
- Check the complete automated test verification suite: `node scripts/test-production-features.mjs` (58/58 passing assertions).
