// ==============================================================================
// CREAXA — RESEND TRANSACTIONAL EMAIL SERVICE
// ==============================================================================
// Server-side email delivery via native fetch to the Resend REST API.
// Works seamlessly in Node.js, Next.js server actions, and Edge/Worker runtimes.
// ==============================================================================

import {
  renderVerificationOtpEmail,
  renderContactEmailOtpEmail,
  renderLoginStepUpOtpEmail,
  renderWelcomeEmail,
  renderInvitationEmail,
  type EmailRenderOutput,
} from './templates.ts';


export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  idempotencyKey?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

const RESEND_API_URL = 'https://api.resend.com/emails';

function getResendConfig() {
  const apiKey =
    process.env.RESEND_API_KEY ||
    (typeof globalThis !== 'undefined' && (globalThis as any).RESEND_API_KEY) ||
    '';
  const fromAuth =
    process.env.RESEND_FROM_AUTH ||
    'CreaXa Auth <auth@codxa-agency.online>';
  const fromNotifications =
    process.env.RESEND_FROM_NOTIFICATIONS ||
    'CreaXa Notifications <notifications@codxa-agency.online>';

  return { apiKey, fromAuth, fromNotifications };
}

/**
 * Send an email via Resend REST API with safe fallback simulation when API key is missing.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { apiKey, fromNotifications } = getResendConfig();
  const from = options.from || fromNotifications;
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  // If no Resend API key is configured in dev/testing, simulate delivery safely
  if (!apiKey || apiKey.startsWith('re_mock') || apiKey.includes('placeholder')) {
    console.info(
      `[CreaXa Resend Simulation] To: ${toList.join(', ')} | Subject: "${options.subject}"`
    );
    return {
      success: true,
      id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      simulated: true,
    };
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    const payload = {
      from,
      to: toList,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags,
    };

    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const body: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = body?.message || body?.error || `Resend HTTP error ${res.status}`;
      console.warn(`[CreaXa Resend] Send failed: ${errMsg}`);
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      id: body.id,
    };
  } catch (err: any) {
    console.error('[CreaXa Resend] Network or dispatch error:', err);
    return {
      success: false,
      error: err.message || 'Email delivery failed',
    };
  }
}

/**
 * Send 6-Digit Email Verification OTP for Signup
 */
export async function sendSignupVerificationOTP(
  email: string,
  code: string,
  expiresInMinutes = 5
): Promise<SendEmailResult> {
  const { fromAuth } = getResendConfig();
  const rendered = renderVerificationOtpEmail(code, expiresInMinutes);

  return sendEmail({
    to: email,
    from: fromAuth,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: 'category', value: 'signup_otp' }],
    idempotencyKey: `otp_signup_${email}_${Date.now()}`,
  });
}

/**
 * Send 6-Digit Contact Email Verification OTP (Section 5 & 6)
 */
export async function sendContactEmailVerificationOTP(
  email: string,
  code: string,
  expiresInMinutes = 5
): Promise<SendEmailResult> {
  const { fromAuth } = getResendConfig();
  const rendered = renderContactEmailOtpEmail(code, expiresInMinutes);

  return sendEmail({
    to: email,
    from: fromAuth,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: 'category', value: 'contact_email_otp' }],
    idempotencyKey: `otp_contact_${email}_${Date.now()}`,
  });
}

/**
 * Send 6-Digit Login Step-Up OTP
 */
export async function sendLoginStepUpOTP(
  email: string,
  code: string,
  expiresInMinutes = 5
): Promise<SendEmailResult> {
  const { fromAuth } = getResendConfig();
  const rendered = renderLoginStepUpOtpEmail(code, expiresInMinutes);

  return sendEmail({
    to: email,
    from: fromAuth,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: 'category', value: 'login_otp' }],
    idempotencyKey: `otp_login_${email}_${Date.now()}`,
  });
}

/**
 * Send Welcome Email once email is verified
 */
export async function sendWelcomeEmailNotification(
  email: string,
  userName = 'Creator',
  role = 'creator'
): Promise<SendEmailResult> {
  const { fromNotifications } = getResendConfig();
  const rendered = renderWelcomeEmail(userName, role);

  return sendEmail({
    to: email,
    from: fromNotifications,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: 'category', value: 'welcome' }],
  });
}

/**
 * Send Invitation Email to a creator
 */
export async function sendInvitationNotificationEmail(params: {
  creatorEmail: string;
  creatorName?: string;
  brandName: string;
  campaignTitle: string;
}): Promise<SendEmailResult> {
  const { fromNotifications } = getResendConfig();
  const rendered = renderInvitationEmail(
    params.creatorName || 'Creative Partner',
    params.brandName,
    params.campaignTitle
  );

  return sendEmail({
    to: params.creatorEmail,
    from: fromNotifications,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: 'category', value: 'invitation' }],
  });
}
