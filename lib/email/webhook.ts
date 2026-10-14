// ==============================================================================
// CREAXA — RESEND WEBHOOK HANDLER & SIGNATURE VERIFICATION
// ==============================================================================
// Validates Svix-compatible webhook signatures (HMAC-SHA256) sent by Resend.
// Updates notification delivery statuses and records delivery telemetry.
// ==============================================================================

import { isSupabaseConfigured, getSupabaseAdmin } from '../supabase';

export interface ResendWebhookEvent {
  type:
    | 'email.sent'
    | 'email.delivered'
    | 'email.delivery_delayed'
    | 'email.complained'
    | 'email.bounced'
    | 'email.opened'
    | 'email.clicked'
    | string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    bounce_type?: string;
    click?: { link: string };
    [key: string]: any;
  };
}

/**
 * Verify incoming Svix signature from Resend webhook headers
 */
export async function verifyResendWebhookSignature(
  rawBody: string,
  headers: Headers | Record<string, string | null | undefined>,
  secret?: string
): Promise<boolean> {
  const signingSecret =
    secret ||
    process.env.RESEND_WEBHOOK_SECRET ||
    '';

  if (!signingSecret) {
    console.warn('[CreaXa Webhook] RESEND_WEBHOOK_SECRET not configured. Bypassing verification in dev.');
    return true;
  }

  const getHeader = (name: string): string | null => {
    if (typeof (headers as any).get === 'function') {
      return (headers as Headers).get(name);
    }
    return (headers as Record<string, string>)[name] || null;
  };

  const svixId = getHeader('svix-id');
  const svixTimestamp = getHeader('svix-timestamp');
  const svixSignature = getHeader('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('[CreaXa Webhook] Missing required Svix headers');
    return false;
  }

  // Check timestamp drift (5 minute tolerance to prevent replay attacks)
  const ts = parseInt(svixTimestamp, 10);
  const nowSec = Math.floor(Date.now() / 1000);
  if (isNaN(ts) || Math.abs(nowSec - ts) > 300) {
    console.warn('[CreaXa Webhook] Webhook timestamp outside allowed 5-minute tolerance');
    return false;
  }

  try {
    const rawSecret = signingSecret.startsWith('whsec_')
      ? signingSecret.slice(6)
      : signingSecret;

    const enc = new TextEncoder();
    // Decode base64 secret to binary
    const binarySecret = Uint8Array.from(atob(rawSecret), (c) => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      'raw',
      binarySecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signedPayload = `${svixId}.${svixTimestamp}.${rawBody}`;
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(signedPayload));
    const computedBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const signatures = svixSignature
      .split(' ')
      .map((s) => (s.startsWith('v1,') ? s.slice(3) : s));

    return signatures.some((sig) => sig === computedBase64);
  } catch (err: any) {
    console.error('[CreaXa Webhook] Signature verification caught error:', err);
    return false;
  }
}

/**
 * Handle incoming verified Resend webhook event and update database records
 */
export async function handleResendWebhookEvent(event: ResendWebhookEvent): Promise<{
  processed: boolean;
  status: string;
}> {
  const emailId = event.data?.email_id;
  const eventType = event.type;

  console.info(`[CreaXa Webhook] Received ${eventType} for message: ${emailId}`);

  let state = 'sent';
  if (eventType === 'email.delivered') state = 'delivered';
  else if (eventType === 'email.bounced' || eventType === 'email.failed') state = 'failed';
  else if (eventType === 'email.complained') state = 'complained';

  if (emailId && isSupabaseConfigured()) {
    try {
      const sb = getSupabaseAdmin();
      if (sb) {
        // Update notification_deliveries if tracked
        await sb
          .from('notification_deliveries')
          .update({
            state,
            delivered_at: state === 'delivered' ? Date.now() : null,
            last_error_code: event.data?.bounce_type || null,
          })
          .eq('provider_message_id', emailId);

        // Record audit / telemetry event
        await sb.from('notification_events').insert({
          id: crypto.randomUUID(),
          event_type: eventType,
          actor_uid: 'system_resend',
          target_type: 'email',
          target_id: emailId,
          payload: event,
          created_at: Date.now(),
        });
      }
    } catch (e: any) {
      console.warn('[CreaXa Webhook] Database update warning:', e.message);
    }
  }

  return { processed: true, status: state };
}
