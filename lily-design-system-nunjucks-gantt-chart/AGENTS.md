# AGENTS — GanttChart (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it
first; everything below is a fast index.

## What this package is

A macro + client.js Nunjucks port of `@lilydesignsystem/svelte-gantt-
chart`: a keyboard-and-pointer-accessible Gantt chart (WAI-ARIA APG
Grid, row hierarchy, milestones, percent-complete, finish-to-start
dependency data, keyboard-accessible edit region composing
`@lilydesignsystem/nunjucks-date-time-picker` TWICE, drag-and-drop
supplementary). Composes `@lilydesignsystem/nunjucks-headless`'s
gantt-table macro family (real npm dependency, unmodified). Ships no
CSS.

Ported from the Svelte canonical
(`lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart`,
2026-09-21) on 2026-09-22, alongside this catalog's own kanban-board
port (built moments earlier, same brief, used as a second local
reference for the macro + client.js shape).

## The one thing to understand before touching this package

**The time-axis columns and every grid-body `<td>` are built entirely
by `gantt-chart.client.js`, not `gantt-chart.njk`.** Generating
`range`/`timeUnit` into a column list needs real civil-date
arithmetic (days-in-month, leap years) that Nunjucks cannot do at all
— the same limitation `date-time-picker.njk`'s own header comment
documents for its calendar grid. `gantt-chart.njk` renders everything
that DOESN'T need that arithmetic (row hierarchy, row headers,
dependency summaries, the two composed date pickers per editable row)
and leaves the rest to client.js. See spec/index.md §3 before changing
either file — most bugs in this package will come from assuming the
macro renders more of the grid than it does, or from client.js
re-deriving something the macro already computed (e.g. re-walking the
`parentId` tree, which the macro already did — client.js only ever
reads each row's `data-lily-gantt-chart-start`/`-end`/`-depth`
attributes, never `tasks` data directly).

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `gantt-chart.njk` | The macro. |
| `gantt-chart.client.js` | The ES-module runtime — builds the time axis and grid body. |
| `gantt-chart.test.ts` | Vitest spec, one or more assertions per §9 acceptance clause. |
| `index.md` | User guide. |
| `docs/` | Deep-dive topic guides. |
| `examples/` | Runnable Nunjucks templates. |
| `CHANGELOG.md` | Version history. |

## Public surface

- Macro: `ganttChart(opts)`, exported from `gantt-chart.njk`.
- Client.js exports: `initGanttChart(root, opts?)`, `autoInit(opts?)`,
  plus the pure date-math/column helpers `compareISO`, `endOfMonth`,
  `generateColumns`, `rangesOverlap` — exported because they are
  independently useful and independently testable, matching the
  Svelte canonical's own `export`ed utility functions.

Required macro params: `label`, `range`, `tasks`.

## Behaviour contract (one paragraph)

`range`/`timeUnit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns client-side, using UTC/epoch-day arithmetic
reused from `@lilydesignsystem/nunjucks-date-time-picker`'s own
exports (`addDays`, `parseIsoDate`, `formatIsoDate`, `daysInMonth`,
`toEpochDay`) rather than re-derived. A task's `[start, end]` (or, for
a parent, its server-derived min/max range) marks every overlapping
column's cell `data-in-range`; a milestone marks exactly one cell
`data-milestone`. `task.parentId` builds a row hierarchy AT RENDER
TIME; a parent's collapse button removes/restores its (already
render-time-identified) descendant rows from the DOM outright, purely
by walking contiguous next-siblings whose `data-lily-gantt-chart-
depth` exceeds the parent's own — no client-side tree rebuild needed.
`task.dependsOn` renders as an `aria-describedby` text summary,
resolved and rendered entirely server-side. Editing is never
drag-only: Enter/Space on a focused task row opens an inline region
composing two `DateTimePicker` instances, freshly initialised (and
destroyed on close) every session — since `date-time-picker.client.js`
exposes no reset call, this fresh-init/destroy cycle is what
guarantees a cancelled edit never leaks into the next one. Pointer
drag-and-drop reschedules a task, preserving its duration;
supplementary, never the only path. Keyboard follows the same
WAI-ARIA APG Grid roving-tabindex model as kanban-board, scoped to the
CURRENT visible row list. Every successful edit announces through one
`.gantt-chart-status aria-live="polite"` region built from
`labels.dateAnnouncement`.

## HTML

See [spec/index.md §6](./spec/index.md#6-html) for the full markup
shape.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly).
- Roving tabindex, matching kanban-board and data-grid.
- Editing via composed `DateTimePicker` is the accessible path for
  rescheduling; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Nunjucks gotchas

- Same scoping trap as kanban-board: a `{% set %}` variable in an
  enclosing macro is invisible inside a nested `{% call %}` block.
  Every composition here uses plain macro-call expressions instead.
  See spec/index.md §5.
- Row hierarchy uses a RECURSIVE macro (`_ganttChartRowsHtml`) —
  confirmed working in this Nunjucks version (a macro calling itself
  and returning its own output bottom-up), since there is no `while`
  loop and arrays are immutable (`.concat()`-only) for building an
  arbitrary-depth tree walk any other way.
- ISO date strings (`"YYYY-MM-DD"`) compare correctly with Nunjucks'
  plain `<`/`>` operators (they compile to ordinary JS string
  comparison) — this is what makes `_ganttChartEffectiveRange`'s
  min/max computation possible in Nunjucks at all, even though full
  civil-date arithmetic (adding days, finding a month's end) is not.
  Don't conflate the two: comparison works, arithmetic doesn't.

## Conventions this package follows

- Plain JS (JSDoc types) for `gantt-chart.client.js`, matching every
  other helper.
- Depends on `@lilydesignsystem/nunjucks-headless` and
  `@lilydesignsystem/nunjucks-date-time-picker` as real npm
  dependencies — never vendors their markup or logic.
- UTC/epoch-day date arithmetic throughout client.js — never
  local-midnight `Date` construction.
- No bundled CSS, fonts, or images.
- Every user-facing string is either a `labels.*` macro param
  (template string, gated by presence) or a `labels.*` client.js init
  option (a real function, for controls that only exist after
  hydration) — see spec/index.md §4's deviation table.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §2.
