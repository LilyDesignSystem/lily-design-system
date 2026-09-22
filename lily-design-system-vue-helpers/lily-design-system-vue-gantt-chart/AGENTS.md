# AGENTS — GanttChart (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless interactive Gantt chart. It composes
`@lilydesignsystem/vue-headless`'s `GanttTable` family (a real npm
dependency, unmodified — task bars are column-spanning grid cells,
never pixel-positioned floating divs) and, matching `vue-picker-bar`'s
own precedent, a sibling *helper* rather than only headless components:
`@lilydesignsystem/vue-date-time-picker`, used twice per edit session
(start date, end date) as the keyboard-accessible way to reschedule or
resize a task. Ships no CSS.

A direct port of the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/).
When the two disagree, the Svelte side wins.

## Files

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).             |
| `GanttChart.vue`     | Implementation. `<script setup lang="ts">`.             |
| `GanttChart.test.ts` | Vitest + `@vue/test-utils` spec, one or more assertions per §8 acceptance clause. |
| `shims.d.ts`         | Local-only ambient module declarations for `@lilydesignsystem/vue-headless` and `@lilydesignsystem/vue-date-time-picker` — works around a real `vue-tsc` limitation (see `spec/index.md` §10 and `lily-design-system-vue-picker-bar/shims.d.ts`). Not published. |
| `index.ts`           | Barrel re-export.                                       |
| `index.md`           | User guide.                                              |

## Public surface

- Default export: `GanttChart` component.
- Named exports: `GanttChart`, `nextGanttChartId`.
- Type exports: `Props`, `GanttTask`, `GanttTimeUnit`, `GanttLabels`,
  `GanttColumn`, `FlatRow`.
- Utility exports: `compareISO`, `effectiveRange`, `endOfMonth`,
  `flattenTasks`, `generateColumns` — pure hierarchy/column helpers
  ported directly from the Svelte canonical — plus `addDays`,
  re-exported from `@lilydesignsystem/vue-date-time-picker` for public-
  surface parity with the Svelte canonical (which defines it locally;
  this port reuses the sibling package's own UTC-epoch-day-safe
  implementation instead — see spec/index.md §3). Note
  `generateColumns`'s own signature takes an explicit `addDaysFn`
  parameter (`generateColumns(range, timeUnit, addDays)`), unlike the
  Svelte canonical's version which closes over a module-local
  `addDays` — see spec/index.md §3 for why.
- Event: `task-change(taskId: string, start: string, end: string)` —
  the Vue-idiomatic equivalent of the Svelte canonical's `onTaskChange`
  callback prop.

Required props: `label`, `range`, `tasks`.

## Behaviour contract (one paragraph)

`range`/`timeUnit` (`"day"` default, `"week"`, `"month"`) generate a
fixed set of columns using UTC/epoch-day arithmetic — never
local-midnight `Date` construction. A task's `[start, end]` marks every
overlapping column's cell `data-in-range`; a milestone (`start ===
end`) marks exactly one cell `data-milestone`. `task.parentId` builds a
row hierarchy; a parent's own `start`/`end` are derived (min/max) from
its descendants and rendered read-only, with a collapse button that
removes descendant rows from the DOM outright. `task.dependsOn`
renders as an `aria-describedby` text summary, never a drawn arrow
(documented non-goal). Editing is never drag-only: Enter/Space on a
focused task row opens an inline region composing two `DateTimePicker`
instances, gated on `labels.dateTimePickerLabels` being supplied.
Pointer drag-and-drop (native HTML5) reschedules a task, preserving its
duration; supplementary, never the only path. Keyboard follows the
same WAI-ARIA APG Grid roving-tabindex model as `data-grid` and
`kanban-board`. Every successful edit announces through one
`.gantt-chart-status aria-live="polite"` region built from
`labels.dateAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {class}">` wrapping the
unmodified `GanttTable` family, with an inline `.gantt-chart-edit-row`
(colspan) appearing only while a task is being edited.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `GanttTable`).
- Roving tabindex, not `aria-activedescendant` — matches `data-grid`
  and `kanban-board`.
- **`GanttTableTD`'s own `active` prop overload, confirmed present in
  Vue too.** Its doc comment claims "active state to indicate the task
  spans this time period," but its actual template
  (`:aria-selected="active || undefined"`, `:tabindex="active ? 0 :
  -1"`) ties `active` to the roving-tabindex cursor, exactly like
  Svelte's own `GanttTableTD`. This package therefore makes the
  identical choice the Svelte canonical made: `active` means only the
  cursor here; span membership is the separate `data-in-range`
  attribute; `GanttTableTD` itself is not modified. See spec/index.md
  §3.
- Editing via composed `DateTimePicker` is the accessible path for
  rescheduling/resizing; drag is supplementary, never required.
- One `aria-live="polite"` region for all edit announcements.

## Conventions this package follows

- Vue 3 Composition API, `<script setup lang="ts">`, `defineProps`,
  `defineEmits`, `withDefaults`.
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/vue-headless` and
  `@lilydesignsystem/vue-date-time-picker` as real dependencies — never
  vendors `GanttTable`'s or `DateTimePicker`'s markup.
- UTC/epoch-day date arithmetic throughout — reuses
  `date-time-picker`'s own `addDays`/`parseIsoDate`/`toEpochDay` where
  possible rather than re-deriving them; the gantt-specific helpers
  (`compareISO`, `endOfMonth`, `generateColumns`, `flattenTasks`,
  `effectiveRange`) are ported directly since date-time-picker has no
  equivalent for them.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names — editing itself is gated on
  `labels.dateTimePickerLabels` in two independent places (the function
  that opens the edit region, and the template block that renders it).
  No baked-in English fallback.
- A callback prop in the Svelte canonical (`onTaskChange`) becomes an
  emitted event (`task-change`) here.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom-level switching, weekend/holiday shading, resource/assignee
  columns) are documented, not silently missing — see spec/index.md §9.

## Local development notes

This catalog has no pnpm workspace linking. `../vite.config.js` aliases
both `@lilydesignsystem/vue-headless` and
`@lilydesignsystem/vue-date-time-picker` to their already-built `dist/`
outputs so tests resolve locally. `../vite.lib.config.ts` externalizes
both specifiers for this package's own build, so the published
`dist/index.js` keeps the bare `import` statements rather than bundling
either dependency in — matching `vue-picker-bar`'s established pattern
for a same-catalog cross-package dependency (see its own AGENTS.md
"Local development notes").
