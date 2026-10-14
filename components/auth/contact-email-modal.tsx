'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, ArrowRight, X, AlertCircle, RefreshCw, ShieldCheck, RotateCcw } from 'lucide-react';
import { OtpInput, type OtpClusterMode } from './otp-input';

interface ContactEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: (email: string) => void;
  initialEmail?: string;
  isDismissable?: boolean;
}

export function ContactEmailModal({
  isOpen,
  onClose,
  onVerified,
  initialEmail = '',
  isDismissable = true
}: ContactEmailModalProps) {
  const [step, setStep] = useState<'enter_email' | 'verify_otp' | 'success'>('enter_email');
  const [otpMode, setOtpMode] = useState<OtpClusterMode>('idle');
  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose: 'contact_email_verification'
        })
      });
      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }
      setStep('verify_otp');
      setOtpMode('idle');
      setAttemptCount(0);
      setCooldown(60);
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Could not send verification code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    if (busy || otpMode !== 'idle') return;

    setBusy(true);
    setOtpMode('verifying');
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          purpose: 'contact_email_verification'
        })
      });
      const data: any = await res.json();

      if (res.ok && data.success) {
        // Backend confirmed verification!
        const isSecondAttemptSuccess = attemptCount > 0;
        const targetMode: OtpClusterMode = isSecondAttemptSuccess ? 'second_success' : 'first_success';
        setOtpMode(targetMode);

        // Hold cinematic reveal readable (~1200ms) then advance to success state
        animTimerRef.current = setTimeout(() => {
          setStep('success');
          onVerified?.(email.trim().toLowerCase());
        }, 1250);
      } else {
        // Server rejected the code
        const isFirstFailure = attemptCount === 0 && data.status !== 'attempts_exceeded';

        if (isFirstFailure) {
          // PHASE 13: FIRST FAILED OTP ANIMATION
          setOtpMode('first_failure');
          animTimerRef.current = setTimeout(() => {
            setOtpMode('idle');
            setOtpCode('');
            setAttemptCount(1);
            setError('Invalid code. 1 attempt remaining.');
          }, 1300);
        } else {
          // PHASE 15: SECOND FAILED OTP ATTEMPT (Challenge invalidated)
          setOtpMode('second_failure');
          setAttemptCount(2);
          setError('Challenge invalidated. Please request a new verification code.');
        }
      }
    } catch (err: any) {
      setOtpMode('idle');
      setError(err.message || 'Verification connection failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('creaxa_contact_email_dismissed', '1');
    } catch {}
    onClose();
  };

  return (
    <div className="contact-email-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <div className="contact-email-modal-card">
        {/* Close/Dismiss Button */}
        {isDismissable && step !== 'success' && (
          <button
            type="button"
            className="contact-modal-close-btn"
            onClick={handleDismiss}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === 'enter_email' && (
          <form onSubmit={handleSendCode} className="contact-modal-content step-enter-fade">
            <div className="contact-modal-icon-badge">
              <Mail size={24} className="accent-icon" />
            </div>

            <span className="contact-modal-eyebrow">NOTIFICATION PREFERENCES</span>
            <h2 id="contact-modal-title" className="contact-modal-heading">Stay Connected With CreaXa</h2>
            <p className="contact-modal-desc">
              Add an email address to receive important project updates, campaign invitations, and milestone notifications.
            </p>

            {error && (
              <div className="contact-modal-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="contact-modal-field">
              <label htmlFor="contact-email-input" className="contact-modal-label">Email Address</label>
              <input
                id="contact-email-input"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                disabled={busy}
                required
                className="contact-modal-input"
                autoComplete="email"
              />
            </div>

            <div className="contact-modal-actions">
              <button
                type="submit"
                disabled={busy}
                className="button full-button"
              >
                {busy ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Sending Code…</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {isDismissable && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="contact-modal-secondary-btn"
                >
                  Continue to Dashboard
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY OTP WITH CINEMATIC ANIMATIONS */}
        {step === 'verify_otp' && (
          <div className="contact-modal-content step-verify-fade">
            <div className="contact-modal-icon-badge">
              <ShieldCheck size={24} className="accent-icon" />
            </div>

            <span className="contact-modal-eyebrow">SECURITY CONFIRMATION</span>
            <h2 id="contact-modal-title" className="contact-modal-heading">Verify Your Email</h2>
            <p className="contact-modal-desc">
              Enter the six-digit code sent to <strong style={{ color: 'var(--text)' }}>{email}</strong> via Resend.
            </p>

            {error && otpMode === 'idle' && (
              <div className="contact-modal-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Glowing Six-Digit OTP Cells with Cinematic Merging State Machine */}
            <div className="contact-modal-otp-area">
              <OtpInput
                value={otpCode}
                onChange={val => { setOtpCode(val); setError(''); }}
                disabled={busy}
                hasError={otpMode === 'first_failure' || otpMode === 'second_failure'}
                mode={otpMode}
                onComplete={code => handleVerifyOtp(code)}
              />
            </div>

            {/* Actions & Retry Logic */}
            <div className="contact-modal-actions">
              {otpMode === 'second_failure' ? (
                <button
                  type="button"
                  onClick={() => handleSendCode()}
                  disabled={busy || cooldown > 0}
                  className="button full-button"
                  style={{ background: 'var(--accent)', color: '#000' }}
                >
                  <RotateCcw size={15} />
                  <span>{cooldown > 0 ? `Request New OTP (${cooldown}s)` : 'Request New OTP'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={busy || otpCode.length !== 6 || otpMode !== 'idle'}
                  className="button full-button"
                >
                  {otpMode === 'verifying' ? (
                    <>
                      <RefreshCw size={15} className="spin" />
                      <span>Verifying Code…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              )}

              <div className="contact-modal-otp-subactions">
                <button
                  type="button"
                  onClick={() => handleSendCode()}
                  disabled={busy || cooldown > 0}
                  className="contact-modal-text-action"
                >
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
                </button>
                <span className="divider-dot">•</span>
                <button
                  type="button"
                  onClick={() => { setStep('enter_email'); setError(''); setOtpMode('idle'); }}
                  disabled={busy}
                  className="contact-modal-text-action"
                >
                  Change Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINAL CONFIRMATION */}
        {step === 'success' && (
          <div className="contact-modal-content step-success-fade">
            <div className="contact-modal-success-check">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>

            <span className="contact-modal-eyebrow lime-eyebrow">VERIFICATION COMPLETE</span>
            <h2 id="contact-modal-title" className="contact-modal-heading">Email Verified Successfully</h2>
            <p className="contact-modal-desc">
              Your contact and campaign notification address has been confirmed as <strong style={{ color: 'var(--text)' }}>{email}</strong>.
            </p>

            <div className="contact-modal-actions">
              <button
                type="button"
                onClick={handleDismiss}
                className="button full-button"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactEmailModal;
