# AGENTS — GanttChart (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless interactive Gantt chart. It composes
`@lilydesignsystem/svelte-headless`'s `GanttTable` family (a real npm
dependency, unmodified — task bars are column-spanning grid cells,
never pixel-positioned floating divs) and, for the first time among
Lily helpers, a sibling *helper* rather than only headless components:
`@lilydesignsystem/svelte-date-time-picker`, used twice per edit
session (start date, end date) as the keyboard-accessible way to
reschedule or resize a task. Ships no CSS.

Proposed and documented first in
[spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md)
(2026-09-21), implemented here (2026-09-22). No other framework catalog
ports it yet.

## Files

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).             |
| `GanttChart.svelte`  | Implementation. TypeScript + Svelte 5 runes.            |
| `GanttChart.test.ts` | Vitest spec, one or more assertions per §8 acceptance. |
| `index.ts`           | Barrel re-export.                                       |
| `index.md`           | User guide.                                             |

## Public surface

- Default export: `GanttChart` component.
- Named export: `GanttChart`.
- Type exports: `Props`, `GanttTask`, `GanttTimeUnit`, `GanttLabels`,
  `GanttColumn`.
- Utility exports: `addDays`, `compareISO`, `effectiveRange`,
  `endOfMonth`, `flattenTasks`, `generateColumns` — UTC/epoch-day civil
  date arithmetic and pure hierarchy helpers, exported because they are
  independently useful and independently testable.

Required props: `label`, `range`, `tasks`.

## Behaviour contract (one paragraph)

`range`/`timeUnit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns using UTC/epoch-day arithmetic — never
local-midnight `Date` construction, the established Lily convention
from `date-time-picker`. A task's `[start, end]` marks every
overlapping column's cell `data-in-range`; a milestone (`start ===
end`) marks exactly one cell `data-milestone`. `task.parentId` builds a
row hierarchy; a parent's own `start`/`end` are derived (min/max) from
its descendants and rendered read-only, with a collapse button that
removes descendant rows from the DOM outright.  `task.dependsOn`
renders as an `aria-describedby` text summary, never a drawn arrow
(documented non-goal — every accessibility source consulted treats
dependency-arrow rendering as an unsolved problem industry-wide, not
something Lily is uniquely skipping). Editing is never drag-only:
Enter/Space on a focused task row opens an inline region composing two
`DateTimePicker` instances, gated on `labels.dateTimePickerLabels`
being supplied (mirrors `date-time-picker`'s own label-presence-gates
convention). Pointer drag-and-drop (native HTML5) reschedules a task,
preserving its duration; supplementary, never the only path — per
WCAG 2.5.7 and the Syncfusion/Telerik accessibility research cited in
spec/index.md, which found neither commercial Gantt library ships a
keyboard shortcut for dragging a bar. Keyboard follows the same
WAI-ARIA APG Grid roving-tabindex model as `data-grid` and
`kanban-board`. Every successful edit announces through one
`.gantt-chart-status aria-live="polite"` region built from
`labels.dateAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {class}">` wrapping the
unmodified `GanttTable` family, with an inline
`.gantt-chart-edit-row` (colspan) appearing only while a task is being
edited.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `GanttTable`).
- Roving tabindex, not `aria-activedescendant` — matches `data-grid`
  and `kanban-board`.
- `GanttTableTD`'s own `active` prop means only "roving-tabindex
  cursor" here, consistent with the other two grids — reusing it for
  span-membership would put more than one cell at `tabindex="0"`
  whenever a task's bar spans more than one column. Span membership is
  the separate `data-in-range` attribute instead; `GanttTableTD` itself
  is not modified. See spec/index.md §3.
- Editing via composed `DateTimePicker` is the accessible path for
  rescheduling/resizing; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$derived`, `$derived.by`,
  `$effect`).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/svelte-headless` and
  `@lilydesignsystem/svelte-date-time-picker` as real dependencies —
  never vendors `GanttTable`'s or `DateTimePicker`'s markup.
- UTC/epoch-day date arithmetic throughout — never local-midnight
  `Date` construction (DST-bug-prone, an established Lily convention).
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names — editing itself is gated on
  `labels.dateTimePickerLabels`, since `date-time-picker` requires it
  too. No baked-in English fallback.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §9.
