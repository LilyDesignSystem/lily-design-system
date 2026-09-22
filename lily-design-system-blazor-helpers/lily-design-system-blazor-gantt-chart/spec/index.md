# GanttChart — Specification (Blazor helper)

Ported from the canonical
[Svelte package's spec/index.md](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/spec/index.md)
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
`tabindex`/`aria-selected` (the roving-tabindex cursor) are simply two
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
