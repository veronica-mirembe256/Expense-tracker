import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Expense } from '@/types/expense';
import { CATEGORY_COLORS } from '@/constants/categories';
import { getCategoryTotals, getMonthlyTotals } from '@/utils/statistics';
import { formatCurrency } from '@/utils/formatCurrency';

interface ChartsProps {
  expenses: Expense[];
  isDarkMode: boolean;
}

export function Charts({ expenses, isDarkMode }: ChartsProps) {
  const categoryTotals = getCategoryTotals(expenses);
  const monthlyTotals = getMonthlyTotals(expenses);
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const textColor = isDarkMode ? '#9ca3af' : '#6b7280';

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Add some expenses to see spending charts.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Spending by Category">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categoryTotals}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {categoryTotals.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Spending">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} />
            <YAxis
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              tickFormatter={(value: number) => `$${value}`}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
      {children}
    </div>
  );
}
