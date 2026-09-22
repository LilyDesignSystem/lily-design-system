# `<lily-gantt-chart>` (HTML helper)

A reusable, headless vanilla HTML/JS Gantt chart packaged as a
**web component (custom element)**. Task bars render as
column-spanning grid cells (never pixel-positioned floating divs).
Rescheduling is never drag-only: Enter/Space on a task row opens an
inline edit region composing two `<lily-date-time-picker>` instances.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide.

## Install

```ts
// One side-effect import registers <lily-gantt-chart> (and its
// dependencies, <lily-gantt-table> and <lily-date-time-picker>) globally:
import "@lilydesignsystem/web-components-gantt-chart";

import { GanttChart, generateColumns, flattenTasks } from "@lilydesignsystem/web-components-gantt-chart";
import type { GanttChartProps, GanttTask, GanttLabels } from "@lilydesignsystem/web-components-gantt-chart";
```

## Quick start

```html
<lily-gantt-chart id="chart" label="Q4 plan" today="2026-10-05"></lily-gantt-chart>
<script type="module">
  import "@lilydesignsystem/web-components-gantt-chart";

  const chart = document.getElementById("chart");
  chart.range = { start: "2026-10-01", end: "2026-10-31" };
  chart.tasks = [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-05" },
    { id: "build", label: "Build", start: "2026-10-06", end: "2026-10-12", dependsOn: ["design"], percentComplete: 40 },
  ];
  chart.labels = {
    columnLabel: (start) => start.slice(-2), // day-of-month
    startLabel: "Start date",
    endLabel: "End date",
    dateTimePickerLabels: {
      previousYear: "Previous year", previousMonth: "Previous month",
      previousWeek: "Previous week", previousDay: "Previous day",
      nextDay: "Next day", nextWeek: "Next week",
      nextMonth: "Next month", nextYear: "Next year",
      confirm: "Confirm", cancel: "Cancel",
    },
    saveLabel: "Save",
    cancelLabel: "Cancel",
    dependencySummary: (preds) => `Blocked by: ${preds.join(", ")}`,
    dateAnnouncement: (title, start, end) => `${title} moved to ${start} – ${end}`,
    collapseButton: (task, collapsed) => (collapsed ? `Expand ${task.label}` : `Collapse ${task.label}`),
  };
  chart.onTaskChange = (taskId, start, end) => {
    // This component never mutates `tasks` itself — update your own
    // data and re-set `chart.tasks`, matching kanban-board's contract.
    chart.tasks = chart.tasks.map((t) => (t.id === taskId ? { ...t, start, end } : t));
  };
</script>
```

`range`, `tasks`, `taskLabel`, `onTaskChange`, and `labels` are
**property-only**. `label`, `caption`, `today`, `time-unit`, and
`class` are ordinary attributes (`today`/`time-unit` also have JS
property mirrors: `today`, `timeUnit`).

**Editing requires `labels.dateTimePickerLabels`** — `date-time-picker`
itself requires that object, so the edit region simply does not open
without it (label-presence-gates-control, the Lily-wide convention).

## Rendered markup

See [spec/index.md §4](./spec/index.md#4-html) for the full shape.
Class hooks: `.gantt-chart`, `.gantt-chart-th`,
`.gantt-chart-row-header`, `.gantt-chart-td`, `.gantt-chart-bar`,
`.gantt-chart-collapse-button`, `.gantt-chart-dependency-summary`,
`.gantt-chart-edit-row`, `.gantt-chart-save-button`,
`.gantt-chart-cancel-button`, `.gantt-chart-status`. No CSS ships.

## Keyboard

| Key | Effect |
| --- | --- |
| Arrow keys | Move the grid cursor; clamp at the edges |
| Home / End | Jump to the first/last column of the current row |
| Ctrl+Home / Ctrl+End | Jump to the grid's first/last cell |
| Enter / Space (non-parent row) | Open that task's edit region |

Inside the edit region, keyboard control belongs to each composed
`<lily-date-time-picker>` and the plain Save/Cancel buttons — see that
package's own guide.

## Row hierarchy

Set `parentId` on a `GanttTask` to nest it under another. A parent's
`start`/`end` are always derived (min start / max end of its
descendants) — setting them on the parent task itself has no effect
on rendering. The row header's collapse button (only rendered on
parent rows) removes/restores descendant rows from the DOM outright.

## Dependencies

Set `dependsOn: [otherTaskId, …]` on a `GanttTask` for a
finish-to-start dependency. This renders as text
(`aria-describedby`, via `labels.dependencySummary`), never a drawn
arrow — see [spec/index.md §9](./spec/index.md#9-non-goals) for why
dependency-arrow rendering is out of scope industry-wide, not
uniquely skipped here.

## Accessibility

See [spec/index.md §7](./spec/index.md#7-accessibility) and
[docs/accessibility.md](./docs/accessibility.md).

## Testing

`npm test` from the workspace root runs every helper's suite,
including this one's, under vitest + jsdom.
