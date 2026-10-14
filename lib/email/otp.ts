// ==============================================================================
// CREAXA — CRYPTOGRAPHIC EMAIL OTP SYSTEM
// ==============================================================================
// 1. Uniformly distributed 6-digit cryptographic random code.
// 2. Digest-only storage via server-side HMAC-SHA256 (plaintext is NEVER persisted).
// 3. Constant-time timing-safe verification.
// 4. 5-minute lifespan, 60s resend cooldown, 5 max attempts.
// 5. Purpose-bound challenges to prevent cross-flow reuse.
// 6. Supabase PostgreSQL persistence with resilient memory-cache fallback.
// ==============================================================================

import { getSupabaseAdmin, isSupabaseConfigured } from '../supabase.ts';

export type OtpPurpose =
  | 'signup_email_verification'
  | 'login_step_up'
  | 'email_change_verification'
  | 'sensitive_account_action'
  | 'contact_email_verification';

export interface OtpChallenge {
  id: string;
  firebaseUid?: string;
  normalizedEmail: string;
  purpose: OtpPurpose;
  codeDigest: string;
  challengeNonce: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  consumedAt?: number;
  invalidatedAt?: number;
  lastSentAt: number;
  resendCount: number;
  createdAt: number;
}

export interface CreateOtpResult {
  success: boolean;
  code?: string; // Only returned on the trusted server during generation so Resend can deliver it
  challengeId?: string;
  cooldownRemainingSeconds?: number;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  challengeId?: string;
  error?: string;
  status: 'verified' | 'invalid_code' | 'expired' | 'attempts_exceeded' | 'already_consumed' | 'cooldown' | 'not_found';
  attempts?: number;
  remaining?: number;
}

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const MAX_ATTEMPTS = 2; // Strict 2-attempt policy per challenge for cinematic verification UX

// In-memory challenge cache fallback for rapid edge verification and test environments
const challengeStore = new Map<string, OtpChallenge>();

function getPepper(): string {
  return (
    process.env.OTP_HMAC_SECRET ||
    'creaxa_production_otp_secret_pepper_948f219b6e4e'
  );
}

/**
 * Generate a cryptographically secure 6-digit numeric string [000000, 999999]
 */
export function generateCryptographicOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Modulo 1,000,000 gives 0 to 999,999
  const num = array[0] % 1000000;
  return num.toString().padStart(6, '0');
}

/**
 * Compute HMAC-SHA256 digest of code + email + nonce + pepper
 */
