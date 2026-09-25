import React, { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';
import type { Category, ExpenseFormErrors, ExpenseFormValues } from '@/types/expense';
import { useExpenses } from '@/hooks/useExpenses';

const emptyForm: ExpenseFormValues = {
  title: '',
  amount: '',
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
};

/** Validates the form and returns a map of field -> error message (empty if valid). */
function validate(values: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  } else if (values.title.trim().length > 80) {
    errors.title = 'Title must be 80 characters or fewer.';
  }

  const amount = Number(values.amount);
  if (!values.amount.trim()) {
    errors.amount = 'Amount is required.';
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be a positive number.';
  }

  if (!values.date) {
    errors.date = 'Date is required.';
  } else if (new Date(values.date) > new Date()) {
    errors.date = 'Date cannot be in the future.';
  }

  return errors;
}

export function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [values, setValues] = useState<ExpenseFormValues>(emptyForm);
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [justAdded, setJustAdded] = useState(false);

  const handleChange = (field: keyof ExpenseFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error as soon as the user edits it again.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    addExpense({
      title: values.title.trim(),
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
    });

    setValues({ ...emptyForm, date: values.date });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
      aria-label="Add expense"
    >
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Add Expense</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Grocery shopping"
            className={inputClasses(!!errors.title)}
            aria-invalid={!!errors.title}
          />
        </Field>

        <Field label="Amount" htmlFor="amount" error={errors.amount}>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={values.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0.00"
            className={inputClasses(!!errors.amount)}
            aria-invalid={!!errors.amount}
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <select
            id="category"
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value as Category)}
            className={inputClasses(false)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date" htmlFor="date" error={errors.date}>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={inputClasses(!!errors.date)}
            aria-invalid={!!errors.date}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          Add Expense
        </button>
        {justAdded && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
            Expense added.
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClasses(hasError: boolean): string {
  return [
    'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    'dark:bg-gray-900 dark:text-gray-50',
    hasError
      ? 'border-red-400 dark:border-red-500'
      : 'border-gray-300 dark:border-gray-700',
  ].join(' ');
}
