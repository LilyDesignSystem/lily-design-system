# KanbanBoard — Specification (Angular helper)

Canonical contract for `@lilydesignsystem/angular-kanban-board`. Ports
the contract proposed in
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)
and first implemented in `svelte-helpers` as
`@lilydesignsystem/svelte-kanban-board` (2026-09-22). This document
mirrors that package's `spec/index.md`, adapted where Angular's own API
surface and headless layer differ — see §3 and §10 for every deviation
found while porting.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The component owns state and behaviour; it does
not own the grid's base markup.

## 2. Scope

Same as the Svelte reference. In scope: rendering a board from
`columns`/`cards` data, pointer drag-and-drop between columns, a
keyboard-accessible move menu per card, WIP (work-in-progress) limits
with a warning state, derived card counts, APG grid roving-tabindex
keyboard navigation, and `aria-live` move announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): drag-preview/
ghost-element rendering, virtualization, undo/redo, column reordering,
swimlanes, card selection/bulk-move, search/filter, collapsible
columns.

## 3. Composition

`KanbanBoard` depends on `@lilydesignsystem/angular-headless`'s
`KanbanTable`, `KanbanTableHead`, `KanbanTableBody`, `KanbanTableRow`,
`KanbanTableTH`, `KanbanTableTD` as a real npm dependency
(`ng-package.json`'s `allowedNonPeerDependencies`) and renders them
unmodified — the same "depend on, don't vendor" rule this catalog's
own pickers follow for the headless `IconButton`/`Listbox` pair. It
also depends on `IconButton` and `Listbox` for the per-card move-menu
trigger and the menu itself, exactly the same composition shape every
`*-picker` in this catalog already uses.

**Deviations found while porting, none requiring a KanbanTable-family
change:**

- Angular's headless `KanbanTableTD` (unlike Svelte's) has **no
  `active` prop at all** — confirmed by reading `KanbanTableTD.ts`; it
  is a bare attribute-selector directive with only a `className`
  input. There is therefore no contract to reuse or collide with.
  Angular's attribute-selector idiom lets a consuming template bind
  extra attributes (`[attr.data-row]`, `[attr.tabindex]` — the cursor; never
  `aria-selected`) directly onto the same native `<td
  lily-kanban-table-td>` element, so the roving-tabindex cursor is set
  that way instead — no headless-component change needed.
- Angular's headless `KanbanTable` sets **no `role="grid"`** on its
  rendered `<table>` (confirmed: no `role` anywhere in
  `KanbanTable.ts`), unlike the Svelte reference's own `KanbanTable`.
  `KanbanTable` is on this port's "do not modify" list, so
  `KanbanBoard` applies `role="grid"` itself, once, in
  `ngAfterViewInit()` — a plain DOM write Angular's own change
  detection does not track (so it is never removed on a later check).
  See the component's own doc comment.
- Angular's headless `KanbanTable` has **no `caption` input** either.
  A `<caption>` element is valid projected content as a `<table>`'s
  first child regardless, so `KanbanBoard` projects one conditionally
  instead of needing a headless-component change.
- The headless `IconButton` gained one small additive input,
  `tabIndex` (default `null`, unchanged behaviour) — needed so the
  move-menu trigger inside a grid cell is not an independent Tab stop
  (the Svelte reference achieves this with a plain `tabindex="-1"`
  rest-prop spread, which Angular's `IconButton` has no equivalent
  for). This mirrors the same additive-extension precedent already
  recorded in
  [spec/helpers/index.md § Composition with the headless layer](../../spec/helpers/index.md)
  for the pickers' own `IconButton`/`Listbox` work. `IconButton`'s
  full existing suite (7 tests) passes unmodified; see this package's
  own CHANGELOG.md.

## 4. HTML

