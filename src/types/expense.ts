/**
 * Core domain types for the Expense Tracker.
 * Kept in a single file since the domain is small; would split by
 * aggregate (expense.ts, category.ts, etc.) if the model grew.
 */

import type { CATEGORIES } from '@/constants/categories';

/** Union of allowed category names, derived from the single source of truth. */
export type Category = (typeof CATEGORIES)[number];

/** An expense record as persisted in Local Storage. */
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  /** ISO 8601 date string (yyyy-mm-dd) for easy sorting/serialization. */
  date: string;
  createdAt: string;
}

/** Shape of the form before an expense is validated and given an id. */
export type ExpenseFormValues = {
  title: string;
  amount: string; // kept as string while in the form, parsed on submit
  category: Category;
  date: string;
};

/** Field-level validation errors keyed by form field name. */
export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

/** Aggregated total spent per category, used by the pie chart and summary cards. */
export interface CategoryTotal {
  category: Category;
  total: number;
}

/** Aggregated total spent per month, used by the bar chart. */
export interface MonthlyTotal {
  month: string; // e.g. "2026-07"
  label: string; // e.g. "Jul 2026"
  total: number;
}