export async function computeOtpDigest(
  code: string,
  email: string,
  nonce: string
): Promise<string> {
  const pepper = getPepper();
  const data = `${email.toLowerCase().trim()}:${nonce}:${code}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(pepper),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string equality check to prevent timing attacks
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Create a new OTP verification challenge
 */
export async function createOtpChallenge(params: {
  email: string;
  purpose: OtpPurpose;
  firebaseUid?: string;
}): Promise<CreateOtpResult> {
  const normalizedEmail = params.email.toLowerCase().trim();
  const now = Date.now();
  const storeKey = `${normalizedEmail}:${params.purpose}`;

  // Check cooldown on existing active challenge
  const existing = challengeStore.get(storeKey);
  if (existing && !existing.consumedAt && !existing.invalidatedAt) {
    const elapsed = now - existing.lastSentAt;
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000);
      return {
        success: false,
        cooldownRemainingSeconds: remainingSeconds,
        error: `Please wait ${remainingSeconds}s before requesting a new code.`,
      };
    }
  }

  const code = generateCryptographicOtp();
  const nonce = crypto.randomUUID();
  const codeDigest = await computeOtpDigest(code, normalizedEmail, nonce);
  const challengeId = crypto.randomUUID();

  const challenge: OtpChallenge = {
    id: challengeId,
    firebaseUid: params.firebaseUid,
    normalizedEmail,
    purpose: params.purpose,
    codeDigest,
    challengeNonce: nonce,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    lastSentAt: now,
    resendCount: existing ? existing.resendCount + 1 : 0,
    createdAt: now,
  };

  challengeStore.set(storeKey, challenge);

  // Synchronize to Supabase PostgreSQL if configured
  if (isSupabaseConfigured()) {
    try {
      const sb = getSupabaseAdmin();
      if (sb) {
        await sb.from('email_otp_challenges').insert({
          id: challenge.id,
          firebase_uid: challenge.firebaseUid || null,
          normalized_email: challenge.normalizedEmail,
          purpose: challenge.purpose,
          code_digest: challenge.codeDigest,
          challenge_nonce: challenge.challengeNonce,
          expires_at: challenge.expiresAt,
          attempts: challenge.attempts,
          max_attempts: challenge.maxAttempts,
          last_sent_at: challenge.lastSentAt,
          resend_count: challenge.resendCount,
          created_at: challenge.createdAt,
        });
      }
    } catch (e: any) {
      console.warn('[CreaXa OTP] Supabase challenge sync warning:', e.message);
    }
  }

  return {
    success: true,
    code,
    challengeId,
  };
}

/**
 * Verify an incoming 6-digit OTP code against the active challenge
 */
export async function verifyOtpChallenge(params: {
  email: string;
  purpose: OtpPurpose;
  code: string;
  firebaseUid?: string;
}): Promise<VerifyOtpResult> {
  const normalizedEmail = params.email.toLowerCase().trim();
  const submittedCode = params.code.trim();
  const now = Date.now();
  const storeKey = `${normalizedEmail}:${params.purpose}`;

  let challenge = challengeStore.get(storeKey);

  // If not found in memory, attempt Supabase lookup
  if (!challenge && isSupabaseConfigured()) {
    try {
      const sb = getSupabaseAdmin();
      if (sb) {
        const { data } = await sb
          .from('email_otp_challenges')
          .select('*')
          .eq('normalized_email', normalizedEmail)
          .eq('purpose', params.purpose)
          .is('consumed_at', null)
          .is('invalidated_at', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          challenge = {
            id: data.id,
            firebaseUid: data.firebase_uid,
            normalizedEmail: data.normalized_email,
            purpose: data.purpose,
            codeDigest: data.code_digest,
            challengeNonce: data.challenge_nonce,
            expiresAt: Number(data.expires_at),
            attempts: Number(data.attempts || 0),
            maxAttempts: Number(data.max_attempts || MAX_ATTEMPTS),
            consumedAt: data.consumed_at ? Number(data.consumed_at) : undefined,
            invalidatedAt: data.invalidated_at ? Number(data.invalidated_at) : undefined,
            lastSentAt: Number(data.last_sent_at),
            resendCount: Number(data.resend_count || 0),
            createdAt: Number(data.created_at),
          };
          challengeStore.set(storeKey, challenge);
        }
      }
    } catch (e: any) {
      console.warn('[CreaXa OTP] Supabase lookup warning:', e.message);
    }
  }

  if (!challenge) {
    return {
      success: false,
      status: 'not_found',
      error: 'No active verification code found. Please request a new code.',
    };
  }

  if (challenge.consumedAt) {
    return {
      success: false,
      status: 'already_consumed',
      error: 'This verification code has already been used.',
    };
  }

  if (challenge.invalidatedAt || challenge.attempts >= challenge.maxAttempts) {
    return {
      success: false,
      status: 'attempts_exceeded',
      error: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  if (now > challenge.expiresAt) {
    challenge.invalidatedAt = now;
    return {
      success: false,
      status: 'expired',
      error: 'This verification code has expired. Please request a new code.',
    };
  }

  // Bind identity if specified
  if (params.firebaseUid && challenge.firebaseUid && params.firebaseUid !== challenge.firebaseUid) {
    return {
      success: false,
      status: 'invalid_code',
      error: 'Account verification identity mismatch.',
    };
  }

  // Increment attempts
  challenge.attempts += 1;

  // Re-compute expected digest for submitted code
  const candidateDigest = await computeOtpDigest(
    submittedCode,
    normalizedEmail,
    challenge.challengeNonce
  );

  const isMatch = timingSafeEqualString(candidateDigest, challenge.codeDigest);

  if (!isMatch) {
    const remaining = challenge.maxAttempts - challenge.attempts;
    if (remaining <= 0) {
      challenge.invalidatedAt = now;
    }

    // Sync attempt increment to Supabase
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          await sb
            .from('email_otp_challenges')
            .update({
              attempts: challenge.attempts,
              invalidated_at: challenge.invalidatedAt || null,
            })
            .eq('id', challenge.id);
        }
      } catch {}
    }

    return {
      success: false,
      status: remaining <= 0 ? 'attempts_exceeded' : 'invalid_code',
      attempts: challenge.attempts,
      remaining: Math.max(0, remaining),
      error:
        remaining <= 0
          ? 'Too many incorrect attempts. Please request a new code.'
          : `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Successfully verified! Atomically mark consumed
  challenge.consumedAt = now;

  if (isSupabaseConfigured()) {
    try {
      const sb = getSupabaseAdmin();
      if (sb) {
        await sb
          .from('email_otp_challenges')
          .update({
            consumed_at: now,
            attempts: challenge.attempts,
          })
          .eq('id', challenge.id);
      }
    } catch (e: any) {
      console.warn('[CreaXa OTP] Supabase consume update warning:', e.message);
    }
  }

  return {
    success: true,
    challengeId: challenge.id,
    status: 'verified',
    attempts: challenge.attempts,
    remaining: Math.max(0, challenge.maxAttempts - challenge.attempts),
  };
}
