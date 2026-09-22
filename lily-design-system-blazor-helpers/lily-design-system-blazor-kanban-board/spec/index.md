# KanbanBoard — Specification (Blazor helper)

Ported from the canonical
[Svelte package's spec/index.md](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/spec/index.md)
with the same § numbering; only framework-specific detail differs.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The component owns state and behaviour; it does
not own the grid's base markup.

## 2. Scope

In scope: rendering a board from `Columns`/`Cards` data, pointer
drag-and-drop between columns, a keyboard-accessible move menu per
card, WIP (work-in-progress) limits with a warning state, derived card
counts, APG grid roving-tabindex keyboard navigation, and `aria-live`
move announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): drag-preview/
ghost-element rendering, virtualization, undo/redo, column reordering,
swimlanes, card selection/bulk-move, search/filter, collapsible
columns. Same reasoning as the canonical Svelte spec §2.

## 3. Composition

`KanbanBoard` depends on `LilyBlazorHeadless.Components`'s `KanbanTable`,
`KanbanTableHead`, `KanbanTableBody`, `KanbanTableRow`, `KanbanTableTH`,
`KanbanTableTD` as a real `ProjectReference` and renders them
unmodified — the same "depend on, don't vendor" rule this catalog's
picker helpers follow for `IconButton`/`Listbox`. It also depends on
`IconButton` and `Listbox` (the same headless components the picker
helpers compose) for the per-card move-menu trigger and the menu
itself — a small button-opens-listbox popup, structurally identical to
every picker's own shape, just anchored to a grid cell instead of a
page header.

**Divergence from the Svelte contract, found while composing this
catalog's own headless layer:** the canonical Svelte spec says
"`KanbanTable` keeps owning `<table role="grid">`… `KanbanTableTD`'s
existing `active` prop (roving `tabindex`/`aria-selected`) is reused
as-is." This catalog's actual `KanbanTable`/`KanbanTableBody`/
`KanbanTableTD` render `role="region"` / `role="list"` /
`role="listitem"` respectively (a WAI-ARIA Grid did not exist in this
headless catalog when they were built), and `KanbanTableTD` has **no**
`Active`/roving-tabindex parameter of any kind — only
`Label`/`CssClass`/`ChildContent`/`AdditionalAttributes`. Rather than
modify the headless components (out of scope for this port), this
package overrides `role` to `grid`/`rowgroup`/`gridcell` per element via
`AdditionalAttributes` splatting, relying on Blazor's documented
last-attribute-wins merge order (each headless component's own explicit
`role` appears *before* its own `@attributes="AdditionalAttributes"` in
its markup, so a caller-supplied `role` always wins) — and implements
the entire roving-tabindex model itself (`tabindex`, `aria-selected`,
`data-row`, `data-col`) the same way, via the same mechanism. Verified
against the actual rendered DOM in `KanbanBoardTests.cs`, not just that
it compiles. See CHANGELOG.md.

## 4. HTML

