# KanbanBoard — Specification (Angular helper)

Canonical contract for `@lilydesignsystem/angular-kanban-board`. Ports
the contract proposed in
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md)
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
  extra attributes (`[attr.data-row]`, `[attr.tabindex]`,
  `[attr.aria-selected]`) directly onto the same native `<td
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
  [spec/helpers/index.md § Composition with the headless layer](../../../spec/helpers/index.md)
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
        <td lily-kanban-table-td data-row data-col tabindex aria-selected> <!-- roving-tabindex cursor -->
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
column's current card count; a column at or over its limit carries
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

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md)
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
