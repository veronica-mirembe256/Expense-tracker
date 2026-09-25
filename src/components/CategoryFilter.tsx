import { CATEGORIES } from '@/constants/categories';
import type { Category } from '@/types/expense';

interface CategoryFilterProps {
  value: Category | 'All';
  onChange: (category: Category | 'All') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="w-full sm:w-48">
      <label htmlFor="category-filter" className="sr-only">
        Filter by category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(e) => onChange(e.target.value as Category | 'All')}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
