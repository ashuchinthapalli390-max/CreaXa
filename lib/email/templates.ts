// ==============================================================================
// CREAXA — BRANDED TRANSACTIONAL EMAIL TEMPLATES
// ==============================================================================
// Dark editorial aesthetic, accessible typography, mobile-responsive layout.
// Generates both rich HTML and fallback plain text.
// ==============================================================================

export interface EmailRenderOutput {
  subject: string;
  html: string;
  text: string;
}

const EMAIL_BASE_CSS = `
  body { margin: 0; padding: 0; background-color: #0b0c0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed; }
  .email-container { max-width: 580px; margin: 40px auto; background-color: #121316; border: 1px solid #23252a; border-radius: 8px; overflow: hidden; }
  .header { padding: 32px 36px 24px; border-bottom: 1px solid #23252a; }
  .wordmark { font-size: 20px; font-weight: 800; letter-spacing: -0.04em; color: #ffffff; text-decoration: none; }
  .wordmark-dot { color: #d4ff00; }
  .content { padding: 36px; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #ffffff; letter-spacing: -0.02em; }
  p { font-size: 14.5px; line-height: 1.65; color: #a1a1aa; margin: 0 0 20px; }
  .otp-box { background-color: #18191d; border: 1px solid #2b2e35; border-radius: 6px; padding: 22px; text-align: center; margin: 28px 0; }
  .otp-code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.28em; color: #d4ff00; margin: 0; }
  .otp-note { font-size: 12px; color: #71717a; margin: 10px 0 0; }
  .btn { display: inline-block; background-color: #d4ff00; color: #0b0c0e; padding: 12px 24px; border-radius: 4px; font-weight: 700; font-size: 13.5px; text-decoration: none; margin: 12px 0 20px; }
  .footer { padding: 24px 36px; border-top: 1px solid #23252a; background-color: #0e0f12; text-align: center; font-size: 11.5px; color: #52525b; line-height: 1.5; }
  .footer a { color: #a1a1aa; text-decoration: underline; }
`;

export function renderVerificationOtpEmail(code: string, expiresInMinutes = 5): EmailRenderOutput {
  const subject = `Your CreaXa verification code: ${code}`;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_BASE_CSS}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="https://creaxa.com" class="wordmark">CreaXa<span class="wordmark-dot">.</span></a>
    </div>
    <div class="content">
      <h1>Verify your email address</h1>
      <p>Use the six-digit verification code below to complete your CreaXa account registration. This code expires in ${expiresInMinutes} minutes.</p>
      
      <div class="otp-box">
        <div class="otp-code">${code}</div>
        <div class="otp-note">Valid for one-time verification only. Never share this code.</div>
      </div>

      <p>If you did not request this verification code, you can safely ignore this email. No account changes have been made.</p>
    </div>
    <div class="footer">
      © 2026 CreaXa • The Creative Direction & AI Talent Marketplace<br>
      Automated transactional email. Please do not reply directly.
    </div>
  </div>
</body>
</html>`;

  const text = `CreaXa Verification Code: ${code}

Use this six-digit code to verify your email address on CreaXa.
This code expires in ${expiresInMinutes} minutes and can only be used once.

Code: ${code}

If you did not request this code, you can safely ignore this message.`;

  return { subject, html, text };
}

export function renderLoginStepUpOtpEmail(code: string, expiresInMinutes = 5): EmailRenderOutput {
  const subject = `Security Login Code: ${code} — CreaXa`;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_BASE_CSS}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="https://creaxa.com" class="wordmark">CreaXa<span class="wordmark-dot">.</span></a>
    </div>
    <div class="content">
      <h1>Second-Step Login Verification</h1>
      <p>A sign-in request to your CreaXa account requires secondary confirmation. Enter the six-digit code below to access your dashboard:</p>
      
      <div class="otp-box">
        <div class="otp-code">${code}</div>
        <div class="otp-note">Expires in ${expiresInMinutes} minutes • Single-use</div>
      </div>

      <p>If you did not attempt to sign in, your password may have been compromised. Please reset your password immediately.</p>
    </div>
    <div class="footer">
      © 2026 CreaXa • Automated Security Alert<br>
      Never share security codes with anyone.
    </div>
  </div>
</body>
</html>`;

  const text = `CreaXa Login Security Code: ${code}

A sign-in request to your account requires secondary confirmation.
Code: ${code} (Expires in ${expiresInMinutes} minutes).

If you did not initiate this login, please reset your password immediately.`;

  return { subject, html, text };
}

export function renderWelcomeEmail(name: string, role: string): EmailRenderOutput {
  const subject = `Welcome to CreaXa, ${name}`;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_BASE_CSS}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="https://creaxa.com" class="wordmark">CreaXa<span class="wordmark-dot">.</span></a>
    </div>
    <div class="content">
      <h1>Welcome to CreaXa, ${name}</h1>
      <p>Your account is now verified. As a <strong>${role === 'creator' ? 'Creative Partner' : 'Brand Client'}</strong>, you now have access to:</p>
      <p>• Verified creative workflows & tool audits<br>
      • Structured briefs with locked commercial rights<br>
      • Milestone-based production workspaces</p>

      <a href="https://creaxa.com/discover" class="btn">Explore Directory</a>
    </div>
    <div class="footer">
      © 2026 CreaXa • Creative Talent Without the Guesswork.
    </div>
  </div>
</body>
</html>`;

  const text = `Welcome to CreaXa, ${name}!
Your account has been verified. Visit https://creaxa.com to access your workspace.`;

  return { subject, html, text };
}

export function renderInvitationEmail(creatorName: string, brandName: string, campaignTitle: string): EmailRenderOutput {
  const subject = `New Campaign Invitation: "${campaignTitle}" — CreaXa`;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_BASE_CSS}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="https://creaxa.com" class="wordmark">CreaXa<span class="wordmark-dot">.</span></a>
    </div>
    <div class="content">
      <h1>You have a new project invitation</h1>
      <p>Hello ${creatorName}, <strong>${brandName}</strong> has invited you to collaborate on the campaign <strong>"${campaignTitle}"</strong>.</p>
      <p>The structured brief, deliverables, turnaround expectations, and commercial scope are ready for your review in your workspace inbox.</p>

      <a href="https://creaxa.com/app/creator/invitations" class="btn">Review Terms & Brief</a>
    </div>
    <div class="footer">
      © 2026 CreaXa • Project terms and revisions are protected by CreaXa project agreements.
    </div>
  </div>
</body>
</html>`;

  const text = `New Campaign Invitation from ${brandName}: "${campaignTitle}"
Log in to review the terms and structured brief: https://creaxa.com/app/creator/invitations`;

  return { subject, html, text };
}
