# KanbanBoard — Specification (React helper)

Canonical contract for `@lilydesignsystem/react-kanban-board`, ported
from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-kanban-board/spec/index.md)
(the reference implementation; see
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)
for the cross-catalog contract both implement). Same behaviour, React
idioms.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The component owns state and behaviour; it does
not own the grid's base markup.

## 2. Scope

Same as the Svelte reference §2. In scope: rendering a board from
`columns`/`cards` data, pointer drag-and-drop between columns, a
keyboard-accessible move menu per card, WIP (work-in-progress) limits
with a warning state, derived card counts, APG grid roving-tabindex
keyboard navigation, and `aria-live` move announcements.

Out of scope (v1 non-goals — see §9): drag-preview/ghost-element
rendering, virtualization, undo/redo, column reordering, swimlanes,
card selection/bulk-move, search/filter, collapsible columns.

## 3. Composition

`KanbanBoard` depends on `@lilydesignsystem/react-headless`'s
`KanbanTable`, `KanbanTableHead`, `KanbanTableBody`, `KanbanTableRow`,
`KanbanTableTH`, `KanbanTableTD` as a real npm dependency and renders
them unmodified. It also depends on `IconButton` and `Listbox` (the
same headless components the React picker helpers — `theme-picker`,
`locale-picker`, etc. — compose) for the per-card move-menu trigger
and the menu itself. `KanbanTable` keeps owning `<table role="grid">`
and its `aria-label`; `KanbanTableTD`'s existing `active` prop (roving
`tabindex`; never `aria-selected` since 2026-10-10) is reused as-is for body cells — this
catalog's `KanbanTableTD` has no span-membership overload (unlike
`GanttTableTD`, see the gantt-chart spec §3), so no separate
`data-in-range`-style attribute is needed here.

## 4. HTML

