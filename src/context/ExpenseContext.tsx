import React, { useMemo, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Category, Expense } from '@/types/expense';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExpenseContext, type ExpenseContextValue } from '@/context/expense-context-def';

const STORAGE_KEY = 'expense-tracker:expenses';

// ---------- Reducer ----------

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'createdAt'> }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_EXPENSES'; payload: Expense[] };

function expenseReducer(state: Expense[], action: ExpenseAction): Expense[] {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense: Expense = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      return [newExpense, ...state];
    }
    case 'DELETE_EXPENSE':
      return state.filter((expense) => expense.id !== action.payload.id);
    case 'UPDATE_EXPENSE':
      return state.map((expense) => (expense.id === action.payload.id ? action.payload : expense));
    case 'SET_EXPENSES':
      return action.payload;
    default:
      return state;
  }
}

// ---------- Provider ----------

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  // Local Storage is the persistence layer; the reducer holds the in-memory
  // working copy so updates are synchronous and don't depend on a re-read.
  const [persisted, setPersisted] = useLocalStorage<Expense[]>(STORAGE_KEY, []);
  const [expenses, dispatch] = useReducer(expenseReducer, persisted);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<Category | 'All'>('All');

  // Keep Local Storage in sync whenever the reducer state changes.
  React.useEffect(() => {
    setPersisted(expenses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses]);

  const addExpense: ExpenseContextValue['addExpense'] = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => dispatch({ type: 'DELETE_EXPENSE', payload: { id } });

  const updateExpense = (expense: Expense) => dispatch({ type: 'UPDATE_EXPENSE', payload: expense });

  const filteredExpenses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesSearch =
        term === '' ||
        expense.title.toLowerCase().includes(term) ||
        expense.category.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  const value: ExpenseContextValue = {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredExpenses,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