```
<div class="kanban-board {CssClass}">
  <KanbanTable Label="{Label}" role="grid">
    <caption>{Caption}</caption>                  <!-- only when Caption is set -->
    <KanbanTableHead>
      <KanbanTableRow>
        <KanbanTableTH data-over-limit>            <!-- only when column.WipLimit is exceeded -->
          {column.Title}
          <span class="kanban-board-count">{Labels.CardCount(count)}</span>
          <span class="kanban-board-wip-warning">{Labels.OverLimit(count, limit)}</span>  <!-- only when over limit -->
        </KanbanTableTH>
      </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody role="rowgroup">
      <KanbanTableRow>
        <KanbanTableTD role="gridcell" tabindex data-row data-col aria-selected>
          <span class="kanban-board-card-title">{CardLabel(card)}</span>
          <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded>…</button>
          <ul class="kanban-board-move-list" role="listbox" aria-label="…">  <!-- only while open -->
            <li role="option">{destinationColumn.Title}</li>
          </ul>
        </KanbanTableTD>
      </KanbanTableRow>
    </KanbanTableBody>
  </KanbanTable>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

## 5. Parameters

| Parameter               | Type                                            | Required | Default |
| ------------------------ | ------------------------------------------------- | -------- | ------- |
| `Label`                  | `string`                                            | yes      | —       |
| `Columns`                | `IReadOnlyList<KanbanColumn>`                       | yes      | —       |
| `Cards`                  | `IReadOnlyList<KanbanCard>`                         | yes      | —       |
| `Caption`                | `string?`                                            | no       | —       |
| `CardLabel`              | `Func<KanbanCard, string>?`                          | no       | `card.Title` |
| `OnMove`                 | `EventCallback<(string CardId, string ToColumnId)>` | no       | —       |
| `Labels`                 | `KanbanLabels`                                       | no       | `new()` |
| `CssClass`               | `string`                                             | no       | `""`    |
| `AdditionalAttributes`   | `Dictionary<string, object>?`                        | no       | `null` (spread on root) |

`KanbanColumn`: `Id` (required), `Title` (required), `WipLimit?: int`.

`KanbanCard`: `Id` (required), `ColumnId` (required), `Title`
(required). Card order within a column follows the order cards appear
in the `Cards` list.

`KanbanLabels` — every field optional, but its presence gates the
control it names, matching every other helper's
label-presence-gates-control convention: `CardCount(count)`,
`OverLimit(count, limit)`, `MoveButton(card)` (accessible name for the
per-card move trigger), `MoveMenuLabel` (accessible name for the move
listbox), `MoveAnnouncement(cardTitle, columnTitle)`.

## 6. Behaviour

**Rendering.** Cards are grouped by `ColumnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `KanbanTableTD` cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card's title is
`draggable`; dropping it on another column's cell moves it there via
the same `OnMove` callback the keyboard path uses. Supplementary, not
primary — see below.

**Card move — keyboard.** Enter/Space on a focused card cell opens that
card's own "Move to…" menu (a headless `Listbox` in
`Navigation="active-descendant"` mode, composed exactly like a picker's
own popup); choosing a destination column calls `OnMove`, closes the
menu, and returns focus to the move-button. Escape closes without
moving.

**WIP limits.** `column.WipLimit`, when set, is compared against that
column's current card count; a column at or over its limit carries
`data-over-limit` on its header cell and renders `Labels.OverLimit`'s
text — rendered only when `Labels.OverLimit` is supplied.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`Labels.MoveAnnouncement` — never a hardcoded sentence.

**Keyboard.** WAI-ARIA APG Grid pattern, hand-rolled (see §3): exactly
one body cell carries `tabindex="0"` at a time. `ArrowUp`/`ArrowDown`
move within a column and clamp; `ArrowLeft`/`ArrowRight` move across
columns and clamp; `Home`/`End` jump to the first/last row of the
current column; `Ctrl+Home`/`Ctrl+End` jump to the grid's first/last
cell; `Enter`/`Space` opens the focused card's move menu. While the
move menu is open, the grid-level keydown handler stands down (see §9)
— Blazor's `KeyboardEventArgs` carries no event-target information, so
it cannot distinguish "key pressed on the cell" from "key pressed on
the nested move button/listbox" the way the canonical Svelte
implementation's `event.target.closest(...)` check can.

**Focus.** No component in this catalog's headless `KanbanTable` family
exposes an `ElementReference` for its `<td>`. Grid-cell focus is
therefore driven by `IJSRuntime.InvokeVoidAsync("eval", …)` targeting a
per-cell `id`, deferred to `OnAfterRenderAsync` so the DOM the browser
focuses already reflects the new `tabindex`/`aria-selected` state — the
same "id-targeted eval, deferred to after render" idiom `DateTimePicker`
and `ThemePicker` already use for cases with no `ElementReference`.
Move-button/listbox focus uses real `ElementReference`s (both
`IconButton` and `Listbox` expose one), keyed per card id.

