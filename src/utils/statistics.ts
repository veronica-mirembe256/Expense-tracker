import type { CategoryTotal, Expense, MonthlyTotal } from '@/types/expense';

/** Sums the `amount` field across all expenses. */
export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/** Groups expenses by category and sums their amounts, omitting empty categories. */
export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category: category as CategoryTotal['category'], total }))
    .sort((a, b) => b.total - a.total);
}

/** Groups expenses by calendar month (yyyy-mm) and sums their amounts, sorted chronologically. */
export function getMonthlyTotals(expenses: Expense[]): MonthlyTotal[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    const month = expense.date.slice(0, 7); // "yyyy-mm"
    totals.set(month, (totals.get(month) ?? 0) + expense.amount);
  }

  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month,
      label: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
        new Date(`${month}-01T00:00:00`)
      ),
      total,
    }));
}

/** Returns the single highest expense, or null if the list is empty. */
export function getHighestExpense(expenses: Expense[]): Expense | null {
  if (expenses.length === 0) return null;
  return expenses.reduce((max, curr) => (curr.amount > max.amount ? curr : max));
}

/** Returns the average expense amount, or 0 if the list is empty. */
export function getAverageExpense(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  return calculateTotal(expenses) / expenses.length;
}
