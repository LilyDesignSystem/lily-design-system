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
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.

## Search (0.7.0)

`search` (controlled when given; the field renders when `labels.search` names it) narrows the tasks: every word must appear, in any order, ignoring case and diacritics. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves. See spec §18.

## Non-goals

Critical-path calculation, interactive zoom-level switching, calendar-derived holiday shading (`isNonWorking` marks holidays), resource/assignee columns — see
spec/index.md §9.
