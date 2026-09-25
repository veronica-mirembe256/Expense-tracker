# AI-Powered Insights: Prompt Engineering Examples

This app deliberately has **no backend and makes no outbound LLM calls** — see the README for why. Instead, `src/services/aiInsights.ts` builds ready-to-paste prompts that take the CSV export (see `sample-expenses.csv` in this folder) and turn it into structured analysis when pasted into any LLM (Claude, ChatGPT, etc.).

Each prompt below follows the same structure deliberately:

1. **Role framing** ("You are a personal finance analyst/advisor") — anchors the tone and domain expertise the model should draw on.
2. **The raw data**, inline, so the prompt is self-contained and reproducible.
3. **One specific, bounded task** — not "analyze my spending," but a concrete question with a defined output shape.
4. **A requested output format** (bulleted list, table, ranked list) so the response is easy to scan and act on, not a wall of prose.

Tool used to generate the example outputs below: **Claude** (Anthropic), chosen because at the time of writing it handled the "identify statistical outliers, not just the biggest number" instruction in prompt 3 more reliably than alternatives tested — it distinguished a genuinely anomalous transaction from a merely large one instead of just sorting by amount.

---

## 1. Top Spending Categories

**Prompt:**
```
You are a personal finance analyst. Here is a CSV export of my expenses:

<CSV DATA>

Rank my spending categories from highest to lowest total. For the top 2
categories, briefly explain what this suggests about my spending habits
and whether the concentration looks reasonable for a typical household
budget. Respond in a short bulleted list.
```

**Example insight produced:**
> Housing (42%) and Food (23%) account for two-thirds of total spend — in line with typical budgeting guidelines, though Food is trending above the recommended 15% benchmark.

---

## 2. Month-over-Month Trend

**Prompt:**
```
You are a personal finance analyst. Here is a CSV export of my expenses,
each with a date:

<CSV DATA>

Group these expenses by month and calculate the total for each month.
Tell me whether my spending is trending up, down, or flat month over
month, and call out the single largest month-over-month change with a
plausible explanation drawn from the category data.
```

**Example insight produced:**
> Spending rose 18% from June to July, driven mainly by a spike in Shopping — consistent with back-to-school purchases.

---

## 3. Unusual Transaction Detection

**Prompt:**
```
You are a personal finance analyst. Here is a CSV export of my expenses:

<CSV DATA>

Identify any transactions that look unusually large relative to their
category's typical amount in this dataset (statistical outliers, not
just the biggest number overall). List each one with the amount,
category, and a one-sentence note on why it stands out.
```

**Example insight produced:**
> A $340 "Health" transaction is roughly 6x the category average of $58, making it a likely one-off (e.g. a specialist visit) rather than a recurring cost.

---

## 4. Budget Recommendations

**Prompt:**
```
You are a personal finance advisor. Here is a CSV export of my expenses:

<CSV DATA>

Based on this history, propose a simple monthly budget per category.
Use the average monthly spend per category as a baseline, then round to
sensible numbers. Present the result as a compact table with columns:
Category, Suggested Monthly Budget, Rationale.
```

**Example insight produced:**
> Suggested Food budget: $450/month (rounded up from a $427 historical average, with headroom for grocery inflation).

---

## 5. Savings Opportunities

**Prompt:**
```
You are a personal finance advisor. Here is a CSV export of my expenses:

<CSV DATA>

Identify the single category with the most realistic opportunity for
savings — favor categories with frequent small discretionary
transactions over one-off large ones (which are harder to reduce).
Suggest one concrete, specific action I could take, and estimate the
potential monthly savings in dollars.
```

**Example insight produced:**
> Entertainment shows 11 separate transactions averaging $22 each. Consolidating to a single streaming plan instead of several could save an estimated $35/month.

---

## Why these five

They cover the four things a personal-finance user typically wants from their data: **where the money goes** (1), **how it's changing over time** (2), **what looks wrong** (3), and **what to do about it** (4 and 5) — moving from descriptive to prescriptive. Each is scoped narrowly enough that an LLM can answer it reliably from CSV data alone, without needing external context (bank rules, income, goals) the app doesn't have.
