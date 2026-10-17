# KanbanBoard — Specification (Svelte helper)

Canonical contract for `@lilydesignsystem/svelte-kanban-board`. Proposed
2026-09-21 in [spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md).
Svelte is the canonical implementation; the other seven frameworks
port it (`lily-design-system-{framework}-kanban-board`).

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
`KanbanTableTD`'s existing `active` prop (roving `tabindex`;
never `aria-selected` since 2026-10-10) is reused as-is for body cells, the same way
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
          <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded aria-controls>…</button>  <!-- only if labels.moveButton -->
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
`moveButton(card)` (accessible name for the per-card move trigger; without
it no button renders, and Enter/Space on the card's cell is the way in),
`moveMenuLabel` (accessible name for the move listbox; without it the
listbox is named by the card's own label),
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
column calls `onMove`, closes the menu, and announces the result.
Choosing the card's current column is not a move: the menu closes with
no `onMove` and no announcement (dropping a card on its own column is
likewise ignored). Escape closes without moving.

**Focus after the menu closes** goes to *that* card — found by its id
after the next render, so when the consumer's `cards` has moved it, focus
and the roving cursor follow it into its new column — landing on its move
button, or on its cell when no button renders. The menu's own keys
(arrows, Enter, Escape) belong to the menu: they never reach the grid's
handler, which would otherwise move the grid cursor out from under an
open menu and reopen it after a move.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column over its limit (more cards than
the limit — a column exactly at its limit is full, not in breach) carries
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
`Enter`/`Space` opens the focused card's move menu. The cursor follows
focus however it arrives (a pointer click or a consumer's `focus()` on
a cell moves it there), and it is clamped to the cells that exist — when
a move shrinks the board under it, the nearest remaining cell becomes the
tab stop, so the board never drops out of the tab order.

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
- §8.3 A column over `wipLimit` carries `data-over-limit` and
  renders `labels.overLimit`'s text; a column at or under its limit, or with
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
  menu, and returns focus to that card's own move button (or its cell
  when there is no button), following the card into its new column.
- §8.9 Escape closes the move menu without calling `onMove`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  calls `onMove` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Extra attributes spread onto the root `<div>`.
- §8.13 No hardcoded user-facing strings: every label comes from a
  prop or a `labels.*` function; without `labels.moveButton` no unnamed
  move button renders.
- §8.14 Keys pressed inside the open move menu never move the grid
  cursor, and choosing a destination does not reopen the menu.
- §8.15 Choosing the card's current column, or dropping a card on it,
  calls no `onMove` and announces nothing.
- §8.16 Focusing a cell by pointer moves the roving cursor there; when the
  board shrinks under the cursor, exactly one cell stays tabbable.
- §8.17 Alt+ArrowUp/Down moves the focused card within its column via `onReorder(cardId, toIndex)` and announces `labels.reorderAnnouncement`.
- §8.18 Alt+Arrow at the column edge, or on an empty cell, calls nothing.
- §8.19 `canMove` can refuse a move: no `onMove`, `labels.moveBlocked` is announced, and the refused column's option is `aria-disabled`.
- §8.20 `readonly`: no move button, no move menu, no drag, no reorder, `data-readonly` on the root.
- §8.21 `readonly` keeps arrow-key navigation.

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)
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

## 11. Research notes — SVAR Svelte Kanban (2026-10-14)

SVAR Kanban is built natively in Svelte 5, with a free edition and a paid
PRO tier. I read its marketing pages and the Vue key-features page; I did
not find its Svelte docs or any accessibility documentation, so this says
nothing about how accessible SVAR is. Its features:

- Drag between and within columns; every drag fires a `move-card` action
  the app can validate or cancel.
- Card sections: cover, priority, title, description, progress, deadline,
  tags, avatars, attachment/comment counts, a menu trigger; custom bodies.
- Collapsible columns, per-column add-card button, fixed or flexible width,
  per-column scroll or one horizontal scroll.
