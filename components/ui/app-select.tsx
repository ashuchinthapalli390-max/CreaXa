'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface AppSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface AppSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  options: (AppSelectOption | string)[];
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const ALL_VALUE = '__creaxa_all__';

export function AppSelect({
  value,
  defaultValue,
  onChange,
  onValueChange,
  options,
  placeholder = 'Select an option',
  ariaLabel,
  id,
  name,
  required,
  disabled,
  className,
  triggerClassName,
  contentClassName,
}: AppSelectProps) {
  const handleChange = React.useCallback((val: string) => {
    const actualVal = val === ALL_VALUE ? '' : val;
    onChange?.(actualVal);
    onValueChange?.(actualVal);
  }, [onChange, onValueChange]);

  const internalValue = value === '' ? ALL_VALUE : value;
  const internalDefault = defaultValue === '' ? ALL_VALUE : defaultValue;

  // Normalize options to AppSelectOption[] with safe non-empty values for Radix
  const normalizedOptions: AppSelectOption[] = React.useMemo(() => {
    return options.map((opt) => {
      const item = typeof opt === 'string' ? { value: opt, label: opt } : opt;
      return {
        ...item,
        value: item.value === '' ? ALL_VALUE : item.value,
      };
    });
  }, [options]);

  return (
    <SelectPrimitive.Root
      value={internalValue}
      defaultValue={internalDefault}
      onValueChange={handleChange}
      required={required}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel || placeholder}
        className={cn('app-select-trigger', triggerClassName, className)}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="app-select-chevron" size={15} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          align="start"
          collisionPadding={12}
          className={cn('app-select-content', contentClassName)}
        >
          <SelectPrimitive.Viewport className="app-select-viewport">
            {normalizedOptions.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="app-select-item"
              >
                <SelectPrimitive.ItemText>
                  <span className="app-select-item-label">{opt.label}</span>
                  {opt.description && (
                    <span className="app-select-item-desc">{opt.description}</span>
                  )}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="app-select-indicator">
                  <Check size={14} className="app-select-check-icon" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
export default AppSelect;