```html
<div class="kanban-board {className}">
  <lily-kanban-table [label]="label"> <!-- role="grid" applied by KanbanBoard, see §3 -->
    <caption class="kanban-board-caption">…</caption> <!-- only when caption is set -->
    <thead lily-kanban-table-head>
      <tr lily-kanban-table-row>
        <th lily-kanban-table-th data-over-limit>            <!-- only when column.wipLimit is exceeded -->
          {column.title}
          <span class="kanban-board-count">{labels.cardCount(count)}</span>
          <span class="kanban-board-wip-warning">{labels.overLimit(count, limit)}</span>  <!-- only when over limit -->
        </th>
      </tr>
    </thead>
    <tbody lily-kanban-table-body>
      <tr lily-kanban-table-row>
        <td lily-kanban-table-td data-row data-col tabindex> <!-- roving-tabindex cursor; no aria-selected: focus is not selection -->
          <span class="kanban-board-card-title">{cardLabel(card)}</span>
          <lily-icon-button baseClass="kanban-board-move-button" ariaHaspopup="listbox" [ariaExpanded] [tabIndex]="-1">…</lily-icon-button>
          <lily-listbox baseClass="kanban-board-move-list" navigation="active-descendant" [hidden]="…"> <!-- only while open -->
            <li role="option">{destinationColumn.title}</li>
          </lily-listbox>
        </td>
      </tr>
    </tbody>
  </lily-kanban-table>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

## 5. Inputs / outputs

| Input        | Type                                                        | Required | Default |
| ------------ | ------------------------------------------------------------ | -------- | ------- |
| `label`      | `string`                                                      | yes      | —       |
| `columns`    | `KanbanColumn[]`                                              | yes      | —       |
| `cards`      | `KanbanCard[]`                                                | yes      | —       |
| `caption`    | `string`                                                       | no       | `""`    |
| `cardLabel`  | `(card: KanbanCard) => string`                                 | no       | `card.title` |
| `labels`     | `KanbanLabels`                                                 | no       | `{}`    |
| `className`  | `string`                                                       | no       | `""`    |

| Output | Type                | Fires |
| ------ | ------------------- | ----- |
| `move` | `KanbanMoveEvent` (`{cardId, toColumnId}`) | After a card moves to a new column, by pointer or by the move menu. Angular's `output()` replaces the Svelte contract's `onMove` callback prop — this catalog's established idiom (see `theme-picker`'s `themeChange`, `picker-bar`'s `share`/`copy`). |

`KanbanColumn`: `id` (required), `title` (required), `wipLimit?: number`.

`KanbanCard`: `id` (required), `columnId` (required), `title`
(required). Card order within a column follows the order cards appear
in the `cards` array.

`KanbanLabels` — every field optional, presence gates the control it
names, matching every other helper's label-gating convention:
`cardCount(count)`, `overLimit(count, limit)`, `moveButton(card)`
(accessible name for the per-card move trigger), `moveMenuLabel`
(accessible name for the move listbox), `moveAnnouncement(cardTitle,
columnTitle)`.

## 6. Behaviour

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `<td lily-kanban-table-td>` cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card title is
`draggable`; dropping it on another column's cell moves it there via
the same `move` output the keyboard path uses. Supplementary, not
primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens
that card's own "Move to…" menu (a headless `Listbox` in
`navigation="active-descendant"` mode); choosing a destination column
emits `move`, closes the menu, returns focus to the specific card's
own move button (not a shared last-mounted reference — see AGENTS.md
for why this matters), and announces the result. Escape closes without
moving.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column over its limit carries
`data-over-limit` on its header cell and renders `labels.overLimit`'s
text — rendered only when `labels.overLimit` is supplied.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`labels.moveAnnouncement`.

**Keyboard.** WAI-ARIA APG Grid pattern: exactly one body cell carries
`tabindex="0"` at a time. `ArrowUp`/`ArrowDown` move within a column
and clamp; `ArrowLeft`/`ArrowRight` move across columns and clamp;
`Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell; `Enter`/
`Space` opens the focused card's move menu.

**SSR.** All DOM writes inside `ngAfterViewInit`/signal `effect()`;
server render emits `cards` in their given order with no move menu
open (except the `role="grid"` patch in §3, which — like the rest of
this catalog's Angular DOM-write rules — runs client-side only; see
§10).

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, applied by `KanbanBoard`
itself — see §3). Roving-tabindex focus management for body cells. The
move menu follows the exact same icon-button-opens-listbox contract
every `*-picker` uses (`aria-haspopup="listbox"`, `aria-expanded`,
`aria-controls`, `aria-activedescendant` inside the open listbox).
State changes are announced through one live region.

## 8. Acceptance criteria

- §8.1 Renders `<div class="kanban-board">` wrapping a `KanbanTable`
  whose `role="grid"` and `aria-label` come from `label`.
- §8.2 Renders one `<th lily-kanban-table-th>` per column with its
  title and, when `labels.cardCount` is supplied, a derived card
  count.
- §8.3 A column over `wipLimit` carries `data-over-limit` and
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
- §8.8 Choosing a destination column in the move menu emits `move`
  with the card's id and the destination column's id, closes the
  menu, and returns focus to that specific card's own move button.
