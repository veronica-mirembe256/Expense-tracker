import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseTable } from '@/components/ExpenseTable';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SummaryCard } from '@/components/SummaryCard';
import { Charts } from '@/components/Charts';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateTotal, getAverageExpense, getHighestExpense } from '@/utils/statistics';
import { csvService } from '@/services/csvService';

interface DashboardProps {
  isDarkMode: boolean;
}

export function Dashboard({ isDarkMode }: DashboardProps) {
  const { expenses, filteredExpenses, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } =
    useExpenses();

  const total = calculateTotal(expenses);
  const average = getAverageExpense(expenses);
  const highest = getHighestExpense(expenses);

  const handleExport = () => {
    csvService.export(filteredExpenses, 'expenses.csv');
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      {/* Summary row */}
      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Spending" value={formatCurrency(total)} icon="💵" accent="primary" />
        <SummaryCard label="Average Expense" value={formatCurrency(average)} icon="📊" accent="green" />
        <SummaryCard
          label="Highest Expense"
          value={highest ? formatCurrency(highest.amount) : '—'}
          icon="🔺"
          accent="orange"
        />
      </section>

      {/* Charts */}
      <section aria-label="Charts">
        <Charts expenses={expenses} isDarkMode={isDarkMode} />
      </section>

      {/* Form */}
      <section aria-label="Add expense">
        <ExpenseForm />
      </section>

      {/* Filters + export */}
      <section aria-label="Expenses" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredExpenses.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Export CSV
          </button>
        </div>

        <ExpenseTable expenses={filteredExpenses} />
      </section>
    </main>
  );
}