- An editor (sidebar, modal or inline) and a context menu (edit, duplicate,
  delete, custom).
- Stackable filters, sorting, and grouping by any field.
- Virtualization of cards and columns; dynamic column loading and
  undo/redo are PRO.
- Read-only mode, REST data provider, export to PDF/PNG/XLSX, themes.

Shipped in 0.2.0 from that list: **`readonly`**, **`canMove`** (SVAR's
cancellable `move-card`), and **within-column reorder** (`onReorder`, with
Alt+ArrowUp/Down — SVAR drags only). Lily's move menu stays the primary
keyboard path.

Ideas, ranked, not yet built:

1. **Collapsible columns**: a header toggle (`aria-expanded`) hiding a
   column's cards but keeping its count; the rectangular grid needs a
   decision on collapsed cells.
2. **Drop position**: pointer drops that pass an index, so a cross-column
   drop can land between cards (today it appends).
3. **Per-column add-card button** firing `onAddCard(columnId)`; Lily
   still ships no editor.
4. **Card slot**: a `card` snippet with priority, tags and deadline, so
   the consumer controls the body (SVAR's `cardContent`).
5. **Filter and sort hooks**: `filter(card)` prop and `sort` comparator,
   applied per column without changing `cards`.
6. **Group by**: swimlanes as row groups, the one hard grid change.
7. **Hard WIP limits** as a `column.strictLimit` flag, on top of `canMove`.
8. **Virtualization** for very large boards.

Still non-goals: the editor UI, export, undo/redo, REST adapter.

## 12. Shipped in 0.3.0 (2026-10-14)

Ideas 1, 3 and 7 of §11 (tests §8.22–§8.30).

- **Collapsible columns**: `collapsedColumns` (bindable); `labels.collapseColumn` gates a header toggle (`aria-expanded`). A collapsed
  column keeps its header, count and warning but its cells are empty (`data-collapsed`) and it does not count towards the board's height.
- **Add card**: `labels.addCard` gates a `+` button per column; `onAddCard(columnId)`. Lily ships no editor. Never rendered when read-only.
- **Hard limits**: `column.strictLimit` with `wipLimit` refuses a move into a full column (menu option `aria-disabled`, drops announce
  `moveBlocked`). Without it the limit stays a warning.
Not built: drop position, card snippet, filter/sort, grouping, virtualization (§11 ideas 2, 4, 5, 6, 8).

## 13. Shipped later in 0.3.0 (2026-10-14)

Tests §8.31–§8.47.

- **`filter` / `compare`**: the grid shows the filtered, sorted view. Header counts, WIP limits and over-limit warnings use every card; a column
  with hidden cards carries `data-hidden-count`. With a filter active `onReorder`'s index is the position in the visible column.
- **Drop position**: dropping a card on a card in another column calls `onMove(cardId, columnId, toIndex)` (0-based, visible column); on an empty
  cell `onMove` gets two arguments (append). Dropping on another card of its own column calls `onReorder`. The cell under the drag carries
  `data-drop-target`; read-only boards refuse drops.
- **Locked cards**: `card.locked` stops move, drag, reorder and the move menu (`data-locked` on the cell); the card still counts towards limits.
- **Alt+ArrowLeft/Right**: moves the card to the neighbouring column (the twin of Alt+Up/Down reorder); honours read-only, locked, `canMove` and hard limits.
- **`cardAttrs(card)`**: extra attributes on each card's cell.

## 14. Consumer-requested capabilities (0.3.0, 2026-10-14)

Tests §8.48–§8.62. Requested from a real app (tickets, leads, deals); the data fields are plain text so Lily keeps no English.

- **Card body**: `card.subtitle`, `card.badges` (`.kanban-board-card-subtitle`, `.kanban-board-card-badge`), `card.href` (title as `<a class="kanban-board-card-link">`),
  and a `card` snippet (`{ card, label, column, pending }`) that replaces the title content (the subtitle and badges are then the snippet's own).
- **Non-colour flags**: `card.flag` and `column.flag` render visible text (`.kanban-board-card-flag`, `.kanban-board-column-flag`) and `data-flag`; a card's flag is
  linked to its cell with `aria-describedby`, so a screen reader announces it. `column.accent` is a hook (`data-accent`) for per-column colour.
- **Allowed targets**: `allowedColumns(card)` returns the column ids a card may move to; the move menu lists only those and the card's own column, and a drop or
  Alt+Arrow elsewhere is refused (`moveBlocked`). `card.locked` stops all moves; `card.draggable=false` stops pointer dragging only.
- **Async move**: `onMove` may return a promise. The card shows in its new column at once (`data-pending`, `aria-busy`, `labels.movePending`), a pending card cannot be moved
  again, and on rejection it goes back with `labels.moveFailed` and `onMoveError`; `labels.moveAnnouncement` is announced on success.
- **Column header and footer**: `columnHeader` and `columnFooter` snippets get `{ column, cards, count }` (every card, unfiltered), the footer in a `<tfoot>`: sums per stage.
- **Empty column**: `labels.emptyColumn(column)` shows a message in the first cell of a column with nothing to show (a row is added if every column is empty).
- **Search**: `search` (bindable) filters by label, subtitle and badges, or `searchText(card)`; `labels.search` gates a `type="search"` field. It combines with `filter`.

## 15. Multi-select, undo, column reordering, swimlanes, drag preview, virtualization (0.4.0, 2026-10-14)

Tests §8.63–§8.83. The consumer's list of what was still missing; a card editor and card-order persistence are not Lily's to build.

- **Multi-select**: `selectable` turns it on. Ctrl/Cmd+click, or the `x` key on the card under the cursor, toggles a card (`data-selected`, `aria-selected="true"`; the table
  is `aria-multiselectable`). `selected` is bindable and `onSelectionChange` reports it. Moving any selected card (menu, Alt+Arrow, drop) moves the whole selection:
  `onMove` is called once per card, locked and refused cards stay behind (each announced through `moveBlocked`), a hard WIP limit admits only as many as fit, and
  `labels.moveManyAnnouncement(count, column)` is announced once. The selection clears after the move.
- **Undo**: `undoable` keeps the last 50 successful moves (a selection move is one step; a rejected async move is never recorded). Ctrl/Cmd+Z, or the button `labels.undo`
  gates (disabled while there is nothing to undo), moves the step's cards back to the columns they came from through `onMove`; a card that is no longer where the move left it is skipped,
  and an undo is not itself undoable. `labels.undoAnnouncement(card, column)` / `labels.undoManyAnnouncement(count)`.
- **Column reordering**: `movableColumns` makes headers draggable and adds Alt+Shift+ArrowLeft/Right on any cell of the column (WCAG 2.5.7). `columnOrder` is bindable,
  unnamed columns follow in their own order, `onColumnOrderChange(order)`, `labels.columnMoveAnnouncement(title, position, count)`; focus follows the moved column.
- **Swimlanes**: `lanes` splits the body into bands, each led by a `.kanban-board-lane` header row (`th scope="rowgroup"`). A card sits in the lane its `laneId` names (the first lane
  when absent). Every lane keeps at least one row so it is a drop target; `data-row` runs across lanes so the grid keyboard model is unchanged. Dropping a card into another lane's
  cell of its own column changes only the lane — `onMove(cardId, columnId, undefined, laneId)`; into another column's cell it passes the lane as the fourth argument.
  The empty-column message is not shown with lanes.
- **Drag preview**: `dragPreviewText(cards)` makes a `.kanban-board-drag-preview` element with that text the drag image (the whole selection when dragging a selected card); the dragged cards carry `data-dragging`.
- **Virtualization**: `virtualize: { rowHeight, height, overscan = 3 }` puts the table in a `.kanban-board-scroll` area (`height` px, `overflow:auto`, the structural inline style) and renders only the rows in view,
  plus the roving tab stop's row, between `.kanban-board-spacer` rows of the right height (lane headers count as a row). Rows carry `aria-rowindex`, the table `aria-rowcount`. Keyboard focus scrolls the target row in.
  Rows are assumed `rowHeight` px tall; Lily measures nothing.

## 16. Collapsible lanes (0.5.0, 2026-10-16)

Tests §8.91–§8.94. `collapsedLanes` (bindable ids) collapses swimlanes the way `collapsedColumns` collapses columns: the lane's header row stays (`data-collapsed` on `.kanban-board-lane`), its card rows are not rendered, so they leave the keyboard grid and cannot be dropped into. `labels.collapseLane(lane, collapsed)` gates a `.kanban-board-lane-toggle` button (`aria-expanded`) in the header; `labels.laneCount(lane, count)` gates a `.kanban-board-lane-count` with the lane's shown card count (collapsed or not). The lane title is in `.kanban-board-lane-title`; the header's own text node is no longer the bare title.

## 17. Typed fields, inline editing, export, hot-path caching (0.6.0, 2026-10-16)

Tests §8.95–§8.108. The data grid's cell types and export, applied to cards.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `card.values[id]`.
  `type` is a data-grid cell type (`text`, `number`, `link`, `date`, `time`, `time-zone`, `select`, `radio`, `person`, `file`, `rollup`, `formula`); `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. A field shows as
  `<span class="kanban-board-card-field" data-field data-type>` holding `.kanban-board-card-field-name` (the header) and the value; a read-only card omits empty fields.
  A card `snippet` replaces all of this, as it replaces the subtitle and badges.
- **Inline editing**: `onFieldEdit({ cardId, fieldId, value, previous })` turns it on (and not `readonly`, not a locked card, not `editable: false`). `text`, `number`, `link`, `date`, `time`, `select` and
  `radio` fields edit; the others display and export only. The value becomes a `.kanban-board-field-button` (`tabindex="-1"`, named by the header plus the value); clicking it, or **F2** on the card
  (first editable field), opens `.kanban-board-field-editor` (an `<input>` of the type, or a `<select>` of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the card's next / previous editable field.
  The editor owns its keys (they never reach the grid), and while an IME is composing (`isComposing`, or `keyCode` 229) Enter and Escape belong to the IME. A value that does not fit the
  type (`isInvalidForType`) is refused: the editor stays open and `labels.editInvalid` is announced. An unchanged value reports nothing. `labels.editAnnouncement(card, header, text)`.
  After commit or cancel focus returns to the card.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.kanban-board-export-button` (`data-kanban-export-format`) inside a `.kanban-board-export` group named by `labels.export`;
  none renders without `labels.exportHeaders` (there is no English header). The file holds one row per card, column by column in display order: title, column, then — when given — lane (with `lanes`),
  subtitle, badges (`; ` joined) and flag, then every `exportable` field (typed values stay numbers, booleans and dates; the rest is the text shown). `exportScope`: `"view"` (default, what the search and filter leave)
  or `"selected"`. `exportFilename` is the base name. Spreadsheet-formula text is defused. `onExport({ format, filename, cardCount, blob })` may return `false` to take over the download;
  otherwise the file is saved and `labels.exportAnnouncement(format, cardCount, filename)` is announced. The buttons are disabled with nothing to export. `export-data.ts` and `cell-types.ts` are copies of the data grid's.
- **Hot path**: selection is a `Set`, and a row's slot index comes from a map built once per layout, so a render does no per-cell scan of `selected` or `slots`.

## 18. Search (0.7.0, 2026-10-17)

Tests §8.110–§8.118. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the kanban board**: `search` (bindable; `labels.search` names the field) narrows the cards. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## Export: copy to clipboard (0.7.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).
