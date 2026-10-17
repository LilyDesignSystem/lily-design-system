# GanttChart — Specification (Blazor helper)

Ported from the canonical
[Svelte package's spec/index.md](../../lily-design-system-svelte-gantt-chart/spec/index.md)
with the same § numbering; only framework-specific detail differs.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from the sibling `DateTimePicker` helper
(never arrow-key drag as the only path), row hierarchy, milestones,
percent-complete, a today marker, and dependency data exposed as text.
The component owns state and behaviour; it does not own the grid's
base markup.

## 2. Scope

In scope: rendering `Tasks` against a `Range`/`TimeUnit` time axis as a
rectangular grid, pointer drag-to-resize/reschedule, a keyboard-
accessible edit surface built from two composed `DateTimePicker`
instances (start, end), row hierarchy with collapse/expand and derived
parent date ranges, milestones (zero-duration tasks), percent-complete
as a data value, a today-column data flag, finish-to-start dependency
data exposed via `aria-describedby`, APG grid roving-tabindex keyboard
navigation, and `aria-live` change announcements.

Out of scope (v1 non-goals — see §9): dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns. Same reasoning as the canonical
Svelte spec §2.

## 3. Composition

`GanttChart` depends on `LilyBlazorHeadless.Components`'s `GanttTable`,
`GanttTableThead`, `GanttTableTbody`, `GanttTableTr`, `GanttTableTH`,
`GanttTableTD` as a real `ProjectReference` and renders them
unmodified. It also depends on the **sibling helper package**
`LilyDesignSystem.Blazor.DateTimePicker` — used twice per edit session,
once for a task's start date and once for its end — the same
`ProjectReference`-to-a-sibling-package pattern `PickerBar` established
for composing other *helpers* (not just headless components) from this
catalog.

**Important finding, contradicting the task brief's own working
hypothesis:** the brief anticipated that this catalog's `GanttTableTD`
might carry the same `active`-parameter overload the Svelte reference's
headless `GanttTableTD` has (documented for "cell is within the task's
span" but implemented as the roving-tabindex cursor). It does not.
`GanttTableTD.razor` in this catalog has **no** `Active` parameter, and
no roving-tabindex concept of any kind — only
`Label`/`CssClass`/`ChildContent`/`AdditionalAttributes`. There is
therefore no overload to avoid: `data-in-range` (span membership) and
`tabindex` (the roving-tabindex cursor; never `aria-selected`, since focus
is not selection) are simply two
different ordinary attributes passed through `AdditionalAttributes`,
kept conceptually distinct exactly as both the Svelte and this port's
own contract require, with no conflict to design around.

**A real bug was found instead:** `GanttTableTD.razor` hardcodes
`role="grid"` on its own `<td>` element — invalid ARIA (a cell inside a
grid should be `role="gridcell"`, not another nested `"grid"`). Not
modified (out of scope for this port); overridden per-cell to
`role="gridcell"` via `AdditionalAttributes` splatting, the same
last-attribute-wins mechanism `KanbanBoard` uses for `KanbanTable`'s
own role defaults. Verified against the actual rendered DOM in
`GanttChartTests.cs`. See CHANGELOG.md for the full write-up.

## 4. HTML

```
<div class="gantt-chart {CssClass}">
  <GanttTable Label="{Label}">
    <caption>{Caption}</caption>                               <!-- only when Caption is set -->
    <GanttTableThead>
      <GanttTableTr>
        <GanttTableTH scope="col"></GanttTableTH>               <!-- leading task-label column -->
        <GanttTableTH scope="col" data-today>{Labels.ColumnLabel(period)}</GanttTableTH>
      </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody role="rowgroup">
      <GanttTableTr>
        <GanttTableTH scope="row">
          <button class="gantt-chart-collapse-button" aria-expanded>…</button>  <!-- only on parent rows -->
          {TaskLabel(task)}
        </GanttTableTH>
        <GanttTableTD role="gridcell" data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
          <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
        </GanttTableTD>
      </GanttTableTr>
      <tr class="gantt-chart-edit-row">                            <!-- only while a task is being edited -->
        <td colspan="{columns.Count + 1}">
          <DateTimePicker Label="{Labels.StartLabel}" Labels="{Labels.DateTimePickerLabels}" Mode="DateTimeMode.Date" @bind-Value="…" />
          <DateTimePicker Label="{Labels.EndLabel}" Labels="{Labels.DateTimePickerLabels}" Mode="DateTimeMode.Date" @bind-Value="…" />
          <button class="gantt-chart-save-button">{Labels.SaveLabel}</button>
          <button class="gantt-chart-cancel-button">{Labels.CancelLabel}</button>
        </td>
      </tr>
    </GanttTableTbody>
  </GanttTable>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 5. Parameters

| Parameter       | Type                                                       | Required | Default |
| ---------------- | ------------------------------------------------------------ | -------- | ------- |
| `Label`          | `string`                                                       | yes      | —       |
| `Range`          | `GanttRange { Start, End }` (ISO dates)                        | yes      | —       |
| `Tasks`          | `IReadOnlyList<GanttTask>`                                     | yes      | —       |
| `Caption`        | `string?`                                                       | no       | —       |
| `TimeUnit`       | `GanttTimeUnit` (`Day`/`Week`/`Month`)                          | no       | `Day`   |
| `Today`          | `string?` (ISO date)                                            | no       | — (no marker unless supplied; never computed internally, stays SSR-safe) |
| `TaskLabel`      | `Func<GanttTask, string>?`                                      | no       | `task.Label` |
| `OnTaskChange`   | `EventCallback<(string TaskId, string Start, string End)>`      | no       | —       |
| `Labels`         | `GanttLabels`                                                   | no       | `new()` |
| `CssClass`       | `string`                                                        | no       | `""`    |
| `AdditionalAttributes` | `Dictionary<string, object>?`                             | no       | `null` (spread on root) |

`GanttTask`: `Id` (required), `Label` (required), `Start`/`End` (ISO
dates, required, inclusive; equal values mean a milestone),
`PercentComplete?: int`, `ParentId?: string`, `DependsOn?:
IReadOnlyList<string>` (other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, but presence gates the control
it names: `ColumnLabel(start, end, timeUnit)`, `EditButton(task)`,
`StartLabel`/`EndLabel` (passed as each composed `DateTimePicker`'s own
`Label`), `DateTimePickerLabels` (a `DateTimePickerLabels` object,
reused for both composed pickers — editing is gated on this being
present, since `DateTimePicker` itself requires it), `SaveLabel`/
`CancelLabel`, `DependencySummary(predecessorLabels)`,
`DateAnnouncement(taskLabel, start, end)`, `CollapseButton(task,
collapsed)`.

## 6. Behaviour

**Time axis.** `Range`/`TimeUnit` generate a fixed set of columns — one
per day, per 7-day week, or per calendar month — using civil-date
arithmetic backed by `DateOnly` (via the sibling `DateTimePicker`
package's own public static helpers: `ParseIsoDate`, `FormatIsoDate`,
`AddDays`, `DaysInMonth`, the `CivilDate` type), never local-midnight
`DateTime` construction — `DateOnly` has no time zone attached at all,
so it cannot reproduce a DST-boundary bug by construction. This
package's own `EndOfMonth`/`GenerateColumns`/`FlattenTasks`/
`EffectiveRange`/`CompareIso`/`AddDays` are public static methods on
`GanttChart`, mirroring the canonical Svelte reference's own exported
pure functions one-for-one, for direct unit testing without rendering
the component.

**Task bars.** A task's `[Start, End]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`Start == End`) marks its one cell `data-milestone` instead
of a spanning range. `PercentComplete`, when set, rides as a plain
attribute (`data-percent-complete`) on the task's own leading in-range
cell — the fill itself is the consumer's own CSS.

**Row hierarchy.** `task.ParentId` builds a tree, flattened for
rendering with a `Depth` used for indentation. A parent row's
`Start`/`End` are derived (min start / max end across its descendants)
and rendered read-only — parent rows are not directly editable. A
`<button class="gantt-chart-collapse-button" aria-expanded>` toggles a
parent's children; collapsing removes descendant rows from the DOM
outright.

**Dependencies.** `task.DependsOn` is data, not a rendered arrow: every
cell in the dependent task's row carries `aria-describedby` pointing at
a generated, hidden text node built from `Labels.DependencySummary`. No
dependency line is drawn — see §9.

**Date/duration edit — keyboard.** Enter/Space on a focused (non-parent)
row opens an inline edit region for that task with two composed
`DateTimePicker` instances (`Mode="DateTimeMode.Date"`) bound to local
copies of `Start`/`End`; Save calls `OnTaskChange` and closes; Cancel
discards. Gated on `Labels.DateTimePickerLabels` being supplied.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop resizes or
reschedules a task's bar; supplementary, never the only path.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `Labels.DateAnnouncement`.

**Keyboard.** While the edit region is open, the grid-level keydown
handler stands down — Blazor's `KeyboardEventArgs` carries no
event-target information, so it cannot distinguish "key pressed on the
cell" from "key pressed inside the two composed `DateTimePicker`s or
the Save/Cancel buttons" the way the canonical Svelte implementation's
`event.target.closest(...)` check can.

**SSR.** All DOM writes happen through `IJSRuntime` inside
`OnAfterRenderAsync`; `Today` is never computed internally — no marker
renders unless the consumer supplies it.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `GanttTable`).
Roving-tabindex focus management for body cells — see §3 for why
`data-in-range` (span membership) and the roving-tabindex cursor are
two separate attributes with no overload to resolve in this catalog.
Row-header cells (`GanttTableTH`, `scope="row"`) hold each task's label
and, for parents, the collapse button; they sit outside the
roving-tabindex column index.

