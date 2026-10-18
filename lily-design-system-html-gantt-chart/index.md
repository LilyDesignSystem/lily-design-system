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
reference to a generated text summary — a drawn arrow only with `dependencyArrows`;
see [spec/index.md §9](./spec/index.md#9-non-goals) for why.

## Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

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
- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `onFieldEdit` edits them in place (click, F2, Tab). See [spec §12](./spec/index.md#12-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
- **Export and virtualization** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons; `virtualize` windows long task lists.

## Filtering and sorting (0.7.0)

- **`filter(task)`** hides tasks it rejects; a passing task keeps its ancestors, as a search match does, and it combines with `search` (both must pass).
- **`compare(a, b)`** orders tasks among their siblings — stable, and the hierarchy is kept (a child stays under its parent). Collapse, the visible export and keyboard order all follow it.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same tasks, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten task rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next task whose label starts with them (the label is `taskLabel(task)`, ignoring case and diacritics; the same letter again steps through matches). A lone `s` stays the select shortcut; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate, an end before the start): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(task, header, reason)` is announced, falling back to `labels.editInvalid`.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit` and the `fieldedit` event** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit` and the `fieldedit` event. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.

## Search (0.7.0)

`search` (a property; the field renders when `labels.search` names it) narrows the tasks: every word must appear, in any order, ignoring case and diacritics. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves. See spec §18.

## Critical path (optional helper)

The chart renders `critical` and `slack`; it computes nothing. `applyCriticalPath(tasks)` (or `criticalPath(tasks)` for the raw result) fills them in: a forward and backward pass over leaf tasks, all four dependency kinds (`e2s`, `s2s`, `e2e`, `s2e`) with lags and leads in calendar days. A task's own `start` is a floor, so dependencies only push tasks later; summary rows, unscheduled tasks and unknown ids are ignored; a dependency cycle is reported in `cycle` and left out. Show it with `labels.criticalLabel`.

Lag is in calendar days by default. For schedules that count business days, pass `{ lagUnit: "working-days", weekends, unavailable }` (the same `weekends` and `unavailable` you give the chart for shading): a lag of N then moves N working days, skipping weekends (default Saturday and Sunday) and the listed holidays, and the backward pass keeps a predecessor off non-working days so a weekend is never reported as slack. Task spans stay as dated; only the gaps between tasks change.

```ts
import { applyCriticalPath } from "@lilydesignsystem/html-gantt-chart";
const tasks = applyCriticalPath(rawTasks); // each leaf task gains critical / slack
```
