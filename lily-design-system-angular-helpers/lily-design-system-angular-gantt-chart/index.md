# Lily Design System™ — Angular GanttChart

A headless, interactive Gantt chart: task bars as column-spanning grid
cells (never pixel-positioned floating divs), keyboard-accessible date
editing composed from
[`date-time-picker`](../lily-design-system-angular-date-time-picker/index.md),
row hierarchy, milestones, percent-complete, a today marker, and
dependency data. Ports
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/index.md)
to Angular 20.

## Install

```sh
npm install @lilydesignsystem/angular-gantt-chart
```

`@lilydesignsystem/angular-headless` and
`@lilydesignsystem/angular-date-time-picker` install automatically as
regular dependencies — `GanttChart` composes both, not a
reimplementation.

## Usage

```ts
import { Component } from "@angular/core";
import { GanttChart, type GanttTaskChangeEvent } from "@lilydesignsystem/angular-gantt-chart";

@Component({
  selector: "app-plan",
  standalone: true,
  imports: [GanttChart],
  template: `
    <lily-gantt-chart
      label="Q4 plan"
      [range]="range"
      [tasks]="tasks"
      today="2026-10-05"
      [labels]="labels"
      (taskChange)="onTaskChange($event)"
    />
  `,
})
export class PlanComponent {
  range = { start: "2026-10-01", end: "2026-10-31" };

  tasks = [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-05" },
    {
      id: "build",
      label: "Build",
      start: "2026-10-06",
      end: "2026-10-12",
      dependsOn: ["design"],
      percentComplete: 40,
    },
    { id: "launch", label: "Launch", start: "2026-10-15", end: "2026-10-15" }, // milestone
  ];

  labels = {
    columnLabel: (start: string) => start,
    startLabel: "Start date",
    endLabel: "End date",
    dateTimePickerLabels: {
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
    },
    saveLabel: "Save",
    cancelLabel: "Cancel",
    dependencySummary: (preds: string[]) => `Blocked by: ${preds.join(", ")}`,
    dateAnnouncement: (title: string, start: string, end: string) =>
      `${title} moved to ${start} – ${end}`,
    collapseButton: (task: { label: string }, collapsed: boolean) =>
      collapsed ? `Expand ${task.label}` : `Collapse ${task.label}`,
  };

  onTaskChange({ taskId, start, end }: GanttTaskChangeEvent): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) Object.assign(task, { start, end });
  }
}
```

## Behaviour

- **Task bars.** A task's date range renders as the run of grid cells
  its start/end covers, marked `data-in-range`; a zero-duration task
  (`start === end`) is a milestone, marked `data-milestone` instead.
- **Editing a task — keyboard (the primary path).** Focus a task row
  (roving `tabindex`, WAI-ARIA APG Grid pattern) and press Enter or
  Space to open an inline edit region with two composed date pickers
  (start, end); Save applies the change, Cancel discards it. Gated on
  `labels.dateTimePickerLabels` being supplied — omit it and editing
  simply does not open, the same label-presence-gates-control rule
  every Lily helper follows.
- **Editing a task — pointer.** Drag a task's bar to another column to
  reschedule it, preserving its duration. Supplementary to the
  keyboard path, never the only way to edit — Syncfusion's own
  accessibility documentation confirms no keyboard shortcut exists for
  dragging a Gantt bar, which is why the typed-field edit surface is
  the accessible path here, not an enhancement to it.
- **Row hierarchy.** `task.parentId` builds a tree; a parent's own
  date range is derived from its children and rendered read-only.
  Collapsing a parent removes its descendant rows from the DOM
  outright.
- **Dependencies.** `task.dependsOn` is data, not a rendered arrow —
  the dependent task's cell carries `aria-describedby` pointing at a
  generated summary built from `labels.dependencySummary`.
- **Today marker.** `today`, when supplied, marks its column
  `data-today`; never computed internally (an SSR-safe rule — a
  server-computed "today" and a client-computed one can disagree
  across a render boundary).

## Labels

Every user-facing string is optional on `GanttLabels`, and its
presence gates the control it names. `labels.dateTimePickerLabels` is
the big one: without it, the whole edit region stays off, because
`date-time-picker` itself requires its own `labels` — this package
never invents English text on that component's behalf.

## Accessibility

WAI-ARIA APG Grid pattern throughout — see
[spec/index.md §7](./spec/index.md#7-accessibility) for the full
contract, and §3 for where this port fills small gaps in Angular's own
headless `GanttTable` (no `role="grid"`, no `caption` input) rather
than modifying that package, and for the `GanttTableTD` `active`-prop
finding (Angular's version has none at all, unlike Svelte's).

## Non-goals

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns — see
[spec/index.md §9](./spec/index.md#9-non-goals).
