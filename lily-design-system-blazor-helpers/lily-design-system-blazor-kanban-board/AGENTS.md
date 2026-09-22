# AGENTS — KanbanBoard (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless interactive kanban board. It composes
`LilyBlazorHeadless.Components`'s `KanbanTable` family (a real
`ProjectReference`, unmodified) and hand-rolls a WAI-ARIA APG Grid
roving-tabindex keyboard model over the resulting rectangular grid
(columns × largest column's card count) — ported directly from the
canonical Svelte reference, since no headless `data-grid` exists yet in
this catalog to copy the model from. Ships no CSS.

Ported from the canonical
[svelte-kanban-board](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/)
(2026-09-22).

## Files

| File                    | Purpose                                                |
| ------------------------ | ------------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical for this port).|
| `KanbanBoard.razor`      | Razor markup.                                            |
| `KanbanBoard.razor.cs`   | C# code-behind (partial class) — types, state, behaviour.|
| `KanbanBoardTests.cs`    | bUnit + xUnit spec, one or more `[Fact]`s per §8 clause. |
| `index.md`               | User guide.                                              |

## Public surface

- Component: `KanbanBoard` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Types: `KanbanColumn`, `KanbanCard`, `KanbanLabels`.
- Required parameters: `Label`, `Columns`, `Cards`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows the WAI-ARIA APG Grid
roving-tabindex model — one cell `tabindex="0"` at a time, hand-rolled
via `AdditionalAttributes` splatting (no headless parameter for it
exists — see the "Important finding" below). Moving a card is never
arrow-key-drag-only, per WCAG 2.5.7 and Atlassian's Pragmatic Drag and
Drop accessibility research: Enter/Space on a focused card opens a
"Move to…" `Listbox` (active-descendant mode) listing destination
columns, composed from `IconButton`/`Listbox`. Pointer drag-and-drop
(native HTML5) is supplementary, not the only path. A column's
`WipLimit`, once exceeded, marks the column `data-over-limit` — a
styling hook, not an enforced block. Every successful move announces
through one `.kanban-board-status aria-live="polite"` region built from
a caller-supplied `Labels.MoveAnnouncement`.

## Important finding: this catalog's headless KanbanTable family has no Grid-pattern parameters

Read before touching cell/role logic. `KanbanTable` renders
`role="region"`, `KanbanTableBody` renders `role="list"`,
`KanbanTableTD` renders `role="listitem"` — none has an `Active` /
roving-tabindex parameter. All three roles are overridden per element
via `AdditionalAttributes` splatting (`role="grid"` /
`role="rowgroup"` / `role="gridcell"`), relying on Blazor's
last-attribute-wins merge order (verified against the real rendered
DOM, not assumed — see `KanbanBoardTests.cs`). Do not modify the
headless components themselves; this is a caller-side override only.
See spec/index.md §3 and CHANGELOG.md for the full write-up.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="kanban-board {CssClass}">` wrapping the
role-overridden `KanbanTable` family and the move-menu `Listbox`, which
renders inline near the focused card.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, applied by this package —
  see the finding above).
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The "Move to…" menu uses active-descendant mode internally (a
  `Listbox` popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required.
- One `aria-live="polite"` region for all move announcements.
- bUnit has no live browser focus model (a documented, pre-existing
  limitation — see the project memory note on a prior picker bug
  "invisible to jsdom/bUnit"). This suite verifies focus *intent*
  (which id/`ElementReference` a `FocusAsync`/`eval` interop call
  targeted), the same technique `ThemePickerTests`/`DateTimePickerTests`
  already use — real regressions in "did we ask to focus the right
  thing" are still caught; a browser-only focus bug would not be.

## Conventions this package follows

- Blazor 10 / .NET 10, `partial class` split between `KanbanBoard.razor`
  and `KanbanBoard.razor.cs`. Namespace `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters;
  `[Parameter(CaptureUnmatchedValues = true)]` for the root's own
  attribute spread.
- Depends on the headless `KanbanTable` family and `IconButton`/
  `Listbox` as a real `ProjectReference` — never vendors their markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `Labels.*` parameter; a label's
  presence gates the control it names — no baked-in English fallback.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.
