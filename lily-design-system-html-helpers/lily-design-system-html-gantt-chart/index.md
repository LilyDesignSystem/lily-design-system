# `<gantt-chart>` (HTML helper)

A reusable, headless vanilla HTML/JS interactive Gantt chart, packaged
as a **web component (custom element)**. Task bars are column-spanning
grid cells — never pixel-positioned floating divs.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide.

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [Rendered markup](#rendered-markup)
- [Styling is required](#styling-is-required)
- [Attributes](#attributes)
- [JS properties](#js-properties)
- [Events](#events)
- [Row hierarchy and dependencies](#row-hierarchy-and-dependencies)
- [Keyboard](#keyboard)
- [Accessibility](#accessibility)
- [Testing](#testing)

## Install

```sh
npm install @lilydesignsystem/html-gantt-chart
```

Installing also pulls in `@lilydesignsystem/html-date-time-picker` (a
real npm `dependency`), which `<gantt-chart>` composes twice per edit
session.

## Quick start

```html
<script type="module">
  import "@lilydesignsystem/html-gantt-chart";

  const chart = document.querySelector("gantt-chart");
  chart.range = { start: "2026-10-01", end: "2026-10-31" };
  chart.tasks = [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-05" },
    { id: "build", label: "Build", start: "2026-10-06", end: "2026-10-20", dependsOn: ["design"], percentComplete: 30 },
    { id: "launch", label: "Launch", start: "2026-10-21", end: "2026-10-21" }, // milestone
  ];
  chart.today = "2026-10-10";
  chart.labels = {
    columnLabel: (start) => start,
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
  chart.addEventListener("taskchange", (event) => {
    const { taskId, start, end } = event.detail;
    // Persist the change…
  });
</script>

<gantt-chart label="Q4 plan"></gantt-chart>
```

`range`, `tasks`, `taskLabel`, `onTaskChange`, and `labels` are
**property-only** — set them from JavaScript, as above, or listen for
the `taskchange` event instead of setting `onTaskChange`.

**Editing requires `labels.dateTimePickerLabels`.** Without it, Enter/
Space on a task row does nothing — matching `date-time-picker`'s own
requirement that `labels` be supplied.

## Rendered markup

See [spec/index.md §5](./spec/index.md#5-html) for the full shape. In
short: a `<table class="gantt-table" role="grid">`, one leading blank
header column plus one header per day/week/month, and one body row per
(flattened, hierarchy-aware) task.

## Styling is required

This package ships **zero CSS**, including the task bar's fill,
continuous-bar appearance across `data-in-range` cells, milestone glyph,
today-column highlight, and the inline edit region's layout. Everything
is yours via the `gantt-chart`/`gantt-table-*`/`gantt-chart-*` class
hooks and `data-in-range`/`data-milestone`/`data-today`/
`data-percent-complete` attributes.

## Attributes

| Attribute   | Type                             | Required | Default |
| ----------- | ----------------------------------- | -------- | ------- |
| `label`     | string                              | yes      | —       |
| `caption`   | string                              | no       | —       |
| `time-unit` | `"day" \| "week" \| "month"`         | no       | `"day"` |
| `today`     | ISO date                            | no       | — (no marker unless set) |
| `class`     | string                              | no       | —       |

## JS properties

| Property        | Type                                                    | Required | Default |
| ---------------- | ---------------------------------------------------------- | -------- | ------- |
| `range`          | `{ start: string; end: string }` (ISO dates)                 | yes      | —       |
| `tasks`          | `GanttTask[]`                                                | yes      | `[]`    |
| `taskLabel`      | `(task: GanttTask) => string`                                 | no       | `task.label` |
| `onTaskChange`   | `(taskId: string, start: string, end: string) => void`        | no       | —       |
| `labels`         | `GanttLabels`                                                 | no       | `{}`    |

`GanttTask`: `{ id, label, start, end, percentComplete?, parentId?,
dependsOn? }`. `start === end` marks a milestone.

## Events

| Event        | Detail                                                 | Fires when |
| ------------ | --------------------------------------------------------- | ---------- |
| `taskchange` | `{ taskId: string; start: string; end: string }`           | A task's dates change, by pointer drag or the edit region. |

## Row hierarchy and dependencies

Give child tasks a `parentId` matching a parent task's `id`; parent rows
render read-only, with `start`/`end` derived as the min/max of their
descendants, and a collapse button (`aria-expanded`) that removes
descendant rows from the DOM outright. `dependsOn: string[]` (other
tasks' ids, finish-to-start) renders as data — an `aria-describedby`
reference to a generated text summary — never a drawn dependency arrow;
see [spec/index.md §9](./spec/index.md#9-non-goals) for why.

## Keyboard

WAI-ARIA APG Grid pattern, identical model to `kanban-board`. Arrow keys
move the cursor and clamp; `Home`/`End`/`Ctrl+Home`/`Ctrl+End` jump
within/across the grid. `Enter`/`Space` on a focused non-parent row
opens its inline edit region (two composed `<date-time-picker>`
instances); parent rows never open one.

## Accessibility

`role="grid"` on the table; roving `tabindex` for body cells. Editing
via composed `<date-time-picker>` is the accessible path for
rescheduling; native drag-and-drop is supplementary, never required
(WCAG 2.5.7). One `aria-live="polite"` region for all edit
announcements.

## Testing

```sh
npx vitest run lily-design-system-html-gantt-chart/gantt-chart.test.ts
```