## 8. Acceptance criteria

- §8.1 Renders `<div class="gantt-chart">` wrapping a `GanttTable`
  whose `role="grid"` and `aria-label` come from `Label`.
- §8.2 Generates one column per day/week/month across `Range`
  according to `TimeUnit`, using `DateOnly`-backed civil-date
  arithmetic.
- §8.3 A task's `[Start, End]` marks every overlapping column's cell
  with `data-in-range`; a milestone (`Start == End`) marks exactly one
  cell `data-milestone` instead.
- §8.4 `PercentComplete` renders as `data-percent-complete` on the
  task's leading in-range cell only when set.
- §8.5 A task with `ParentId` renders nested under its parent with a
  `Depth`-based indentation; the parent's own `Start`/`End` are derived
  (min/max of its descendants), not its own data.
- §8.6 A parent row's collapse button toggles `aria-expanded` and
  removes/restores descendant rows from the DOM outright.
- §8.7 A task's `DependsOn` produces an `aria-describedby` reference to
  a generated summary built from `Labels.DependencySummary`; a task
  with no dependencies carries neither.
- §8.8 Exactly one body cell carries `tabindex="0"` at any time; arrow
  keys move it and clamp at the grid's edges within the current row/
  column axis rather than wrapping.
- §8.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `DateTimePicker` instances seeded from that
  task's current `Start`/`End`, only when `Labels.DateTimePickerLabels`
  is supplied; a parent row does not open one.
