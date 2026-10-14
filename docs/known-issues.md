# CreaXa — Known Issues & Architectural Constraints

This document provides a transparent, truthful assessment of current architectural boundaries, external dependencies, and planned enhancements for CreaXa.

---

## 1. External Creator Reference Boundaries
- **Editorial Nature:**  
  The 10 prominent artists (Paul Trillo, Refik Anadol, niceaunties, Claire Silver, Roope Rainisto, Sasha Stiles, Kris Kashtanova, Anna Ridler, Sougwen Chung, Karen X. Cheng) are incorporated as **Public Editorial References**.
- **No Direct In-App Invitations:**  
  Because these artists have not signed up as registered platform creators, the invitation system is intentionally disabled on their profiles. Users are provided direct links to their official websites and portfolios instead.
- **Media Embed Rights:**  
  Original videos (such as Paul Trillo's *The Hardest Parts* and *Thank You For Not Answering*) use official Vimeo embeds with fallback links to the artist's portfolio. No copyrighted files are downloaded or rehosted without explicit permission.

---

## 2. Browser & Video Embed Policies
- **Third-Party Cookies & Tracking Protection:**  
  Modern browsers (Brave, Safari, Chrome with Enhanced Privacy) may occasionally block third-party iframe cookies from video platforms (Vimeo, YouTube).
- **Graceful Fallback:**  
  The `VideoEmbed` component (`components/ui/video-embed.tsx`) detects when an embed fails to load or is blocked and renders an editorial fallback card with an "Open on Original Site" CTA, avoiding empty or broken black boxes.
- **Audio Autoplay:**  
  Per web accessibility and modern browser autoplay policies, all video embeds start muted or require direct user interaction before playing audio.

---

## 3. Database & Authentication State
- **Preserved Real User Data:**  
  Real user accounts in Supabase (e.g. `uSbzMByCm7My7TIcndYfs293sH73` / `ashuchinthapalli3900@gmail.com` and `5v9BgAf4ROftCFzDuwBiFnYPKeV2` / `vyshu@company.com`) are preserved. Synthetic test seeds (`brand_acme`, `creator_alice`) are isolated and never conflated with genuine creators.
- **Multi-Factor Authentication (MFA):**  
  Admin route protection relies on Firebase custom claims, secret token verification, and server-side authorization. Production environments require MFA enablement on Firebase console.

---

## 4. Notifications (Resend & Firebase Push)
- **Resend Email Delivery:**  
  Uses server-side REST API with cryptographic HMAC-SHA256 OTP challenges. Rate limits and 60-second cooldowns are enforced. If `RESEND_API_KEY` is not present in local test environments, the engine gracefully falls back to mock delivery mode while maintaining cryptographically valid verification challenges.
- **Web Push (FCM):**  
  Web push notifications require user permission opt-in and active browser service worker support.

---

## 5. Escrow & Contract Payments (Roadmap v2.0)
- **Current State:**  
  Full campaign brief creation, matching score explanation, creator invitation, deliverable upload, revision cycles, and approval workflow are fully implemented in the database and UI.
- **v2.0 Milestone:**  
  Stripe Connect / Razorpay marketplace escrow settlement integration is architected for Phase 2, currently represented via simulated financial commitment holds upon campaign approval.
