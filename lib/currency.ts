/**
 * Centralized currency normalization, money formatting, and rate comparison service.
 * Follows Phase 6 guidelines for transparent, correct multi-currency behavior.
 */

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(c: unknown): c is SupportedCurrency {
  return typeof c === 'string' && SUPPORTED_CURRENCIES.includes(c.toUpperCase() as SupportedCurrency);
}

export function normalizeCurrency(c: unknown, fallback: SupportedCurrency = 'INR'): SupportedCurrency {
  if (typeof c === 'string') {
    const upper = c.trim().toUpperCase();
    if (SUPPORTED_CURRENCIES.includes(upper as SupportedCurrency)) {
      return upper as SupportedCurrency;
    }
  }
  return fallback;
}

export function formatMoney(amount: unknown, currency: unknown = 'INR'): string {
  const norm = normalizeCurrency(currency);
  const n = Number(amount) || 0;
  const locale = norm === 'INR' ? 'en-IN' : norm === 'EUR' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: norm,
    maximumFractionDigits: 0,
  }).format(n);
}

export interface RateComparisonResult {
  comparable: boolean;
  withinBudget: boolean;
  reason?: string;
  diff?: number;
}

/**
 * Compares a creator's rate against a budget according to Option A (Same-Currency Baseline).
 * Returns transparent information on comparability and budget satisfaction.
 */
export function compareBudget(
  rate: unknown,
  creatorCurrency: unknown,
  budget: unknown,
  budgetCurrency: unknown
): RateComparisonResult {
  const r = Number(rate);
  const b = Number(budget);

  // If budget is unconstrained (0 or unset), any rate is acceptable
  if (!Number.isFinite(b) || b <= 0) {
    return { comparable: true, withinBudget: true, reason: 'Budget unconstrained' };
  }

  // If rate is unconstrained (0 or unset), creator rate on request
  if (!Number.isFinite(r) || r <= 0) {
    return { comparable: true, withinBudget: true, reason: 'Rate on request' };
  }

  const cCurr = normalizeCurrency(creatorCurrency);
  const bCurr = normalizeCurrency(budgetCurrency);

  // Same currency comparison: exact numerical comparison
  if (cCurr === bCurr) {
    const withinBudget = r <= b;
    return {
      comparable: true,
      withinBudget,
      diff: b - r,
      reason: withinBudget
        ? `Rate ${formatMoney(r, cCurr)} is within budget ${formatMoney(b, bCurr)}`
        : `Rate ${formatMoney(r, cCurr)} exceeds budget ${formatMoney(b, bCurr)}`,
    };
  }

  // Cross-currency without FX provider is not directly comparable
  return {
    comparable: false,
    withinBudget: false,
    reason: `Different currencies (${cCurr} vs ${bCurr}) cannot be compared directly without conversion`,
  };
}
