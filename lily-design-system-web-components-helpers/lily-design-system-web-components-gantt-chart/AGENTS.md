# AGENTS — `<lily-gantt-chart>` (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless interactive Gantt chart, packaged
as the `<lily-gantt-chart>` custom element. Composes
`@lilydesignsystem/web-components-headless`'s `<lily-gantt-table>` (a
real npm dependency, unmodified — task bars are column-spanning grid
cells, never pixel-positioned floating divs) and, twice per edit
session, the sibling helper
`@lilydesignsystem/web-components-date-time-picker`. Ships no CSS.

Direct port of `@lilydesignsystem/svelte-gantt-chart`. Implemented
2026-09-22, the first Gantt-chart port outside Svelte.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `gantt-chart.ts` | Implementation (TypeScript custom-element class). |
| `gantt-chart.test.ts` | Vitest + jsdom spec, one or more assertions per §8 acceptance clause, plus pure-function tests for the date/hierarchy helpers. |
| `index.ts` | Barrel re-export + side-effectful registration. |
| `index.md` | Human-readable guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | A runnable HTML page. |

## Public surface

- Class `GanttChart extends HTMLElement` (registered as
  `<lily-gantt-chart>` on import of `index.ts`).
- Named exports: `compareISO`, `effectiveRange`, `endOfMonth`,
  `flattenTasks`, `generateColumns`, `nextGanttChartId`. Unlike the
  Svelte reference, `addDays` is **not** re-exported here — this
  package imports it directly from
  `@lilydesignsystem/web-components-date-time-picker` instead of
  re-deriving it; consumers who want it should import it from that
  package too.
- Type exports: `GanttChartProps`, `GanttColumn`, `GanttFlatRow`,
  `GanttLabels`, `GanttTask`, `GanttTimeUnit`.

Required attribute: `label`. Required properties: `range`, `tasks`
(property-only).

## Behaviour contract (one paragraph)

`range`/`time-unit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns using UTC/epoch-day arithmetic REUSED from
`@lilydesignsystem/web-components-date-time-picker` (`addDays`,
`parseIsoDate`, `formatIsoDate`, `daysInMonth`, `toEpochDay`) rather
than re-derived — see spec/index.md §3. A task's `[start, end]` marks
every overlapping column's cell `data-in-range`; a milestone (`start
=== end`) marks exactly one cell `data-milestone`. `task.parentId`
builds a row hierarchy; a parent's own `start`/`end` are derived
(min/max) from its descendants and rendered read-only, with a collapse
button that removes descendant rows from the DOM outright.
`task.dependsOn` renders as an `aria-describedby` text summary, never a
drawn arrow (documented non-goal). Editing is never drag-only:
Enter/Space on a focused task row opens an inline region composing two
`<lily-date-time-picker>` instances, gated on
`labels.dateTimePickerLabels` being supplied. Pointer drag-and-drop
(native HTML5) reschedules a task, preserving its duration;
supplementary, never the only path. Keyboard follows the same
WAI-ARIA APG Grid roving-tabindex model as `kanban-board`, with
`Home`/`End` transposed to move within a ROW (kanban-board's move
within a column, since rows/columns swap meaning between the two
components). Every successful edit announces through one
`.gantt-chart-status aria-live="polite"` region built from
`labels.dateAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {class}">` wrapping the
unmodified `<lily-gantt-table>`, with an inline `.gantt-chart-edit-row`
(colspan) inserted/removed (not hidden) only while a task is being
edited — a heavier composed `<lily-date-time-picker>` pair makes
"always present, toggle hidden" (kanban-board's move-menu approach)
too costly to build once per row up front.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, `<lily-gantt-table>`'s own
  default — no override needed here, unlike `kanban-board`).
- Roving tabindex on data cells only; row-header cells (task label +
  collapse button) sit outside the roving-tabindex column index.
- `data-in-range` (span membership) is a SEPARATE attribute from the
  roving-tabindex cursor state — a task's bar can span many cells at
  once, while roving-tabindex requires exactly one active cell
  grid-wide. See spec/index.md §3.
- Editing via composed `<lily-date-time-picker>` is the accessible
  path for rescheduling; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`, light
  DOM only, no Shadow DOM).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/web-components-headless` and
  `@lilydesignsystem/web-components-date-time-picker` as real
  dependencies — never vendors either's markup. Mirrors
  `picker-bar.ts`'s bare-side-effect-import pattern for a sibling
  *helper* dependency (not just headless).
- Builds every table-related element with `document.createElement`/
  `appendChild` — never `innerHTML` (same HTML5 table-parsing gotcha
  as `kanban-board`; see that package's own note).
- UTC/epoch-day date arithmetic throughout, reused from
  `date-time-picker` rather than re-derived.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` property; a label's
  presence gates the control it names — editing itself is gated on
  `labels.dateTimePickerLabels`, since `date-time-picker` requires it
  too. No baked-in English fallback, with one documented exception: a
  column header with no `labels.columnLabel` falls back to its raw
  ISO date (mirrors the Svelte reference exactly).
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §9.
