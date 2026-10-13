# CreaXa — Firebase Authentication Setup Guide

## 1. Executive Summary

CreaXa utilizes **Firebase Authentication** as its primary user identity gateway. Under the approved production architecture:
- **Enabled Providers**: **Email/Password** and **Google OAuth**
- **Explicitly Excluded**: Microsoft, Apple, GitHub, Phone OTP (Microsoft is completely removed from scope)
- **Firebase Project ID**: `creaxa-6e7bc`
- **Application Database Mapping**: The stable Firebase UID (`sub`) maps directly to `public.accounts.id TEXT PRIMARY KEY` in Supabase PostgreSQL.

---

## 2. Firebase Console Configuration

### 2.1 Project Verification
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Select or verify project **`creaxa-6e7bc`**.
3. Under **Project Settings** > **General**, verify the registered Web App:
   - **App ID**: `1:641625441345:web:8f922b61d009c6df25f2c0`
   - **Sender ID**: `641625441345`

### 2.2 Sign-In Method Activation
Navigate to **Authentication** > **Sign-in method**:
1. **Email/Password**:
   - Status: **Enabled**
   - Email link (passwordless sign-in): Optional (disabled by default)
2. **Google**:
   - Status: **Enabled**
   - Project support email: Select your project administrator email.
3. **Microsoft Authentication**:
   - Status: **DISABLED / REMOVED FROM SCOPE**
   - All Microsoft Entra app registrations and provider buttons have been decommissioned.

### 2.3 Authorized Domains
Under **Authentication** > **Settings** > **Authorized domains**, ensure the following origins are listed:
- `localhost`
- `127.0.0.1`
- `creaxa-6e7bc.firebaseapp.com`
- `creaxa-6e7bc.web.app`
- Your production domain (e.g. `creaxa.com`, `*.workers.dev`)

---

## 3. Client & Edge Integration Architecture

### 3.1 Modular Web SDK (`lib/firebase.ts`)
The client app uses the modular Firebase v12 SDK:
```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBjfKTxCM8rts9srwXSvWluomgIRUPrhRs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "creaxa-6e7bc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "creaxa-6e7bc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "creaxa-6e7bc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "641625441345",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:641625441345:web:8f922b61d009c6df25f2c0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F82JG95L1J"
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
```

### 3.2 Edge JWT Verification (`lib/auth-edge.ts`)
Cloudflare Workers run in V8 isolates without Node.js `crypto` or `firebase-admin`. We verify Firebase ID tokens using the native **Web Crypto API** (`crypto.subtle`):
1. Downloads Google's public x509 certs from `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`.
2. Verifies RS256 signatures, audience (`creaxa-6e7bc`), issuer (`https://securetoken.google.com/creaxa-6e7bc`), and expiry.
3. Automatically sets session cookies (`__session`) across edge API routes.

---

## 4. User Onboarding & Role Separation

1. **First-time User Flow**:
   User signs up via Email or Google $\to$ Token minted $\to$ Session synced via `/api/auth/session` $\to$ Redirected to `/onboarding`.
2. **Role Selection**:
   - **I'm an AI Creator**: Creator onboarding (Specializations, AI Tools, Portfolio, Starting Rate, Currency).
   - **I'm a Brand / Agency**: Organization onboarding (Company Name, Industry, Website, Goals).
3. **Role Persistence**:
   Business roles (`creator`, `brand`) are strictly enforced server-side and recorded in the database, avoiding client-side role manipulation.
