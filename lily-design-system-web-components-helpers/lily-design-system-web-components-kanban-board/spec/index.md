# KanbanBoard — Specification (Web Components helper)

Canonical contract for `@lilydesignsystem/web-components-kanban-board`,
registered as `<lily-kanban-board>`. Ports
[`@lilydesignsystem/svelte-kanban-board`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/spec/index.md)
(proposed 2026-09-21) to this catalog's vanilla-custom-element idiom.
Svelte wins on behaviour; this package supplies the custom-element API
shape. Ported 2026-09-22, after the React, Vue, Angular, and Blazor
catalogs.

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
columns. Same reasoning as the Svelte reference — see
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md).

## 3. Composition

`<lily-kanban-board>` depends on
`@lilydesignsystem/web-components-headless`'s `<lily-kanban-table>` as
a real npm dependency and renders it unmodified — the same
"depend on, don't vendor" rule every other helper follows. It also
depends on `<lily-icon-button>` for the per-card move-menu trigger.

Two structural differences from the Svelte reference, both forced by
this catalog's own architecture (read before assuming a gap):

- **No `KanbanTableTD` family exists here.** This catalog's
  `<lily-kanban-table>` is a single autonomous custom element wrapping
  a real `<table role="region">` — see its own doc comment for why the
  role is `"region"` by default — with **no** sub-element family
  (`KanbanTableTD`/`KanbanTableTH`/etc.). The consumer supplies
  `<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` as plain light-DOM children,
  built with `document.createElement`/`appendChild` (never `innerHTML`
  or a template-literal string — the HTML5 parser silently drops a
  bare `<thead>`/`<tr>`/`<td>` start tag outside a real `<table>`'s own
  insertion mode; see `<lily-kanban-table>`'s own doc comment). This
  component therefore builds and owns its `<td>`/`<th>` cells directly
  (classes `kanban-board-th`/`kanban-board-td`), rather than reusing an
  `active` prop on a shared sub-component the way the Svelte/React/Vue/
  Angular ports do. There is no risk of the `active`-prop overload
  those ports had to reason about — WAI-ARIA APG Grid roving-tabindex
  (`tabindex`/`aria-selected`) is implemented directly on cells this
  package owns outright.
- **`role="grid"` is set explicitly.** `<lily-kanban-table>` defaults
  its inner `<table>` to `role="region"` (a deliberate, documented
  quirk, not "fixed" here) but copies every other host attribute —
  `role` included — onto the inner table via its own
  `passThroughAttributes` mechanism. This component writes
  `<lily-kanban-table role="grid" label="…">`, which relies on exactly
  that pass-through to get the grid role onto the real table; no
  monkey-patching.

The per-card move menu is hand-rolled markup (a `<ul role="listbox">`
built with `document.createElement`), **not** a composed
`<lily-listbox>`. `<lily-listbox>` in this catalog's headless layer is
an autonomous custom element with a fixed `<ul>` shape of its own — see
[spec/helpers/index.md § Composition with the headless layer](../../../spec/helpers/index.md)
for why every Web Components picker helper (`theme-picker`,
`locale-picker`, …) already made the same call for their own dropdowns
rather than nesting `<lily-listbox>` inside a trigger. `theme-picker.ts`
is the established reference for this shape; `kanban-board.ts` mirrors
it, anchored to a grid cell instead of a page header.

## 4. HTML

```html
<lily-kanban-board label="…" caption="…">
  <!-- rendered content, replaces any light-DOM children -->
</lily-kanban-board>
```

renders:

```html
<div class="kanban-board {class}">
  <lily-kanban-table role="grid" label="{label}">
    <table class="kanban-table" role="grid" aria-label="{label}">
      <caption>{caption}</caption> <!-- only when caption is set -->
      <thead>
        <tr>
          <th class="kanban-board-th" scope="col" data-over-limit> <!-- only when column.wipLimit is exceeded -->
            {column.title}
            <span class="kanban-board-count">{labels.cardCount(count)}</span> <!-- only when labels.cardCount is set -->
            <span class="kanban-board-wip-warning">{labels.overLimit(count, limit)}</span> <!-- only when over limit AND labels.overLimit is set -->
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="kanban-board-td" role="gridcell" data-row data-col tabindex aria-selected> <!-- tabindex="0" on exactly one cell -->
            <span class="kanban-board-card-title" draggable="true">{cardLabel(card)}</span>
            <lily-icon-button base-class="kanban-board-move-button" label="{labels.moveButton(card)}" tabindex="-1" aria-haspopup="listbox" aria-expanded aria-controls="{listId}">⇄</lily-icon-button>
            <ul class="kanban-board-move-list" id="{listId}" role="listbox" aria-label="{labels.moveMenuLabel}" tabindex="-1" hidden> <!-- hidden unless this card's menu is open -->
              <li class="kanban-board-move-option" role="option" aria-selected data-active>{destinationColumn.title}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </lily-kanban-table>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

**Deviation from the Svelte markup shape:** every card's move-menu
`<ul>` is always present in the DOM (one per card with a card), toggled
via the `hidden` attribute, rather than mounted/unmounted per the
Svelte reference's `{#if openCardId === card.id}`. Toggling `hidden`
keeps the listbox out of the accessibility tree and tab order exactly
as unmounting would, while letting open/close/navigate update state
attributes in place (`#syncMoveMenu`) instead of triggering a
structural rebuild that would have to re-resolve focus. See §6.

## 5. Public surface

| Member | Kind | Type | Required | Default |
| --- | --- | --- | --- | --- |
| `label` | attribute + property | `string` | yes | — |
| `caption` | attribute + property | `string` | no | — |
| `columns` | property-only | `KanbanColumn[]` | yes | `[]` |
| `cards` | property-only | `KanbanCard[]` | yes | `[]` |
| `cardLabel` | property-only | `(card: KanbanCard) => string` | no | `card.title` |
| `onMove` | property-only | `(cardId: string, toColumnId: string) => void` | no | — |
| `labels` | property-only | `KanbanLabels` | no | `{}` |
| `class` | attribute | `string` | no | `""` |

`columns`/`cards`/`cardLabel`/`onMove`/`labels` are **property-only** —
arrays of objects and functions have no clean attribute-string
encoding, the same convention `picker-bar`'s `shareTargets`/`themeProps`
already establishes in this catalog. Setting a property triggers a
structural rebuild (`#render()`); reading it returns a defensive copy.

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

The move button itself is **not** gated on `labels.moveButton` being
present — it always renders (with an empty accessible name if
unlabelled) because it is the sole keyboard-accessible path to move a
card; only its *name* is gated. This matches the Svelte reference
exactly (`label={labels.moveButton?.(card) ?? ""}`).

## 6. Behaviour

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card's title
span is `draggable`; dropping it on another column's cell moves it
there via the same `onMove` callback the keyboard path uses.
Supplementary, not primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens that
card's own "Move to…" menu; choosing a destination column calls
`onMove`, closes the menu, and returns focus to **that card's own**
move button — see §10 for why this is asserted explicitly, not
assumed. Escape closes without moving.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column at or over its limit carries
`data-over-limit` on its header cell and renders `labels.overLimit`'s
text — rendered only when `labels.overLimit` is supplied. Not
enforced — a styling/warning hook only.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`labels.moveAnnouncement` — never a hardcoded sentence.

**Keyboard — grid.** WAI-ARIA APG Grid pattern: exactly one body cell
carries `tabindex="0"` at a time. `ArrowUp`/`ArrowDown` move within a
column and clamp; `ArrowLeft`/`ArrowRight` move across columns and
clamp; `Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell; `Enter`/
`Space` opens the focused card's move menu.

**Keyboard — move menu.** `ArrowUp`/`ArrowDown` move the active option
and clamp; `Home`/`End` jump; `Enter`/`Space` chooses the active
option; `Escape` closes without moving; `Tab` moves focus to the move
button first (without cancelling the key, so the browser's default Tab
proceeds from the picker's position) then closes without refocusing —
mirrors `theme-picker`'s own established Tab handling.

Every one of the move menu's own handled keys calls
`event.stopPropagation()`. The listbox is a descendant of the grid
cell that owns `onGridKeydown`; without stopping propagation, every
keystroke inside the open menu would ALSO reach the grid's own
roving-tabindex handler (e.g. `ArrowDown` would move the listbox's
active option *and* the grid cursor in the same keystroke). This is
asserted by a dedicated test, not merely implemented.

**SSR.** All DOM writes happen in `connectedCallback`/property
setters, guarded by `this.isConnected`; nothing runs before the
element is actually in a document.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, explicitly set — see §3).
Roving-tabindex focus management for body cells. The move menu follows
the icon-button-opens-listbox contract every picker helper uses
(`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`,
`aria-activedescendant` inside the open listbox). State changes are
announced through one live region.

## 8. Acceptance criteria

- §8.1 Renders `<div class="kanban-board">` wrapping a
  `<lily-kanban-table>` whose inner `<table role="grid">` carries
  `aria-label` from `label`.
- §8.2 Renders one header cell per column with its title and, when
  `labels.cardCount` is supplied, a derived card count; absent
  `labels.cardCount`, no count renders.
- §8.3 A column at or over `wipLimit` carries `data-over-limit` and
  renders `labels.overLimit`'s text; a column under its limit, or with
  no `wipLimit` set, carries neither.
- §8.4 Cards render as a rectangular grid: the body has as many rows
  as the largest column's card count, and shorter columns pad with
  empty cells.
- §8.5 Exactly one body cell (`.kanban-board-td`) carries
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
- §8.12 Extra attributes set on the `<lily-kanban-board>` host are
  copied onto the root `<div>`.
- §8.13 No hardcoded user-facing strings: every label comes from a
  property or a `labels.*` function.

Plus two clauses this port adds beyond the Svelte reference's own
suite, both real risks specific to this catalog's implementation shape
(see §6 and §10):

- Arrow keys inside an open move menu never also move the grid's
  roving-tabindex cursor.
- Closing one card's move menu refocuses that card's own move button,
  never a different card's.

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md).

## 10. The move-button shared/last-mounted-ref risk

Every prior catalog's port of this component (React, Vue, Angular,
Blazor) independently found and fixed the same latent bug in the
Svelte reference: its move menu binds a single shared button reference
across every card's icon button, so closing a menu refocuses whichever
card mounted *last*, not the card whose menu just closed — invisible
to the Svelte suite because it only asserts a CSS class, not button
identity.

This implementation has no framework ref-binding sugar at all: each
card's `<lily-icon-button>` host is stored in a `Map<cardId,
HTMLElement>` (`#moveButtonHosts`), keyed by the card's own id, built
fresh on every structural render. `#closeMoveMenu` looks up the real
`<button>` for the SPECIFIC card whose menu was open
(`this.#moveButtonHosts.get(cardId)`), never a "last one built"
reference — there is no single shared variable for it to alias. This
is verified by a dedicated regression test (`kanban-board.test.ts`,
"move-menu button identity, not a shared/last-mounted ref") that opens
and closes card one's menu, then opens and chooses from card two's
menu, and asserts focus lands on card two's own button — confirmed
load-bearing by temporarily reintroducing a "focus the last-built
button" bug and observing the test fail.
