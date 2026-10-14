# CreaXa: AI Content Creator Marketplace

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16%20Turbopack-black.svg)](https://nextjs.org/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth%20(Email%2C%20Google)-orange.svg)](https://firebase.google.com/)
[![Resend](https://img.shields.io/badge/Resend-Transactional%20Email%20%2B%20OTP-black.svg)](https://resend.com/)
[![Supabase PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-green.svg)](https://supabase.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Storage-orange.svg)](https://workers.cloudflare.com/)
[![Dual AI](https://img.shields.io/badge/AI-OpenAI%20%2B%20Gemini%20Cascade-purple.svg)](https://deepmind.google/)

> **Live Application URL:** [https://creaxa-pro.vercel.app](https://creaxa-pro.vercel.app/)

**CreaXa** is an independent, AI-native creator marketplace engineered for the next generation of creative production. It connects AI filmmakers, animators, generative artists, and creative technologists with forward-thinking brands and creative agencies through explainable matching, transparent commercial licensing, and transactional project workspaces.

---

## 1. Suggested Evaluation Flow

To evaluate the full end-to-end functionality of CreaXa on [https://creaxa-pro.vercel.app](https://creaxa-pro.vercel.app/):

1. **Homepage & Interactive Workflow**:
   - Open the homepage and explore the 5-second lightweight skippable cinematic intro.
   - Interact with the **8-Stage Workflow State Machine**: click through stages (Idea, Brief, Matching, Invite, Agreement, Deliverables, Revisions, Handover), toggle tool filters (Runway, Kling, Flux, Sora), and preview real-time brief generation.
2. **Discover Creators & Editorial Directory**:
   - Navigate to `/discover`.
   - Switch between **"Registered Creators"** (active marketplace accounts) and **"10 Verified AI Creators (Editorial Reference Directory)"**.
   - Review published creator profiles, documented AI tools (Sora, Runway Gen-2, Midjourney, Stable Diffusion), output formats, and creative workflows.
   - Use multi-select filters (Specialization, Tools, Format, Style, Industry, Aspect Ratio, Rate).
3. **Authentication & Custom Email OTP**:
   - Open **Sign Up** (`/signup`).
   - Register with Email/Password or **Continue with Google**.
   - For email signup, experience the **6-digit cryptographic Email OTP** delivered via **Resend** with real-time 60-second cooldown timer and 5-minute expiry.
4. **Creator Onboarding & Portfolio Publication**:
   - Complete onboarding with the **Creator** role (`/onboarding`).
   - Publish a showcase portfolio project with declared AI tools, creative workflow notes, and commercial-use rights declarations.
5. **Brand Campaign & AI Brief Builder**:
   - Log in with a **Brand / Agency** account.
   - Navigate to `/app/brand/campaigns` and create a campaign brief.
   - Use the **AI Creative Brief Builder** powered by dual-provider fallback (**OpenAI** `gpt-4.1-mini` with automatic cascade to **Google Gemini** `gemini-flash-lite-latest` / `gemini-flash-latest`).
6. **Explainable Matching & Direct Invitations**:
   - Review 7-dimension weighted compatibility scores (Style, Tools, Format, Industry, Budget).
   - Send collaboration invitations to registered creators.
7. **Transactional Collaboration Workspace**:
   - Manage the full project lifecycle through authenticated dashboards:
     $$\text{Invite} \longrightarrow \text{Accept} \longrightarrow \text{Submit Deliverable v1} \longrightarrow \text{Request Revision} \longrightarrow \text{Resubmit v2} \longrightarrow \text{Approve} \longrightarrow \text{Final Delivery}$$
8. **Web Push & Transactional Notifications**:
   - Test in-app notification center (bell icon with unread counts).
   - Test explicit opt-in browser push notifications via **Firebase Cloud Messaging (FCM)**.
   - Test verified Resend webhook delivery updates.

> **Important Note on External Creators:** Public editorial references to established AI artists (Paul Trillo, Refik Anadol, etc.) are strictly separated from registered marketplace accounts. In-app invitations on reference profiles link out to their official websites. Marketplace invitations and private engagements require registered user accounts.

---

## 2. Technical Architecture Matrix

| Architectural Layer | Technology | Implementation Details |
|---|---|---|
| **Website & Frontend** | Next.js 16 (Turbopack) / React 19 / TypeScript | Server & Client Components, Responsive Editorial UI |
| **Authentication** | **Firebase Authentication** | Email/Password and Google OAuth (*No Microsoft login*) |
| **Email Service & OTP** | **Resend REST API** | Cryptographic 6-digit OTP, HMAC-SHA256 digest, 5-minute expiry, 60s cooldown |
| **Verified Sending Domain** | `codxa-agency.online` | Verified DKIM/SPF domain in Resend (`auth@codxa-agency.online`) |
| **Resend Webhooks** | Svix-compatible Webhook Endpoint | `POST /api/webhooks/resend`, HMAC-SHA256 signature verification, replay protection |
| **Web Push Notifications** | **Firebase Cloud Messaging (FCM)** | Background service worker (`firebase-messaging-sw.js`), user opt-in prompt |
| **Primary Database** | **Supabase PostgreSQL** | 22 normalized tables, Row Level Security (RLS), relational integrity |
| **Dual AI Brief Builder** | **OpenAI + Google Gemini** | Model cascade (`gemini-flash-lite-latest` $\to$ `gemini-flash-latest` $\to$ `gemini-pro-latest`) |
| **Object File Storage** | Cloudflare R2 | High-throughput portfolio and deliverable hosting |
| **Design System & Themes** | Semantic CSS Tokens | **All 10 curated themes** with persistent local storage |

---

## 3. Ten Genuine AI Creator References (Editorial Directory)

To test search, filtering, tool benchmarks, and creator detail pages without misrepresenting real people, CreaXa catalogs 10 acclaimed AI artists as **External Editorial References**:

| # | Creator | Location | Specialization | Documented Tools | Real Documented Works | Official Portfolio |
|---|---|---|---|---|---|---|
| 1 | **Paul Trillo** | Los Angeles, USA | AI Filmmaking & Experimental Direction | Sora, Runway Gen-2, Stable Diffusion, DALL·E 2 | *Washed Out — The Hardest Part* (Sora music video), *Thank You For Not Answering* | [paultrillo.com](https://paultrillo.com/) |
| 2 | **Refik Anadol** | Los Angeles, USA | Generative Art & Machine-Learning Environments | StyleGAN2, Custom ML Models, Latent Space Tools | *Unsupervised — Machine Hallucinations* (MoMA), *Casa Batlló* | [refikanadol.com](https://refikanadol.com/) |
| 3 | **niceaunties (Wenhui Lim)** | Singapore | Surreal AI Visual Storytelling & Moving-Image | Midjourney, Runway, Motion Tracking, Stable Diffusion | *Auntieverse* (Visual universe), *Mirror Into Auntieverse* | [niceaunties.com](https://www.niceaunties.com/) |
| 4 | **Claire Silver** | USA | AI Digital Art & Collaborative Fashion | Midjourney, DALL·E 2, Stable Diffusion, Artbreeder | *AI Art is Not Art* (Genesis collection), *corpo \| real* | [clairesilver.com](https://www.clairesilver.com/) |
| 5 | **Roope Rainisto** | Helsinki, Finland | Post-Photography & AI Photographic Series | DreamBooth, Custom Diffusion, Inpainting, Upscaling | *Life in West America*, *REWORLD* | [rooperainisto.com](https://www.rooperainisto.com/) |
| 6 | **Sasha Stiles** | New York, USA | AI Poetry, Computational Art & Typography | Custom LLMs, GPT Fine-tunes, Generative Typography | *Technelegy* (Poetry book), *REPETAE: Again, Again* (Gucci) | [sashastiles.com](https://www.sashastiles.com/) |
| 7 | **Kris Kashtanova** | New York, USA | AI Illustration, Comic Narrative & Video | Midjourney, Stable Diffusion, Runway Gen-2, Kaiber | *Zarya of the Dawn* (Graphic novel), *Rose Enigma* | [kris.art](https://www.kris.art/) |
| 8 | **Anna Ridler** | London, UK | Custom Datasets & Machine-Learning Art | Custom GANs, Hand-Curated Datasets, PyTorch | *Mosaic Virus* (Dynamic GAN video), *Myriad (Tulips)* | [annaridler.com](https://annaridler.com/) |
| 9 | **Sougwen Chung** | London / Windsor | Human–Robot Collaboration & Generative Systems | D.O.U.G. Robotic Arm, Neural Networks, EEG Sensors | *MEMORY* (Drawing unit gen 2), *Assembly Lines* | [sougwen.com](https://sougwen.com/) |
| 10 | **Karen X. Cheng** | San Francisco, USA | AI Commercial Creative, Advertising & VFX | Stable Diffusion, Runway Gen-1/Gen-2, DALL·E | *HP AI Fashion Video*, *PUMA / Beats / LEGO* ads | [karenx.com](https://www.karenx.com/) |

### Architectural Distinction:
- **Reference Records:** Primary source links, documented tools, public works, disabled in-app invite (links to official portfolio), no fake rates or availability.
- **Registered Creators:** Authenticated Firebase accounts, editable profiles, project uploads, commercial declarations, in-app messaging, milestone agreements, and deliverable handoffs.

---

## 4. Ten Curated Editorial Themes

CreaXa supports 10 themes via CSS semantic custom properties:
1. **Obsidian Editorial**: Sleek modern dark mode with titanium accents (`#11110F` / `#F2EEE5` / `#D95736`)
2. **Paper & Ink**: Minimalist, high-contrast monochrome monograph (`#F4F0E7` / `#232321` / `#B7432B`)
3. **Carbon Acid**: Tech-forward dark slate with vibrant electric lime (`#131715` / `#EDF3E6` / `#D4ED65`)
4. **Midnight Cobalt**: Deep electric blue inspired by modern cinema (`#09152B` / `#EEF1FC` / `#8BA8FF`)
5. **Terracotta Atelier**: Warm Mediterranean design studio earth tones (`#EBDCCE` / `#332720` / `#B85C3C`)
6. **Arctic Signal**: Clean, cool Scandinavian architectural palette (`#E8F1F0` / `#173337` / `#008C83`)
7. **Plum Archive**: Regal, nuanced deep violet and muted gold (`#21151F` / `#F4E9EF` / `#E4A0B9`)
8. **Industrial Mono**: Raw brutalist technical aesthetic (`#E6E5E0` / `#1B1B1B` / `#EF5836`)
9. **Analog Film**: Nostalgic sepia-tinted cinematic grading (`#29231C` / `#F3E8D2` / `#DBAB57`)
10. **Deep Teal Gallery**: Elegant museum gallery atmosphere (`#092D30` / `#F5F1E6` / `#F4AA78`)

Themes persist across sessions in `localStorage` without resetting active forms or authenticated sessions.

---

## 5. Development & Testing Commands

### Prerequisites
- Node.js `>= 20.0.0` (Node 22 or 24 recommended)
- npm or pnpm

### Environment Setup
Create `.env` using `.env.example`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_SUPABASE_URL=https://...
RESEND_API_KEY=re_...
RESEND_FROM_AUTH=CreaXa Auth <auth@codxa-agency.online>
RESEND_WEBHOOK_SECRET=whsec_...
OTP_HMAC_SECRET=your_pepper_secret
OPENAI_API_KEY=sk-svcacct-...
GEMINI_API_KEY=AQ.Ab8RN6...
```

### Production Build
```bash
cmd.exe /c npx next build
```

### Run End-to-End Test Suite
```bash
cmd.exe /c npx tsx --env-file=.env scripts/test-production-features.mjs
```
*Validates: 10 creator references, cryptographic OTP generation, HMAC timing-safe comparison, Resend email dispatch, Svix webhook verification, live API endpoints (62 assertions).*

---

## 6. Project Documentation Index

- [Pre-Migration Audit](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/docs/pre-migration-audit.md)
- [Animation System & Motion Design](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/docs/animation-system.md)
- [Supabase Core Schema Migration](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/supabase/migrations/20261013000000_init_supabase_schema.sql)
- [Email OTP, Push & References Migration](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/supabase/migrations/20261014000000_email_otp_push_references.sql)
- [Dual-AI Brief Extraction Engine](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/lib/ai.ts)
- [10 Genuine AI Creators Dataset](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/lib/creators/external-references.ts)
- [Resend Webhook Handler](file:///c:/Users/ashuc/OneDrive/Desktop/CreaXa/lib/email/webhook.ts)
