# Changelog — GanttChart (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.4.0 — 2026-10-16

- Added unscheduled tasks, ported from the Svelte 0.4.0: a task with no `start` / `end` renders its row with no bar (`data-unscheduled`); Enter opens the edit region with empty dates and Save stays disabled until both are set, which schedules it through `onTaskChange`. An unscheduled child does not shape its parent's span; drag and Alt+Arrow do nothing for it.
- Added `@bind-CollapsedTaskIds` and `Labels.ExpandAll` / `Labels.CollapseAll` buttons that expand or collapse every parent task.

## 0.3.0 — 2026-10-14

- Added a progress field in the edit region, baselines and typed dependencies, ported from the Svelte 0.3.0.
- Added a zoom control, drag-resize handles, task selection, Alt+Arrow shift and resize, and `taskAttrs`, ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `markers`, `isNonWorking`, and task `type`, `critical` and `slack` data hooks, ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: row depth is `data-depth`, not an inline style; orphaned `parentId`s render as top-level rows and cycles no longer
hang; the edit region takes focus on open and returns it to the grid on Save/Cancel (Escape is not wired in Blazor; see spec); a range entered end-first is
saved start-first and Save is disabled while a date is empty; collapse and edit controls do not render unnamed. Added
`Labels.TaskColumnHeader` and `EffectiveRanges`. See the repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[Svelte package](../lily-design-system-svelte-gantt-chart/)
to this catalog's own idioms. Composes this catalog's own headless
`GanttTable` family (`LilyBlazorHeadless.Components`, unmodified) and
the **sibling** `LilyDesignSystem.Blazor.DateTimePicker` package — used
twice per edit session, for a task's start and end date — as the
keyboard-accessible editing surface, following the same
`ProjectReference`-to-a-sibling-package pattern `PickerBar` established
for composing other *helpers* (not just headless components). Per WCAG
2.5.7, editing is never arrow-key-drag-only: pointer drag-to-resize/
reschedule is supplementary to the composed `DateTimePicker` edit path.
Also ships row hierarchy with derived parent date ranges and
collapse/expand, milestones, percent-complete as a data value, a
today-column data flag, and finish-to-start dependency data exposed via
`aria-describedby` (never a rendered arrow). Civil-date arithmetic
reuses `DateTimePicker`'s own public static, `DateOnly`-backed helpers
(`ParseIsoDate`, `FormatIsoDate`, `AddDays`, `DaysInMonth`,
`CivilDate`) rather than re-deriving epoch-day math from scratch.

### Important finding: the task brief's `GanttTableTD.Active` concern does not apply to this catalog

The brief anticipated (based on the Svelte reference's own headless
`GanttTableTD` — whose `active` prop is documented for "cell is within
the task's span" but implemented as the roving-tabindex cursor) that
this catalog's `GanttTableTD` might have the same overload, and warned
to check carefully before reusing `Active` for anything. On inspection,
`GanttTableTD.razor` in this catalog has **no `Active` parameter at
all** — its only parameters are `Label`, `CssClass`, `ChildContent`,
`AdditionalAttributes`. There is no overload to avoid: `data-in-range`
(span membership) and `tabindex`/`aria-selected` (the roving-tabindex
cursor) are simply two ordinary attributes passed through
`AdditionalAttributes`, exactly as distinct as the Svelte contract
requires, with nothing to resolve.

### Real finding: `GanttTableTD` hardcodes an invalid `role="grid"` on its own `<td>`

A grid cell's role should be `"gridcell"`, not another `"grid"` nested
inside the outer one. Not modified (out of scope for this port);
overridden per-cell to `role="gridcell"` via `AdditionalAttributes`
splatting — the same last-attribute-wins mechanism `KanbanBoard` uses
for `KanbanTable`'s own role defaults, and verified against the actual
rendered DOM (`GanttChartTests.cs`,
`Section_8_1_Cells_Carry_Gridcell_Role_Not_The_Headless_Default_Of_Grid`),
not assumed from reading the source.

### Other deviations from the Svelte reference

- **Grid keydown stands down while the edit region is open.** Same
  Blazor `KeyboardEventArgs` target-introspection limitation
  `KanbanBoard` documents: the handler cannot tell "key pressed on the
  cell" from "key pressed inside the two composed `DateTimePicker`s or
  the Save/Cancel buttons" by target alone, so it bails out entirely
  while an edit region is open.
- **`@ondragover` cannot carry both a handler and `:preventDefault` on
  a component tag** (`RZ10010`, same finding as `KanbanBoard`) — the
  dragover-accepts-drop behaviour is unconditional rather than gated on
  "a task drag is in progress"; harmless, since the drop handler still
  only acts when it can resolve a real dragged `GanttTask`.
- **Cell focus.** No component in the headless `GanttTable` family
  exposes an `ElementReference` for its `<td>`. Grid-cell focus uses
  `IJSRuntime.InvokeVoidAsync("eval", …)` against a per-cell `id`,
  deferred to `OnAfterRenderAsync` — the same idiom `KanbanBoard` and
  `DateTimePicker` already use for this situation.

### Testing note

bUnit has no live browser focus model (see `KanbanBoard`'s own
CHANGELOG note on the same limitation, and the project memory note on a
prior picker bug "invisible to jsdom/bUnit"). This package's suite
still exercises every real behavioural clause of §8, including the
pure civil-date/hierarchy helpers directly (mirroring the canonical
Svelte suite's own unit tests for `compareISO`/`addDays`/`endOfMonth`/
`generateColumns`/`flattenTasks`/`effectiveRange`). 28 tests, one or
more per §8 acceptance clause plus the pure-helper unit tests, all
passing.

---

Lily™ and Lily Design System™ are trademarks.
