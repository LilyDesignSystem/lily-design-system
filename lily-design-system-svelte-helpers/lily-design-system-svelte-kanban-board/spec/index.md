# KanbanBoard — Specification (Svelte helper)

Canonical contract for `@lilydesignsystem/svelte-kanban-board`. Proposed
2026-09-21 in [spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md).
This package is the first implementation; no other framework catalog
ports it yet.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The component owns state and behaviour; it does
not own the grid's base markup.

## 2. Scope

In scope: rendering a board from `columns`/`cards` data, pointer
drag-and-drop between columns, a keyboard-accessible move menu per
card, WIP (work-in-progress) limits with a warning state, derived card
counts, APG grid roving-tabindex keyboard navigation, and `aria-live`
move announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): drag-preview/
ghost-element rendering, virtualization, undo/redo, column reordering,
swimlanes, card selection/bulk-move, search/filter, collapsible
columns. Each either requires real visual/layout ownership that
conflicts with "no bundled CSS, no rendering opinion," or is a
v2-sized feature better designed once v1 ships and is exercised in a
real app.

## 3. Composition

`KanbanBoard` depends on `@lilydesignsystem/svelte-headless`'s
`KanbanTable`, `KanbanTableHead`, `KanbanTableBody`, `KanbanTableRow`,
`KanbanTableTH`, `KanbanTableTD` as a real npm dependency and renders
them unmodified — the same "depend on, don't vendor" rule `data-grid`
follows for `DataTable`. It also depends on `IconButton` and `Listbox`
(the same headless components the picker helpers compose) for the
per-card move-menu trigger and the menu itself — a small
button-opens-listbox popup, structurally identical to every picker's
own shape, just anchored to a grid cell instead of a page header.
`KanbanTable` keeps owning `<table role="grid">` and its `aria-label`;
`KanbanTableTD`'s existing `active` prop (roving `tabindex`/
`aria-selected`) is reused as-is for body cells, the same way
`data-grid` reuses it on `DataTableTD`.

## 4. HTML

