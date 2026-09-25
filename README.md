# Personal Expense Tracker

A modern, client-only expense tracker built with **React, TypeScript, Vite, and Tailwind CSS**. Add expenses, search and filter them, visualize spending with charts, export to CSV, and toggle dark mode — all persisted entirely in the browser via Local Storage.

Built as a take-home assessment. This README doubles as the design/architecture writeup you'd want going into a technical interview about it.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)
- [AI-Powered Insights](#ai-powered-insights)
- [Assumptions](#assumptions)
- [Possible Next Steps](#possible-next-steps)

---

## Overview

**Core features**
- Add expenses with title, amount, category, and date, with inline validation
- Real-time total spending, average expense, and highest expense
- Search by title or category, and filter by category
- Export the currently filtered view to CSV
- Pie chart (spending by category) and bar chart (spending by month), via Recharts
- Dark mode toggle, persisted across sessions
- All data lives in the browser — no backend, no database, no account

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 (functional components + hooks) | Industry standard, hooks keep components simple |
| Language | TypeScript (strict mode) | Catches bugs at compile time; domain types double as documentation |
| Build tool | Vite | Fast dev server, minimal config, first-class TS/React support |
| Styling | Tailwind CSS | Fast iteration, consistent design tokens, no separate CSS files to maintain |
| Charts | Recharts | Declarative, composable React charting with good TS support |
| State | React Context + `useReducer` | See [Design Decisions](#design-decisions--trade-offs) |
| Persistence | Browser Local Storage | Required by the spec; no backend involved |

## Setup

Requires Node.js 18+.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

No environment variables, API keys, or backend setup are required — everything runs client-side.

## Project Structure

```
src/
│
├── components/        # Reusable, mostly presentational UI pieces
│   ├── ExpenseForm.tsx     # Controlled form + validation for new expenses
│   ├── ExpenseTable.tsx    # Renders filtered expenses, handles delete
│   ├── SearchBar.tsx       # Debounced-free text search input
│   ├── SummaryCard.tsx     # Generic stat card (total/avg/highest)
│   ├── CategoryFilter.tsx  # Category <select> filter
│   ├── Charts.tsx          # Pie + bar chart (Recharts)
│   └── Navbar.tsx          # Header + dark mode toggle
│
├── pages/
│   └── Dashboard.tsx   # Composes components into the main screen
│
├── context/
│   └── ExpenseContext.tsx  # Global state: reducer + Local Storage sync
│
├── hooks/
│   └── useLocalStorage.ts  # Generic, reusable Local Storage <-> state sync
│
├── services/
│   ├── csvService.ts       # Integration boundary for CSV export
│   └── aiInsights.ts       # Builds LLM prompt templates from expense data
│
├── utils/
│   ├── formatCurrency.ts   # Currency/date formatting (pure functions)
│   ├── exportCSV.ts        # CSV serialization + file download (pure + DOM)
│   └── statistics.ts       # Aggregation: totals, category/month grouping
│
├── types/
│   └── expense.ts      # Domain interfaces: Expense, form values, aggregates
│
├── constants/
│   └── categories.ts   # Single source of truth for category list + colors
│
└── App.tsx             # Dark mode wiring + provider composition
```

## Architecture

**Data flow.** `ExpenseContext` owns the canonical list of expenses in a `useReducer` reducer (`ADD_EXPENSE`, `DELETE_EXPENSE`, `UPDATE_EXPENSE`, `SET_EXPENSES`). It's seeded from `useLocalStorage` on mount and re-synced to Local Storage on every change via a `useEffect`. Components never touch Local Storage directly — they call `addExpense` / `deleteExpense` from `useExpenses()` and read `filteredExpenses`, which is derived with `useMemo` from search term + category filter.

**Component boundaries.**
- **Presentational components** (`SummaryCard`, `SearchBar`, `CategoryFilter`, `ExpenseTable`, `Charts`) take props and render; they don't know about Local Storage or the reducer.
- **`Dashboard`** is the composition layer — it reads from context and utils, and lays components out.
- **`utils/`** are pure functions (formatting, aggregation, CSV serialization) — easy to unit test in isolation, no React or DOM dependency where possible.
- **`services/`** are the integration boundary between UI and "the outside world" (file downloads, future API calls). Kept thin today but gives a clear seam if, say, CSV export needed to become a server-side job later.

**Typing.** `Category` is derived from the `CATEGORIES` const array (`(typeof CATEGORIES)[number]`) rather than declared separately, so the type and the runtime list can never drift out of sync.

## Design Decisions & Trade-offs

**Why Local Storage instead of a backend?**
The spec calls for it explicitly, and it's the right fit for a single-user, no-auth expense tracker: zero infrastructure, works offline, and data never leaves the device. The trade-off is real, though — it's per-browser (no sync across devices), capped at a few MB, and not a substitute for a database if this ever needed multi-user support. The `useLocalStorage` hook and `csvService` are the two places that would need to change if a backend were added later; nothing else in the component tree assumes Local Storage.

**Why Context + `useReducer` instead of Redux/Zustand?**
The app has one meaningfully shared piece of state (the expense list) plus two small pieces of UI state (search term, category filter). A reducer gives predictable, testable state transitions (`ADD_EXPENSE`, `DELETE_EXPENSE`, etc.) without pulling in a state management library, its middleware, and its boilerplate for a problem this size. If the app grew multiple independent slices of global state with complex cross-cutting updates, or needed time-travel debugging / devtools, Redux Toolkit would start to earn its cost — but that's not this app.

**Why TypeScript throughout?**
The domain is small but has several places where a typo or shape mismatch would only show up at runtime otherwise (category strings, form values before/after parsing, CSV columns). Strict mode plus the `Category` type derived from `CATEGORIES` means the compiler catches an invalid category or a missing form field before it ships, and the interfaces in `types/expense.ts` double as living documentation of the domain.

**Why keep `utils/exportCSV.ts` and `services/csvService.ts` separate?**
`exportCSV.ts` is a pure formatter (string in, string/Blob out) that's trivial to unit test. `csvService.ts` is the thin integration layer components actually call — today it's a pass-through, but it's the natural place to add e.g. multiple export formats or a server-side hand-off without touching `ExpenseTable`/`Dashboard`.

**Why no AI API calls in the app itself?**
The take-home explicitly frames this as a *prompt engineering* exercise, not an "integrate an LLM API" one — and wiring in a live LLM call would mean shipping an API key to the client or standing up a backend, which contradicts the "Local Storage only, no backend" requirement. Instead, `services/aiInsights.ts` generates fully-formed, copy-pasteable prompts from the live expense data; see [AI-Powered Insights](#ai-powered-insights) below for the five prompts and example outputs.

## AI-Powered Insights

See [`docs/ai-insights.md`](./docs/ai-insights.md) for the full writeup, and [`docs/sample-expenses.csv`](./docs/sample-expenses.csv) for a sample export to try them against.

Five prompt-engineering examples are included, each pairing a specific analytical task with a requested output format:

1. **Top Spending Categories** — ranks categories, flags concentration risk
2. **Month-over-Month Trend** — detects rising/falling spend and the biggest driver
3. **Unusual Transaction Detection** — flags statistical outliers, not just big numbers
4. **Budget Recommendations** — proposes a per-category monthly budget as a table
5. **Savings Opportunities** — finds the most realistic place to cut spend, with a $ estimate

The prompts themselves are generated programmatically from real data in `src/services/aiInsights.ts` (`INSIGHT_PROMPTS`), so they're never out of sync with the app's actual CSV format.

## Assumptions

- Single-user, single-device usage — no auth, no multi-device sync (Local Storage's inherent scope).
- Expense dates can't be in the future (validated in the form); no restriction on how far in the past.
- Amounts are treated as plain numbers with two decimal places, single implicit currency (USD) — no multi-currency support.
- Categories are a fixed, curated list (`constants/categories.ts`) rather than user-defined, to keep the pie chart and filters bounded and consistent.
- "Export as CSV" exports the **currently filtered** view (respecting search + category filter), on the assumption that's more useful than always exporting everything.

## Possible Next Steps

Deliberately out of scope for this assessment, but the natural next additions:
- Edit-in-place for existing expenses (the reducer already supports `UPDATE_EXPENSE`)
- Recurring expenses
- CSV *import* (the export/parse logic in `utils/exportCSV.ts` would extend naturally)
- Per-category monthly budgets with over/under-budget indicators on the summary cards
- Unit tests for `utils/statistics.ts` and `utils/exportCSV.ts` (pure functions, cheap to cover)