- §8.10 Saving the edit region calls `OnTaskChange` with the task's id
  and the edited `Start`/`End`, then closes the region.
- §8.11 Cancelling the edit region discards changes without calling
  `OnTaskChange`.
- §8.12 A pointer drag-resize/reschedule of a task's bar calls
  `OnTaskChange` the same way the keyboard path does.
- §8.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `Labels.DateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `Today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it — nothing is computed internally.
- §8.15 Extra attributes spread onto the root `<div>`.
- §8.16 Body cells render `role="gridcell"` (overridden from the
  headless default of `role="grid"` — see §3).
- §8.17 No hardcoded user-facing strings: every label comes from a
  parameter or a `Labels.*` function.

**Added 2026-10-11** (canonical §8.6–§8.11, §8.16, §8.17; see the Svelte package's spec):

- Row depth is `data-depth` on the row header, never an inline style.
- A task whose `parentId` names no task renders as a top-level row; a
  `parentId` cycle does not hang; parent ranges are derived in one pass.
- Focusing a cell by pointer moves the roving cursor there; when collapsing
  removes the row under the cursor, exactly one cell stays tabbable.
- Opening the edit region moves focus to the start date's field; Save
  (disabled while a date is empty) saves a range entered end-first
  start-first; Save, Cancel and Escape return focus to the grid.
- Without their labels, the collapse button and the edit region do not
  render unnamed; `labels.taskColumnHeader` names the leading header cell.

Blazor deviation: Escape does not cancel the edit region. Blazor's `KeyboardEventArgs` cannot tell whether a date picker already used the key to close its own dialog, so cancelling on it would discard the edit along with the dialog. Cancel remains the way out.

## 9. Non-goals and deviations from the Svelte reference

Non-goals: dependency-arrow rendering, virtualization, critical-path
calculation, dependency types beyond finish-to-start, interactive
zoom-level switching, weekend/holiday shading, resource/assignee
columns — see §2.

Deviations: (1) `GanttTableTD`'s `role="grid"` bug and its override
(§3); (2) the grid-level keydown handler stands down entirely while the
edit region is open, for the same Blazor `KeyboardEventArgs`
target-introspection limitation `KanbanBoard` documents (§6); (3)
`@ondragover` cannot carry both a plain handler and a
`:preventDefault` modifier on the same *component* tag (`RZ10010`), so
dragover-accepts-drop is unconditional rather than gated on "a task
drag is in progress" — harmless, since the drop handler still only
acts when it can resolve a real dragged `GanttTask`.

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `GanttTable` family, and `DateTimePicker` used twice per
edit session — the first Blazor helper-to-helper composition in this
catalog used for a single feature rather than four different pickers
in a row (`PickerBar`'s shape) or one picker inside a grid cell
(`KanbanBoard`'s shape). Follows every other Blazor helper's
established rules: headless (no bundled CSS), SSR-safe, i18n-clean
(label-presence gates each control).

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there): `readonly`, `markers` (`data-marker` plus a text label), `isNonWorking` (`data-non-working` when every day in a column is non-working), and task `type`/`critical`/`slack` as `data-*` hooks on the row.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there): the progress field (`labels.percentLabel`, a 4th `onTaskChange` argument), baselines (`task.baseline`, `data-baseline`, `labels.baselineSummary`) and typed dependencies (`dependsOn` objects, `labels.dependencyDetail`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §14.1–§14.17): zoom (`timeUnit`, `labels.zoomIn` / `zoomOut`), drag-resize handles, task selection (`selectedTaskId`, `onTaskSelect`, the `s` key), Alt+ArrowLeft/Right shift and Alt+Shift+Arrow end move, and `taskAttrs`.

## Unscheduled tasks and collapse-all (2026-10-16)

Ported from the Svelte canonical (its spec "Unscheduled tasks and collapse-all", tests §14.18–§14.24). `start` / `end` are optional on a task: with neither, the row renders no bar and no `data-in-range` cells and carries `data-unscheduled`; the edit region opens with empty dates and Save is disabled until both are set. `effectiveRanges` skips an unscheduled child when deriving a parent's span (a parent whose children are all unscheduled has an empty range and is unscheduled itself). Drag, resize and Alt+Arrow ignore an unscheduled task, and a baseline variance with no current end is 0. `CollapsedTaskIds` holds the collapsed parent ids; `Labels.ExpandAll` / `Labels.CollapseAll` gate two buttons in `.gantt-chart-collapse-all` (shown only when the chart has parents), each disabled when it would change nothing. Blazor: `GanttTask.Start` / `End` are now optional (`string?`), which is source-compatible with callers that set them.

## 11. Typed fields, inline editing, export, virtualization (0.5.0, 2026-10-16)

The data grid's cell types and export, applied to tasks; ported from the Svelte canonical with these Blazor idioms.

- **Typed fields**: `Fields` is a list of `DataGridColumn` (the data grid's own record: `Id`, `Header`, `Type`, `Options`, `NumberFormat`, `DateFormat`, `TimeFormat`, `Parse`, `Validate`, `Exportable`, `ExportValue`, `Editable`, …), read from `task.Values[id]` (a `DataGridRow`). `Type` fills in the field's `Format`, `Compare` and `ExportValue` through the data grid's `CellTypes.Resolve`, once per `Fields` / `Locale` change. With no `Locale` a value shows as stored. A field shows as a column between the task name and the timeline as a `.gantt-chart-field-field`-style element holding its header (`.gantt-chart-field-field-name`) and its value; a read-only task omits empty fields.
- **Inline editing**: a field edits in place when its `Editable` is set, `OnFieldEdit` has a handler, the chart is not `Readonly`. `Text`, `Number`, `Link`, `Date`, `Time`, `Select` and `Radio` fields edit; the others display and export only. The value becomes a `.gantt-chart-field-button` (`tabindex="-1"` in the board and chart; named by the header plus the value); clicking it, or F2 on the card (first editable field), opens `.gantt-chart-field-editor` (an `<input>` of the type, or a `<select>` of `Options`). **Enter** commits, **Escape** cancels, blur commits; the editor owns its keys (they never reach the grid), and an input method's composing keys (`"Process"`) never commit or cancel. A value that does not fit the type, or that `Validate` refuses, is refused: the editor stays open and `Labels.EditInvalid` is announced. An unchanged value reports nothing. **Blazor deviation:** Tab does not move to the next field's editor (a keydown handler cannot decide `preventDefault` per event); it moves on normally and the blur commits. `OnFieldEdit` receives a `GanttFieldEdit` (`TaskId`, `FieldId`, `Value`, `Previous`); `Labels.EditAnnouncement(title, header, text)`.
- **Export**: `Labels.ExportCsv` / `ExportTsv` / `ExportExcel` each gate a `.gantt-chart-export-button` (`data-gantt-export-format`) inside a `.gantt-chart-export` group named by `Labels.Export`; none renders without `Labels.ExportHeaders` (a `GanttExportHeaders`; there is no English header). One row per task in hierarchy order: label, start and end (a parent's derived span; real dates in Excel), then — when named — progress, parent, depends-on, baseline start and end, then every field with `Exportable`. `ExportScope`: `All` (default) or `Visible` (leaves out the tasks under a collapsed parent). `ExportFilename` is the base name. `OnExport` is raised with the `DataGridExport`; `ExportHandler` returning `false` takes over the download; otherwise the file is saved and `Labels.ExportAnnouncement` is announced.
- **Virtualization**: `Virtualize` (a `GanttVirtualize(RowHeight, Height, Overscan)`) renders only the task rows in view inside a `.gantt-chart-scroll` area, between `.gantt-chart-spacer` rows; the roving tab stop's row always renders; `aria-rowcount` / `aria-rowindex` are set.
- **Dependency**: the package references `LilyDesignSystem.Blazor.DataGrid` (for `DataGridColumn`, `CellTypes`, `ExportData`, `DataGridExport`) rather than copying its sources; `TypedFields.cs` is the small internal helper that reads, formats, parses and exports one field.

## 17. Weekend shading and dependency arrows (0.6.0, 2026-10-17)

Tests §17.1–§17.11. In Blazor the parameters are `Weekends` (`IReadOnlyList<int>`) and `DependencyArrows`; the arrows are measured with **one** `eval` call per change (the first and last in-range cell of each row, returned as JSON) and the paths are computed in C# (`DependencyArrowGeometry.Path`, a line-for-line port of the Svelte `dependencyPath`, tested against the same expected strings). The overlay is rebuilt only when the measured JSON changes, so it cannot loop. Typed dependencies come from `GanttTask.Dependencies`; plain `DependsOn` ids are `e2s`.

- **Weekend shading**: `weekends` is a list of weekdays (0 = Sunday … 6 = Saturday), for example `[0, 6]` or `[5, 6]`. A **day** column whose date falls on one gets `data-weekend` on its header and on every body cell
  (week and month columns are never marked: a column is not a day). It is never defaulted — the weekend is the consumer's locale — and it combines with `isNonWorking` (a holiday on a weekday is `data-non-working`;
  both attributes can sit on one cell). The weekday is computed from the epoch day (`weekdayOfEpochDay`), never from the browser's time zone. Shading is CSS: the 57 `themes/` tint `[data-weekend]` cells.
- **Dependency arrows**: `dependencyArrows` draws one `<path class="gantt-chart-dependency-arrow" data-from data-to data-dependency-type>` per dependency in an `<svg class="gantt-chart-dependency-arrows" aria-hidden="true">`
  laid over the scroll area (`position:absolute; pointer-events:none` — the structural inline style; the scroll area becomes `position:relative`). Edges follow the type: `e2s` predecessor end → dependent start, `s2s`,
  `s2e`, `e2e` likewise. The path is orthogonal and always arrives horizontally, with an arrowhead marker; when the dependent starts too close to the predecessor's end it goes round through the row gap
  (`dependencyPath`, a pure, unit-tested function in `dependency-arrows.ts`). Positions are **measured** from the rendered cells (first and last `td[data-in-range]` of each row), after render and whenever the
  table's size changes, so it is client-only and SSR-safe (no overlay until measured). Arrows are drawn only between rows that exist in the DOM: a collapsed parent's children and a virtualized chart's off-screen
  rows have none. The overlay is decoration: dependencies remain available as text through `labels.dependencySummary` / `dependencyDetail`, and arrows take no focus. Stroke and colour are CSS (`currentColor`).
  Lag is not drawn (no pixel-positioned bars); critical-path highlighting is still `task.critical`.

## Search, copy, keyboard, validation and undo (0.7.0)

- Added search: `Labels.Search` renders a field and `SearchValue` (bindable) keeps the tasks whose label and field text contain every typed word, in any order, ignoring case and diacritics; Escape clears it; `Labels.SearchAnnouncement`. The field carries the headless `search-input` class (written by hand, not composed).
- Added copy to the clipboard: `Labels.Copy` (needs `ExportHeaders`), `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added PageUp / PageDown, type-ahead on task labels, and right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says). Movement uses the new public `GridMotion` from the data-grid package.
- Added field `Validate` messages (`Labels.EditRefused`, `aria-invalid` on the open editor, cleared when the person types) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `OnFieldEdit`, with `Labels.FieldUndoAnnouncement` / `FieldRedoAnnouncement`.
