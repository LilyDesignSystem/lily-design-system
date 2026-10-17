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

## Search (0.7.0)

`search` (bindable; the field renders when `labels.search` names it) narrows the tasks: every word must appear, in any order, ignoring case and diacritics. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves. See spec §18.

## Non-goals (v1)

Critical-path calculation, interactive zoom-level
switching, holiday shading from a calendar (`isNonWorking` marks them; `weekends` marks weekdays), resource/assignee columns. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out.

---

Lily™ and Lily Design System™ are trademarks.