- §8.9 Escape closes the move menu without emitting `move`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  emits `move` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Extra attributes land on `KanbanBoard`'s own host tag
  (`<lily-kanban-board>`), one level outside the `.kanban-board` div —
  **Angular deviation**: Angular always emits a real host element for
  a component's selector (no `<svelte:element>`-style no-wrapper
  root), so unlike the Svelte contract's literal root-`<div>` spread,
  extra attributes cannot land directly on `.kanban-board` itself. The
  same deviation is already documented for `picker-bar`'s own
  `AGENTS.md`.
- §8.13 No hardcoded user-facing strings: every label comes from an
  input or a `labels.*` function.

**Added 2026-10-11** (canonical §8.13–§8.16; see the Svelte package's spec):

- Without `labels.moveButton` no unnamed move button renders; Enter/Space on
  the card's cell opens the menu, which is then named by the card itself.
- Keys pressed inside the open move menu never move the grid cursor, and
  choosing a destination does not reopen the menu.
- Choosing the card's current column, or dropping a card on it, is not a
  move: no `onMove`, no announcement.
- Focusing a cell by pointer moves the roving cursor there; when the board
  shrinks under the cursor, exactly one cell stays tabbable; after a move,
  focus and the cursor follow the card to its new column (its move button,
  or its cell when there is none).
- A column is over its `wipLimit` only with more cards than the limit;
  exactly at the limit it is full, not in breach.

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)
for the reasoning behind each.

## 10. Relationship to the headless layer and other helpers

`KanbanBoard` composes two different headless shapes in one package:
the structural `KanbanTable` family (matching `data-grid`'s
relationship to `DataTable`) and the interactive `IconButton`/
`Listbox` pair every picker helper already depends on. Follows every
other helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), Angular-idiomatic
(standalone component, signal `input()`/`output()`, `OnPush`).

