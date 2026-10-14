'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface AppComboboxProps {
  options: (ComboboxOption | string)[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

export function AppCombobox({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No matches found.',
  ariaLabel,
  id,
  className,
}: AppComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
    return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  }, [options]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const s = search.toLowerCase();
    return normalizedOptions.filter(
      (opt) => opt.label.toLowerCase().includes(s) || (opt.description && opt.description.toLowerCase().includes(s))
    );
  }, [normalizedOptions, search]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={cn('app-combobox-wrap', className)} ref={containerRef}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel || placeholder}
        aria-expanded={open}
        className="app-select-trigger combobox-trigger"
        onClick={() => setOpen(!open)}
      >
        <span className={cn('combobox-display-text', !selectedOption && 'placeholder-text')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown size={14} className="combobox-chevron opacity-50" />
      </button>

      {open && (
        <div className="app-select-content combobox-dropdown">
          <div className="combobox-search-bar">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="combobox-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                type="button"
                className="icon-btn search-clear-btn"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="combobox-list" role="listbox">
            {filtered.length === 0 ? (
              <div className="combobox-empty">{emptyText}</div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={cn('app-select-item', isSelected && 'selected')}
                    onClick={() => {
                      onValueChange?.(opt.value);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    <div>
                      <span className="app-select-item-label">{opt.label}</span>
                      {opt.description && <span className="app-select-item-desc">{opt.description}</span>}
                    </div>
                    {isSelected && <Check size={14} className="app-select-check-icon" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