**SSR.** All DOM writes happen through `IJSRuntime` inside
`OnAfterRenderAsync`; server render emits `Cards` in their given order
with no move menu open.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, applied via attribute-splat
override — see §3). Roving-tabindex focus management for body cells.
The move menu follows the exact same icon-button-opens-listbox contract
every picker uses (`aria-haspopup="listbox"`, `aria-expanded`,
`aria-activedescendant` inside the open listbox). State changes are
announced through one live region.

## 8. Acceptance criteria

- §8.1 Renders `<div class="kanban-board">` wrapping a `KanbanTable`
  whose rendered `role` is `"grid"` (overridden from the headless
  default) and `aria-label` comes from `Label`.
- §8.2 Renders one `KanbanTableTH` per column with its title and, when
  `Labels.CardCount` is supplied, a derived card count.
- §8.3 A column at or over `WipLimit` carries `data-over-limit` and
  renders `Labels.OverLimit`'s text; a column under its limit, or with
  no `WipLimit` set, carries neither.
- §8.4 Cards render as a rectangular grid: the body has as many rows
  as the largest column's card count, and shorter columns pad with
  empty cells rather than shifting other columns' rows.
- §8.5 Exactly one body cell (`.kanban-table-td`) carries
  `tabindex="0"` at any time; arrow keys move it and clamp at the
  grid's edges rather than wrapping.
- §8.6 `Home`/`End` move within the current column;
  `Ctrl+Home`/`Ctrl+End` move to the grid's first/last cell.
- §8.7 Enter/Space on a focused card opens that card's own move menu
  (`aria-haspopup="listbox"`, `aria-expanded` toggles, a
  `role="listbox"` of destination columns appears).
- §8.8 Choosing a destination column in the move menu calls `OnMove`
  with the card's id and the destination column's id, closes the
  menu, and returns focus to the move button.
- §8.9 Escape closes the move menu without calling `OnMove`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  calls `OnMove` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `Labels.MoveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Extra attributes spread onto the root `<div>`.
- §8.13 `KanbanTableBody` and `KanbanTableTD` render `role="rowgroup"`
  and `role="gridcell"` respectively (overridden from the headless
  defaults of `"list"`/`"listitem"`).
- §8.14 No hardcoded user-facing strings: every label comes from a
  parameter or a `Labels.*` function.

## 9. Non-goals and deviations from the Svelte reference

Non-goals: drag-preview/ghost-element rendering, virtualization,
undo/redo, column reordering, swimlanes, card selection/bulk-move,
search/filter, collapsible columns — see §2.

Deviations, both documented above: (1) the `role` overrides required
because this catalog's headless `KanbanTable` family predates the
WAI-ARIA Grid pattern (§3); (2) the grid-level keydown handler bails
out entirely while the move menu is open, rather than relying on
`event.target.closest(...)` target introspection Blazor's
`KeyboardEventArgs` does not provide (§6); (3) `@ondragover` cannot
carry both a plain handler and an `:preventDefault` modifier on the
same *component* tag in Blazor (`RZ10010` — both lower to one
"ondragover" parameter and collide), so `data-over-limit`'s pointer
counterpart, dragover-accepts-drop, is unconditional rather than gated
on "a card drag is in progress" the way the Svelte reference gates it;
harmless, since `OnColumnDropAsync` still only acts when it can resolve
a real dragged `KanbanCard`.

## 10. Relationship to the headless layer and other helpers

`KanbanBoard` composes two different headless shapes in one package:
the structural `KanbanTable` family and the interactive
`IconButton`/`Listbox` pair every picker helper already depends on.
Follows every other Blazor helper's established rules: headless (no
bundled CSS), SSR-safe, i18n-clean (label-presence gates each control).
