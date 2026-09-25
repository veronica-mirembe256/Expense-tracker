import React from 'react';
import type { Expense } from '@/types/expense';
import { CATEGORY_COLORS } from '@/constants/categories';
import { formatCurrency, formatDate } from '@/utils/formatCurrency';
import { useExpenses } from '@/hooks/useExpenses';

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const { deleteExpense } = useExpenses();

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No expenses match your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Date</Th>
            <Th align="right">Amount</Th>
            <Th align="right">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
          {expenses.map((expense) => (
            <tr key={expense.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50">{expense.title}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[expense.category]}1a`,
                    color: CATEGORY_COLORS[expense.category],
                  }}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-50">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => deleteExpense(expense.id)}
                  aria-label={`Delete ${expense.title}`}
                  className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}
