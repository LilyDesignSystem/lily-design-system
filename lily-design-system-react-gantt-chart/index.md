# @lilydesignsystem/react-gantt-chart

A headless, accessible Gantt chart for React 19. Composes
`@lilydesignsystem/react-headless`'s `GanttTable` family plus, for
editing, this catalog's sibling `@lilydesignsystem/react-date-time-picker`
helper — used twice per edit session, for a task's start and end date.
Ships no CSS.

See [spec/index.md](./spec/index.md) for the canonical contract and
[AGENTS.md](./AGENTS.md) for a fast index aimed at AI coding agents.

## Install

```sh
npm install @lilydesignsystem/react-gantt-chart @lilydesignsystem/react-headless @lilydesignsystem/react-date-time-picker
```

## Quick start

```tsx
import GanttChart from "@lilydesignsystem/react-gantt-chart";
import type { GanttTask } from "@lilydesignsystem/react-gantt-chart";
import { useState } from "react";

const DTP_LABELS = {
  previousYear: "Previous year",
  previousMonth: "Previous month",
  previousWeek: "Previous week",
  previousDay: "Previous day",
  nextDay: "Next day",
  nextWeek: "Next week",
  nextMonth: "Next month",
  nextYear: "Next year",
  confirm: "Confirm",
  cancel: "Cancel",
};

function Chart() {
  const [tasks, setTasks] = useState<GanttTask[]>([
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03" },
    { id: "build", label: "Build", start: "2026-10-04", end: "2026-10-06", dependsOn: ["design"] },
  ]);

  return (
    <GanttChart
      label="Q4 plan"
      range={{ start: "2026-10-01", end: "2026-10-31" }}
      tasks={tasks}
      today="2026-10-05"
      onTaskChange={(taskId, start, end) =>
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, start, end } : t)))
      }
      labels={{
        columnLabel: (start) => start,
        startLabel: "Start date",
        endLabel: "End date",
        dateTimePickerLabels: DTP_LABELS,
        saveLabel: "Save",
        cancelLabel: "Cancel",
        dependencySummary: (preds) => `Blocked by: ${preds.join(", ")}`,
        dateAnnouncement: (title, start, end) => `${title} moved to ${start} - ${end}`,
        collapseButton: (task, collapsed) => (collapsed ? `Expand ${task.label}` : `Collapse ${task.label}`),
      }}
    />
  );
}
```

## Keyboard

- Arrow keys move the roving-tabindex cursor between cells; they clamp
  at the grid's edges within the current row/column axis (they never
  wrap).
- `Home`/`End` jump to the first/last column in the current row;
  `Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell.
- `Enter`/`Space` on a focused non-parent row opens an inline edit
  region with two composed `DateTimePicker` instances — Save commits,
  Cancel discards.

Editing is never drag-only: the edit region is always reachable by
keyboard, independent of pointer drag-and-drop. See spec/index.md §6
for the accessibility research this design choice is based on.

## Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

## Styling hooks

`gantt-chart`, `gantt-chart-collapse-button`,
`gantt-chart-dependency-summary`, `gantt-chart-bar`,
`gantt-chart-edit-row`, `gantt-chart-save-button`,
`gantt-chart-cancel-button`, `gantt-chart-status`, plus
`[data-in-range]`, `[data-milestone]`, `[data-today]`, and
`[data-percent-complete]` on body cells.
- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `onFieldEdit` edits them in place (click, F2, Tab). See [spec §15](./spec/index.md#15-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
- **Export and virtualization** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons; `virtualize` windows long task lists.

## Non-goals

Critical-path calculation, interactive zoom-level switching, calendar-derived holiday shading (`isNonWorking` marks holidays), resource/assignee columns — see
spec/index.md §9.
