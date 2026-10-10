# AGENTS — GanttChart (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 standalone, headless, interactive Gantt chart. It
composes `@lilydesignsystem/angular-headless`'s `GanttTable` family (a
real npm dependency, unmodified) and, for editing, the **sibling
helper** `@lilydesignsystem/angular-date-time-picker` — used twice per
edit session, for a task's start and end date — mirroring
`angular-picker-bar`'s own sibling-helper dependency/build-alias
pattern exactly. Ports `@lilydesignsystem/svelte-gantt-chart`
(2026-09-22); no other Angular catalog package composes `GanttTable`
yet.

## Files

| File                          | Purpose                                                |
| ------------------------------ | ------------------------------------------------------- |
| `spec/index.md`                | Specification-driven contract (canonical).             |
| `gantt-chart.component.ts`     | Implementation. Standalone component, signal inputs/outputs, plus the ported civil-date/hierarchy helpers. |
| `gantt-chart.component.spec.ts`| Vitest + TestBed spec, one or more assertions per §8 acceptance clause. |
| `index.ts`                     | Barrel re-export.                                       |
| `index.md`                     | User guide.                                             |

## Public surface

- Named export: `GanttChart` (selector `lily-gantt-chart`).
- Named export: `nextGanttChartId`.
- Pure helper exports: `compareISO`, `endOfMonth`, `generateColumns`,
  `flattenTasks`, `effectiveRange` (ported here from the Svelte
  reference), plus `addDays` (re-exported — reused directly from
  `@lilydesignsystem/angular-date-time-picker`, not re-derived).
- Type exports: `GanttTask`, `GanttTimeUnit`, `GanttLabels`,
  `GanttTaskChangeEvent`, `GanttColumn`, `GanttFlatRow`.

Required inputs: `label`, `range`, `tasks`. One output: `taskChange`.

## Behaviour contract (one paragraph)

Tasks render against a `range`/`timeUnit` grid of columns, generated
with UTC/epoch-day arithmetic — reusing
`@lilydesignsystem/angular-date-time-picker`'s own exported
`addDays`/`daysInMonth`/`formatIsoDate`/`parseIsoDate`/`toEpochDay`
rather than re-deriving them, per this port's own instructions; only
the Gantt-specific pieces date-time-picker does not export
(`compareISO`, `endOfMonth`, `generateColumns`, `flattenTasks`,
`effectiveRange`) are ported from the Svelte reference. A task's
`[start, end]` marks overlapping cells `data-in-range`; a milestone
(`start === end`) marks one cell `data-milestone`. Row hierarchy comes
from `task.parentId`; a parent's own range is derived from its
descendants and collapsing removes descendant rows from the DOM
outright. Editing is never drag-only, per WCAG 2.5.7 and Syncfusion's
own accessibility documentation (no keyboard shortcut exists for
dragging a Gantt bar): Enter/Space on a focused task row opens an
inline edit region with two composed `DateTimePicker` instances,
gated on `labels.dateTimePickerLabels` being supplied. Pointer
drag-and-drop reschedule is supplementary. Dependencies are exposed as
`aria-describedby` text, never a rendered arrow. Same roving-tabindex
grid model as `kanban-board`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {className}">` inside
`GanttChart`'s own `<lily-gantt-chart>` host tag (extra attributes a
consumer writes there land one level outside `.gantt-chart`; see spec
§8.15).

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`) — applied by `GanttChart`
  itself in `ngAfterViewInit()`, since Angular's headless `GanttTable`
  sets no `role` at all (confirmed by reading `GanttTable.ts`) and is
  on this port's "do not modify" list.
- Roving tabindex for body cells, set via direct attribute bindings on
  the native `<td lily-gantt-table-td>` cell. **Important finding**:
  unlike Svelte's `GanttTableTD` (whose own `active` prop is
  deliberately *not* reused for span-membership, precisely because it
  is tied to the roving-tabindex cursor and a task's bar can span many
  cells — see the Svelte package's own CHANGELOG), Angular's
  `GanttTableTD` has **no `active` prop at all** — confirmed by reading
  `GanttTableTD.ts`. There is therefore no contract-overload risk to
  design around here: both the roving-tabindex cursor and the
  `data-in-range` span marker are independent attribute bindings set
  directly by this component, and `GanttTableTD` is not modified.
- Dependency data via `aria-describedby`, never a rendered arrow (every
  accessibility source consulted treats the arrow as unsolved
  industry-wide — see spec §9).
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- Angular 20 standalone component, signal-based inputs/outputs,
  `OnPush` change detection.
- Depends on `@lilydesignsystem/angular-headless` **and**
  `@lilydesignsystem/angular-date-time-picker` as real npm
  dependencies (both listed in `ng-package.json`'s
  `allowedNonPeerDependencies`) — never vendors either's markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` input; a label's presence
  gates the control it names.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, zoom
  switching, weekend/holiday shading, resource/assignee columns) are
  documented, not silently missing — see spec/index.md §9.

## Local development note

This catalog has no pnpm workspace linking. `../vitest.config.ts`
aliases `@lilydesignsystem/angular-date-time-picker` (and
`@lilydesignsystem/angular-headless`) to each package's already-built
ng-packagr `dist/fesm2022/*.mjs` so tests resolve locally, mirroring
`picker-bar`'s own four aliases; `../tsconfig.json` mirrors that with a
`paths` entry to `date-time-picker`'s `dist/types/*.d.ts`. Neither
alias is read when this package's own `dist/` is built — the published
output keeps the bare `@lilydesignsystem/angular-date-time-picker`
import, resolved from `node_modules` by a real install via the
`dependencies` ng-packagr writes into `dist/package.json`. Confirmed
by inspecting the built FESM bundle after `ng-packagr` ran: both
`@lilydesignsystem/angular-headless` and
`@lilydesignsystem/angular-date-time-picker` remain external imports,
never inlined.

## Deviations from the Svelte reference (read spec/index.md §3 and §10 for full reasoning)

1. Angular's headless `GanttTableTD` has no `active` prop at all
   (Svelte's does, and the Svelte package's own spec/CHANGELOG spend a
   full section explaining why it is deliberately *not* reused for
   span-membership). That whole "prop overload" question does not
   arise in the Angular port — there is no prop to overload.
2. Angular's headless `GanttTable` sets no `role="grid"` (Svelte's
   does) — patched by `GanttChart` itself, once, client-side, the same
   fix `kanban-board` needed for the identical gap in `KanbanTable`.
3. Angular's headless `GanttTable` has no `caption` input — a
   projected `<caption>` element covers it.
4. `onTaskChange` (a Svelte callback prop) becomes the `taskChange`
   output.
