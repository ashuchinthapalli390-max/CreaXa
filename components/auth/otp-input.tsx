'use client';

import React, { useRef, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export type OtpClusterMode =
  | 'idle'
  | 'verifying'
  | 'first_success'
  | 'first_failure'
  | 'second_success'
  | 'second_failure';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  mode?: OtpClusterMode;
  onComplete?: (code: string) => void;
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  mode = 'idle',
  onComplete
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (mode === 'idle') {
      const firstEmpty = digits.findIndex(d => !d);
      const targetIdx = firstEmpty === -1 ? 5 : firstEmpty;
      inputRefs.current[targetIdx]?.focus();
    }
  }, [mode]);

  const isLocked = disabled || mode !== 'idle';

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLocked) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join('').trim());
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join('').trim());
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const newCode = newDigits.join('');
    onChange(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.length === 6) {
      onComplete?.(newCode);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isLocked) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();

    if (pasted.length === 6) {
      onComplete?.(pasted);
    }
  };

  const clusterClass = `cinematic-otp-cluster is-${mode.replace('_', '-')} ${hasError ? 'otp-shake-error' : ''}`;

  return (
    <div
      className={clusterClass}
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, idx) => {
        const isCurrentActive = digits.findIndex(d => !d) === idx && mode === 'idle';
        return (
          <input
            key={idx}
            ref={el => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={e => handleInput(idx, e)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={isLocked}
            style={{ '--cell-idx': idx } as React.CSSProperties}
            className={`cinematic-otp-cell cell-idx-${idx} ${digit ? 'filled' : ''} ${isCurrentActive ? 'active' : ''}`}
            aria-label={`Digit ${idx + 1} of 6`}
          />
        );
      })}

      {/* Cinematic Central Reveal Overlays */}
      {mode === 'first_success' && (
        <div className="cinematic-overlay-reveal" aria-live="assertive">
          <div className="cinematic-overlay-badge success-badge">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="cinematic-overlay-title success-text">AUTH SUCCESS</h3>
          <p className="cinematic-overlay-sub">Email verified successfully</p>
        </div>
      )}

      {mode === 'second_success' && (
        <div className="cinematic-overlay-reveal" aria-live="assertive">
          <div className="cinematic-overlay-badge success-badge">
            <CheckCircle2 size={34} />
          </div>
          <h3 className="cinematic-overlay-title success-text">2ND AUTH SUCCESS</h3>
          <p className="cinematic-overlay-sub">Verification successful on your second attempt</p>
        </div>
      )}

      {mode === 'first_failure' && (
        <div className="cinematic-overlay-reveal" aria-live="assertive">
          <div className="cinematic-overlay-badge failure-badge">
            <AlertCircle size={30} />
          </div>
          <h3 className="cinematic-overlay-title failure-text">AUTH FAILED</h3>
          <p className="cinematic-overlay-sub" style={{ letterSpacing: '0.12em', fontWeight: 700 }}>TRY AGAIN</p>
        </div>
      )}

      {mode === 'second_failure' && (
        <div className="cinematic-overlay-reveal" aria-live="assertive">
          <div className="cinematic-overlay-badge failure-badge">
            <AlertCircle size={32} />
          </div>
          <h3 className="cinematic-overlay-title failure-text">AUTH FAILED</h3>
          <p className="cinematic-overlay-sub" style={{ color: '#ffb3b3', fontWeight: 600 }}>TRY AGAIN WITH NEW OTP</p>
        </div>
      )}
    </div>
  );
}

export default OtpInput;
