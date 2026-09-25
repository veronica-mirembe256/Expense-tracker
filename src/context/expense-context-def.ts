import { createContext } from 'react';
import type { Category, Expense } from '@/types/expense';

export interface ExpenseContextValue {
  expenses: Expense[];
  addExpense: (expense: { title: string; amount: number; category: Category; date: string }) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: Expense) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
  filteredExpenses: Expense[];
}

export const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);
