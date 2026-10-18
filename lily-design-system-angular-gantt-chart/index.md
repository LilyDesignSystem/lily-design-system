# Lily Design System™ — Angular GanttChart

A headless, interactive Gantt chart: task bars as column-spanning grid
cells (never pixel-positioned floating divs), keyboard-accessible date
editing composed from
[`date-time-picker`](../lily-design-system-angular-date-time-picker/index.md),
row hierarchy, milestones, percent-complete, a today marker, and
dependency data. Ports
[`@lilydesignsystem/svelte-gantt-chart`](../lily-design-system-svelte-gantt-chart/index.md)
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
- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `fieldEdit` output with `[editableFields]="true"` edits them in place (click, F2, Tab). See [spec §11](./spec/index.md#11-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
- **Export and virtualization** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons; `virtualize` windows long task lists.

## Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

## Filtering and sorting (0.7.0)

- **`filter(task)`** hides tasks it rejects; a passing task keeps its ancestors, as a search match does, and it combines with `search` (both must pass).
- **`compare(a, b)`** orders tasks among their siblings — stable, and the hierarchy is kept (a child stays under its parent). Collapse, the visible export and keyboard order all follow it.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same tasks, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the `copy` output and `copyHandler({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten task rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next task whose label starts with them (the label is `taskLabel(task)`, ignoring case and diacritics; the same letter again steps through matches). A lone `s` stays the select shortcut; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate, an end before the start): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(task, header, reason)` is announced, falling back to `labels.editInvalid`.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through the `fieldEdit` output** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without the `fieldEdit` output. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.

## Search (0.7.0)

`search` (a `model()`; the field renders when `labels.search` names it) narrows the tasks: every word must appear, in any order, ignoring case and diacritics. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves. See spec §18.

## Critical path (optional helper)

The chart renders `critical` and `slack`; it computes nothing. `applyCriticalPath(tasks)` (or `criticalPath(tasks)` for the raw result) fills them in: a forward and backward pass over leaf tasks, all four dependency kinds (`e2s`, `s2s`, `e2e`, `s2e`) with lags and leads in calendar days. A task's own `start` is a floor, so dependencies only push tasks later; summary rows, unscheduled tasks and unknown ids are ignored; a dependency cycle is reported in `cycle` and left out. Show it with `labels.criticalLabel`.

Lag is in calendar days by default. For schedules that count business days, pass `{ lagUnit: "working-days", weekends, unavailable }` (the same `weekends` and `unavailable` you give the chart for shading): a lag of N then moves N working days, skipping weekends (default Saturday and Sunday) and the listed holidays, and the backward pass keeps a predecessor off non-working days so a weekend is never reported as slack. Task spans stay as dated; only the gaps between tasks change.

```ts
import { applyCriticalPath } from "@lilydesignsystem/angular-gantt-chart";
const tasks = applyCriticalPath(rawTasks); // each leaf task gains critical / slack
```

## Non-goals

Critical-path calculation, interactive zoom-level switching, calendar-derived holiday shading (`isNonWorking` marks holidays), resource/assignee columns — see
[spec/index.md §9](./spec/index.md#9-non-goals).