Three real deviations from the Svelte reference were found and
resolved during this port, all documented in §3 above and in this
package's own CHANGELOG.md: Angular's headless `KanbanTable`/
`KanbanTableTD` lack `role="grid"`, `caption`, and an `active` prop
that Svelte's versions have; and `IconButton` needed one small
additive `tabIndex` input. None required modifying the `KanbanTable`
family itself.

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§8.17–§8.21 there): `readonly`, `canMove` with `labels.moveBlocked`, and Alt+ArrowUp/Down reorder via `onReorder(cardId, toIndex)` with `labels.reorderAnnouncement`. See the Svelte spec for the contract and the SVAR survey (§11).

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there; clauses §8.22–§8.30): collapsible columns (`collapsedColumns`, `labels.collapseColumn`), add-card buttons (`labels.addCard`, `onAddCard`) and hard limits (`column.strictLimit`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.31–§8.47): `filter` / `compare`, drop position (`onMove`'s optional third argument, `data-drop-target`, in-column drop calls `onReorder`), `card.locked`, Alt+ArrowLeft/Right column move and `cardAttrs`; and the consumer-requested capabilities (Svelte spec §14, clauses §8.48–§8.62): card body, flags, `allowedColumns`, async move (`moveHandler` where the idiom has events), column header/footer, `labels.emptyColumn`, `search`.

## Svelte 0.4.0 parity (2026-10-15)

Ported from the Svelte canonical spec (§15 there; clauses §8.63–§8.83): multi-select and group move, undo, column reordering, swimlanes, drag preview and virtualization. See the Svelte spec for the contract; idiom differences (prop casing, event vs callback, async hooks) follow this package's earlier parity sections.

## Collapsible lanes (2026-10-16)

Ported from the Svelte canonical (its spec "Collapsible lanes", tests §8.91–§8.94). A lane header `<th class="kanban-board-lane" scope="rowgroup" data-lane-id>` holds an optional `.kanban-board-lane-toggle` button (`aria-expanded`, named by `labels.collapseLane(lane, collapsed)`; glyph ▸ / ▾), the title in `.kanban-board-lane-title`, and an optional `.kanban-board-lane-count` (`labels.laneCount(lane, count)`, the lane's cards under the current search/filter). A collapsed lane's header carries `data-collapsed` and the lane contributes no row slots, so a board with every lane collapsed has only headers.

## 11. Typed fields, inline editing, export, hot-path caching (0.6.0, 2026-10-16)

Tests §8.95–§8.108. The data grid's cell types and export, applied to cards.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `card.values[id]`.
  `type` is a data-grid cell type (`text`, `number`, `link`, `date`, `time`, `time-zone`, `select`, `radio`, `person`, `file`, `rollup`, `formula`); `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. A field shows as
  `<span class="kanban-board-card-field" data-field data-type>` holding `.kanban-board-card-field-name` (the header) and the value; a read-only card omits empty fields.
  A card `template` replaces all of this, as it replaces the subtitle and badges.
- **Inline editing**: The `fieldEdit` output (`{ cardId, fieldId, value, previous })` with `[editableFields]="true"` (which stands in for a listener, as an Angular output cannot report one) turns it on (and not `readonly`, not a locked card, not `editable: false`). `text`, `number`, `link`, `date`, `time`, `select` and
  `radio` fields edit; the others display and export only. The value becomes a `.kanban-board-field-button` (`tabindex="-1"`, named by the header plus the value); clicking it, or **F2** on the card
  (first editable field), opens `.kanban-board-field-editor` (an `<input>` of the type, or a `<select>` of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the card's next / previous editable field.
  The editor owns its keys (they never reach the grid), and while an IME is composing (`isComposing`, or `keyCode` 229) Enter and Escape belong to the IME. A value that does not fit the
  type (`isInvalidForType`) is refused: the editor stays open and `labels.editInvalid` is announced. An unchanged value reports nothing. `labels.editAnnouncement(card, header, text)`.
  After commit or cancel focus returns to the card.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.kanban-board-export-button` (`data-kanban-export-format`) inside a `.kanban-board-export` group named by `labels.export`;
  none renders without `labels.exportHeaders` (there is no English header). The file holds one row per card, column by column in display order: title, column, then — when given — lane (with `lanes`),
  subtitle, badges (`; ` joined) and flag, then every `exportable` field (typed values stay numbers, booleans and dates; the rest is the text shown). `exportScope`: `"view"` (default, what the search and filter leave)
  or `"selected"`. `exportFilename` is the base name. Spreadsheet-formula text is defused. `exportHandler` (given `{ format, filename, cardCount, blob }`, and the `exportFile` output) may return `false` to take over the download;
  otherwise the file is saved and `labels.exportAnnouncement(format, cardCount, filename)` is announced. The buttons are disabled with nothing to export. `export-data.ts` and `cell-types.ts` are copies of the data grid's.
- **Hot path**: selection is a `Set`, and a row's slot index comes from a map built once per layout, so a render does no per-cell scan of `selected` or `slots`.

## 18. Search (0.7.0, 2026-10-17)

Tests §8.110–§8.118. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the kanban board**: `search` (a `model()`; `labels.search` names the field) narrows the cards. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## Export: copy to clipboard (0.7.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the `copy` output and `copyHandler({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0, 2026-10-17)

- **PageUp / PageDown** move the cursor ten rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next card in the focused column whose label starts with them. A lone `x` stays the select shortcut when `selectable`; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

The matching is the pure `typeahead.ts` (`isTypeaheadKey`, `nextTypeaheadState`, `findTypeaheadMatch`), shared by the three grids and tested on its own.

## In-place edit: validation, undo and redo (0.7.0, 2026-10-17)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(card, header, reason)` is announced, falling back to `labels.editInvalid`.
- With `undoable`, Ctrl/Cmd+Z takes back a **move** first while there is one, then field edits.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through the `fieldEdit` output** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without the `fieldEdit` output. `labels.fieldUndoAnnouncement(card, header, text)` / `labels.fieldRedoAnnouncement(card, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Drop cue, labels and direction (0.7.0, 2026-10-17)

- **A live "can't drop here" cue.** While a card is dragged, the cell under the pointer carries `data-drop-target` if it would accept the card, and `data-drop-blocked` (not `data-drop-target`) if `canMove`, `allowedColumns` or a full strict WIP limit would refuse it. A refused `dragover` is not cancelled and sets `dropEffect` to `none`, so the browser shows its own not-allowed cursor; an accepted one is cancelled and sets `move`. The cues clear on leave, drop and drag end. The reference themes outline an accepted cell with a dashed ring and stripe a refused one. This is the live twin of the announcement `labels.moveBlocked` makes after a refused keyboard move; a server-side refusal (a 422) still snaps the card back through `onMove` rejecting.
- **Every label is overridable.** All visible and spoken text is in `labels` (`emptyColumn`, `addCard`, `collapseColumn`, `laneCount`, the announcements and the rest); the only literal in the markup is the decorative `+` glyph of the add-card button, which has its accessible name from `labels.addCard`. A complete Chinese bundle is tested to leave no English in the DOM.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next column, and Alt+ArrowLeft/Right (move the card) and Alt+Shift+ArrowLeft/Right (move the column) follow the arrow. Vertical keys, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.137–§8.148.
