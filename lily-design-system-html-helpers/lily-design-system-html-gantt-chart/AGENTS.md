# AGENTS — `<gantt-chart>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable, headless vanilla HTML/JS interactive Gantt chart, packaged
as a custom element (`<gantt-chart>`, no `lily-` prefix). Task bars are
column-spanning grid cells (never pixel-positioned floating divs).
Composes `@lilydesignsystem/html-date-time-picker` twice per edit
session (task start, task end) — the first helper in this catalog to
compose a sibling *helper* rather than only headless markup, following
the pattern `@lilydesignsystem/html-picker-bar` established. Ships no
CSS.

Ported from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/)
(2026-09-21), implemented here 2026-09-22.

**This catalog's `lily-design-system-html-headless` `gantt-table*.html`
files are pure markup-contract documentation, not JS classes** — same
situation as `kanban-board` (see its own AGENTS.md). `gantt-chart.ts`
builds the documented class names (`gantt-table`, `gantt-table-thead`/
`-tbody`/`-tr`/`-th`/`-td` — note `-tr`, not `-row`, unlike kanban's own
naming) by hand, exclusively via `document.createElement`/`appendChild`.

## Files

| File                   | Purpose                                                |
| ----------------------- | ------------------------------------------------------- |
| `spec/index.md`         | Specification-driven contract (canonical).             |
| `gantt-chart.ts`        | Implementation. Vanilla TypeScript custom element.      |
| `gantt-chart.test.ts`   | Vitest + jsdom spec, one or more assertions per §8.     |
| `index.ts`              | Barrel re-export + side-effectful `customElements.define`. Also registers `<date-time-picker>`. |
| `index.md`              | User guide.                                              |

## Public surface

- Custom element tag: `gantt-chart`.
- Class export: `GanttChart`.
- Type exports: `GanttChartProps`, `GanttChartTaskChangeDetail`,
  `GanttColumn`, `GanttFlatRow`, `GanttLabels`, `GanttTask`,
  `GanttTimeUnit`.
- Utility exports: `addDays` (re-exported straight from
  `@lilydesignsystem/html-date-time-picker`), `compareISO`,
  `endOfMonth`, `flattenTasks`, `generateColumns`, `effectiveRange`,
  `nextGanttChartId`.

Observed attributes: `label` (required), `caption`, `time-unit`
(`"day"` default), `today`, `class`. Property-only: `range` (required),
`tasks` (required), `taskLabel`, `onTaskChange`, `labels`.

Event: `taskchange` (`CustomEvent<{taskId, start, end}>`), paired with
the `onTaskChange` property.

## Behaviour contract (one paragraph)

`range`/`timeUnit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns using civil-date (UTC/epoch-day) arithmetic —
**reused from `@lilydesignsystem/html-date-time-picker`'s own exports**
(`addDays`, `parseIsoDate`, `formatIsoDate`, `daysInMonth`,
`toEpochDay`) rather than re-ported from scratch, checked first per this
port's own instructions. A task's `[start, end]` marks every overlapping
column's cell `data-in-range`; a milestone (`start === end`) marks
exactly one cell `data-milestone`. `task.parentId` builds a row
hierarchy; a parent's own `start`/`end` are derived (min/max) from its
descendants and rendered read-only, with a collapse button that removes
descendant rows from the DOM outright — a genuinely structural change
(row indices renumber), handled by a full `<tbody>` rebuild.
`task.dependsOn` renders as an `aria-describedby` text summary, never a
drawn arrow. Editing is never drag-only: Enter/Space on a focused task
row opens an inline region composing two `<date-time-picker>` instances,
gated on `labels.dateTimePickerLabels` being supplied. Pointer
drag-and-drop (native HTML5) reschedules a task, preserving its
duration; supplementary, never the only path. Keyboard follows the same
WAI-ARIA APG Grid roving-tabindex model as `kanban-board`. Every
successful edit announces through one `.gantt-chart-status
[aria-live="polite"]` region built from `labels.dateAnnouncement`.

## The targeted-insert edit region

Opening a task's edit region does **not** trigger a structural rebuild:
`#openEdit()` inserts exactly one `<tr class="gantt-chart-edit-row">`
immediately after the task's own row via
`row.insertAdjacentElement("afterend", tr)`; `#closeEdit()` removes it.
The grid's own DOM — including whichever cell currently holds
`tabindex="0"` — is never touched. `gantt-chart.test.ts` has a dedicated
test asserting the SAME `<td>` DOM node (`toBe`, not a class check)
still carries `tabindex="0"` and stays connected after opening an edit
region — verified load-bearing by temporarily routing `#openEdit()`
through a full `#render()` and confirming that test (and only that test)
fails. Collapsing a row, by contrast, DOES rebuild the whole `<tbody>`,
because it renumbers every subsequent row's `data-row` index — see
spec/index.md §10.3 for the full reasoning on both sides of this split.

## HTML

See [spec/index.md §5](./spec/index.md#5-html) for the full markup
shape. Root: `<div class="gantt-chart {class}">` wrapping a hand-built
`<table class="gantt-table" role="grid">`, with an inline
`.gantt-chart-edit-row` (colspan) appearing only while a task is being
edited.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set directly — the headless
  `gantt-table` contract specifies no default role).
- Roving tabindex, not `aria-activedescendant`.
- No `GanttTableTD active`-prop overload risk exists in this catalog
  (unlike every other catalog's own gantt-chart port): this catalog's
  `gantt-table-td.html` contract documents only `aria-label`, no `active`
  prop at all, so `tabindex`/`aria-selected` (roving cursor) and
  `data-in-range` (span membership) are two independent attributes with
  nothing to disambiguate. See spec/index.md §10.4.
- Editing via composed `<date-time-picker>` is the accessible path for
  rescheduling/resizing; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- Vanilla custom element, no framework runtime, no `lily-` tag prefix.
- Strict TypeScript.
- Depends on `@lilydesignsystem/html-date-time-picker` as a real npm
  dependency — external in the built output (verified: `dist/index.js`
  imports it as a bare specifier, no bundled `DateTimePicker` class
  body); side-effect-imported once to register `<date-time-picker>`.
- UTC/epoch-day date arithmetic throughout — reused from the sibling
  picker rather than re-implemented (see spec §10.2).
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` property; a label's presence
  gates the control it names — editing itself is gated on
  `labels.dateTimePickerLabels`, since `date-time-picker` requires it
  too.
- Every table part built exclusively via `document.createElement`/
  `appendChild`, never `innerHTML`/template strings.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §9.

## Testing

`npx vitest run lily-design-system-html-gantt-chart/gantt-chart.test.ts`
from the `lily-design-system-html-helpers` workspace root. 29 tests
(6 pure-function tests for the reused/local date-arithmetic and
hierarchy helpers, plus one or more assertions per §8 clause), including
the dedicated targeted-insert regression test above.
