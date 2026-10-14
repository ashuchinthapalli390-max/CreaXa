'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimatedCheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  ariaLabel?: string;
}

export function AnimatedCheckbox({
  id: explicitId,
  name,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  onCheckedChange,
  disabled = false,
  required = false,
  indeterminate = false,
  label,
  description,
  className,
  'aria-label': ariaLabelProp,
  ariaLabel: ariaLabelAlt,
}: AnimatedCheckboxProps) {
  const generatedId = React.useId();
  const id = explicitId || generatedId;

  const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const toggle = React.useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
    onCheckedChange?.(next);
  }, [disabled, isChecked, isControlled, onChange, onCheckedChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggle();
    }
  };

  const effectiveAriaLabel = ariaLabelProp || ariaLabelAlt || (typeof label === 'string' ? label : undefined);

  return (
    <div className={cn('animated-checkbox-wrapper animated-checkbox-root', disabled && 'is-disabled', className)}>
      <div
        role="checkbox"
        id={id}
        tabIndex={disabled ? -1 : 0}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        aria-required={required}
        aria-disabled={disabled}
        aria-label={effectiveAriaLabel}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'animated-checkbox-box',
          isChecked && 'is-checked',
          indeterminate && 'is-indeterminate'
        )}
      >
        <span className="checkbox-indicator-icon" aria-hidden="true">
          {indeterminate ? (
            <Minus size={13} strokeWidth={3} className="minus-icon" />
          ) : (
            <Check size={13} strokeWidth={3} className={cn('check-icon', isChecked && 'visible')} />
          )}
        </span>
      </div>

      {/* Hidden native input for standard form submission if needed */}
      {name && (
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          required={required}
          disabled={disabled}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
      )}

      {(label || description) && (
        <div className="checkbox-label-block" onClick={toggle}>
          {label && <label htmlFor={id} className="checkbox-main-label">{label}</label>}
          {description && <p className="checkbox-desc-text">{description}</p>}
        </div>
      )}
    </div>
  );
}

export default AnimatedCheckbox;
