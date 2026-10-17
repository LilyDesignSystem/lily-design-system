# Lily Design System™ — Blazor GanttChart

A headless, keyboard-accessible Gantt chart: task bars render as
column-spanning grid cells (never pixel-positioned floating divs), and
editing a task's dates opens an inline region built from two composed
`DateTimePicker` instances — never by arrow-key dragging alone. Row
hierarchy with collapse/expand, milestones, percent-complete, a today
marker, and finish-to-start dependency data exposed as text.

## Typed fields, editing and export

- **Typed fields and editing** (0.5.0): `Fields` (`DataGridColumn`s) + `task.Values` show typed values; a field's `Editable` with an `OnFieldEdit` handler edits it in place. See the spec's "Typed" section.
- **Export** (0.5.0): `Labels.ExportCsv` / `ExportTsv` / `ExportExcel` plus `Labels.ExportHeaders` add CSV, TSV and Excel buttons.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.GanttChart
```

`LilyBlazorHeadless` and `LilyDesignSystem.Blazor.DateTimePicker`
install automatically as regular NuGet dependencies — `GanttChart`
composes the headless `GanttTable` family and the sibling
`DateTimePicker` helper, never vendoring their markup.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<GanttChart
    Label="Q4 plan"
    Range="@(new GanttRange { Start = "2026-10-01", End = "2026-10-31" })"
    Tasks="@Tasks"
    Today="2026-10-05"
    Labels="@(new GanttLabels
    {
        ColumnLabel = (start, _, _) => start,
        StartLabel = "Start date",
        EndLabel = "End date",
        DateTimePickerLabels = MyDateTimePickerLabels,
        SaveLabel = "Save",
        CancelLabel = "Cancel",
        DependencySummary = preds => $"Blocked by: {string.Join(", ", preds)}",
        DateAnnouncement = (title, start, end) => $"{title} moved to {start} - {end}",
        CollapseButton = (task, collapsed) => collapsed ? $"Expand {task.Label}" : $"Collapse {task.Label}",
    })"
    OnTaskChange="@HandleTaskChange" />

@code {
    private IReadOnlyList<GanttTask> Tasks { get; set; } = new[]
    {
        new GanttTask { Id = "design", Label = "Design", Start = "2026-10-01", End = "2026-10-03" },
        new GanttTask { Id = "build", Label = "Build", Start = "2026-10-04", End = "2026-10-06", DependsOn = new[] { "design" }, PercentComplete = 40 },
    };

    private void HandleTaskChange((string TaskId, string Start, string End) change)
    {
        Tasks = Tasks
            .Select(t => t.Id == change.TaskId
                ? new GanttTask { Id = t.Id, Label = t.Label, Start = change.Start, End = change.End, PercentComplete = t.PercentComplete, ParentId = t.ParentId, DependsOn = t.DependsOn }
                : t)
            .ToList();
    }
}
```

Editing requires `Labels.DateTimePickerLabels` (a
`DateTimePickerLabels` record from the sibling `DateTimePicker`
package) — without it, Enter/Space on a task row does nothing, per this
catalog's label-presence-gates-control convention.

## Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

## Keyboard

WAI-ARIA APG Grid roving-tabindex, the same model `KanbanBoard` uses.
Arrow keys move within/across rows and columns and clamp; `Home`/`End`
move within the current row; `Ctrl+Home`/`Ctrl+End` jump to the grid's
first/last cell; `Enter`/`Space` on a non-parent row opens an inline
edit region with two `DateTimePicker`s (start, end); Save calls
`OnTaskChange`; Cancel discards.

Native HTML5 drag-and-drop resize/reschedule is supplementary: dropping
a task's bar onto another column calls the same `OnTaskChange`
callback, preserving the task's original duration.

## Row hierarchy

`GanttTask.ParentId` builds a tree. A parent row's `Start`/`End` are
**derived** (min start / max end across its descendants) — editing a
parent directly is not supported; edit its children. The row header's
collapse button (`aria-expanded`) removes/restores descendant rows
from the DOM outright when toggled.

## Dependencies

`GanttTask.DependsOn` is data, not a rendered arrow: every cell in the
dependent task's row carries `aria-describedby`, pointing at a hidden
text node built from `Labels.DependencySummary`. Rendering an actual
dependency line is a documented non-goal — see `spec/index.md §9`;
every accessibility source consulted treats the arrow itself as
unsolved industry-wide, not something uniquely skipped here.

## Styling

`GanttChart` renders no CSS of its own beyond kebab-case class hooks:
`gantt-chart`, `gantt-chart-collapse-button`,
`gantt-chart-dependency-summary`, `gantt-chart-bar`,
`gantt-chart-edit-row`, `gantt-chart-save-button`,
`gantt-chart-cancel-button`, `gantt-chart-status` — plus the headless
`GanttTable` family's own `gantt-table*` classes and `data-in-range`/
`data-milestone`/`data-today`/`data-percent-complete` data hooks.

## Accessibility

- WAI-ARIA APG Grid pattern. Every user-facing string comes from
  `Labels` — a label's absence disables the control it names.
- One `aria-live="polite"` region announces every successful edit.
- bUnit has no live browser focus model; this package's own test suite
  verifies focus *intent* rather than that the browser actually moved
  focus — see `AGENTS.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

## Search, copy, keyboard, validation and undo (0.7.0)

- Added search: `Labels.Search` renders a field and `SearchValue` (bindable) keeps the tasks whose label and field text contain every typed word, in any order, ignoring case and diacritics; Escape clears it; `Labels.SearchAnnouncement`. The field carries the headless `search-input` class (written by hand, not composed).
- Added copy to the clipboard: `Labels.Copy` (needs `ExportHeaders`), `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added PageUp / PageDown, type-ahead on task labels, and right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says). Movement uses the new public `GridMotion` from the data-grid package.
- Added field `Validate` messages (`Labels.EditRefused`, `aria-invalid` on the open editor, cleared when the person types) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `OnFieldEdit`, with `Labels.FieldUndoAnnouncement` / `FieldRedoAnnouncement`.

---

Lily™ and Lily Design System™ are trademarks.
