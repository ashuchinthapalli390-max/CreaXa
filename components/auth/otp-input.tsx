'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  isSuccess?: boolean;
  onComplete?: (code: string) => void;
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  isSuccess = false,
  onComplete
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first empty box or first box on mount
    const firstEmpty = digits.findIndex(d => !d);
    const targetIdx = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[targetIdx]?.focus();
  }, []);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isSuccess) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        // Clear current digit
        const newDigits = [...digits];
        newDigits[index] = '';
        const newValue = newDigits.join('').trim();
        onChange(newValue);
      } else if (index > 0) {
        // Move to previous and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        const newValue = newDigits.join('').trim();
        onChange(newValue);
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
    if (disabled || isSuccess) return;
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
    if (disabled || isSuccess) return;
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

  return (
    <div
      className={`otp-digit-cluster ${hasError ? 'otp-shake-error' : ''} ${isSuccess ? 'otp-success-glow' : ''}`}
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, idx) => {
        const isCurrentActive = digits.findIndex(d => !d) === idx;
        return (
          <div key={idx} className="otp-digit-wrapper">
            <input
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
              disabled={disabled}
              className={`otp-digit-cell ${digit ? 'filled' : ''} ${isCurrentActive ? 'active' : ''} ${hasError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}
              aria-label={`Digit ${idx + 1} of 6`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default OtpInput;
