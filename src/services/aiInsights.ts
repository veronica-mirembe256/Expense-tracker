import type { Expense } from '@/types/expense';
import { expensesToCSV } from '@/utils/exportCSV';

/**
 * This app has no backend and makes no outbound LLM calls — that's a
 * deliberate scope boundary (see README "Design Decisions"). This module
 * instead demonstrates *prompt engineering*: given the user's exported
 * data, it builds ready-to-paste prompts for an LLM of the user's choice
 * (ChatGPT, Claude, etc.). Each prompt is designed to be self-contained:
 * it includes the CSV data, a specific analytical task, and a requested
 * output format, so the response is structured and actionable rather than
 * generic commentary.
 */

export interface InsightPrompt {
  id: string;
  title: string;
  description: string;
  buildPrompt: (csv: string) => string;
  /** A representative example of the kind of insight this prompt tends to produce. */
  exampleInsight: string;
}

export const INSIGHT_PROMPTS: InsightPrompt[] = [
  {
    id: 'top-categories',
    title: 'Top Spending Categories',
    description: 'Ranks categories by total spend and flags any that dominate the budget.',
    buildPrompt: (csv) => `You are a personal finance analyst. Here is a CSV export of my expenses:

${csv}

Rank my spending categories from highest to lowest total. For the top 2 categories, briefly explain what this suggests about my spending habits and whether the concentration looks reasonable for a typical household budget. Respond in a short bulleted list.`,
    exampleInsight:
      'Housing (42%) and Food (23%) account for two-thirds of total spend — in line with typical budgeting guidelines, though Food is trending above the recommended 15% benchmark.',
  },
  {
    id: 'monthly-trend',
    title: 'Month-over-Month Trend',
    description: 'Identifies whether spending is rising, falling, or stable over time.',
    buildPrompt: (csv) => `You are a personal finance analyst. Here is a CSV export of my expenses, each with a date:

${csv}

Group these expenses by month and calculate the total for each month. Tell me whether my spending is trending up, down, or flat month over month, and call out the single largest month-over-month change with a plausible explanation drawn from the category data.`,
    exampleInsight:
      'Spending rose 18% from June to July, driven mainly by a spike in Shopping — consistent with back-to-school purchases.',
  },
  {
    id: 'anomaly-detection',
    title: 'Unusual Transaction Detection',
    description: 'Surfaces outlier expenses that deviate from the user\u2019s typical spending pattern.',
    buildPrompt: (csv) => `You are a personal finance analyst. Here is a CSV export of my expenses:

${csv}

Identify any transactions that look unusually large relative to their category's typical amount in this dataset (statistical outliers, not just the biggest number overall). List each one with the amount, category, and a one-sentence note on why it stands out.`,
    exampleInsight:
      'A $340 "Health" transaction is roughly 6x the category average of $58, making it a likely one-off (e.g. a specialist visit) rather than a recurring cost.',
  },
  {
    id: 'budget-recommendation',
    title: 'Budget Recommendations',
    description: 'Suggests a simple monthly budget per category based on historical spend.',
    buildPrompt: (csv) => `You are a personal finance advisor. Here is a CSV export of my expenses:

${csv}

Based on this history, propose a simple monthly budget per category. Use the average monthly spend per category as a baseline, then round to sensible numbers. Present the result as a compact table with columns: Category, Suggested Monthly Budget, Rationale.`,
    exampleInsight:
      'Suggested Food budget: $450/month (rounded up from a $427 historical average, with headroom for grocery inflation).',
  },
  {
    id: 'savings-opportunities',
    title: 'Savings Opportunities',
    description: 'Finds the most actionable place to cut spending without guessing at judgment calls.',
    buildPrompt: (csv) => `You are a personal finance advisor. Here is a CSV export of my expenses:

${csv}

Identify the single category with the most realistic opportunity for savings — favor categories with frequent small discretionary transactions over one-off large ones (which are harder to reduce). Suggest one concrete, specific action I could take, and estimate the potential monthly savings in dollars.`,
    exampleInsight:
      'Entertainment shows 11 separate transactions averaging $22 each. Consolidating to a single streaming plan instead of several could save an estimated $35/month.',
  },
];

/** Convenience helper: builds a specific prompt directly from live expense data. */
export function buildInsightPrompt(promptId: string, expenses: Expense[]): string | null {
  const prompt = INSIGHT_PROMPTS.find((p) => p.id === promptId);
  if (!prompt) return null;
  return prompt.buildPrompt(expensesToCSV(expenses));
}
