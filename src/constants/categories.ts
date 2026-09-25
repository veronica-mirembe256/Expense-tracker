/**
 * Single source of truth for expense categories.
 * The `Category` type in types/expense.ts is derived from this array,
 * so adding a category here is the only change needed to support it
 * throughout the form, filters, and charts.
 */
export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Education',
  'Other',
] as const;

/** Deterministic colour per category, reused by the pie chart and badges. */
export const CATEGORY_COLORS: Record<(typeof CATEGORIES)[number], string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Housing: '#8b5cf6',
  Utilities: '#06b6d4',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Shopping: '#f59e0b',
  Education: '#6366f1',
  Other: '#6b7280',
};