```
<div class="kanban-board {class}">
  <KanbanTable label="{label}" caption="{caption}">
    <KanbanTableHead>
      <KanbanTableRow>
        <KanbanTableTH data-over-limit>            <!-- only when column.wipLimit is exceeded -->
          {column.title}
          <span class="kanban-board-count">{labels.cardCount(count)}</span>
          <span class="kanban-board-wip-warning">{labels.overLimit(count, limit)}</span>  <!-- only when over limit -->
        </KanbanTableTH>
      </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
      <KanbanTableRow>
        <KanbanTableTD>                             <!-- active = the roving-tabindex cursor -->
          <span class="kanban-board-card-title">{cardLabel(card)}</span>
          <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded>…</button>
          <Listbox class="kanban-board-move-list" role="listbox" hidden>  <!-- only while open -->
            <li role="option">{destinationColumn.title}</li>
          </Listbox>
        </KanbanTableTD>
      </KanbanTableRow>
    </KanbanTableBody>
  </KanbanTable>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

## 5. Props

| Prop         | Type                                                     | Required | Default |
| ------------ | --------------------------------------------------------- | -------- | ------- |
| `label`      | `string`                                                   | yes      | —       |
| `columns`    | `KanbanColumn[]`                                           | yes      | —       |
| `cards`      | `KanbanCard[]`                                             | yes      | —       |
| `caption`    | `string`                                                    | no       | —       |
| `cardLabel`  | `(card: KanbanCard) => string`                              | no       | `card.title` |
| `onMove`     | `(cardId: string, toColumnId: string) => void`              | no       | —       |
| `labels`     | `KanbanLabels`                                              | no       | `{}`    |
| `class`      | `string`                                                    | no       | `""`    |

`KanbanColumn`: `id` (required), `title` (required), `wipLimit?: number`.

`KanbanCard`: `id` (required), `columnId` (required), `title`
(required). Card order within a column follows the order cards appear
in the `cards` array.

`KanbanLabels` — every field optional, but its presence gates the
control it names, matching every other helper's label-gating
convention (`share-picker`'s `copyLabel`, `data-grid`'s label-gated
toolbar): `cardCount(count)`, `overLimit(count, limit)`,
`moveButton(card)` (accessible name for the per-card move trigger),
`moveMenuLabel` (accessible name for the move listbox),
`moveAnnouncement(cardTitle, columnTitle)`.

## 6. Behaviour

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `KanbanTableTD` cells — the same "sparse but rectangular"
trade-off documented in spec/helpers/index.md, kept so the WAI-ARIA
Grid pattern's row/column bookkeeping stays honest without switching
away from a real `<table>`.

**Card move — pointer.** Native HTML5 drag-and-drop: a card is
`draggable`; dropping it on another column's cell moves it there via
the same `onMove` callback the keyboard path uses. Supplementary, not
primary — see below.

**Card move — keyboard.** The decisive design choice, backed by
research cited in spec/helpers/index.md: not arrow-key dragging.
Enter/Space on a focused card cell opens that card's own "Move to…"
menu (a headless `Listbox` in `navigation="active-descendant"` mode,
composed exactly like a picker's own popup); choosing a destination
column calls `onMove`, closes the menu, returns focus to the
move-button, and announces the result. Escape closes without moving.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column at or over its limit carries
`data-over-limit` on its header cell and renders `labels.overLimit`'s
text — rendered only when `labels.overLimit` is supplied.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`labels.moveAnnouncement` — never a hardcoded sentence, matching every
other helper's i18n-clean rule.

**Keyboard.** WAI-ARIA APG Grid pattern, the same roving-tabindex
model `data-grid` uses: exactly one body cell carries `tabindex="0"`
at a time. `ArrowUp`/`ArrowDown` move within a column and clamp;
`ArrowLeft`/`ArrowRight` move across columns and clamp;
`Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell;
`Enter`/`Space` opens the focused card's move menu.

**SSR.** All DOM writes inside the framework's mount/effect lifecycle;
server render emits `cards` in their given order with no move menu
open.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `KanbanTable`).
Roving-tabindex focus management for body cells, matching `data-grid`.
The move menu follows the exact same icon-button-opens-listbox
contract every preference picker uses (`aria-haspopup="listbox"`,
`aria-expanded`, `aria-controls`, `aria-activedescendant` inside the
open listbox). State changes are announced through one live region.

## 8. Acceptance criteria

- §8.1 Renders `<div class="kanban-board">` wrapping a `KanbanTable`
  whose `role="grid"` and `aria-label` come from `label`.
- §8.2 Renders one `KanbanTableTH` per column with its title and, when
  `labels.cardCount` is supplied, a derived card count.
- §8.3 A column at or over `wipLimit` carries `data-over-limit` and
  renders `labels.overLimit`'s text; a column under its limit, or with
  no `wipLimit` set, carries neither.
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
- §8.8 Choosing a destination column in the move menu calls `onMove`
  with the card's id and the destination column's id, closes the
  menu, and returns focus to the move button.
- §8.9 Escape closes the move menu without calling `onMove`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  calls `onMove` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Extra attributes spread onto the root `<div>`.
- §8.13 No hardcoded user-facing strings: every label comes from a
  prop or a `labels.*` function.

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md)
for the reasoning behind each.

## 10. Relationship to the headless layer and other helpers

`KanbanBoard` composes two different headless shapes in one package:
the structural `KanbanTable` family (matching `data-grid`'s relationship
to `DataTable`) and the interactive `IconButton`/`Listbox` pair every
picker helper already depends on (matching the picker helpers'
composition, ported to a grid-cell context instead of a page header).
Follows every other helper's established rules: headless (no bundled
CSS), SSR-safe, i18n-clean (label-presence gates each control),
Svelte-canonical-first.
