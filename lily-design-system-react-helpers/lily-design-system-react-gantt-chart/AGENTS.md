# AGENTS — GanttChart (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless interactive Gantt chart. It composes
`@lilydesignsystem/react-headless`'s `GanttTable` family (a real npm
dependency, unmodified — task bars are column-spanning grid cells,
never pixel-positioned floating divs) and, for the first time among
this catalog's React helpers, a sibling *helper* rather than only
headless components: `@lilydesignsystem/react-date-time-picker`, used
twice per edit session (start date, end date) as the keyboard-
accessible way to reschedule or resize a task. Ships no CSS.

Ported from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/)
(2026-09-22), which is the reference implementation for this contract —
see [spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md).

## Files

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).             |
| `GanttChart.tsx`     | Implementation. TypeScript + React 19 hooks.            |
| `GanttChart.test.tsx`| Vitest spec, one or more assertions per §8 acceptance. |
| `index.ts`           | Barrel re-export.                                       |
| `index.md`           | User guide.                                             |

## Public surface

- Default export: `GanttChart` component.
- Named export: `GanttChart`.
- Type exports: `Props`, `GanttTask`, `GanttTimeUnit`, `GanttLabels`,
  `GanttColumn`.
- Utility exports: `compareISO`, `effectiveRange`, `endOfMonth`,
  `flattenTasks`, `generateColumns` — pure hierarchy/column-generation
  helpers, exported because they are independently useful and
  independently testable. **`addDays` is not re-exported here** —
  import it from `@lilydesignsystem/react-date-time-picker`, which
  this package itself depends on for the same UTC/epoch-day
  implementation. See spec/index.md §14.

Required props: `label`, `range`, `tasks`.

## Behaviour contract (one paragraph)

`range`/`timeUnit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns using UTC/epoch-day arithmetic — never
local-midnight `Date` construction. A task's `[start, end]` marks
every overlapping column's cell `data-in-range`; a milestone (`start
=== end`) marks exactly one cell `data-milestone`. `task.parentId`
builds a row hierarchy; a parent's own `start`/`end` are derived
(min/max) from its descendants and rendered read-only, with a
collapse button that removes descendant rows from the DOM outright.
`task.dependsOn` renders as an `aria-describedby` text summary, never
a drawn arrow (documented non-goal). Editing is never drag-only:
Enter/Space on a focused task row opens an inline region composing two
`DateTimePicker` instances, gated on `labels.dateTimePickerLabels`
being supplied (mirrors `date-time-picker`'s own label-presence-gates
convention). Pointer drag-and-drop (native HTML5) reschedules a task,
preserving its duration; supplementary, never the only path. Keyboard
follows the same WAI-ARIA APG Grid roving-tabindex model as
`react-kanban-board`. Every successful edit announces through one
`.gantt-chart-status aria-live="polite"` region built from
`labels.dateAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {className}">` wrapping the
unmodified `GanttTable` family, with an inline
`.gantt-chart-edit-row` (colSpan) appearing only while a task is being
edited.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `GanttTable`).
- Roving tabindex, not `aria-activedescendant` — matches
  `react-kanban-board`.
- `GanttTableTD`'s own `active` prop means only "roving-tabindex
  cursor" here — confirmed the same documentation/implementation
  overload the Svelte reference found (doc comment says "active time
  period for the task," implementation ties it to roving
  `tabindex`/`aria-selected`). Span membership is the separate
  `data-in-range` attribute instead; `GanttTableTD` itself is not
  modified. See spec/index.md §3.
- Editing via composed `DateTimePicker` is the accessible path for
  rescheduling/resizing; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- React 19 function components with hooks (`useState`, `useRef`,
  `useEffect`, `useId`).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/react-headless` and
  `@lilydesignsystem/react-date-time-picker` as real dependencies —
  never vendors `GanttTable`'s or `DateTimePicker`'s markup. See
  spec/index.md §13 for the cross-package build/alias pattern, mirrored
  from `react-picker-bar`.
- UTC/epoch-day date arithmetic throughout — never local-midnight
  `Date` construction. Reuses `addDays`/`parseIsoDate`/`toEpochDay`
  from `react-date-time-picker` rather than re-deriving them.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names — editing itself is gated on
  `labels.dateTimePickerLabels`, since `date-time-picker` requires
  `labels` too. No baked-in English fallback.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §9.