```
<div class="kanban-board {className}">
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

| Prop        | Type                                            | Required | Default      |
| ----------- | ------------------------------------------------ | -------- | ------------ |
| `label`     | `string`                                          | yes      | —            |
| `columns`   | `KanbanColumn[]`                                  | yes      | —            |
| `cards`     | `KanbanCard[]`                                    | yes      | —            |
| `caption`   | `string`                                           | no       | —            |
| `cardLabel` | `(card: KanbanCard) => string`                     | no       | `card.title` |
| `onMove`    | `(cardId: string, toColumnId: string) => void`     | no       | —            |
| `labels`    | `KanbanLabels`                                     | no       | `{}`         |
| `className` | `string`                                           | no       | `""`         |

Plus every other native `<div>` attribute (`Props` extends
`React.HTMLAttributes<HTMLDivElement>` minus `onChange`/`children`),
spread onto the root.

`KanbanColumn`: `id` (required), `title` (required), `wipLimit?: number`.

`KanbanCard`: `id` (required), `columnId` (required), `title`
(required). Card order within a column follows the order cards appear
in the `cards` array.

`KanbanLabels` — every field optional, but its presence gates the
control it names, matching every other helper's label-gating
convention: `cardCount(count)`, `overLimit(count, limit)`,
`moveButton(card)` (accessible name for the per-card move trigger),
`moveMenuLabel` (accessible name for the move listbox),
`moveAnnouncement(cardTitle, columnTitle)`.

## 6. Behaviour

Identical to the Svelte reference's §6, translated to React state
(`useState`/`useRef`/`useEffect`) instead of runes:

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `KanbanTableTD` cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card is
`draggable`; dropping it on another column's cell moves it there via
the same `onMove` callback the keyboard path uses. Supplementary, not
primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens
that card's own "Move to…" menu (a headless `Listbox` in
`navigation="active-descendant"` mode); choosing a destination column
calls `onMove`, closes the menu, returns focus to that card's own
move-button, and announces the result. Escape closes without moving.

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
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell;
`Enter`/`Space` opens the focused card's move menu.

**SSR.** All DOM writes happen inside `useEffect`; server render emits
`cards` in their given order with no move menu open.

## 7. Accessibility

Same as the Svelte reference §7: WAI-ARIA APG Grid pattern
(`role="grid"`, inherited from `KanbanTable`). Roving-tabindex focus
management for body cells. The move menu follows the exact same
icon-button-opens-listbox contract every React preference picker uses
(`aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant`
inside the open listbox). State changes are announced through one live
region.

## 8. Acceptance criteria

Identical to the Svelte reference's §8 clauses, renumbered here for
this package's own test file to reference directly:

- §8.1 Renders `<div class="kanban-board">` wrapping a `KanbanTable`
  whose `role="grid"` and `aria-label` come from `label`.
- §8.2 Renders one `KanbanTableTH` per column with its title and, when
  `labels.cardCount` is supplied, a derived card count.
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

Same as the Svelte reference's §9: drag-preview/ghost-element
rendering, virtualization, undo/redo, column reordering, swimlanes,
card selection/bulk-move, search/filter, collapsible columns.

## 10. Relationship to the headless layer and other helpers

`KanbanBoard` composes two different headless shapes in one package:
the structural `KanbanTable` family (matching `data-grid`'s
relationship to `DataTable`) and the interactive `IconButton`/`Listbox`
pair every React picker helper already depends on. Follows every other
React helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), React-19-idiomatic.

## 11. Differences from the Svelte reference

- `value`/state is `useState`, not `$state` runes; no two-way binding
  — `onMove`/`onActivate`/`onActiveIndexChange` callbacks instead of
  `bind:`.
- `class` is `className`.
- `bind:ref` becomes a callback `ref` (one per card, keyed by id — see
  §12 below) or a `useRef`.
- No `nextKanbanBoardId()` module-level counter: `React.useId()`
  supplies a stable, hydration-safe id per instance instead.
- Extra attributes are typed via `Omit<React.HTMLAttributes<HTMLDivElement>, ...>`
  rather than a `[key: string]: unknown` index signature (the same
  typing change the `date-time-picker`/`theme-picker` React ports
  already made, needed for `forwardRef`'s `.d.ts` generation — see
  spec/helpers/index.md's "Composition with the headless layer" React
  row).

## 12. Deliberate deviation: per-card move-button focus return

The Svelte reference binds a single shared `moveButtonEl` variable via
`bind:ref` on every card's `IconButton`, unconditionally rendered for
every card (not just the open one). Since none of those `IconButton`
instances ever remount once the board is mounted, `bind:ref` only
fires once per card, at initial mount — so `moveButtonEl` ends up
permanently pointing at whichever card's button mounted **last** in
document order, not the card whose menu is actually being closed. This
is invisible to the Svelte test suite because its own assertion only
checks that focus lands on *an* element carrying the shared
`kanban-board-move-button` class, not on the specific card's own
button.

This React port fixes that: `moveButtonRefs` is a `Map<cardId,
HTMLButtonElement>` populated by each card's own callback `ref`, and
closing a card's move menu focuses that same card's button by id. The
behavioural contract (§8.8: "closes the menu, and returns focus to the
move button") is unchanged and still passes the ported test
unmodified; this is a correctness improvement over the reference's
latent last-mounted-wins quirk, not a contract change.

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§8.17–§8.21 there): `readonly`, `canMove` with `labels.moveBlocked`, and Alt+ArrowUp/Down reorder via `onReorder(cardId, toIndex)` with `labels.reorderAnnouncement`. See the Svelte spec for the contract and the SVAR survey (§11).

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there; clauses §8.22–§8.30): collapsible columns (`collapsedColumns`, `labels.collapseColumn`), add-card buttons (`labels.addCard`, `onAddCard`) and hard limits (`column.strictLimit`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.31–§8.47): `filter` / `compare`, drop position (`onMove`'s optional third argument, `data-drop-target`, in-column drop calls `onReorder`), `card.locked`, Alt+ArrowLeft/Right column move and `cardAttrs`.

## Svelte 0.3.0 parity, consumer capabilities (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.48–§8.62): card body (`subtitle`, `badges`, `href`, `renderCard`), flags and accent, `allowedColumns`, `card.draggable`, async `onMove` with `onMoveError`, `columnHeader` / `columnFooter` render props, `labels.emptyColumn` and `search`.

## Svelte 0.4.0 parity (2026-10-15)

Ported from the Svelte canonical spec (§15 there; clauses §8.63–§8.83): multi-select and group move, undo, column reordering, swimlanes, drag preview and virtualization. See the Svelte spec for the contract; idiom differences (prop casing, event vs callback, async hooks) follow this package's earlier parity sections.

## Collapsible lanes (2026-10-16)

Ported from the Svelte canonical (its spec "Collapsible lanes", tests §8.91–§8.94). A lane header `<th class="kanban-board-lane" scope="rowgroup" data-lane-id>` holds an optional `.kanban-board-lane-toggle` button (`aria-expanded`, named by `labels.collapseLane(lane, collapsed)`; glyph ▸ / ▾), the title in `.kanban-board-lane-title`, and an optional `.kanban-board-lane-count` (`labels.laneCount(lane, count)`, the lane's cards under the current search/filter). A collapsed lane's header carries `data-collapsed` and the lane contributes no row slots, so a board with every lane collapsed has only headers.

## 13. Typed fields, inline editing, export, hot-path caching (0.6.0, 2026-10-16)

Tests §8.95–§8.108. The data grid's cell types and export, applied to cards.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `card.values[id]`.
  `type` is a data-grid cell type (`text`, `number`, `link`, `date`, `time`, `time-zone`, `select`, `radio`, `person`, `file`, `rollup`, `formula`); `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. A field shows as
  `<span class="kanban-board-card-field" data-field data-type>` holding `.kanban-board-card-field-name` (the header) and the value; a read-only card omits empty fields.
  A `renderCard` replaces all of this, as it replaces the subtitle and badges.
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
