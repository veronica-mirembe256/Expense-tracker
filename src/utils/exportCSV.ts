import type { Expense } from '@/types/expense';

const CSV_HEADERS = ['Title', 'Amount', 'Category', 'Date'] as const;

/** Escapes a single CSV field: wraps in quotes and doubles any inner quotes. */
function escapeCsvField(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/** Converts an array of expenses into a CSV-formatted string. */
export function expensesToCSV(expenses: Expense[]): string {
  const rows = expenses.map((expense) =>
    [expense.title, expense.amount.toFixed(2), expense.category, expense.date]
      .map(escapeCsvField)
      .join(',')
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
}

/** Triggers a browser download of the given expenses as a CSV file. */
export function downloadExpensesAsCSV(expenses: Expense[], filename = 'expenses.csv'): void {
  const csvContent = expensesToCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
