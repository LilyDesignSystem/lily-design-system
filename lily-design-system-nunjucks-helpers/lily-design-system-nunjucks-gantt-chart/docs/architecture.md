# Architecture — why client.js builds the grid

See [spec/index.md §3](../spec/index.md#3-composition-and-why-the-grid-body-is-entirely-client-built)
for the canonical account. This is the expanded version, for anyone
about to change `gantt-chart.njk` or `gantt-chart.client.js` and
wondering where a given piece of markup should live.

## The test: does it need civil-date arithmetic?

Ask this about anything you're about to render:

- **"Which columns exist?"** — needs civil-date arithmetic (how many
  days are in this month, does this week cross a month boundary).
  **Client-only.**
- **"Does this task's range overlap this column?"** — once you HAVE
  the columns, this is pure ISO-string comparison (`a <= d && c <= b`).
  No calendar knowledge needed. But since you can't have the columns
  without client-side arithmetic in the first place, this ALSO ends up
  client-side in practice (there's no benefit to splitting it out).
- **"What's this parent task's derived range?"** — min/max of already-
  known `start`/`end` strings. Pure comparison, no calendar knowledge.
  **This one CAN run in Nunjucks**, and does — see
  `_ganttChartEffectiveRange` in `gantt-chart.njk`.
- **"Does this task depend on that one, and what's its label?"** — a
  lookup by id into already-known data. No date math at all.
  **Server-side.**
- **"How many rows, and in what order, with what depth?"** — a
  `parentId` tree walk. No date math. **Server-side.**

The dividing line is genuinely "does this specific computation need to
know how many days are in a month or whether a year is a leap year,"
not "is this part of the grid" — the grid's ROW STRUCTURE is server-
rendered; only its COLUMNS and CELLS are not.

## What lives in each row's data attributes

`gantt-chart.client.js` never reads a `tasks` JSON blob — there isn't
one. Everything it needs about a row comes from that row's own `<tr>`
data attributes, already resolved by the macro:

| Attribute | Set by | Read by |
| --- | --- | --- |
| `data-lily-gantt-chart-task-id` | macro | client.js (row lookup, drag/drop, edit) |
| `data-lily-gantt-chart-task-label` | macro | client.js (announcements, collapse button label substitution) |
| `data-lily-gantt-chart-depth` | macro | client.js (collapse/expand descendant detection) |
| `data-lily-gantt-chart-start` / `-end` | macro (derived for parents, own for leaves); UPDATED by client.js after a save/drop | client.js (grid cell overlap testing) |
| `data-lily-gantt-chart-has-children` | macro | client.js (Enter/Space gating, bar draggability) |
| `data-lily-gantt-chart-percent-complete` | macro | client.js (bar rendering) |

This is deliberate: it keeps a single source of truth in the DOM
rather than a JS object that could drift out of sync with what's
actually rendered, and it means `rebuildGrid()` can run from nothing
but a DOM query — no state to thread through, no risk of it going
stale across a collapse/expand cycle.
