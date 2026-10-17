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

## Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

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
- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `onFieldEdit` edits them in place (click, F2, Tab). See [spec §11](./spec/index.md#11-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
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
