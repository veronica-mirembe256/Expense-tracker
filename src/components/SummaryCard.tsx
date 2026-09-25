import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: 'primary' | 'green' | 'purple' | 'orange';
}

const ACCENT_CLASSES: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  purple: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  orange: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
};

/** A compact stat card used on the dashboard summary row. Purely presentational. */
export function SummaryCard({ label, value, icon, accent = 'primary' }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${ACCENT_CLASSES[accent]}`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{value}</p>
        </div>
      </div>
    </div>
  );
}
