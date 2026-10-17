# GanttChart (Svelte helper)

A reusable Svelte 5 headless **interactive Gantt chart**. It composes
`@lilydesignsystem/svelte-headless`'s `GanttTable` family — task bars
rendered as column-spanning grid cells, never pixel-positioned
floating divs — and `@lilydesignsystem/svelte-date-time-picker`, used
twice per edit session (start date, end date), as the
keyboard-accessible way to reschedule or resize a task. Ships no CSS:
every visual detail is the consumer's, via kebab-case class hooks and
`data-*` attributes.

Editing is never drag-only. Native drag-and-drop fails WCAG 2.5.7
(Dragging Movements); the research behind this package (see
[spec/index.md](./spec/index.md)) found that even mature commercial
Gantt libraries ship no keyboard shortcut for dragging a bar — their
accessible path is a typed-field edit surface, which is exactly what
composing `date-time-picker` gives this package for free.

## Usage

```svelte
<script lang="ts">
  import GanttChart from "@lilydesignsystem/svelte-gantt-chart";
  import type { GanttTask } from "@lilydesignsystem/svelte-gantt-chart";

  let tasks = $state<GanttTask[]>([
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-05" },
    { id: "build", label: "Build", start: "2026-10-06", end: "2026-10-12", dependsOn: ["design"] },
    { id: "launch", label: "Launch", start: "2026-10-13", end: "2026-10-13" }, // milestone
  ]);

  function handleTaskChange(taskId: string, start: string, end: string) {
    tasks = tasks.map((t) => (t.id === taskId ? { ...t, start, end } : t));
  }
</script>

<GanttChart
  label="Q4 launch plan"
  range={{ start: "2026-10-01", end: "2026-10-31" }}
  {tasks}
  today="2026-10-08"
  onTaskChange={handleTaskChange}
  labels={{
    columnLabel: (start) => start,
    startLabel: "Start date",
    endLabel: "End date",
    saveLabel: "Save",
    cancelLabel: "Cancel",
    dependencySummary: (predecessors) => `Blocked by: ${predecessors.join(", ")}`,
    dateAnnouncement: (title, start, end) => `${title} rescheduled to ${start} – ${end}`,
    collapseButton: (task, collapsed) => (collapsed ? `Expand ${task.label}` : `Collapse ${task.label}`),
    dateTimePickerLabels: {
      previousYear: "Previous year", previousMonth: "Previous month",
      previousWeek: "Previous week", previousDay: "Previous day",
      nextDay: "Next day", nextWeek: "Next week",
      nextMonth: "Next month", nextYear: "Next year",
      confirm: "Confirm", cancel: "Cancel",
    },
  }}
/>
```

## Props

See [spec/index.md §5](./spec/index.md#5-props) for the full table.
Required: `label`, `range`, `tasks`. Every optional `labels.*` field
gates the control it names — editing itself is gated on
`labels.dateTimePickerLabels` being supplied, since `date-time-picker`
requires it too.

## Behaviour

- **Time axis**: `range`/`timeUnit` (`"day"` default, or `"week"`/
  `"month"`) generate a fixed set of columns using UTC/epoch-day
  arithmetic — never local-midnight `Date` construction.
- **Task bars**: a `[start, end]` range marks every overlapping
  column's cell `data-in-range`; a milestone (`start === end`) marks
  one cell `data-milestone`.
- **Row hierarchy**: `task.parentId` builds a tree; a parent's own
  `start`/`end` are derived from its descendants and rendered
  read-only, with a collapse button that removes descendant rows from
  the DOM outright.
- **Dependencies**: `task.dependsOn` renders as an `aria-describedby`
  text summary; with `dependencyArrows` an `aria-hidden` SVG overlay also draws an arrow per dependency (0.6.0), so the text stays the accessible description.
- **Edit — keyboard**: Enter/Space on a focused task row opens an
  inline region with two composed `DateTimePicker` instances.
- **Edit — pointer**: native HTML5 drag-and-drop reschedules a task;
  supplementary, never the only path.
- **Keyboard**: WAI-ARIA APG Grid roving-tabindex, the same model
  `data-grid` and `kanban-board` use.
- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `onFieldEdit` edits them in place (click, F2, Tab). See [spec §16](./spec/index.md#16-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
- **Export and virtualization** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons; `virtualize` windows long task lists.
- **Announcements**: every successful edit announces via one
  `aria-live="polite"` region.

## Non-goals (v1)

Critical-path calculation, interactive zoom-level
switching, holiday shading from a calendar (`isNonWorking` marks them; `weekends` marks weekdays), resource/assignee columns. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out.

---

Lily™ and Lily Design System™ are trademarks.
