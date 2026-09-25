import type { Expense } from '@/types/expense';
import { downloadExpensesAsCSV, expensesToCSV } from '@/utils/exportCSV';

/**
 * Thin service boundary around CSV concerns.
 *
 * Kept separate from `utils/exportCSV.ts` on purpose: the util module is a
 * pure, dependency-free formatter (easy to unit test), while this service
 * is the integration point the UI talks to. Today that's a straight
 * pass-through, but it's the natural place to add e.g. analytics events,
 * multiple export formats, or a backend upload without touching components.
 */
export const csvService = {
  export(expenses: Expense[], filename?: string): void {
    downloadExpensesAsCSV(expenses, filename);
  },
  toString(expenses: Expense[]): string {
    return expensesToCSV(expenses);
  },
};
