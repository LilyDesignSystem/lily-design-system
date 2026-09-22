# AGENTS — GanttChart (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless interactive Gantt chart. It composes
`LilyBlazorHeadless.Components`'s `GanttTable` family (a real
`ProjectReference`, unmodified) and the **sibling** helper package
`LilyDesignSystem.Blazor.DateTimePicker` — used twice per edit session,
once for a task's start date and once for its end — for keyboard-
accessible editing. The same WAI-ARIA APG Grid roving-tabindex model
`KanbanBoard` hand-rolls, applied here to a rectangular grid of tasks ×
time-axis columns. Ships no CSS.

Ported from the canonical
[svelte-gantt-chart](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/)
(2026-09-22).

## Files

| File                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------- |
| `spec/index.md`        | Specification-driven contract (canonical for this port).|
| `GanttChart.razor`     | Razor markup.                                            |
| `GanttChart.razor.cs`  | C# code-behind (partial class) — types, pure date-math helpers, state, behaviour. |
| `GanttChartTests.cs`   | bUnit + xUnit spec: pure-helper unit tests plus one or more `[Fact]`s per §8 clause. |
| `index.md`             | User guide.                                              |

## Public surface

- Component: `GanttChart` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Types: `GanttTask`, `GanttTimeUnit`, `GanttRange`, `GanttColumn`,
  `GanttLabels`, `GanttFlatRow`, `GanttDateRange`.
- Public static pure helpers (mirror the canonical Svelte reference's
  own exported functions one-for-one): `GanttChart.CompareIso`,
  `GanttChart.AddDays`, `GanttChart.EndOfMonth`,
  `GanttChart.GenerateColumns`, `GanttChart.FlattenTasks`,
  `GanttChart.EffectiveRange`.
- Required parameters: `Label`, `Range`, `Tasks`.

## IMPORTANT: read before touching cell roles or the `active`/roving-tabindex logic

The task brief anticipated this catalog's `GanttTableTD` might carry
the same `active`-prop overload the Svelte reference's own headless
`GanttTableTD` has (documented as span-membership, implemented as the
roving-tabindex cursor). **It does not.** This catalog's
`GanttTableTD.razor` has no `Active` parameter, no roving-tabindex
concept — only `Label`/`CssClass`/`ChildContent`/`AdditionalAttributes`.
So `data-in-range` and `tabindex`/`aria-selected` are just two ordinary
attributes with nothing to reconcile.

What DOES need attention: `GanttTableTD.razor` hardcodes an invalid
`role="grid"` on its own `<td>`. This package overrides it to
`role="gridcell"` per cell via `AdditionalAttributes` splatting
(last-attribute-wins — verified against the real rendered DOM, not
assumed). Do not modify the headless component itself. See
spec/index.md §3 and CHANGELOG.md.

## Behaviour contract (one paragraph)

`Range`/`TimeUnit` generate a fixed set of day/week/month columns using
`DateOnly`-backed civil-date arithmetic reused from the sibling
`DateTimePicker` package (never local-midnight `DateTime`
construction). A task's `[Start, End]` marks every overlapping column
`data-in-range`; a milestone (`Start == End`) marks exactly one cell
`data-milestone`. `task.ParentId` builds a tree flattened with
collapse/expand; a parent's own range is derived (min/max of
descendants), never its own data. `task.DependsOn` is text data via
`aria-describedby`, never a rendered arrow. Enter/Space on a focused
non-parent row opens an inline edit region with two composed
`DateTimePicker` instances (gated on `Labels.DateTimePickerLabels`);
Save calls `OnTaskChange`, Cancel discards. Native HTML5 drag-and-drop
resize/reschedule is supplementary, never the only path. One
`aria-live="polite"` region announces every successful edit.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="gantt-chart {CssClass}">` wrapping the
role-overridden `GanttTable` family; the edit region renders as a
plain `<tr class="gantt-chart-edit-row">` immediately after the task's
own row, matching the Svelte reference's literal markup shape (not a
`GanttTableTr`, since it is a single colspan-ing cell, not a per-column
row).

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `GanttTable`
  as-is; `role="gridcell"` applied by this package per body cell — see
  the finding above).
- Roving tabindex for body cells, hand-rolled via
  `AdditionalAttributes` (no headless parameter for it exists).
- Row-header cells (`scope="row"`) sit outside the roving-tabindex
  column index, the same way `KanbanBoard`'s move-menu controls sit
  outside its own grid.
- bUnit has no live browser focus model (a documented, pre-existing
  limitation — see the project memory note on a prior picker bug
  "invisible to jsdom/bUnit", and `KanbanBoard`'s own note on the same
  point). This suite verifies real DOM state (attribute positions,
  which rows/cells exist) rather than actual browser focus movement —
  the same testing shape the canonical Svelte suite itself uses,
  independent of the bUnit-specific limitation.

## Conventions this package follows

- Blazor 10 / .NET 10, `partial class` split between `GanttChart.razor`
  and `GanttChart.razor.cs`. Namespace `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters;
  `[Parameter(CaptureUnmatchedValues = true)]` for the root's own
  attribute spread.
- Depends on the headless `GanttTable` family and the sibling
  `DateTimePicker` helper as real `ProjectReference`s — never vendors
  their markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `Labels.*` parameter; a label's
  presence gates the control it names — no baked-in English fallback.
  Editing specifically is gated on `Labels.DateTimePickerLabels`, since
  `DateTimePicker` itself requires it.
- Non-goals (dependency-arrow rendering, virtualization, critical-path
  calculation, dependency types beyond finish-to-start, interactive
  zoom, weekend/holiday shading, resource/assignee columns) are
  documented, not silently missing — see spec/index.md §9.
