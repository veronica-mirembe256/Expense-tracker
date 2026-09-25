import { useContext } from 'react';
import { ExpenseContext, type ExpenseContextValue } from '@/context/expense-context-def';

/** Hook for consuming the expense context; throws if used outside the provider. */
export function useExpenses(): ExpenseContextValue {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
